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
  QUESTION_BANK,
  REALISTIC_EXAMS,
  TOPIC_EXAMS,
  TOPICS,
} from '../data/agileContent.js'
import { HARD_EXAMS, TOPIC_TIPS } from '../data/agileHardExams.js'
import { ZEN_QUESTIONS } from '../data/agileZenQuestions.js'
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
  exams: 'agilepm:exam-results:v1',
}

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

  // Mirror aggregate progress to the cloud whenever it changes (owner only),
  // but only after the initial load for this account has completed.
  useEffect(() => {
    if (!cloud || loadedAccountRef.current !== accountId) return undefined
    let cancelled = false
    saveAgileProgress(accountId, { matchingStats, examResults })
      .then((ok) => {
        if (!cancelled) setCloudError(!ok)
      })
      .catch(() => {
        if (!cancelled) setCloudError(true)
      })
    return () => {
      cancelled = true
    }
  }, [cloud, accountId, loaded, matchingStats, examResults])

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
    }),
    [
      cloud,
      syncStatus,
      matchingStats,
      examResults,
      recordExam,
      resetMatchingStats,
      attempts,
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
    document.title = 'AgilePM v3 Foundation — Study'
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
            AgilePM <span>v3 Foundation</span>
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
            <TabButton active={mode === 'exams'} onClick={() => setMode('exams')}>
              Mock Exams
            </TabButton>
            <TabButton active={mode === 'zen'} onClick={() => setMode('zen')}>
              Zen Mode
            </TabButton>
          </nav>
          <SyncBadge />
        </div>
      </header>

      <main className="agile-main">
        {mode === 'home' && <HomeView onPick={setMode} />}
        {mode === 'flashcards' && <FlashcardsView />}
        {mode === 'matching' && <MatchingView />}
        {mode === 'exams' && <ExamsView />}
        {mode === 'zen' && <ZenView />}
      </main>

      <footer className="agile-footer">
        Private study area · {FLASHCARDS.length} flashcards ·{' '}
        {MATCHING_PAIRS.length} matching pairs · {ZEN_POOL_SIZE}-question Zen pool
        · Good luck on the exam.
      </footer>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`agile-tab${active ? ' agile-tab--active' : ''}`}
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
      <h1 className="agile-home__title">AgilePM v3 Foundation Revision</h1>
      <p className="agile-home__lede">
        A private study toolkit built from your notes. Pick a mode to get
        started.
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
          onClick={() => onPick('exams')}
        >
          <span className="agile-card__emoji" aria-hidden>
            📝
          </span>
          <h2>Mock Exams</h2>
          <p>
            2 fixed exam-realistic papers plus 4 randomised practice papers: 50
            questions, 40 minutes, 60% to pass.
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
      </div>
      <div className="agile-examfacts">
        <h3>Real exam format</h3>
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

  const { recordExam } = useAgileProgress()

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
  }

  const next = () => {
    setSelected(null)
    setRevealed(false)
    setIdx((i) => {
      const n = i + 1
      if (n >= queue.length) {
        // Exhausted the pool — reshuffle for an endless stream.
        setQueue(shuffle(ZEN_POOL))
        return 0
      }
      return n
    })
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
  }

  if (ended) {
    return <ZenReview history={history} onRestart={restart} />
  }

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
        <button
          type="button"
          className="agile-btn agile-btn--success"
          onClick={endSession}
        >
          End session
        </button>
      </div>

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
            Pick an answer to see instant feedback. Keep going as long as you
            like, then press <strong>End session</strong> for your per-topic
            breakdown.
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

function ExamsView() {
  // active = { key, title, build } describing the paper to run.
  const [active, setActive] = useState(null)
  const { examResults: results, recordExam, cloud, attempts } =
    useAgileProgress()

  const onFinish = (examKey, title, result) => {
    recordExam(examKey, title, result)
  }

  if (active) {
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

  const renderCard = (key, title, build) => {
    const r = results[key]
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
        <button
          type="button"
          className="agile-btn agile-btn--primary"
          onClick={() => setActive({ key, title, build })}
        >
          {r ? 'Retake' : 'Start'}
        </button>
      </div>
    )
  }

  return (
    <div className="agile-exams">
      <h1 className="agile-exams__title">Mock Exams</h1>
      <p className="agile-exams__lede">
        Every paper follows the real exam format:{' '}
        {EXAM_CONFIG.questionCount} questions, a{' '}
        {EXAM_CONFIG.durationMinutes}-minute timer, and a pass mark of{' '}
        {EXAM_CONFIG.passMark}/{EXAM_CONFIG.questionCount} (
        {EXAM_CONFIG.passPercent}%). Closed book.
      </p>

      <h2 className="agile-exams__section">
        Full mock exams &mdash; real exam style
      </h2>
      <p className="agile-exams__note">
        Four hard, full-length papers modelled exactly on a real AgilePM v3
        paper: direct questions, &ldquo;identify the missing word(s)&rdquo;,
        numbered-statement combinations (1, 2, 3 &hellip;) and two-statement
        true/false items. Correct answers are scattered with no pattern. After
        submitting you&rsquo;ll get a full strengths &amp; weaknesses breakdown
        by topic.
      </p>
      <div className="agile-exams__grid">
        {HARD_EXAMS.map((paper) =>
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
        {TOPIC_EXAMS.map((paper) => (
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
          </div>
        ))}
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
    onFinish(examKey, title, result)
  }, [examKey, title, onFinish, result])

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
          <span>Answered: {answeredCount}/{exam.length}</span>
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
            const selected = answers[q.id] === opt
            return (
              <button
                key={opt}
                type="button"
                className={`agile-option${selected ? ' is-selected' : ''}`}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                }
              >
                <span className="agile-option__radio" aria-hidden />
                <span>{opt}</span>
              </button>
            )
          })}
        </div>
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
              answers[qq.id] ? 'is-answered' : '',
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

function ExamReview({ exam, answers, result, onExit }) {
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
            Back to exams
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
