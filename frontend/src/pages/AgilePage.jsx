import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import {
  isAgileCloudUser,
  loadAgileExamAttempts,
  loadAgileProgress,
  logAgileExamAttempt,
  saveAgileProgress,
} from '../utils/agileProgress.js'
import {
  EXAM_CONFIG,
  EXAM_WEIGHTING,
  FLASHCARDS,
  MATCHING_PAIRS,
  RACI_TABLE,
  QUESTION_BANK,
  REALISTIC_EXAMS,
  TOPIC_EXAMS,
  TOPICS,
} from '../data/agileContent.js'
import { HARD_EXAMS, TOPIC_TIPS } from '../data/agileHardExams.js'
import { DOC_MOCK_EXAMS } from '../data/agileDocMockExams.js'
import {
  FINAL_BOOKS,
  FINAL_MOCK_EXAMS,
  finalPaperNumber,
  papersInBook,
} from '../data/agileFinalMocks.js'
import {
  AR_OPTIONS,
  OFFICIAL_PRACTITIONER_SAMPLE,
  PRACTITIONER_CONFIG,
  PRACTITIONER_EXAMS,
  PRACTITIONER_TOPICS,
  flattenPractitioner,
  practitionerCorrectLabel,
  practitionerStem,
  scorePractitionerLine,
} from '../data/agilePractitioner.js'
import { ZEN_QUESTIONS } from '../data/agileZenQuestions.js'
import {
  PractitionerReview,
  PractitionerRunner,
  isPractitionerSnapshot,
} from './PractitionerExam.jsx'
import MillionaireGame from './MillionaireGame.jsx'
import './AgilePage.css'

// ---------------------------------------------------------------------------
// Hidden AgilePM v3 Foundation study area (only reachable via /agile).
// Self-contained: no network calls, all content is bundled static data and
// all progress is kept locally in the browser (localStorage). This keeps the
// feature private to the device and avoids any data leaving the machine.
// ---------------------------------------------------------------------------

// Namespaced storage keys so this study tool never clashes with app data.
const STORAGE_KEYS = {
  matching: 'agilepm:matching-stats:v1',
  // Separate stats for the Roles (RACI) matching game so they never mix
  // with the term/definition matching scores.
  roles: 'agilepm:roles-stats:v1',
  exams: 'agilepm:exam-results:v1',
  // IDs of Zen questions answered incorrectly, retained across sessions so
  // they can be redone until answered correctly.
  zenWrong: 'agilepm:zen-wrong:v1',
  // Full snapshots of completed mock papers (questions, answers, result) so
  // any attempt can be re-opened later to review where marks were lost.
  savedMocks: 'agilepm:saved-mocks:v1',
  // The wrong-question bank: every mock question answered incorrectly, kept
  // until the user removes it manually. Getting one right later does not
  // take it out of the bank.
  wrongBank: 'agilepm:wrong-bank:v1',
}

// How many completed-mock snapshots to keep (newest first). Each snapshot is
// a full 50-question paper, so the cap keeps localStorage well within quota
// while still holding several sittings of every paper.
const MAX_SAVED_MOCKS = 80

// Fisher-Yates shuffle returning a new array (does not mutate the input).
function shuffle(input) {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Build the Zen-mode question pool: every authored question from the dedicated
// Zen bank plus the general bank and all fixed exam papers, de-duplicated by
// normalised question text. This yields a large (~750) varied pool that powers
// the endless practice mode. Computed once at module load.
function normaliseQuestion(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
}

function buildZenPool() {
  const all = [
    ...ZEN_QUESTIONS,
    ...QUESTION_BANK,
    ...REALISTIC_EXAMS.flatMap((e) => e.questions),
    ...TOPIC_EXAMS.flatMap((e) => e.questions),
    ...HARD_EXAMS.flatMap((e) => e.questions),
    ...DOC_MOCK_EXAMS.flatMap((e) => e.questions),
    ...FINAL_MOCK_EXAMS.flatMap((e) => e.questions),
  ]
  const seen = new Set()
  const pool = []
  for (const q of all) {
    const key = normaliseQuestion(q.q)
    if (seen.has(key)) continue
    seen.add(key)
    // Keep only the fields Zen mode needs, with a guaranteed-unique id.
    pool.push({
      id: q.id,
      topic: q.topic,
      q: q.q,
      options: q.options,
      correct: q.correct,
      explain: q.explain,
    })
  }
  return pool
}

const ZEN_POOL = buildZenPool()
const ZEN_POOL_SIZE = ZEN_POOL.length

// The four Agile Manifesto value statements, used for typed warm-ups at the
// start of every Zen session. One side of each statement is blanked out and
// the user must type the missing words.
const MANIFESTO_VALUE_PAIRS = [
  { left: 'individuals and interactions', right: 'processes and tools' },
  { left: 'working software', right: 'comprehensive documentation' },
  { left: 'customer collaboration', right: 'contract negotiation' },
  { left: 'responding to change', right: 'following a plan' },
]

// KC 02.04 — Manifesto Principles Enhanced (12 principles).
const MANIFESTO_PRINCIPLES = [
  'Highest priority: satisfy customer through early/continuous delivery of value',
  'Welcome change, even late',
  'Deliver working solutions frequently',
  'All parties work together daily',
  'Build projects around motivated individuals',
  'Face-to-face = most efficient communication',
  'Working solutions = primary measure of progress',
  'Sustainable pace indefinitely',
  'Continuous attention to technical excellence',
  'Simplicity - maximising work NOT done',
  'Best outcomes emerge from self-organising teams',
  'Regular reflection and adjustment',
]

// IN 01.01 — 9 Principles of Agile Leadership.
// Rule requested by user: always keep the first word visible and only blank one
// other word in each leadership principle prompt.
const AGILE_LEADERSHIP_PRINCIPLES = [
  'Leadership lives everywhere in the organisation',
  'Leaders embrace and enable team and individual mastery',
  'Leaders favour ecosystems over hierarchies',
  'Leaders develop new leaders (not followers)',
  'Leaders foster team accountability',
  'Leaders ensure clarity of purpose',
  'Leaders are stewards of organisational values',
  'Leaders enable agility to maximise value and impact',
  'Leaders are dedicated to learning and growth',
]

function pickLeadershipBlank(line) {
  const words = line.split(/\s+/).filter(Boolean)
  if (words.length < 3) return { prompt: `${line} [?]`, answer: '' }

  // Keep first word visible; blank exactly one later word.
  const i = 1 + Math.floor(Math.random() * (words.length - 1))
  const answer = words[i].replace(/[()]/g, '')
  const promptWords = [...words]
  promptWords[i] = '[?]'
  return {
    prompt: promptWords.join(' '),
    answer,
    full: line,
  }
}

// Build typed warm-up questions for every session:
// - 4 Manifesto values (random side blanked)
// - 12 manifesto principles (one phrase blanked with [?])
// - 9 agile leadership principles (first word always visible + one blanked word)
function buildWarmups() {
  const valueQs = MANIFESTO_VALUE_PAIRS.map((pair, i) => {
    const blankLeft = Math.random() < 0.5
    return {
      id: `warmup-value-${i}`,
      prompt: blankLeft ? `[?] OVER ${pair.right}` : `${pair.left} OVER [?]`,
      answer: blankLeft ? pair.left : pair.right,
      full: `${pair.left} OVER ${pair.right}`,
    }
  })

  const principleQs = MANIFESTO_PRINCIPLES.map((line, i) => {
    const parts = line.split(/\s+/).filter(Boolean)
    const mid = Math.max(1, Math.floor(parts.length / 2))
    const answer = parts.slice(mid).join(' ')
    return {
      id: `warmup-principle-${i}`,
      prompt: `${parts.slice(0, mid).join(' ')} [?]`,
      answer,
      full: line,
    }
  })

  const leadershipQs = AGILE_LEADERSHIP_PRINCIPLES.map((line, i) => {
    const built = pickLeadershipBlank(line)
    return {
      id: `warmup-leadership-${i}`,
      prompt: built.prompt,
      answer: built.answer,
      full: built.full,
    }
  })

  return shuffle([...valueQs, ...principleQs, ...leadershipQs])
}

// Forgiving comparison for typed answers: case, punctuation and extra
// whitespace are ignored so "Working Software!" still counts as correct.
function normaliseTyped(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Safe localStorage helpers (wrapped so private-mode/quota errors never crash).
function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore persistence failures (e.g. private browsing) */
  }
}

const DEFAULT_MATCHING = { correct: 0, wrong: 0, rounds: 0 }

// ---------------------------------------------------------------------------
// Progress context: single source of truth for matching stats + exam results.
// For the allowed, logged-in owner account it syncs to Supabase; for everyone
// else it transparently falls back to localStorage only. Components don't need
// to know which backend is active.
// ---------------------------------------------------------------------------
const AgileProgressContext = createContext(null)

function useAgileProgress() {
  const ctx = useContext(AgileProgressContext)
  if (!ctx) {
    throw new Error('useAgileProgress must be used inside AgileProgressProvider')
  }
  return ctx
}

function AgileProgressProvider({ children }) {
  const { user } = useAuth()
  const cloud = isAgileCloudUser(user)
  const accountId = cloud ? user.id : null

  const [matchingStats, setMatchingStats] = useState(() =>
    readStore(STORAGE_KEYS.matching, DEFAULT_MATCHING),
  )
  const [examResults, setExamResults] = useState(() =>
    readStore(STORAGE_KEYS.exams, {}),
  )
  // Wrong-question bank entries:
  // { id, topic, q, options, correct, explain, chosen, from, addedAt }
  const [wrongBank, setWrongBank] = useState(() =>
    readStore(STORAGE_KEYS.wrongBank, []),
  )
  const [attempts, setAttempts] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [cloudError, setCloudError] = useState(false)
  // Tracks which account's data has been hydrated from the cloud. Cloud writes
  // are gated on this so we never overwrite remote data with local defaults
  // before the initial load completes. A ref (not state) avoids any
  // setState-in-effect during render synchronisation.
  const loadedAccountRef = useRef(null)

  // Initial hydrate from the cloud (owner only). All state changes happen
  // inside async callbacks, never synchronously in the effect body.
  useEffect(() => {
    if (!cloud) {
      loadedAccountRef.current = null
      return undefined
    }
    let cancelled = false
    Promise.all([
      loadAgileProgress(accountId),
      loadAgileExamAttempts(accountId),
    ])
      .then(([progress, history]) => {
        if (cancelled) return
        if (progress) {
          setMatchingStats(progress.matching_stats ?? DEFAULT_MATCHING)
          setExamResults(progress.exam_results ?? {})
          // Cloud bank wins only when it has entries; otherwise keep whatever
          // is already stored locally so nothing is lost pre-migration.
          if (Array.isArray(progress.wrong_bank) && progress.wrong_bank.length) {
            setWrongBank(progress.wrong_bank)
          }
        }
        setAttempts(history ?? [])
        loadedAccountRef.current = accountId
        setLoaded(true)
        setCloudError(false)
      })
      .catch(() => {
        if (cancelled) return
        setCloudError(true)
      })
    return () => {
      cancelled = true
    }
  }, [cloud, accountId])

  // Always keep a local cache so progress survives even without the cloud.
  useEffect(() => {
    writeStore(STORAGE_KEYS.matching, matchingStats)
  }, [matchingStats])
  useEffect(() => {
    writeStore(STORAGE_KEYS.exams, examResults)
  }, [examResults])
  useEffect(() => {
    writeStore(STORAGE_KEYS.wrongBank, wrongBank)
  }, [wrongBank])

  // Mirror aggregate progress to the cloud whenever it changes (owner only),
  // but only after the initial load for this account has completed.
  useEffect(() => {
    if (!cloud || loadedAccountRef.current !== accountId) return undefined
    let cancelled = false
    saveAgileProgress(accountId, { matchingStats, examResults, wrongBank })
      .then((ok) => {
        if (!cancelled) setCloudError(!ok)
      })
      .catch(() => {
        if (!cancelled) setCloudError(true)
      })
    return () => {
      cancelled = true
    }
  }, [cloud, accountId, loaded, matchingStats, examResults, wrongBank])

  const syncStatus = cloudError ? 'error' : loaded ? 'synced' : 'loading'

  // Record a completed exam: update the aggregate map and append to history.
  const recordExam = useCallback(
    (examKey, title, result) => {
      setExamResults((prev) => {
        const prevBest = prev[examKey]?.bestPercent ?? -1
        return {
          ...prev,
          [examKey]: {
            lastPercent: result.percent,
            lastScore: result.score,
            total: result.total,
            bestPercent: Math.max(prevBest, result.percent),
            attempts: (prev[examKey]?.attempts ?? 0) + 1,
            passed: result.passed,
          },
        }
      })
      if (cloud) {
        const attempt = {
          examKey,
          title,
          percent: result.percent,
          score: result.score,
          total: result.total,
          passed: result.passed,
        }
        // Optimistically show it, then persist.
        setAttempts((prev) =>
          [
            { id: `temp-${Date.now()}`, created_at: new Date().toISOString(), ...attempt },
            ...prev,
          ].slice(0, 12),
        )
        logAgileExamAttempt(accountId, attempt).catch(() => {})
      }
    },
    [cloud, accountId],
  )

  const resetMatchingStats = useCallback(() => {
    setMatchingStats({ ...DEFAULT_MATCHING })
  }, [])

  // Merge newly missed questions into the bank, de-duplicated by question
  // text. Re-missing a question updates the recorded wrong choice but keeps
  // the original added date.
  const addWrongQuestions = useCallback((entries) => {
    if (!entries?.length) return
    setWrongBank((prev) => {
      const byKey = new Map(prev.map((e) => [normaliseQuestion(e.q), e]))
      for (const entry of entries) {
        const key = normaliseQuestion(entry.q)
        const existing = byKey.get(key)
        byKey.set(
          key,
          existing
            ? { ...existing, chosen: entry.chosen, from: entry.from }
            : entry,
        )
      }
      return [...byKey.values()]
    })
  }, [])

  // Remove questions by their text — only used by the manual Remove / Clear
  // controls. A later correct answer does not drop an item from the bank.
  const removeWrongQuestions = useCallback((questionTexts) => {
    if (!questionTexts?.length) return
    const keys = new Set(questionTexts.map(normaliseQuestion))
    setWrongBank((prev) => prev.filter((e) => !keys.has(normaliseQuestion(e.q))))
  }, [])

  const clearWrongBank = useCallback(() => {
    setWrongBank([])
  }, [])

  const value = useMemo(
    () => ({
      cloud,
      syncStatus,
      matchingStats,
      setMatchingStats,
      examResults,
      recordExam,
      resetMatchingStats,
      attempts,
      wrongBank,
      addWrongQuestions,
      removeWrongQuestions,
      clearWrongBank,
    }),
    [
      cloud,
      syncStatus,
      matchingStats,
      examResults,
      recordExam,
      resetMatchingStats,
      attempts,
      wrongBank,
      addWrongQuestions,
      removeWrongQuestions,
      clearWrongBank,
    ],
  )

  return (
    <AgileProgressContext.Provider value={value}>
      {children}
    </AgileProgressContext.Provider>
  )
}

// Small badge that reflects where progress is being stored.
function SyncBadge() {
  const { cloud, syncStatus } = useAgileProgress()
  if (!cloud) return null
  const label =
    syncStatus === 'loading'
      ? 'Loading…'
      : syncStatus === 'saving'
        ? 'Saving…'
        : syncStatus === 'error'
          ? 'Sync error'
          : 'Saved to cloud'
  return (
    <span className={`agile-sync agile-sync--${syncStatus}`} title="Your progress is saved to your account">
      <span className="agile-sync__dot" aria-hidden />
      {label}
    </span>
  )
}

export default function AgilePage() {
  return (
    <AgileProgressProvider>
      <AgilePageInner />
    </AgileProgressProvider>
  )
}

function AgilePageInner() {
  const [mode, setMode] = useState('home')

  // Keep the browser tab title clear while studying; restore on unmount.
  useEffect(() => {
    const prev = document.title
    document.title = 'AgilePM v3 — Study'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="agile-root">
      <header className="agile-header">
        <div className="agile-header__inner">
          <button
            type="button"
            className="agile-brand"
            onClick={() => setMode('home')}
          >
            AgilePM <span>v3</span>
          </button>
          <nav className="agile-tabs" aria-label="Study modes">
            <TabButton active={mode === 'home'} onClick={() => setMode('home')}>
              Home
            </TabButton>
            <TabButton
              active={mode === 'flashcards'}
              onClick={() => setMode('flashcards')}
            >
              Flashcards
            </TabButton>
            <TabButton
              active={mode === 'matching'}
              onClick={() => setMode('matching')}
            >
              Matching Game
            </TabButton>
            <TabButton
              active={mode === 'roles'}
              onClick={() => setMode('roles')}
            >
              Roles
            </TabButton>
            <TabButton
              active={
                mode === 'exams' ||
                mode === 'finals' ||
                mode === 'practitioner'
              }
              onClick={() => setMode('exams')}
            >
              Mock Exams
            </TabButton>
            <TabButton active={mode === 'zen'} onClick={() => setMode('zen')}>
              Zen Mode
            </TabButton>
            <TabButton
              active={mode === 'surprise'}
              onClick={() => setMode('surprise')}
              className="agile-tab--surprise"
            >
              Suprise
            </TabButton>
            <TabButton
              active={mode === 'wrongbank'}
              onClick={() => setMode('wrongbank')}
            >
              Wrong Questions
            </TabButton>
          </nav>
          <SyncBadge />
        </div>
      </header>

      <main className="agile-main">
        {mode === 'home' && <HomeView onPick={setMode} />}
        {mode === 'flashcards' && <FlashcardsView />}
        {mode === 'matching' && <MatchingView />}
        {mode === 'roles' && <RolesView />}
        {(mode === 'exams' ||
          mode === 'finals' ||
          mode === 'practitioner') && (
          <ExamsView
            key={mode}
            startLibrary={
              mode === 'finals'
                ? 'finals'
                : mode === 'practitioner'
                  ? 'practitioner'
                  : null
            }
          />
        )}
        {mode === 'zen' && <ZenView />}
        {mode === 'surprise' && <MillionaireGame />}
        {mode === 'wrongbank' && <WrongBankView />}
      </main>

      <footer className="agile-footer">
        Private study area · {FLASHCARDS.length} flashcards ·{' '}
        {MATCHING_PAIRS.length} matching pairs · {RACI_TABLE.length} RACI
        artifacts · {ZEN_POOL_SIZE}-question Zen pool ·{' '}
        {PRACTITIONER_EXAMS.length} Practitioner papers · Good luck on the exam.
      </footer>
    </div>
  )
}

function TabButton({ active, onClick, className, children }) {
  return (
    <button
      type="button"
      className={`agile-tab${active ? ' agile-tab--active' : ''}${
        className ? ` ${className}` : ''
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
function HomeView({ onPick }) {
  return (
    <div className="agile-home">
      <h1 className="agile-home__title">AgilePM v3 Revision</h1>
      <p className="agile-home__lede">
        A private study toolkit. Foundation tools sit at the top. Practitioner
        scenario papers sit in their own section underneath.
      </p>

      <h2 className="agile-home__level">Foundation</h2>
      <p className="agile-home__level-lede">
        Closed book · 50 questions · 40 minutes · 30/50 (60%) to pass
      </p>
      <div className="agile-cards">
        <button
          type="button"
          className="agile-card"
          onClick={() => onPick('flashcards')}
        >
          <span className="agile-card__emoji" aria-hidden>
            🃏
          </span>
          <h2>Flashcards</h2>
          <p>
            Flip through {FLASHCARDS.length} cards covering every syllabus area.
            Filter by topic, shuffle, and mark what you know.
          </p>
        </button>
        <button
          type="button"
          className="agile-card"
          onClick={() => onPick('matching')}
        >
          <span className="agile-card__emoji" aria-hidden>
            🔀
          </span>
          <h2>Matching Game</h2>
          <p>
            Match terms to definitions. Everything is randomly shuffled each
            round, with running right/wrong progress tracking.
          </p>
        </button>
        <button
          type="button"
          className="agile-card"
          onClick={() => onPick('roles')}
        >
          <span className="agile-card__emoji" aria-hidden>
            👥
          </span>
          <h2>Roles</h2>
          <p>
            Critical RACI to memorise. Match each project artifact to who is
            Responsible and who is Accountable.
          </p>
        </button>
        <button
          type="button"
          className="agile-card"
          onClick={() => onPick('exams')}
        >
          <span className="agile-card__emoji" aria-hidden>
            📝
          </span>
          <h2>Practice library</h2>
          <p>
            Full mocks, the 10-paper practice pack, realistic papers, topic
            drills and randomised sits — 50 questions, 40 minutes, 60% to pass.
          </p>
        </button>
        <button
          type="button"
          className="agile-card"
          onClick={() => onPick('finals')}
        >
          <span className="agile-card__emoji" aria-hidden>
            📘
          </span>
          <h2>Final series</h2>
          <p>
            30 hard official-style papers in three exam books. Same APMG
            format as the real Foundation paper — not mixed with practice sits.
          </p>
        </button>
        <button
          type="button"
          className="agile-card"
          onClick={() => onPick('zen')}
        >
          <span className="agile-card__emoji" aria-hidden>
            🧘
          </span>
          <h2>Zen Mode</h2>
          <p>
            Endless exam-style questions from a {ZEN_POOL_SIZE}-question pool.
            Instant feedback, a live right/wrong/accuracy tally, and a full
            per-topic breakdown when you end the session.
          </p>
        </button>
        <button
          type="button"
          className="agile-card"
          onClick={() => onPick('wrongbank')}
        >
          <span className="agile-card__emoji" aria-hidden>
            📕
          </span>
          <h2>Wrong Questions Bank</h2>
          <p>
            Every mock question you get wrong is collected here automatically.
            Review each one with the correct answer and retry the whole bank
            whenever you want &mdash; getting one right does not remove it.
          </p>
        </button>
        <button
          type="button"
          className="agile-card agile-card--surprise"
          onClick={() => onPick('surprise')}
        >
          <h2>Suprise</h2>
        </button>
      </div>
      <div className="agile-examfacts">
        <h3>Foundation exam format</h3>
        <ul>
          <li>
            <strong>{EXAM_CONFIG.questionCount}</strong> multiple-choice
            questions
          </li>
          <li>
            <strong>{EXAM_CONFIG.durationMinutes} minutes</strong> duration
          </li>
          <li>
            Pass mark <strong>{EXAM_CONFIG.passPercent}%</strong> (
            {EXAM_CONFIG.passMark}/{EXAM_CONFIG.questionCount})
          </li>
          <li>Closed book</li>
        </ul>
      </div>

      <h2 className="agile-home__level" id="practitioner">
        Practitioner
      </h2>
      <p className="agile-home__level-lede">
        Open book (official handbook only) · 80 objective-test lines · 150
        minutes · 40/80 (50%) to pass
      </p>
      <div className="agile-cards">
        <a
          className="agile-card agile-card--official"
          href={OFFICIAL_PRACTITIONER_SAMPLE.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="agile-card__emoji" aria-hidden>
            🏛️
          </span>
          <h2>Official APMG sample</h2>
          <p>
            The real AgilePM v3 Practitioner sample on APMG’s exam player.
            Choose AgilePM (v3) Practitioner from the list — their paper
            stays on their site.
          </p>
        </a>
        <button
          type="button"
          className="agile-card agile-card--pract"
          onClick={() => onPick('practitioner')}
        >
          <span className="agile-card__emoji" aria-hidden>
            📋
          </span>
          <h2>Practitioner mocks</h2>
          <p>
            Five original scenario papers in the official booklet layout:
            classic, select-2, matching and assertion/reason. Shared project
            scenario, additional information, and an option grid.
          </p>
        </button>
      </div>
      <div className="agile-examfacts agile-examfacts--pract">
        <h3>Practitioner exam format</h3>
        <ul>
          <li>
            <strong>4</strong> syllabus questions · <strong>20</strong> lines
            each
          </li>
          <li>
            <strong>{PRACTITIONER_CONFIG.questionCount}</strong> marks ·{' '}
            <strong>{PRACTITIONER_CONFIG.durationMinutes} minutes</strong>
          </li>
          <li>
            Pass mark <strong>{PRACTITIONER_CONFIG.passPercent}%</strong> (
            {PRACTITIONER_CONFIG.passMark}/{PRACTITIONER_CONFIG.questionCount}
            )
          </li>
          <li>Open book — official handbook only</li>
        </ul>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Flashcards
// ---------------------------------------------------------------------------
function FlashcardsView() {
  const [topic, setTopic] = useState('ALL')
  const [order, setOrder] = useState(() => FLASHCARDS.map((c) => c.id))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  // Per-card confidence rating: { [cardId]: 'low' | 'medium' | 'high' }.
  const [confidence, setConfidence] = useState({})

  const cardsById = useMemo(() => {
    const map = new Map()
    FLASHCARDS.forEach((c) => map.set(c.id, c))
    return map
  }, [])

  // Rebuild the working deck whenever the topic filter changes.
  const buildDeck = useCallback(
    (selectedTopic, shuffleDeck) => {
      const filtered = FLASHCARDS.filter(
        (c) => selectedTopic === 'ALL' || c.topic === selectedTopic,
      ).map((c) => c.id)
      setOrder(shuffleDeck ? shuffle(filtered) : filtered)
      setIndex(0)
      setFlipped(false)
    },
    [],
  )

  const handleTopic = (value) => {
    setTopic(value)
    buildDeck(value, false)
  }

  const current = order.length ? cardsById.get(order[index]) : null

  const go = (delta) => {
    setFlipped(false)
    setIndex((i) => {
      const next = i + delta
      if (next < 0) return order.length - 1
      if (next >= order.length) return 0
      return next
    })
  }

  const setCardConfidence = (level) => {
    if (!current) return
    setConfidence((prev) => {
      // Clicking the active level again clears it (toggle off).
      if (prev[current.id] === level) {
        const next = { ...prev }
        delete next[current.id]
        return next
      }
      return { ...prev, [current.id]: level }
    })
  }

  // Confidence breakdown across the current deck.
  const counts = order.reduce(
    (acc, id) => {
      const level = confidence[id]
      if (level) acc[level] += 1
      return acc
    },
    { low: 0, medium: 0, high: 0 },
  )

  return (
    <div className="agile-flash">
      <div className="agile-toolbar">
        <label className="agile-field">
          <span>Topic</span>
          <select value={topic} onChange={(e) => handleTopic(e.target.value)}>
            <option value="ALL">All topics ({FLASHCARDS.length})</option>
            {Object.entries(TOPICS).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="agile-btn"
          onClick={() => buildDeck(topic, true)}
        >
          Shuffle
        </button>
        <div className="agile-flash__progress">
          {order.length ? index + 1 : 0} / {order.length} ·{' '}
          <span className="agile-conf-tag agile-conf-tag--high">
            High {counts.high}
          </span>{' '}
          <span className="agile-conf-tag agile-conf-tag--medium">
            Med {counts.medium}
          </span>{' '}
          <span className="agile-conf-tag agile-conf-tag--low">
            Low {counts.low}
          </span>
        </div>
      </div>

      {current ? (
        <>
          <button
            type="button"
            className={`agile-flipcard${flipped ? ' is-flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label="Flip card"
          >
            <div className="agile-flipcard__inner">
              <div className="agile-flipcard__face agile-flipcard__front">
                <span className="agile-flipcard__topic">
                  {TOPICS[current.topic]}
                </span>
                <p className="agile-flipcard__text">{current.front}</p>
                <span className="agile-flipcard__hint">Click to reveal</span>
              </div>
              <div className="agile-flipcard__face agile-flipcard__back">
                <span className="agile-flipcard__topic">
                  {TOPICS[current.topic]}
                </span>
                <p className="agile-flipcard__text">{current.back}</p>
                <span className="agile-flipcard__hint">Click to flip back</span>
              </div>
            </div>
          </button>

          <div className="agile-confidence">
            <span className="agile-confidence__label">Confidence</span>
            <div className="agile-confidence__btns">
              {['low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`agile-conf-btn agile-conf-btn--${level}${
                    confidence[current.id] === level ? ' is-active' : ''
                  }`}
                  onClick={() => setCardConfidence(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="agile-flash__controls">
            <button type="button" className="agile-btn" onClick={() => go(-1)}>
              ‹ Prev
            </button>
            <button type="button" className="agile-btn" onClick={() => go(1)}>
              Next ›
            </button>
          </div>
        </>
      ) : (
        <p className="agile-empty">No cards for this topic.</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Matching Game
// ---------------------------------------------------------------------------
const MATCH_ROUND_SIZE = 6

// Returns the pairs available for a topic ('ALL' = every topic).
function poolForTopic(selectedTopic) {
  return MATCHING_PAIRS.filter(
    (p) => selectedTopic === 'ALL' || p.topic === selectedTopic,
  )
}

// Pure helper: builds a fresh round (picked pairs + two independently shuffled
// columns) for the given topic. `excludeIds` lists pairs recently shown so that
// pressing "New round" surfaces different questions than are already on screen.
// If there aren't enough unseen pairs to fill a round, we top up from the rest.
function createRound(selectedTopic, excludeIds = []) {
  const pool = poolForTopic(selectedTopic)
  const size = Math.min(MATCH_ROUND_SIZE, pool.length)
  const exclude = new Set(excludeIds)

  // Prefer pairs the player hasn't just seen.
  const fresh = pool.filter((p) => !exclude.has(p.id))
  let picked = shuffle(fresh).slice(0, size)

  // Not enough unseen pairs? Fill the gap from the recently-seen ones.
  if (picked.length < size) {
    const used = new Set(picked.map((p) => p.id))
    const rest = shuffle(pool.filter((p) => !used.has(p.id)))
    picked = picked.concat(rest.slice(0, size - picked.length))
  }

  return {
    pairs: picked,
    terms: shuffle(picked.map((p) => ({ id: p.id, text: p.term }))),
    defs: shuffle(picked.map((p) => ({ id: p.id, text: p.definition }))),
  }
}

function MatchingView() {
  const [topic, setTopic] = useState('ALL')
  const [round, setRound] = useState(() => createRound('ALL'))
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matched, setMatched] = useState(() => new Set())
  const [wrongFlash, setWrongFlash] = useState(null) // {termId, defId}
  const [roundWrong, setRoundWrong] = useState(0)
  // Remembers pair ids shown in recent rounds so a "New round" generates
  // different questions. Seeded with the initial round's ids.
  const seenRef = useRef(round.pairs.map((p) => p.id))
  // Cumulative stats live in the progress context (cloud-synced for the owner,
  // localStorage-backed for everyone else).
  const {
    matchingStats: stats,
    setMatchingStats: setStats,
    resetMatchingStats,
  } = useAgileProgress()

  const startRound = useCallback((selectedTopic, resetHistory = false) => {
    // Switching topic clears the "recently seen" history for the new pool.
    if (resetHistory) seenRef.current = []

    const next = createRound(selectedTopic, seenRef.current)

    // Remember what we just showed, then trim the history so it stays smaller
    // than the pool — this guarantees the next round can still be filled while
    // rotating through every available pair before any repeats.
    const poolSize = poolForTopic(selectedTopic).length
    const maxExclude = Math.max(0, poolSize - MATCH_ROUND_SIZE)
    const seen = [...seenRef.current, ...next.pairs.map((p) => p.id)]
    seenRef.current =
      seen.length > maxExclude ? seen.slice(seen.length - maxExclude) : seen

    setRound(next)
    setSelectedTerm(null)
    setMatched(new Set())
    setWrongFlash(null)
    setRoundWrong(0)
  }, [])

  const handleTopic = (value) => {
    setTopic(value)
    startRound(value, true)
  }

  const handleTermClick = (termId) => {
    if (matched.has(termId)) return
    setSelectedTerm((prev) => (prev === termId ? null : termId))
  }

  const handleDefClick = (defId) => {
    if (!selectedTerm || matched.has(defId)) return
    if (selectedTerm === defId) {
      // Correct match (term id === definition id for the same pair).
      const isFinalPair = round && matched.size + 1 === round.pairs.length
      setMatched((prev) => new Set(prev).add(defId))
      setSelectedTerm(null)
      // Count this correct answer, and the whole round once when finished.
      setStats((s) => ({
        ...s,
        correct: s.correct + 1,
        rounds: isFinalPair ? s.rounds + 1 : s.rounds,
      }))
    } else {
      // Wrong match: flash red, record the miss.
      setWrongFlash({ termId: selectedTerm, defId })
      setRoundWrong((n) => n + 1)
      setStats((s) => ({ ...s, wrong: s.wrong + 1 }))
      window.setTimeout(() => setWrongFlash(null), 500)
      setSelectedTerm(null)
    }
  }

  const roundComplete = round && matched.size === round.pairs.length

  const resetStats = () => {
    resetMatchingStats()
  }

  const total = stats.correct + stats.wrong
  const accuracy = total ? Math.round((stats.correct / total) * 100) : 0

  return (
    <div className="agile-match">
      <div className="agile-toolbar">
        <label className="agile-field">
          <span>Topic</span>
          <select value={topic} onChange={(e) => handleTopic(e.target.value)}>
            <option value="ALL">All topics</option>
            {Object.entries(TOPICS).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="agile-btn"
          onClick={() => startRound(topic)}
        >
          New round
        </button>
      </div>

      <div className="agile-statbar">
        <div className="agile-statbar__item agile-statbar__item--good">
          <span className="agile-statbar__num">{stats.correct}</span>
          <span className="agile-statbar__label">Right</span>
        </div>
        <div className="agile-statbar__item agile-statbar__item--bad">
          <span className="agile-statbar__num">{stats.wrong}</span>
          <span className="agile-statbar__label">Wrong</span>
        </div>
        <div className="agile-statbar__item">
          <span className="agile-statbar__num">{accuracy}%</span>
          <span className="agile-statbar__label">Accuracy</span>
        </div>
        <div className="agile-statbar__item">
          <span className="agile-statbar__num">{stats.rounds}</span>
          <span className="agile-statbar__label">Rounds</span>
        </div>
        <button
          type="button"
          className="agile-btn agile-btn--ghost"
          onClick={resetStats}
        >
          Reset stats
        </button>
      </div>

      {roundComplete && (
        <div className="agile-round-done">
          Round complete! {round.pairs.length} matched
          {roundWrong > 0 ? ` · ${roundWrong} wrong attempt${roundWrong > 1 ? 's' : ''}` : ' with no mistakes 🎉'}.
          <button
            type="button"
            className="agile-btn agile-btn--primary"
            onClick={() => startRound(topic)}
          >
            Play again
          </button>
        </div>
      )}

      {round && (
        <div className="agile-match__grid">
          <div className="agile-match__col">
            <h3>Terms</h3>
            {round.terms.map((t) => {
              const isMatched = matched.has(t.id)
              const isSelected = selectedTerm === t.id
              const isWrong = wrongFlash?.termId === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={isMatched}
                  className={[
                    'agile-match__item',
                    isMatched ? 'is-matched' : '',
                    isSelected ? 'is-selected' : '',
                    isWrong ? 'is-wrong' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleTermClick(t.id)}
                >
                  {t.text}
                </button>
              )
            })}
          </div>
          <div className="agile-match__col">
            <h3>Definitions</h3>
            {round.defs.map((d) => {
              const isMatched = matched.has(d.id)
              const isWrong = wrongFlash?.defId === d.id
              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={isMatched}
                  className={[
                    'agile-match__item',
                    isMatched ? 'is-matched' : '',
                    isWrong ? 'is-wrong' : '',
                    selectedTerm && !isMatched ? 'is-targetable' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleDefClick(d.id)}
                >
                  {d.text}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Roles matching game — Critical RACI table (artifact → Responsible / Accountable)
// ---------------------------------------------------------------------------
const ROLE_ROUND_SIZE = 6
const ROLE_MODES = {
  both: 'Both R and A',
  responsible: 'Responsible',
  accountable: 'Accountable',
}

// Builds the match pairs for one drill mode. "both" uses the combined
// Responsible + Accountable line so one tap reviews the whole table row.
function rolesPairsForMode(mode) {
  return RACI_TABLE.map((row) => {
    if (mode === 'responsible') {
      return { id: `${row.id}-r`, term: row.artifact, definition: row.responsible }
    }
    if (mode === 'accountable') {
      return { id: `${row.id}-a`, term: row.artifact, definition: row.accountable }
    }
    return {
      id: row.id,
      term: row.artifact,
      definition: `Responsible: ${row.responsible}\nAccountable: ${row.accountable}`,
      responsible: row.responsible,
      accountable: row.accountable,
    }
  })
}

// Same round builder as the term matching game, but never puts two cards
// with the same definition text in one round (several artifacts share a
// RACI pair, which would make the right-hand column ambiguous).
function createRolesRound(mode, excludeIds = []) {
  const pool = rolesPairsForMode(mode)
  const size = Math.min(ROLE_ROUND_SIZE, pool.length)
  const exclude = new Set(excludeIds)
  const ordered = [
    ...shuffle(pool.filter((p) => !exclude.has(p.id))),
    ...shuffle(pool.filter((p) => exclude.has(p.id))),
  ]
  const picked = []
  const usedDefs = new Set()
  for (const p of ordered) {
    if (picked.length >= size) break
    const key = p.definition.toLowerCase()
    if (usedDefs.has(key)) continue
    usedDefs.add(key)
    picked.push(p)
  }
  return {
    pairs: picked,
    terms: shuffle(picked.map((p) => ({ id: p.id, text: p.term }))),
    defs: shuffle(
      picked.map((p) => ({
        id: p.id,
        text: p.definition,
        responsible: p.responsible,
        accountable: p.accountable,
      })),
    ),
  }
}

function RolesView() {
  const [mode, setMode] = useState('both')
  const [round, setRound] = useState(() => createRolesRound('both'))
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matched, setMatched] = useState(() => new Set())
  const [wrongFlash, setWrongFlash] = useState(null)
  const [roundWrong, setRoundWrong] = useState(0)
  const seenRef = useRef(round.pairs.map((p) => p.id))
  const [stats, setStats] = useState(() =>
    readStore(STORAGE_KEYS.roles, DEFAULT_MATCHING),
  )

  useEffect(() => {
    writeStore(STORAGE_KEYS.roles, stats)
  }, [stats])

  const startRound = useCallback((nextMode, resetHistory = false) => {
    if (resetHistory) seenRef.current = []
    const next = createRolesRound(nextMode, seenRef.current)
    const poolSize = rolesPairsForMode(nextMode).length
    const maxExclude = Math.max(0, poolSize - ROLE_ROUND_SIZE)
    const seen = [...seenRef.current, ...next.pairs.map((p) => p.id)]
    seenRef.current =
      seen.length > maxExclude ? seen.slice(seen.length - maxExclude) : seen
    setRound(next)
    setSelectedTerm(null)
    setMatched(new Set())
    setWrongFlash(null)
    setRoundWrong(0)
  }, [])

  const handleMode = (value) => {
    setMode(value)
    startRound(value, true)
  }

  const handleTermClick = (termId) => {
    if (matched.has(termId)) return
    setSelectedTerm((prev) => (prev === termId ? null : termId))
  }

  const handleDefClick = (defId) => {
    if (!selectedTerm || matched.has(defId)) return
    if (selectedTerm === defId) {
      const isFinalPair = round && matched.size + 1 === round.pairs.length
      setMatched((prev) => new Set(prev).add(defId))
      setSelectedTerm(null)
      setStats((s) => ({
        ...s,
        correct: s.correct + 1,
        rounds: isFinalPair ? s.rounds + 1 : s.rounds,
      }))
    } else {
      setWrongFlash({ termId: selectedTerm, defId })
      setRoundWrong((n) => n + 1)
      setStats((s) => ({ ...s, wrong: s.wrong + 1 }))
      window.setTimeout(() => setWrongFlash(null), 500)
      setSelectedTerm(null)
    }
  }

  const roundComplete = round && matched.size === round.pairs.length
  const total = stats.correct + stats.wrong
  const accuracy = total ? Math.round((stats.correct / total) * 100) : 0

  return (
    <div className="agile-match">
      <p className="agile-exams__lede">
        Critical RACI to memorise. Tap an artifact, then tap who is
        Responsible and Accountable. Several artifacts share the same pair
        &mdash; each round only shows unique answers so the match is unambiguous.
      </p>
      <div className="agile-toolbar">
        <label className="agile-field">
          <span>Match</span>
          <select value={mode} onChange={(e) => handleMode(e.target.value)}>
            {Object.entries(ROLE_MODES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="agile-btn"
          onClick={() => startRound(mode)}
        >
          New round
        </button>
      </div>

      <div className="agile-statbar">
        <div className="agile-statbar__item agile-statbar__item--good">
          <span className="agile-statbar__num">{stats.correct}</span>
          <span className="agile-statbar__label">Right</span>
        </div>
        <div className="agile-statbar__item agile-statbar__item--bad">
          <span className="agile-statbar__num">{stats.wrong}</span>
          <span className="agile-statbar__label">Wrong</span>
        </div>
        <div className="agile-statbar__item">
          <span className="agile-statbar__num">{accuracy}%</span>
          <span className="agile-statbar__label">Accuracy</span>
        </div>
        <div className="agile-statbar__item">
          <span className="agile-statbar__num">{stats.rounds}</span>
          <span className="agile-statbar__label">Rounds</span>
        </div>
        <button
          type="button"
          className="agile-btn agile-btn--ghost"
          onClick={() => setStats({ ...DEFAULT_MATCHING })}
        >
          Reset stats
        </button>
      </div>

      {roundComplete && (
        <div className="agile-round-done">
          Round complete! {round.pairs.length} matched
          {roundWrong > 0
            ? ` · ${roundWrong} wrong attempt${roundWrong > 1 ? 's' : ''}`
            : ' with no mistakes 🎉'}
          .
          <button
            type="button"
            className="agile-btn agile-btn--primary"
            onClick={() => startRound(mode)}
          >
            Play again
          </button>
        </div>
      )}

      {round && (
        <div className="agile-match__grid">
          <div className="agile-match__col">
            <h3>Artifacts</h3>
            {round.terms.map((t) => {
              const isMatched = matched.has(t.id)
              const isSelected = selectedTerm === t.id
              const isWrong = wrongFlash?.termId === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={isMatched}
                  className={[
                    'agile-match__item',
                    isMatched ? 'is-matched' : '',
                    isSelected ? 'is-selected' : '',
                    isWrong ? 'is-wrong' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleTermClick(t.id)}
                >
                  {t.text}
                </button>
              )
            })}
          </div>
          <div className="agile-match__col">
            <h3>
              {mode === 'responsible'
                ? 'Responsible'
                : mode === 'accountable'
                  ? 'Accountable'
                  : 'Responsible / Accountable'}
            </h3>
            {round.defs.map((d) => {
              const isMatched = matched.has(d.id)
              const isWrong = wrongFlash?.defId === d.id
              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={isMatched}
                  className={[
                    'agile-match__item',
                    isMatched ? 'is-matched' : '',
                    isWrong ? 'is-wrong' : '',
                    selectedTerm && !isMatched ? 'is-targetable' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleDefClick(d.id)}
                >
                  {d.responsible && d.accountable ? (
                    <span className="agile-match__raci">
                      <span>
                        <span className="agile-match__raci-k">R</span>{' '}
                        {d.responsible}
                      </span>
                      <span>
                        <span className="agile-match__raci-k">A</span>{' '}
                        {d.accountable}
                      </span>
                    </span>
                  ) : (
                    d.text
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Zen Mode — endless exam-style practice with instant feedback
// ---------------------------------------------------------------------------
function ZenView() {
  // One shuffled pass through the whole pool; we reshuffle when it's exhausted
  // so the session can run indefinitely without immediate repeats.
  const [queue, setQueue] = useState(() => shuffle(ZEN_POOL))
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [history, setHistory] = useState([]) // { id, topic, q, options, correct, chosen, isRight }
  const [ended, setEnded] = useState(false)
  // Every question ever answered wrong is retained (and persisted) here until
  // it is answered correctly. "Redo wrong" replays exactly this set.
  const [wrongIds, setWrongIds] = useState(
    () => new Set(readStore(STORAGE_KEYS.zenWrong, [])),
  )
  const [redoMode, setRedoMode] = useState(false)
  // Typed Manifesto warm-up shown at the very start of every session.
  const [warmups, setWarmups] = useState(() => buildWarmups())
  const [warmIdx, setWarmIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [warmRevealed, setWarmRevealed] = useState(false)
  const inWarmup = warmIdx < warmups.length

  const { recordExam } = useAgileProgress()

  // Keep the retained wrong-question set across page reloads too.
  useEffect(() => {
    writeStore(STORAGE_KEYS.zenWrong, [...wrongIds])
  }, [wrongIds])

  const current = queue[idx]
  // Shuffle each question's options once (stable until the question changes).
  const options = useMemo(
    () => (current ? shuffle(current.options) : []),
    [current],
  )

  const right = history.filter((h) => h.isRight).length
  const answered = history.length
  const wrong = answered - right
  const accuracy = answered ? Math.round((right / answered) * 100) : 0

  const choose = (opt) => {
    if (revealed) return
    const isRight = opt === current.correct
    setSelected(opt)
    setRevealed(true)
    setHistory((h) => [
      ...h,
      {
        id: current.id,
        topic: current.topic,
        q: current.q,
        options: current.options,
        correct: current.correct,
        chosen: opt,
        isRight,
      },
    ])
    // Wrong answers join the retained redo pool; a correct answer (in any
    // mode) clears that question from it.
    setWrongIds((prev) => {
      const has = prev.has(current.id)
      if (isRight ? !has : has) return prev
      const nextSet = new Set(prev)
      if (isRight) nextSet.delete(current.id)
      else nextSet.add(current.id)
      return nextSet
    })
  }

  const next = () => {
    setSelected(null)
    setRevealed(false)
    const n = idx + 1
    if (n < queue.length) {
      setIdx(n)
      return
    }
    // End of the current queue: in redo mode replay whatever is still wrong,
    // dropping back to the endless pool once everything has been cleared.
    if (redoMode) {
      const remaining = ZEN_POOL.filter((q) => wrongIds.has(q.id))
      if (remaining.length > 0) {
        setQueue(shuffle(remaining))
      } else {
        setRedoMode(false)
        setQueue(shuffle(ZEN_POOL))
      }
    } else {
      // Exhausted the pool — reshuffle for an endless stream.
      setQueue(shuffle(ZEN_POOL))
    }
    setIdx(0)
  }

  // Check the typed warm-up answer and log it like any other question (topic
  // KC, so it feeds the per-topic breakdown). Warm-ups never join the redo
  // pool because they are not multiple-choice pool questions.
  const submitWarmup = (e) => {
    e.preventDefault()
    if (warmRevealed || !typed.trim()) return
    const w = warmups[warmIdx]
    const isRight = normaliseTyped(typed) === normaliseTyped(w.answer)
    setWarmRevealed(true)
    setHistory((h) => [
      ...h,
      {
        id: w.id,
        topic: 'KC',
        q: `Warm-up: ${w.prompt}`,
        options: isRight ? [w.answer] : [typed.trim(), w.answer],
        correct: w.answer,
        chosen: typed.trim(),
        isRight,
      },
    ])
  }

  const nextWarmup = () => {
    setTyped('')
    setWarmRevealed(false)
    setWarmIdx((i) => i + 1)
  }

  // Switch the stream to only the retained wrong questions.
  const startRedo = () => {
    const wrongQuestions = ZEN_POOL.filter((q) => wrongIds.has(q.id))
    if (wrongQuestions.length === 0) return
    setQueue(shuffle(wrongQuestions))
    setIdx(0)
    setSelected(null)
    setRevealed(false)
    setRedoMode(true)
  }

  // Leave redo mode and return to the full endless pool.
  const exitRedo = () => {
    setQueue(shuffle(ZEN_POOL))
    setIdx(0)
    setSelected(null)
    setRevealed(false)
    setRedoMode(false)
  }

  const endSession = () => {
    // Persist the session as an attempt (cloud owner) / aggregate result.
    if (answered > 0) {
      recordExam('zen', 'Zen practice session', {
        percent: accuracy,
        score: right,
        total: answered,
        passMark: Math.ceil(answered * 0.6),
        passed: accuracy >= 60,
      })
    }
    setEnded(true)
  }

  const restart = () => {
    setQueue(shuffle(ZEN_POOL))
    setIdx(0)
    setSelected(null)
    setRevealed(false)
    setHistory([])
    setEnded(false)
    setRedoMode(false)
    // A fresh session always starts with a fresh Manifesto warm-up.
    setWarmups(buildWarmups())
    setWarmIdx(0)
    setTyped('')
    setWarmRevealed(false)
  }

  if (ended) {
    return <ZenReview history={history} onRestart={restart} />
  }

  const warm = inWarmup ? warmups[warmIdx] : null
  const warmIsRight =
    warmRevealed && warm
      ? normaliseTyped(typed) === normaliseTyped(warm.answer)
      : false

  return (
    <div className="agile-zen">
      <div className="agile-statbar agile-zen__stats">
        <div className="agile-statbar__item agile-statbar__item--good">
          <span className="agile-statbar__num">{right}</span>
          <span className="agile-statbar__label">Right</span>
        </div>
        <div className="agile-statbar__item agile-statbar__item--bad">
          <span className="agile-statbar__num">{wrong}</span>
          <span className="agile-statbar__label">Wrong</span>
        </div>
        <div className="agile-statbar__item">
          <span className="agile-statbar__num">{accuracy}%</span>
          <span className="agile-statbar__label">Accuracy</span>
        </div>
        <div className="agile-statbar__item">
          <span className="agile-statbar__num">{answered}</span>
          <span className="agile-statbar__label">Answered</span>
        </div>
        {redoMode && (
          <span className="agile-zen__redo-tag">
            Redoing wrong questions · {wrongIds.size} left
          </span>
        )}
        <div className="agile-zen__actions">
          {redoMode ? (
            <button
              type="button"
              className="agile-btn agile-btn--warn"
              onClick={exitRedo}
            >
              Exit redo
            </button>
          ) : (
            <button
              type="button"
              className="agile-btn agile-btn--warn"
              disabled={wrongIds.size === 0}
              onClick={startRedo}
              title="Replay every question you've answered incorrectly until you get it right"
            >
              Redo wrong ({wrongIds.size})
            </button>
          )}
          <button
            type="button"
            className="agile-btn agile-btn--success"
            onClick={endSession}
          >
            End session
          </button>
        </div>
      </div>

      {inWarmup && (
        <div className="agile-question agile-zen__warmup">
          <span className="agile-question__topic">
            Warm-up · Written question {warmIdx + 1}/{warmups.length}
          </span>
          <h2 className="agile-question__text">{warm.prompt}</h2>
          <form className="agile-zen__warmform" onSubmit={submitWarmup}>
            <input
              type="text"
              className="agile-zen__input"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type the missing words…"
              disabled={warmRevealed}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {!warmRevealed && (
              <button
                type="submit"
                className="agile-btn agile-btn--primary"
                disabled={!typed.trim()}
              >
                Check
              </button>
            )}
          </form>

          {warmRevealed && (
            <div
              className={`agile-zen__feedback ${
                warmIsRight ? 'is-right' : 'is-wrong'
              }`}
            >
              <strong>{warmIsRight ? 'Correct ✓' : 'Not quite ✗'}</strong>
              {!warmIsRight && (
                <p className="agile-zen__answer">
                  Answer: <span>{warm.answer}</span>
                </p>
              )}
              <p className="agile-zen__explain">{warm.full}</p>
            </div>
          )}

          <div className="agile-zen__nav">
            {!warmRevealed ? (
              <p className="agile-zen__hint">
                Fill in the blank, then press <strong>Check</strong>. Every Zen
                session starts with this full written warm-up set.
              </p>
            ) : (
              <button
                type="button"
                className="agile-btn agile-btn--primary"
                onClick={nextWarmup}
              >
                {warmIdx + 1 < warmups.length
                  ? 'Next value ›'
                  : 'Start questions ›'}
              </button>
            )}
          </div>
        </div>
      )}

      {!inWarmup && (
      <>
      <div className="agile-question">
        <span className="agile-question__topic">{TOPICS[current.topic]}</span>
        <h2 className="agile-question__text">{current.q}</h2>
        <div className="agile-options">
          {options.map((opt) => {
            const isChosen = selected === opt
            const isAnswer = current.correct === opt
            const cls = [
              'agile-option',
              revealed && isAnswer ? 'is-correct' : '',
              revealed && isChosen && !isAnswer ? 'is-wrong' : '',
              !revealed && isChosen ? 'is-selected' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button
                key={opt}
                type="button"
                className={cls}
                onClick={() => choose(opt)}
                disabled={revealed}
              >
                <span className="agile-option__radio" aria-hidden />
                <span>{opt}</span>
              </button>
            )
          })}
        </div>

        {revealed && (
          <div
            className={`agile-zen__feedback ${
              selected === current.correct ? 'is-right' : 'is-wrong'
            }`}
          >
            <strong>
              {selected === current.correct ? 'Correct ✓' : 'Not quite ✗'}
            </strong>
            {selected !== current.correct && (
              <p className="agile-zen__answer">
                Answer: <span>{current.correct}</span>
              </p>
            )}
            <p className="agile-zen__explain">{current.explain}</p>
          </div>
        )}
      </div>

      <div className="agile-zen__nav">
        {!revealed ? (
          <p className="agile-zen__hint">
            Pick an answer to see instant feedback. Wrong answers are saved —
            press <strong>Redo wrong</strong> to replay them until you get them
            right, or <strong>End session</strong> for your per-topic breakdown.
          </p>
        ) : (
          <button
            type="button"
            className="agile-btn agile-btn--primary"
            onClick={next}
          >
            Next question ›
          </button>
        )}
      </div>
      </>
      )}
    </div>
  )
}

// End-of-session feedback: per-topic accuracy, strengths, focus areas and a
// review of everything answered incorrectly.
function ZenReview({ history, onRestart }) {
  const answered = history.length
  const right = history.filter((h) => h.isRight).length
  const accuracy = answered ? Math.round((right / answered) * 100) : 0
  const passed = accuracy >= 60

  const topicStats = useMemo(() => {
    const map = {}
    history.forEach((h) => {
      if (!map[h.topic]) map[h.topic] = { correct: 0, total: 0 }
      map[h.topic].total += 1
      if (h.isRight) map[h.topic].correct += 1
    })
    return Object.entries(map)
      .map(([topic, s]) => ({
        topic,
        correct: s.correct,
        total: s.total,
        pct: Math.round((s.correct / s.total) * 100),
      }))
      .sort((a, b) => b.pct - a.pct || b.total - a.total)
  }, [history])

  const strengths = topicStats.filter((t) => t.pct >= 80)
  const weaknesses = [...topicStats]
    .filter((t) => t.pct < 70)
    .sort((a, b) => a.pct - b.pct)
  const wrong = history.filter((h) => !h.isRight)

  if (answered === 0) {
    return (
      <div className="agile-review">
        <p className="agile-empty">
          You ended the session without answering any questions. Start again and
          answer a few to get your per-topic breakdown.
        </p>
        <button type="button" className="agile-btn agile-btn--primary" onClick={onRestart}>
          Start a new session
        </button>
      </div>
    )
  }

  return (
    <div className="agile-review">
      <div className={`agile-result ${passed ? 'is-pass' : 'is-fail'}`}>
        <div className="agile-result__score">{accuracy}%</div>
        <div className="agile-result__detail">
          <strong>Session complete</strong>
          <span>
            {right}/{answered} correct · {answered - right} wrong · {accuracy}%
            accuracy
          </span>
        </div>
        <div className="agile-result__actions">
          <button type="button" className="agile-btn agile-btn--primary" onClick={onRestart}>
            New session
          </button>
        </div>
      </div>

      <section className="agile-analysis">
        <h2 className="agile-analysis__title">Performance by topic</h2>
        <div className="agile-analysis__bars">
          {topicStats.map((t) => {
            const band = t.pct >= 80 ? 'good' : t.pct >= 70 ? 'ok' : 'bad'
            return (
              <div key={t.topic} className="agile-bar">
                <div className="agile-bar__label">
                  <span>{TOPICS[t.topic]}</span>
                  <span className="agile-bar__score">
                    {t.correct}/{t.total} · {t.pct}%
                  </span>
                </div>
                <div className="agile-bar__track">
                  <div
                    className={`agile-bar__fill agile-bar__fill--${band}`}
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="agile-analysis__cols">
          <div className="agile-analysis__col">
            <h3 className="agile-analysis__h agile-analysis__h--good">
              Key strengths
            </h3>
            {strengths.length ? (
              <ul className="agile-analysis__list">
                {strengths.map((t) => (
                  <li key={t.topic}>
                    <strong>{TOPICS[t.topic]}</strong> — {t.pct}% ({t.correct}/
                    {t.total})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="agile-analysis__empty">
                No topic hit 80% yet — keep practising to build clear strengths.
              </p>
            )}
          </div>

          <div className="agile-analysis__col">
            <h3 className="agile-analysis__h agile-analysis__h--bad">
              Focus areas to improve
            </h3>
            {weaknesses.length ? (
              <ul className="agile-analysis__list">
                {weaknesses.map((t) => (
                  <li key={t.topic}>
                    <strong>{TOPICS[t.topic]}</strong> — {t.pct}% ({t.correct}/
                    {t.total})
                    <p className="agile-analysis__tip">{TOPIC_TIPS[t.topic]}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="agile-analysis__empty">
                Nothing below 70% — excellent coverage across the syllabus!
              </p>
            )}
          </div>
        </div>

        <p className="agile-analysis__verdict">
          {accuracy === 100
            ? 'Flawless session — full marks across every question you attempted. 🎯'
            : weaknesses.length === 0
              ? 'Strong, well-rounded session. To reach full marks, re-check the questions you missed below and confirm exact wording (definitions, timeboxes and the MoSCoW 60/20 numbers).'
              : 'To push toward full marks, prioritise the focus areas above (weakest first). Re-read each missed question below — most marks are lost on exact definitions, role accountabilities, timeboxes and number-based rules.'}
        </p>
      </section>

      {wrong.length > 0 && (
        <>
          <h2 className="agile-analysis__title">
            Review your {wrong.length} missed question
            {wrong.length > 1 ? 's' : ''}
          </h2>
          <ol className="agile-review__list">
            {wrong.map((h, i) => (
              <li key={`${h.id}-${i}`} className="agile-review__item is-wrong">
                <span className="agile-review__topic">{TOPICS[h.topic]}</span>
                <p className="agile-review__q">{h.q}</p>
                <ul className="agile-review__opts">
                  {h.options.map((opt) => {
                    const picked = h.chosen === opt
                    const isAnswer = h.correct === opt
                    return (
                      <li
                        key={opt}
                        className={[
                          'agile-review__opt',
                          isAnswer ? 'is-answer' : '',
                          picked && !isAnswer ? 'is-yourwrong' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {opt}
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mock Exams
// ---------------------------------------------------------------------------

// Build one weighted 50-question paper: sample per topic by weight, then
// shuffle the question order and each question's options.
function buildExam() {
  const picked = []
  Object.entries(EXAM_WEIGHTING).forEach(([topic, count]) => {
    const pool = QUESTION_BANK.filter((q) => q.topic === topic)
    const sample = shuffle(pool).slice(0, Math.min(count, pool.length))
    picked.push(...sample)
  })

  // If a topic lacked enough questions, top up from the remaining bank so the
  // paper always reaches the configured length where possible.
  if (picked.length < EXAM_CONFIG.questionCount) {
    const chosen = new Set(picked.map((q) => q.id))
    const remainder = shuffle(QUESTION_BANK.filter((q) => !chosen.has(q.id)))
    picked.push(
      ...remainder.slice(0, EXAM_CONFIG.questionCount - picked.length),
    )
  }

  return shuffle(picked).map((q) => ({
    id: q.id,
    topic: q.topic,
    q: q.q,
    explain: q.explain,
    correct: q.correct,
    options: shuffle(q.options),
  }))
}

// Builds a fixed paper: keeps the authored question order and option order so
// it reads exactly like the real exam booklet (a-d options stay put).
// Small deterministic PRNG (mulberry32) so option order is stable per question
// across re-renders / review, but still varied between questions.
function seededRandom(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i += 1) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

// Some answer formats must stay in their conventional exam order: numbered
// combinations (1, 2, 3), two-statement true/false, and "all/none of the above".
function hasFixedOptionOrder(options) {
  return options.some(
    (o) =>
      /^\d(,\s*\d)+$/.test(o.trim()) ||
      /^Only \d is true$/i.test(o.trim()) ||
      /^Both 1 and 2 are true$/i.test(o.trim()) ||
      /^Neither 1 (nor|or) 2 is true$/i.test(o.trim()) ||
      /of the above/i.test(o),
  )
}

function buildFixedExam(paper) {
  return paper.questions.map((q) => {
    let options = q.options
    // Scatter the correct answer across A-D for free-form questions so there
    // is no positional pattern, while preserving order-sensitive formats.
    if (!hasFixedOptionOrder(q.options)) {
      const rand = seededRandom(hashString(q.id))
      options = [...q.options]
      for (let i = options.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1))
        ;[options[i], options[j]] = [options[j], options[i]]
      }
    }
    return {
      id: q.id,
      topic: q.topic,
      q: q.q,
      explain: q.explain,
      correct: q.correct,
      options,
    }
  })
}

// ---------------------------------------------------------------------------
// Wrong Questions Bank — every mock question answered incorrectly lands here
// automatically. Questions can be reviewed (with the correct answer) and
// retried in bulk. A later correct answer does not remove them.
// ---------------------------------------------------------------------------
function WrongBankView() {
  const {
    wrongBank,
    addWrongQuestions,
    removeWrongQuestions,
    clearWrongBank,
  } = useAgileProgress()
  const [retrying, setRetrying] = useState(false)

  // Sort newest-added first for the list view.
  const entries = useMemo(
    () =>
      [...wrongBank].sort(
        (a, b) => new Date(b.addedAt ?? 0) - new Date(a.addedAt ?? 0),
      ),
    [wrongBank],
  )

  // Retrying is for practice only. Correct answers stay in the bank; if a
  // question is missed again, refresh the recorded wrong choice.
  const onRetryFinish = (examKey, title, result, exam, answers) => {
    addWrongQuestions(
      exam
        .filter((q) => answers[q.id] !== q.correct)
        .map((q) => ({
          ...q,
          chosen: answers[q.id] ?? null,
          from: 'Wrong bank retry',
        })),
    )
  }

  if (retrying) {
    return (
      <ExamRunner
        examKey="wrong-bank-retry"
        title="Wrong questions retry"
        build={() => shuffle(wrongBank)}
        onExit={() => setRetrying(false)}
        onFinish={onRetryFinish}
      />
    )
  }

  return (
    <div className="agile-wrongbank">
      <h1 className="agile-exams__title">Wrong Questions Bank</h1>
      <p className="agile-exams__lede">
        Every mock question you answer incorrectly is saved here automatically.
        Review each one with its correct answer and retry them whenever you
        want. Getting a question right does not remove it &mdash; use Remove
        or Clear bank if you want it gone.
      </p>

      <div className="agile-wrongbank__bar">
        <span className="agile-wrongbank__count">
          {entries.length} question{entries.length === 1 ? '' : 's'} in the bank
        </span>
        <div className="agile-wrongbank__actions">
          <button
            type="button"
            className="agile-btn agile-btn--primary"
            disabled={entries.length === 0}
            onClick={() => setRetrying(true)}
          >
            Retry all wrong questions
          </button>
          <button
            type="button"
            className="agile-btn agile-btn--ghost"
            disabled={entries.length === 0}
            onClick={clearWrongBank}
          >
            Clear bank
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="agile-empty">
          Nothing here yet — sit any mock exam and every question you get wrong
          will appear in this bank automatically.
        </p>
      ) : (
        <ol className="agile-review__list">
          {entries.map((e) => (
            <li key={e.id} className="agile-review__item is-wrong">
              <div className="agile-wrongbank__itemhead">
                <span className="agile-review__topic">
                  {TOPICS[e.topic] || PRACTITIONER_TOPICS[e.topic] || e.topic}
                </span>
                <span className="agile-wrongbank__meta">
                  {e.from}
                  {e.addedAt
                    ? ` · ${new Date(e.addedAt).toLocaleDateString()}`
                    : ''}
                </span>
                <button
                  type="button"
                  className="agile-btn agile-btn--ghost agile-wrongbank__remove"
                  onClick={() => removeWrongQuestions([e.q])}
                  aria-label="Remove this question from the bank"
                >
                  Remove
                </button>
              </div>
              <p className="agile-review__q">{e.q}</p>
              <ul className="agile-review__opts">
                {e.options.map((opt) => {
                  const picked = e.chosen === opt
                  const isAnswer = e.correct === opt
                  return (
                    <li
                      key={opt}
                      className={[
                        'agile-review__opt',
                        isAnswer ? 'is-answer' : '',
                        picked && !isAnswer ? 'is-yourwrong' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {opt}
                      {isAnswer ? ' ✓' : picked ? ' — your answer' : ''}
                    </li>
                  )
                })}
              </ul>
              {e.explain ? (
                <p className="agile-review__explain">{e.explain}</p>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function ExamsView({ startLibrary = null }) {
  // active = { key, title, build } describing the paper to run.
  const [active, setActive] = useState(null)
  // Completed-paper snapshots saved on this device, newest first.
  const [savedMocks, setSavedMocks] = useState(() =>
    readStore(STORAGE_KEYS.savedMocks, []),
  )
  // A saved attempt currently being re-reviewed, or null.
  const [reviewing, setReviewing] = useState(null)
  // When set, the card Review button is showing every saved sitting of
  // that one paper (newest first).
  const [reviewingPaper, setReviewingPaper] = useState(null)
  // null = Foundation + Practitioner hub; 'practice' / 'finals' drill in.
  // 'practitioner' from Home only scrolls to the Practitioner block.
  const [library, setLibrary] = useState(
    startLibrary === 'practitioner' ? null : startLibrary,
  )

  useEffect(() => {
    if (startLibrary !== 'practitioner' || library) return undefined
    const t = window.setTimeout(() => {
      document.getElementById('agile-practitioner')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
    return () => window.clearTimeout(t)
  }, [startLibrary, library])
  // Which 10-paper booklet is open inside the Final series.
  const [finalBook, setFinalBook] = useState(1)
  const { examResults: results, recordExam, cloud, attempts, addWrongQuestions } =
    useAgileProgress()

  // Persist saved attempts whenever they change.
  useEffect(() => {
    writeStore(STORAGE_KEYS.savedMocks, savedMocks)
  }, [savedMocks])

  const onFinish = (examKey, title, result, exam, answers) => {
    recordExam(examKey, title, result)
    // Snapshot the whole sat paper (question + option order + answers) so the
    // review can be reopened later exactly as it appeared.
    const entry = {
      id: `${examKey}-${Date.now()}`,
      examKey,
      title,
      savedAt: new Date().toISOString(),
      result,
      exam,
      answers,
    }
    setSavedMocks((prev) => [entry, ...prev].slice(0, MAX_SAVED_MOCKS))
    // Every missed question automatically joins the wrong-question bank.
    if (isPractitionerSnapshot(exam)) {
      addWrongQuestions(
        flattenPractitioner(exam.paper)
          .filter((q) => !scorePractitionerLine(q, answers[q.id]))
          .map((q) => ({
            id: q.id,
            topic: q.topic,
            q: practitionerStem(q),
            options:
              q.options ??
              (q.type === 'ar'
                ? AR_OPTIONS.map((o) => `${o.key}. ${o.text}`)
                : (q.column2 ?? []).map((o) => `${o.key}. ${o.text}`)),
            correct: practitionerCorrectLabel(q),
            explain: q.explain ?? '',
            chosen: Array.isArray(answers[q.id])
              ? answers[q.id].join(' + ')
              : (answers[q.id] ?? null),
            from: title,
            addedAt: new Date().toISOString(),
          })),
      )
    } else {
      addWrongQuestions(
        exam
          .filter((q) => answers[q.id] !== q.correct)
          .map((q) => ({
            id: q.id,
            topic: q.topic,
            q: q.q,
            options: q.options,
            correct: q.correct,
            explain: q.explain ?? '',
            chosen: answers[q.id] ?? null,
            from: title,
            addedAt: new Date().toISOString(),
          })),
      )
    }
  }

  const deleteSaved = (id) => {
    setSavedMocks((prev) => prev.filter((s) => s.id !== id))
  }

  const pastFor = (key) =>
    savedMocks
      .filter((s) => String(s.examKey) === String(key))
      .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))

  // Re-open a previously saved attempt in the full review screen.
  if (reviewing) {
    const exitLabel = reviewingPaper ? 'Back to attempts' : 'Back to exams'
    return (
      <div className="agile-saved-review">
        <p className="agile-saved-review__meta">
          Reviewing saved attempt: <strong>{reviewing.title}</strong> ·{' '}
          {new Date(reviewing.savedAt).toLocaleString()}
        </p>
        {isPractitionerSnapshot(reviewing.exam) ? (
          <PractitionerReview
            paper={reviewing.exam.paper}
            answers={reviewing.answers}
            result={reviewing.result}
            exitLabel={exitLabel}
            onExit={() => setReviewing(null)}
          />
        ) : (
          <ExamReview
            exam={reviewing.exam}
            answers={reviewing.answers}
            result={reviewing.result}
            exitLabel={exitLabel}
            onExit={() => setReviewing(null)}
          />
        )}
      </div>
    )
  }

  // Per-paper history opened from the Review button on a mock card.
  if (reviewingPaper) {
    const past = pastFor(reviewingPaper.key)
    return (
      <div className="agile-exams">
        <button
          type="button"
          className="agile-btn agile-btn--ghost agile-exams__back"
          onClick={() => setReviewingPaper(null)}
        >
          ‹ Back to papers
        </button>
        <h1 className="agile-exams__title">
          Past attempts — {reviewingPaper.title}
        </h1>
        <p className="agile-exams__lede">
          Every completed sitting of this paper is kept here. Open any one to
          see every question, the answer you gave, and the correct one.
        </p>
        {past.length ? (
          <ol className="agile-history">
            {past.map((s, i) => (
              <li
                key={s.id}
                className={`agile-history__row agile-history__row--saved ${
                  s.result.passed ? 'is-pass' : 'is-fail'
                }`}
              >
                <span className="agile-history__title">
                  {i === 0 ? 'Most recent' : `Sitting ${i + 1}`}
                </span>
                <span className="agile-history__score">
                  {s.result.score}/{s.result.total} · {s.result.percent}%
                </span>
                <span
                  className={`agile-pill ${
                    s.result.passed ? 'agile-pill--pass' : 'agile-pill--fail'
                  }`}
                >
                  {s.result.passed ? 'PASS' : 'NOT YET'}
                </span>
                <span className="agile-history__date">
                  {new Date(s.savedAt).toLocaleString()}
                </span>
                <span className="agile-history__actions">
                  <button
                    type="button"
                    className="agile-btn agile-btn--primary"
                    onClick={() => setReviewing(s)}
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    className="agile-btn agile-btn--ghost"
                    onClick={() => deleteSaved(s.id)}
                    aria-label={`Delete saved attempt from ${s.savedAt}`}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="agile-exam-card__none">
            No saved sittings of this paper yet. Finish it once and it will
            appear here for review.
          </p>
        )}
      </div>
    )
  }

  if (active) {
    if (active.kind === 'practitioner') {
      return (
        <PractitionerRunner
          paper={active.paper}
          examKey={active.key}
          title={active.title}
          onExit={() => setActive(null)}
          onFinish={onFinish}
        />
      )
    }
    return (
      <ExamRunner
        examKey={active.key}
        title={active.title}
        build={active.build}
        onExit={() => setActive(null)}
        onFinish={onFinish}
      />
    )
  }

  const finalsSat = FINAL_MOCK_EXAMS.filter((p) => results[p.id]).length
  const finalsPassed = FINAL_MOCK_EXAMS.filter((p) => results[p.id]?.passed).length
  const activeBook =
    FINAL_BOOKS.find((b) => b.id === finalBook) ?? FINAL_BOOKS[0]
  const bookPapers = papersInBook(activeBook)

  const renderPaperRow = (paper) => {
    const key = paper.id
    const title = paper.title
    const r = results[key]
    const past = pastFor(key)
    const n = finalPaperNumber(paper)
    return (
      <li key={key} className="agile-paper-row">
        <span className="agile-paper-row__num">{String(n).padStart(2, '0')}</span>
        <div className="agile-paper-row__main">
          <h2>{title}</h2>
          {r ? (
            <p>
              Best {r.bestPercent}% · last {r.lastScore}/
              {r.total ?? EXAM_CONFIG.questionCount} · {r.attempts} attempt
              {r.attempts === 1 ? '' : 's'}
            </p>
          ) : (
            <p>Not sat yet · 50 questions · 40 minutes · 30/50 to pass</p>
          )}
        </div>
        {r?.passed != null ? (
          <span
            className={`agile-pill ${
              r.passed ? 'agile-pill--pass' : 'agile-pill--fail'
            }`}
          >
            {r.passed ? 'PASSED' : 'NOT YET'}
          </span>
        ) : (
          <span className="agile-paper-row__fresh">Ready</span>
        )}
        <div className="agile-paper-row__actions">
          <button
            type="button"
            className="agile-btn agile-btn--primary"
            onClick={() =>
              setActive({
                key,
                title,
                build: () => buildFixedExam(paper),
              })
            }
          >
            {r ? 'Retake' : 'Start'}
          </button>
          <button
            type="button"
            className="agile-btn"
            disabled={past.length === 0}
            onClick={() => setReviewingPaper({ key, title })}
          >
            Review{past.length > 0 ? ` (${past.length})` : ''}
          </button>
        </div>
      </li>
    )
  }

  const renderCard = (key, title, build) => {
    const r = results[key]
    const past = pastFor(key)
    return (
      <div key={key} className="agile-exam-card">
        <div className="agile-exam-card__head">
          <h2>{title}</h2>
          {r?.passed != null && (
            <span
              className={`agile-pill ${
                r.passed ? 'agile-pill--pass' : 'agile-pill--fail'
              }`}
            >
              {r.passed ? 'PASSED' : 'NOT YET'}
            </span>
          )}
        </div>
        {r ? (
          <ul className="agile-exam-card__stats">
            <li>
              Best: <strong>{r.bestPercent}%</strong>
            </li>
            <li>
              Last: {r.lastScore}/{r.total ?? EXAM_CONFIG.questionCount} (
              {r.lastPercent}%)
            </li>
            <li>Attempts: {r.attempts}</li>
          </ul>
        ) : (
          <p className="agile-exam-card__none">Not attempted yet.</p>
        )}
        <div className="agile-exam-card__actions">
          <button
            type="button"
            className="agile-btn agile-btn--primary"
            onClick={() => setActive({ key, title, build })}
          >
            {r ? 'Retake' : 'Start'}
          </button>
          <button
            type="button"
            className="agile-btn"
            disabled={past.length === 0}
            onClick={() => setReviewingPaper({ key, title })}
            title={
              past.length === 0
                ? 'Finish this mock to review it later'
                : `Review ${past.length} saved attempt${
                    past.length === 1 ? '' : 's'
                  }`
            }
          >
            Review{past.length > 0 ? ` (${past.length})` : ''}
          </button>
        </div>
      </div>
    )
  }

  if (!library) {
    const practSat = PRACTITIONER_EXAMS.filter((p) => results[p.id]).length
    const practPassed = PRACTITIONER_EXAMS.filter((p) => results[p.id]?.passed)
      .length
    return (
      <div className="agile-exams">
        <h2 className="agile-home__level">Foundation</h2>
        <p className="agile-exams__lede">
          Practice sits and the final series stay apart so a hard
          official-style paper is never mixed into a revision pack. Every
          Foundation paper is {EXAM_CONFIG.questionCount} questions,{' '}
          {EXAM_CONFIG.durationMinutes} minutes, closed book,{' '}
          {EXAM_CONFIG.passMark}/{EXAM_CONFIG.questionCount} to pass.
        </p>
        <div className="agile-exams__chooser">
          <button
            type="button"
            className="agile-exams__choice"
            onClick={() => setLibrary('practice')}
          >
            <span className="agile-exams__choice-kicker">Revision</span>
            <h2>Practice library</h2>
            <p>
              Nine full mocks, the 10-paper practice pack, two realistic
              papers, topic drills and randomised sits from the bank.
            </p>
            <span className="agile-exams__choice-go">Open practice library →</span>
          </button>
          <button
            type="button"
            className="agile-exams__choice agile-exams__choice--final"
            onClick={() => setLibrary('finals')}
          >
            <span className="agile-exams__choice-kicker">Exam series</span>
            <h2>Final series · 30 papers</h2>
            <p>
              Three official-style books of 10. Hardest stems, real APMG
              question types, full syllabus weighting. Sit these as if it
              is the real Foundation paper.
            </p>
            <span className="agile-exams__choice-go">
              Open final series → {finalsSat}/{FINAL_MOCK_EXAMS.length || 30} sat
            </span>
          </button>
        </div>

        <h2 className="agile-home__level" id="agile-practitioner">
          Practitioner
        </h2>
        <p className="agile-exams__lede">
          Original scenario papers in the official 80-mark booklet layout:
          four syllabus questions, 20 lines each, classic / select-2 /
          matching / assertion-reason, scenario plus additional information.
          Open book · {PRACTITIONER_CONFIG.durationMinutes} minutes ·{' '}
          {PRACTITIONER_CONFIG.passMark}/{PRACTITIONER_CONFIG.questionCount} to
          pass.
        </p>
        <div className="agile-exams__meter" aria-label="Practitioner progress">
          <span>
            {practPassed} passed · {practSat} sat · {PRACTITIONER_EXAMS.length}{' '}
            papers
          </span>
        </div>
        <ol className="agile-paper-list">
          {PRACTITIONER_EXAMS.map((paper, i) => {
            const key = paper.id
            const r = results[key]
            const past = pastFor(key)
            return (
              <li key={key} className="agile-paper-row">
                <span className="agile-paper-row__num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="agile-paper-row__main">
                  <h2>{paper.title}</h2>
                  {r ? (
                    <p>
                      Best {r.bestPercent}% · last {r.lastScore}/
                      {r.total ?? PRACTITIONER_CONFIG.questionCount} ·{' '}
                      {r.attempts} attempt{r.attempts === 1 ? '' : 's'}
                    </p>
                  ) : (
                    <p>
                      {paper.project} · 80 lines · 150 minutes · 40/80 to pass
                    </p>
                  )}
                </div>
                {r?.passed != null ? (
                  <span
                    className={`agile-pill ${
                      r.passed ? 'agile-pill--pass' : 'agile-pill--fail'
                    }`}
                  >
                    {r.passed ? 'PASSED' : 'NOT YET'}
                  </span>
                ) : (
                  <span className="agile-paper-row__fresh">Ready</span>
                )}
                <div className="agile-paper-row__actions">
                  <button
                    type="button"
                    className="agile-btn agile-btn--primary"
                    onClick={() =>
                      setActive({
                        kind: 'practitioner',
                        key,
                        title: paper.title,
                        paper,
                      })
                    }
                  >
                    Start
                  </button>
                  <button
                    type="button"
                    className="agile-btn"
                    disabled={past.length === 0}
                    onClick={() =>
                      setReviewingPaper({ key, title: paper.title })
                    }
                  >
                    Review{past.length > 0 ? ` (${past.length})` : ''}
                  </button>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  if (library === 'finals') {
    return (
      <div className="agile-exams">
        <button
          type="button"
          className="agile-btn agile-btn--ghost agile-exams__back"
          onClick={() => setLibrary(null)}
        >
          ‹ All exam libraries
        </button>
        <h1 className="agile-exams__title">Final examination series</h1>
        <p className="agile-exams__lede">
          30 original papers in the real APMG Foundation format: direct
          questions, identify the missing word(s), numbered combinations
          and two-statement true/false. Answers are scattered A–D. Closed
          book — treat each sitting like the real exam.
        </p>
        <div className="agile-exams__meter" aria-label="Final series progress">
          <span>
            {finalsPassed} passed · {finalsSat} sat ·{' '}
            {FINAL_MOCK_EXAMS.length || 30} papers
          </span>
          <div className="agile-progress-track agile-exams__meter-track">
            <div
              className="agile-progress-fill"
              style={{
                width: `${
                  FINAL_MOCK_EXAMS.length
                    ? Math.round((finalsSat / FINAL_MOCK_EXAMS.length) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
        <div className="agile-exams__books" role="tablist" aria-label="Exam books">
          {FINAL_BOOKS.map((book) => {
            const papers = papersInBook(book)
            const sat = papers.filter((p) => results[p.id]).length
            const active = book.id === activeBook.id
            return (
              <button
                key={book.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`agile-exams__book${active ? ' is-active' : ''}`}
                onClick={() => setFinalBook(book.id)}
              >
                <strong>{book.label}</strong>
                <span>{book.range}</span>
                <em>
                  {sat}/{papers.length || 10} sat
                </em>
              </button>
            )
          })}
        </div>
        <p className="agile-exams__note">{activeBook.blurb}</p>
        {bookPapers.length ? (
          <ol className="agile-paper-list">{bookPapers.map(renderPaperRow)}</ol>
        ) : (
          <p className="agile-empty">
            This book is still being assembled. Open another book or the
            practice library in the meantime.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="agile-exams">
      <button
        type="button"
        className="agile-btn agile-btn--ghost agile-exams__back"
        onClick={() => setLibrary(null)}
      >
        ‹ All exam libraries
      </button>
      <h1 className="agile-exams__title">Practice library</h1>
      <p className="agile-exams__lede">
        Revision papers for drilling. Every paper still follows the real
        exam format: {EXAM_CONFIG.questionCount} questions, a{' '}
        {EXAM_CONFIG.durationMinutes}-minute timer, and a pass mark of{' '}
        {EXAM_CONFIG.passMark}/{EXAM_CONFIG.questionCount} (
        {EXAM_CONFIG.passPercent}%). Closed book. Tap an option and
        you&rsquo;ll see immediately whether you were right or wrong.
      </p>

      <h2 className="agile-exams__section">
        Full mock exams &mdash; real exam style
      </h2>
      <p className="agile-exams__note">
        Full-length papers modelled exactly on a real AgilePM v3 paper: direct
        questions, &ldquo;identify the missing word(s)&rdquo;, numbered-statement
        combinations (1, 2, 3 &hellip;) and two-statement true/false items.
        Correct answers are scattered with no pattern. Each tap shows
        instantly if you were right or wrong; submit at the end for the
        full strengths &amp; weaknesses breakdown by topic.
      </p>
      <div className="agile-exams__grid">
        {HARD_EXAMS.map((paper) =>
          renderCard(paper.id, paper.title, () => buildFixedExam(paper)),
        )}
      </div>

      <h2 className="agile-exams__section">
        Practice examination pack &mdash; 10 extra papers
      </h2>
      <p className="agile-exams__note">
        Ten additional full-length papers from the practice examination pack
        (500 questions). Each item keeps its A&ndash;D options and the pack
        answer key, with the rationale shown after you tap.
      </p>
      <div className="agile-exams__grid">
        {DOC_MOCK_EXAMS.map((paper) =>
          renderCard(paper.id, paper.title, () => buildFixedExam(paper)),
        )}
      </div>

      <h2 className="agile-exams__section">Exam-realistic papers</h2>
      <p className="agile-exams__note">
        Two fixed, exam-standard papers written in the real APMG question style
        (direct questions, &ldquo;identify the missing word(s)&rdquo;,
        &ldquo;which statement is true&rdquo;) and presented in a set order with
        fixed A&ndash;D options &mdash; just like sitting the actual exam.
      </p>
      <div className="agile-exams__grid">
        {REALISTIC_EXAMS.map((paper) =>
          renderCard(paper.id, paper.title, () => buildFixedExam(paper)),
        )}
      </div>

      <h2 className="agile-exams__section">Topic-focused papers</h2>
      <p className="agile-exams__note">
        Deep-dive papers where every question targets a single syllabus area.
        The timer and pass mark scale to the number of questions (still 60% to
        pass).
      </p>
      <div className="agile-exams__grid">
        {TOPIC_EXAMS.map((paper) => {
          const past = pastFor(paper.id)
          return (
          <div key={paper.id} className="agile-exam-card">
            <div className="agile-exam-card__head">
              <h2>{paper.title}</h2>
              {results[paper.id]?.passed != null && (
                <span
                  className={`agile-pill ${
                    results[paper.id].passed
                      ? 'agile-pill--pass'
                      : 'agile-pill--fail'
                  }`}
                >
                  {results[paper.id].passed ? 'PASSED' : 'NOT YET'}
                </span>
              )}
            </div>
            <p className="agile-exam-card__tag">
              {TOPICS[paper.topic]} · {paper.questions.length} questions
            </p>
            {results[paper.id] ? (
              <ul className="agile-exam-card__stats">
                <li>
                  Best: <strong>{results[paper.id].bestPercent}%</strong>
                </li>
                <li>
                  Last: {results[paper.id].lastScore}/
                  {results[paper.id].total ?? paper.questions.length} (
                  {results[paper.id].lastPercent}%)
                </li>
                <li>Attempts: {results[paper.id].attempts}</li>
              </ul>
            ) : (
              <p className="agile-exam-card__none">Not attempted yet.</p>
            )}
            <div className="agile-exam-card__actions">
              <button
                type="button"
                className="agile-btn agile-btn--primary"
                onClick={() =>
                  setActive({
                    key: paper.id,
                    title: paper.title,
                    build: () => buildFixedExam(paper),
                  })
                }
              >
                {results[paper.id] ? 'Retake' : 'Start'}
              </button>
              <button
                type="button"
                className="agile-btn"
                disabled={past.length === 0}
                onClick={() =>
                  setReviewingPaper({ key: paper.id, title: paper.title })
                }
                title={
                  past.length === 0
                    ? 'Finish this mock to review it later'
                    : `Review ${past.length} saved attempt${
                        past.length === 1 ? '' : 's'
                      }`
                }
              >
                Review{past.length > 0 ? ` (${past.length})` : ''}
              </button>
            </div>
          </div>
          )
        })}
      </div>

      <h2 className="agile-exams__section">Randomised practice papers</h2>
      <p className="agile-exams__note">
        Four papers assembled from the wider question bank, weighted across
        syllabus topics and reshuffled every attempt for endless practice.
      </p>
      <div className="agile-exams__grid">
        {[1, 2, 3, 4].map((no) =>
          renderCard(no, `Mock Exam ${no}`, () => buildExam()),
        )}
      </div>

      <h2 className="agile-exams__section">Saved results — review your answers</h2>
      <p className="agile-exams__note">
        Every mock you complete is saved here automatically. Open any attempt to
        see the full paper again — every question, the answer you gave and the
        correct one — so you can see exactly where you went wrong.
      </p>
      {savedMocks.length ? (
        <ol className="agile-history">
          {savedMocks.map((s) => (
            <li
              key={s.id}
              className={`agile-history__row agile-history__row--saved ${
                s.result.passed ? 'is-pass' : 'is-fail'
              }`}
            >
              <span className="agile-history__title">{s.title}</span>
              <span className="agile-history__score">
                {s.result.score}/{s.result.total} · {s.result.percent}%
              </span>
              <span
                className={`agile-pill ${
                  s.result.passed ? 'agile-pill--pass' : 'agile-pill--fail'
                }`}
              >
                {s.result.passed ? 'PASS' : 'NOT YET'}
              </span>
              <span className="agile-history__date">
                {new Date(s.savedAt).toLocaleString()}
              </span>
              <span className="agile-history__actions">
                <button
                  type="button"
                  className="agile-btn agile-btn--primary"
                  onClick={() => setReviewing(s)}
                >
                  Review
                </button>
                <button
                  type="button"
                  className="agile-btn agile-btn--ghost"
                  onClick={() => deleteSaved(s.id)}
                  aria-label={`Delete saved attempt ${s.title}`}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="agile-exam-card__none">
          No saved results yet — finish any mock and it will appear here for
          review.
        </p>
      )}

      {cloud && (
        <>
          <h2 className="agile-exams__section">Recent attempts</h2>
          <p className="agile-exams__note">
            Your completed papers, saved to your account so you can track how
            you&rsquo;re improving over time.
          </p>
          {attempts.length ? (
            <ol className="agile-history">
              {attempts.map((a) => (
                <li
                  key={a.id}
                  className={`agile-history__row ${
                    a.passed ? 'is-pass' : 'is-fail'
                  }`}
                >
                  <span className="agile-history__title">{a.title}</span>
                  <span className="agile-history__score">
                    {a.score}/{a.total} · {a.percent}%
                  </span>
                  <span
                    className={`agile-pill ${
                      a.passed ? 'agile-pill--pass' : 'agile-pill--fail'
                    }`}
                  >
                    {a.passed ? 'PASS' : 'NOT YET'}
                  </span>
                  <span className="agile-history__date">
                    {new Date(a.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="agile-exam-card__none">
              No attempts saved yet — finish a paper and it will appear here.
            </p>
          )}
        </>
      )}
    </div>
  )
}

function ExamRunner({ examKey, title, build, onExit, onFinish }) {
  // The paper is built once per attempt.
  const [exam] = useState(() => build())
  // Pass mark and timer scale to the actual paper length, so shorter
  // topic-focused papers keep the same 60% bar and proportional time as the
  // full 50-question / 40-minute exam.
  const total = exam.length
  const passMark = Math.ceil((total * EXAM_CONFIG.passPercent) / 100)
  const durationMinutes = Math.max(
    1,
    Math.round((total * EXAM_CONFIG.durationMinutes) / EXAM_CONFIG.questionCount),
  )

  const [answers, setAnswers] = useState({}) // { questionId: optionText }
  const [current, setCurrent] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60)
  const finishedRef = useRef(false)

  // First tap locks the answer and reveals right/wrong immediately, so
  // practice feedback happens per question rather than only after submit.
  const choose = (opt) => {
    const qid = exam[current].id
    if (answers[qid] != null) return
    setAnswers((prev) => ({ ...prev, [qid]: opt }))
  }

  const result = useMemo(() => {
    const score = exam.reduce(
      (acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0),
      0,
    )
    const percent = Math.round((score / exam.length) * 100)
    return {
      score,
      percent,
      total: exam.length,
      passMark,
      passed: score >= passMark,
    }
  }, [answers, exam, passMark])

  const handleSubmit = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setSubmitted(true)
    // Pass the full paper snapshot and answers up so the attempt can be saved
    // and reviewed again later, exactly as it was sat.
    onFinish(examKey, title, result, exam, answers)
  }, [examKey, title, onFinish, result, exam, answers])

  // Countdown timer; auto-submits when it reaches zero. The state changes
  // happen inside the timeout callback (not the effect body) to avoid
  // cascading synchronous renders.
  useEffect(() => {
    if (submitted) return undefined
    const t = window.setTimeout(() => {
      if (secondsLeft <= 1) handleSubmit()
      else setSecondsLeft((s) => s - 1)
    }, 1000)
    return () => window.clearTimeout(t)
  }, [secondsLeft, submitted, handleSubmit])

  const answeredCount = Object.keys(answers).length
  const rightCount = exam.filter((qq) => answers[qq.id] === qq.correct).length
  const wrongCount = answeredCount - rightCount
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const lowTime = secondsLeft <= 60

  if (submitted) {
    return (
      <ExamReview
        exam={exam}
        answers={answers}
        result={result}
        onExit={onExit}
      />
    )
  }

  const q = exam[current]

  return (
    <div className="agile-runner">
      <div className="agile-runner__bar">
        <button type="button" className="agile-btn agile-btn--ghost" onClick={onExit}>
          ‹ Exit
        </button>
        <div className="agile-runner__meta">
          <span>
            {title} · Q{current + 1}/{exam.length}
          </span>
          <span>
            {rightCount} right · {wrongCount} wrong · {answeredCount}/
            {exam.length}
          </span>
        </div>
        <div
          className={`agile-timer${lowTime ? ' agile-timer--low' : ''}`}
          role="timer"
          aria-live="off"
        >
          ⏱ {mm}:{ss}
        </div>
      </div>

      <div className="agile-progress-track">
        <div
          className="agile-progress-fill"
          style={{ width: `${(answeredCount / exam.length) * 100}%` }}
        />
      </div>

      <div className="agile-question">
        <span className="agile-question__topic">{TOPICS[q.topic]}</span>
        <h2 className="agile-question__text">{q.q}</h2>
        <div className="agile-options">
          {q.options.map((opt) => {
            const chosen = answers[q.id]
            const revealed = chosen != null
            const isChosen = chosen === opt
            const isAnswer = q.correct === opt
            const cls = [
              'agile-option',
              revealed && isAnswer ? 'is-correct' : '',
              revealed && isChosen && !isAnswer ? 'is-wrong' : '',
              !revealed && isChosen ? 'is-selected' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button
                key={opt}
                type="button"
                className={cls}
                onClick={() => choose(opt)}
                disabled={revealed}
              >
                <span className="agile-option__radio" aria-hidden />
                <span>{opt}</span>
              </button>
            )
          })}
        </div>

        {answers[q.id] != null && (
          <div
            className={`agile-zen__feedback ${
              answers[q.id] === q.correct ? 'is-right' : 'is-wrong'
            }`}
          >
            <strong>
              {answers[q.id] === q.correct ? 'Correct ✓' : 'Not quite ✗'}
            </strong>
            {answers[q.id] !== q.correct && (
              <p className="agile-zen__answer">
                Answer: <span>{q.correct}</span>
              </p>
            )}
            {q.explain && <p className="agile-zen__explain">{q.explain}</p>}
          </div>
        )}
      </div>

      <div className="agile-runner__nav">
        <button
          type="button"
          className="agile-btn"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          ‹ Prev
        </button>
        {current < exam.length - 1 ? (
          <button
            type="button"
            className="agile-btn agile-btn--primary"
            onClick={() => setCurrent((c) => Math.min(exam.length - 1, c + 1))}
          >
            Next ›
          </button>
        ) : (
          <button
            type="button"
            className="agile-btn agile-btn--success"
            onClick={handleSubmit}
          >
            Submit exam
          </button>
        )}
      </div>

      <div className="agile-qjump">
        {exam.map((qq, i) => (
          <button
            key={qq.id}
            type="button"
            className={[
              'agile-qjump__dot',
              i === current ? 'is-current' : '',
              answers[qq.id] == null
                ? ''
                : answers[qq.id] === qq.correct
                  ? 'is-right'
                  : 'is-wrong',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setCurrent(i)}
            aria-label={`Go to question ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="agile-runner__submit">
        <button
          type="button"
          className="agile-btn agile-btn--success"
          onClick={handleSubmit}
        >
          Submit exam now
        </button>
      </div>
    </div>
  )
}

function ExamReview({ exam, answers, result, onExit, exitLabel = 'Back to exams' }) {
  const [filter, setFilter] = useState('all') // all | wrong

  const visible = exam.filter((q) =>
    filter === 'wrong' ? answers[q.id] !== q.correct : true,
  )
  const wrongCount = exam.length - result.score

  // Per-topic performance, used to identify strengths and weaknesses.
  const topicStats = useMemo(() => {
    const map = {}
    exam.forEach((q) => {
      const t = q.topic
      if (!map[t]) map[t] = { correct: 0, total: 0 }
      map[t].total += 1
      if (answers[q.id] === q.correct) map[t].correct += 1
    })
    return Object.entries(map)
      .map(([topic, s]) => ({
        topic,
        correct: s.correct,
        total: s.total,
        pct: Math.round((s.correct / s.total) * 100),
      }))
      .sort((a, b) => b.pct - a.pct || b.total - a.total)
  }, [exam, answers])

  const strengths = topicStats.filter((t) => t.pct >= 80)
  // Weakest first, so the most urgent focus areas are listed at the top.
  const weaknesses = [...topicStats]
    .filter((t) => t.pct < 70)
    .sort((a, b) => a.pct - b.pct)

  return (
    <div className="agile-review">
      <div className={`agile-result ${result.passed ? 'is-pass' : 'is-fail'}`}>
        <div className="agile-result__score">{result.percent}%</div>
        <div className="agile-result__detail">
          <strong>{result.passed ? 'PASS' : 'NOT YET'}</strong>
          <span>
            {result.score}/{exam.length} correct · {wrongCount} wrong · need{' '}
            {result.passMark} to pass
          </span>
        </div>
        <div className="agile-result__actions">
          <button type="button" className="agile-btn" onClick={onExit}>
            {exitLabel}
          </button>
        </div>
      </div>

      <section className="agile-analysis">
        <h2 className="agile-analysis__title">Performance by topic</h2>
        <div className="agile-analysis__bars">
          {topicStats.map((t) => {
            const band = t.pct >= 80 ? 'good' : t.pct >= 70 ? 'ok' : 'bad'
            return (
              <div key={t.topic} className="agile-bar">
                <div className="agile-bar__label">
                  <span>{TOPICS[t.topic]}</span>
                  <span className="agile-bar__score">
                    {t.correct}/{t.total} · {t.pct}%
                  </span>
                </div>
                <div className="agile-bar__track">
                  <div
                    className={`agile-bar__fill agile-bar__fill--${band}`}
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="agile-analysis__cols">
          <div className="agile-analysis__col">
            <h3 className="agile-analysis__h agile-analysis__h--good">
              Key strengths
            </h3>
            {strengths.length ? (
              <ul className="agile-analysis__list">
                {strengths.map((t) => (
                  <li key={t.topic}>
                    <strong>{TOPICS[t.topic]}</strong> — {t.pct}% (
                    {t.correct}/{t.total})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="agile-analysis__empty">
                No topic hit 80% yet — keep practising to build clear strengths.
              </p>
            )}
          </div>

          <div className="agile-analysis__col">
            <h3 className="agile-analysis__h agile-analysis__h--bad">
              Focus areas to improve
            </h3>
            {weaknesses.length ? (
              <ul className="agile-analysis__list">
                {weaknesses.map((t) => (
                  <li key={t.topic}>
                    <strong>{TOPICS[t.topic]}</strong> — {t.pct}% (
                    {t.correct}/{t.total})
                    <p className="agile-analysis__tip">{TOPIC_TIPS[t.topic]}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="agile-analysis__empty">
                Nothing below 70% — excellent coverage across the syllabus!
              </p>
            )}
          </div>
        </div>

        <p className="agile-analysis__verdict">
          {result.percent === 100
            ? 'Full marks — flawless across every topic. You are exam-ready. 🎯'
            : weaknesses.length === 0
              ? `Strong, well-rounded result. To reach full marks, re-check the handful of questions you missed below and confirm the exact wording (definitions, timeboxes and the MoSCoW 60/20 numbers).`
              : `To push toward full marks, prioritise the focus areas above (weakest first), then re-attempt a paper. Read each missed question's explanation below — most marks are lost on exact definitions, role accountabilities, timeboxes and number-based rules.`}
        </p>
      </section>

      <div className="agile-review__filters">
        <button
          type="button"
          className={`agile-btn agile-btn--ghost${
            filter === 'all' ? ' is-active' : ''
          }`}
          onClick={() => setFilter('all')}
        >
          All ({exam.length})
        </button>
        <button
          type="button"
          className={`agile-btn agile-btn--ghost${
            filter === 'wrong' ? ' is-active' : ''
          }`}
          onClick={() => setFilter('wrong')}
        >
          Wrong only ({wrongCount})
        </button>
      </div>

      <ol className="agile-review__list">
        {visible.map((q) => {
          const chosen = answers[q.id]
          const isCorrect = chosen === q.correct
          return (
            <li
              key={q.id}
              className={`agile-review__item ${
                isCorrect ? 'is-correct' : 'is-wrong'
              }`}
            >
              <span className="agile-review__topic">{TOPICS[q.topic]}</span>
              <p className="agile-review__q">{q.q}</p>
              <ul className="agile-review__opts">
                {q.options.map((opt) => {
                  const picked = chosen === opt
                  const right = q.correct === opt
                  return (
                    <li
                      key={opt}
                      className={[
                        'agile-review__opt',
                        right ? 'is-answer' : '',
                        picked && !right ? 'is-yourwrong' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {right ? '✓ ' : picked ? '✗ ' : ''}
                      {opt}
                      {picked && (
                        <span className="agile-review__yours"> (your answer)</span>
                      )}
                    </li>
                  )
                })}
              </ul>
              {chosen == null && (
                <p className="agile-review__skipped">You did not answer this.</p>
              )}
              <p className="agile-review__explain">{q.explain}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
