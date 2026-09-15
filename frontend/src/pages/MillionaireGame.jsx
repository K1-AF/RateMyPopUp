import { useEffect, useMemo, useState } from 'react'
import { TOPICS } from '../data/agileContent.js'
import {
  MILLIONAIRE_COUNT,
  buildMillionairePaper,
} from '../data/agileMillionaire.js'

// Who Wants to Be a Millionaire-style Foundation game. Twenty Foundation
// syllabus questions (never Practitioner, never fetched over the network)
// climb from £1,000 to £1,000,000. Lifeline state lives only in React memory.

// Prize for each correct answer, in order. Question 1 is worth £1,000;
// question 20 is the million.
const MILLIONAIRE_LADDER = [
  1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 75000, 100000, 125000,
  175000, 250000, 350000, 500000, 600000, 700000, 800000, 900000, 1000000,
]

const LETTERS = ['A', 'B', 'C', 'D']

const WELCOME =
  "Welcome Baby Noob, do you have what it takes to be a millionaire? Let's find out"

const LOST_LINE =
  'Andddddd that is the wrong answer! NOOB! Better be just seeing what happens when you get a question wrong yh'

const WON_HEADLINE = 'WELL DONE NOOOOOOOOOB!!!'
const WON_CHANT = 'Noobs gonna pass Noobs gonna pass'

// Colours are a fixed palette (never from user input) so confetti styles stay safe.
const CONFETTI_COLORS = [
  '#f4d03f',
  '#ff6b6b',
  '#4ecdc4',
  '#ffe66d',
  '#ff9f1c',
  '#ffffff',
  '#2ecc8f',
  '#c77dff',
]

function ConfettiRain() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => {
        // Deterministic per-piece layout so render stays pure.
        let t = (i + 1) * 0x6d2b79f5
        const rand = () => {
          t += 0x6d2b79f5
          let x = Math.imul(t ^ (t >>> 15), 1 | t)
          x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
          return ((x ^ (x >>> 14)) >>> 0) / 4294967296
        }
        return {
          id: i,
          left: Math.round(rand() * 1000) / 10,
          delay: Math.round(rand() * 120) / 100,
          duration: 1.8 + Math.round(rand() * 220) / 100,
          drift: Math.round((rand() * 120 - 60) * 10) / 10,
          w: 10 + Math.round(rand() * 10),
          h: 12 + Math.round(rand() * 14),
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        }
      }),
    [],
  )

  return (
    <div className="agile-milli__confetti" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="agile-milli__confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.w}px`,
            height: `${p.h}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

function formatPounds(amount) {
  return `£${amount.toLocaleString('en-GB')}`
}

function shuffle(input) {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function visibleWrongs(options, correct, eliminated) {
  return options.filter((opt) => opt !== correct && !eliminated.has(opt))
}

function MillionaireGame() {
  const [questions, setQuestions] = useState(() => buildMillionairePaper())
  const [phase, setPhase] = useState('intro')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [eliminated, setEliminated] = useState(() => new Set())
  const [usedLifelines, setUsedLifelines] = useState({
    fifty: false,
    phone: false,
    audience: false,
  })
  const [audience, setAudience] = useState(null)
  const [phoneNote, setPhoneNote] = useState('')
  const [walkConfirm, setWalkConfirm] = useState(false)
  const [ending, setEnding] = useState(null)

  const question = questions[index]
  const prize = MILLIONAIRE_LADDER[index] ?? 0
  const banked = index === 0 ? 0 : MILLIONAIRE_LADDER[index - 1]
  const playing = phase === 'play' && question && !ending

  // After the welcome line, the studio takes over so the tab click feels
  // like it "turns into" the game. The button still lets her skip the pause.
  useEffect(() => {
    if (phase !== 'intro') return undefined
    const timer = window.setTimeout(() => setPhase('play'), 3200)
    return () => window.clearTimeout(timer)
  }, [phase])

  const restart = () => {
    setQuestions(buildMillionairePaper())
    setPhase('intro')
    setIndex(0)
    setSelected(null)
    setConfirming(false)
    setRevealed(false)
    setEliminated(new Set())
    setUsedLifelines({ fifty: false, phone: false, audience: false })
    setAudience(null)
    setPhoneNote('')
    setWalkConfirm(false)
    setEnding(null)
  }

  const clearTurnExtras = () => {
    setSelected(null)
    setConfirming(false)
    setRevealed(false)
    setEliminated(new Set())
    setAudience(null)
    setPhoneNote('')
    setWalkConfirm(false)
  }

  const lockLifeline = (key) => {
    setUsedLifelines((prev) => ({ ...prev, [key]: true }))
  }

  const useFifty = () => {
    if (!playing || revealed || usedLifelines.fifty) return
    const drop = shuffle(
      visibleWrongs(question.options, question.correct, eliminated),
    ).slice(0, 2)
    if (drop.length < 2) return
    setEliminated((prev) => new Set([...prev, ...drop]))
    if (drop.includes(selected)) {
      setSelected(null)
      setConfirming(false)
    }
    lockLifeline('fifty')
  }

  const usePhone = () => {
    if (!playing || revealed || usedLifelines.phone) return
    const drop = visibleWrongs(question.options, question.correct, eliminated)
    if (drop.length === 0) return
    const wrong = shuffle(drop)[0]
    const letter = LETTERS[question.options.indexOf(wrong)] || '?'
    setEliminated((prev) => new Set([...prev, wrong]))
    if (selected === wrong) {
      setSelected(null)
      setConfirming(false)
    }
    setPhoneNote(
      `Your friend would throw out ${letter} — they are sure that one is wrong.`,
    )
    lockLifeline('phone')
  }

  const useAudience = () => {
    if (!playing || revealed || usedLifelines.audience) return
    const remaining = question.options.filter((opt) => !eliminated.has(opt))
    // Earlier questions get a more confident crowd; later ones split the vote.
    // Percentages are generated locally (never from user input) and clamped
    // before they touch inline styles.
    const confidence = Math.max(0.38, 0.86 - index * 0.024)
    const votes = remaining.map((opt) => ({ opt, pct: 0 }))
    if (remaining.length === 1) {
      votes[0].pct = 100
    } else {
      const correctShare = Math.round(confidence * 100)
      let rest = 100 - correctShare
      const correctRow = votes.find((row) => row.opt === question.correct)
      if (correctRow) correctRow.pct = correctShare
      const others = votes.filter((row) => row.opt !== question.correct)
      others.forEach((row, i) => {
        if (i === others.length - 1) {
          row.pct = Math.max(0, rest)
          return
        }
        const slice = Math.floor(Math.random() * (rest + 1))
        row.pct = slice
        rest -= slice
      })
    }
    setAudience({
      votes,
      hint:
        question.explain ||
        `The crowd is muttering about ${TOPICS[question.topic] || 'this topic'}.`,
    })
    lockLifeline('audience')
  }

  const choose = (opt) => {
    if (!playing || revealed || eliminated.has(opt)) return
    setSelected(opt)
    setConfirming(false)
  }

  const confirmFinal = () => {
    if (!playing || !selected || revealed) return
    setConfirming(true)
  }

  const cancelFinal = () => setConfirming(false)

  const lockFinal = () => {
    if (!playing || !selected || revealed) return
    const right = selected === question.correct
    setRevealed(true)
    setConfirming(false)
    if (right && index === questions.length - 1) {
      setEnding({ kind: 'won', takeHome: MILLIONAIRE_LADDER[index] })
      setPhase('over')
      return
    }
    if (!right) {
      setEnding({ kind: 'lost', takeHome: 0 })
    }
  }

  const nextQuestion = () => {
    if (ending) {
      setPhase('over')
      return
    }
    clearTurnExtras()
    setIndex((i) => i + 1)
  }

  const walkAway = () => {
    if (!playing || revealed || banked <= 0) return
    setEnding({ kind: 'walked', takeHome: banked })
    setPhase('over')
  }

  if (phase === 'intro') {
    return (
      <div className="agile-milli agile-milli--intro">
        <p className="agile-milli__kicker">Suprise</p>
        <h1 className="agile-milli__welcome">{WELCOME}</h1>
        <p className="agile-milli__intro-lede">
          20 Foundation questions. Three lifelines. Climb from{' '}
          {formatPounds(MILLIONAIRE_LADDER[0])} to{' '}
          {formatPounds(MILLIONAIRE_LADDER[MILLIONAIRE_COUNT - 1])}. A wrong
          answer ends the run — walk away to bank what you have already won.
        </p>
        <button
          type="button"
          className="agile-btn agile-milli__start"
          onClick={() => setPhase('play')}
        >
          Let&apos;s find out
        </button>
      </div>
    )
  }

  if (phase === 'over' && ending) {
    return (
      <div
        className={`agile-milli agile-milli--over${
          ending.kind === 'won' ? ' agile-milli--won' : ''
        }`}
      >
        {ending.kind === 'won' && <ConfettiRain />}
        <p className="agile-milli__kicker">
          {ending.kind === 'won' ? 'Millionaire' : 'Game over'}
        </p>
        {ending.kind === 'won' ? (
          <>
            <h1 className="agile-milli__welcome agile-milli__welcome--won">
              {WON_HEADLINE}
            </h1>
            <p className="agile-milli__chant">{WON_CHANT}</p>
          </>
        ) : (
          <h1
            className={`agile-milli__welcome${
              ending.kind === 'lost' ? ' agile-milli__welcome--lost' : ''
            }`}
          >
            {ending.kind === 'lost'
              ? LOST_LINE
              : 'Smart walk. You banked the money.'}
          </h1>
        )}
        <p className="agile-milli__takehome" aria-live="polite">
          You leave with <strong>{formatPounds(ending.takeHome)}</strong>
        </p>
        {ending.kind === 'lost' && question && (
          <p className="agile-milli__reveal">
            The right answer was{' '}
            <strong>
              {LETTERS[question.options.indexOf(question.correct)]}.{' '}
              {question.correct}
            </strong>
          </p>
        )}
        <button
          type="button"
          className="agile-btn agile-milli__start"
          onClick={restart}
        >
          Play again
        </button>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="agile-milli">
        <p>Could not build a paper. Try again.</p>
        <button type="button" className="agile-btn" onClick={restart}>
          Reset
        </button>
      </div>
    )
  }

  const canFifty =
    !usedLifelines.fifty &&
    visibleWrongs(question.options, question.correct, eliminated).length >= 2
  const canPhone =
    !usedLifelines.phone &&
    visibleWrongs(question.options, question.correct, eliminated).length >= 1

  return (
    <div className="agile-milli">
      <div className="agile-milli__toolbar">
        <div className="agile-milli__lifelines" role="group" aria-label="Lifelines">
          <button
            type="button"
            className={`agile-milli__life${usedLifelines.fifty ? ' is-used' : ''}`}
            onClick={useFifty}
            disabled={!playing || revealed || !canFifty}
            title="Remove two wrong answers"
          >
            50:50
          </button>
          <button
            type="button"
            className={`agile-milli__life${usedLifelines.phone ? ' is-used' : ''}`}
            onClick={usePhone}
            disabled={!playing || revealed || !canPhone}
            title="Phone a friend — remove one wrong answer"
          >
            Phone a friend
          </button>
          <button
            type="button"
            className={`agile-milli__life${usedLifelines.audience ? ' is-used' : ''}`}
            onClick={useAudience}
            disabled={!playing || revealed || usedLifelines.audience}
            title="Ask the audience for a hint"
          >
            Ask the audience
          </button>
        </div>
        <div className="agile-milli__bank">
          <span>Banked {formatPounds(banked)}</span>
          <button
            type="button"
            className="agile-btn agile-btn--ghost"
            onClick={() => setWalkConfirm(true)}
            disabled={!playing || revealed || banked <= 0}
          >
            Walk away
          </button>
        </div>
      </div>

      <div className="agile-milli__stage">
        <div className="agile-milli__studio">
          <p className="agile-milli__for">
            Question {index + 1} of {MILLIONAIRE_COUNT} · for{' '}
            <strong>{formatPounds(prize)}</strong>
          </p>
          <span className="agile-milli__topic">
            {TOPICS[question.topic] || question.topic}
          </span>
          <h2 className="agile-milli__q">{question.q}</h2>

          <div className="agile-milli__answers">
            {question.options.map((opt, i) => {
              const gone = eliminated.has(opt)
              const isChosen = selected === opt
              const isAnswer = revealed && opt === question.correct
              const isMiss = revealed && isChosen && opt !== question.correct
              const cls = [
                'agile-milli__answer',
                gone ? 'is-gone' : '',
                isChosen && !revealed ? 'is-selected' : '',
                isAnswer ? 'is-correct' : '',
                isMiss ? 'is-wrong' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={`${question.id}-${i}`}
                  type="button"
                  className={cls}
                  onClick={() => choose(opt)}
                  disabled={revealed || gone}
                >
                  <span className="agile-milli__letter">{LETTERS[i]}:</span>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>

          {phoneNote && (
            <p className="agile-milli__note" role="status">
              {phoneNote}
            </p>
          )}

          {audience && (
            <div className="agile-milli__audience" role="status">
              <p className="agile-milli__audience-hint">
                <strong>Audience hint:</strong> {audience.hint}
              </p>
              <div className="agile-milli__bars">
                {audience.votes.map((row) => {
                  const letter =
                    LETTERS[question.options.indexOf(row.opt)] || '?'
                  return (
                    <div key={row.opt} className="agile-milli__bar">
                      <span>
                        {letter} {row.pct}%
                      </span>
                      <div className="agile-milli__bar-track">
                        <div
                          className="agile-milli__bar-fill"
                          style={{
                            width: `${Math.max(0, Math.min(100, Number(row.pct) || 0))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="agile-milli__actions">
            {!revealed && !confirming && (
              <button
                type="button"
                className="agile-btn agile-milli__start"
                onClick={confirmFinal}
                disabled={!selected}
              >
                Final answer
              </button>
            )}
            {confirming && !revealed && (
              <div className="agile-milli__confirm">
                <p>
                  Is that your final answer?{' '}
                  <strong>
                    {LETTERS[question.options.indexOf(selected)]}. {selected}
                  </strong>
                </p>
                <div className="agile-milli__confirm-btns">
                  <button
                    type="button"
                    className="agile-btn agile-milli__start"
                    onClick={lockFinal}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="agile-btn agile-btn--ghost"
                    onClick={cancelFinal}
                  >
                    No, wait
                  </button>
                </div>
              </div>
            )}
            {revealed && selected === question.correct && (
              <div className="agile-milli__win-step">
                <p aria-live="polite">
                  Correct — you have {formatPounds(prize)}!
                </p>
                <button
                  type="button"
                  className="agile-btn agile-milli__start"
                  onClick={
                    ending ? () => setPhase('over') : nextQuestion
                  }
                >
                  {ending ? 'Collect £1,000,000 ›' : 'Next question ›'}
                </button>
              </div>
            )}
            {ending?.kind === 'lost' && (
              <button
                type="button"
                className="agile-btn agile-milli__start"
                onClick={() => setPhase('over')}
              >
                See result ›
              </button>
            )}
          </div>
        </div>

        <ol className="agile-milli__ladder" aria-label="Prize ladder">
          {MILLIONAIRE_LADDER.map((value, step) => ({ value, step }))
            .reverse()
            .map(({ value, step }) => {
              const cls = [
                'agile-milli__rung',
                step === index ? 'is-current' : '',
                step < index ? 'is-won' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <li key={value} className={cls}>
                  <span>{step + 1}</span>
                  <strong>{formatPounds(value)}</strong>
                </li>
              )
            })}
        </ol>
      </div>

      {walkConfirm && (
        <div className="agile-milli__modal" role="dialog" aria-modal="true">
          <div className="agile-milli__modal-card">
            <p>
              Walk away with <strong>{formatPounds(banked)}</strong>?
            </p>
            <div className="agile-milli__confirm-btns">
              <button
                type="button"
                className="agile-btn agile-milli__start"
                onClick={walkAway}
              >
                Walk away
              </button>
              <button
                type="button"
                className="agile-btn agile-btn--ghost"
                onClick={() => setWalkConfirm(false)}
              >
                Keep playing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MillionaireGame
