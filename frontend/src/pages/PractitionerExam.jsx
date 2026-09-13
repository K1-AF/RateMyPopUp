import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AR_OPTIONS,
  PRACTITIONER_CONFIG,
  PRACTITIONER_LABELS,
  PRACTITIONER_TOPICS,
  flattenPractitioner,
  practitionerCorrectLabel,
  practitionerParts,
  practitionerStem,
  scorePractitionerLine,
  scorePractitionerPaper,
} from '../data/agilePractitioner.js'

// Official-style Practitioner sitting: scenario booklet, part instructions,
// option grid, 150-minute clock. Answers stay hidden until the paper is
// finished — the live exam does not mark line-by-line.

function letterOf(option) {
  const m = String(option).match(/^([A-F])\b/)
  return m ? m[1] : option
}

export function PractitionerRunner({ paper, examKey, title, onExit, onFinish }) {
  const parts = useMemo(() => practitionerParts(paper), [paper])
  const lines = useMemo(() => flattenPractitioner(paper), [paper])
  const [partIdx, setPartIdx] = useState(0)
  const [itemIdx, setItemIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [tab, setTab] = useState('question')
  const [submitted, setSubmitted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(
    PRACTITIONER_CONFIG.durationMinutes * 60,
  )
  const finishedRef = useRef(false)

  const bundle = parts[partIdx]
  const item = bundle.items[Math.min(itemIdx, bundle.items.length - 1)]
  const result = useMemo(
    () => scorePractitionerPaper(paper, answers),
    [paper, answers],
  )

  const handleSubmit = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    setSubmitted(true)
    onFinish(examKey, title, result, { kind: 'practitioner', paper }, answers)
  }, [examKey, title, onFinish, result, paper, answers])

  useEffect(() => {
    if (submitted) return undefined
    const t = window.setTimeout(() => {
      if (secondsLeft <= 1) handleSubmit()
      else setSecondsLeft((s) => s - 1)
    }, 1000)
    return () => window.clearTimeout(t)
  }, [secondsLeft, submitted, handleSubmit])

  const go = (nextPart, nextItem) => {
    setPartIdx(nextPart)
    setItemIdx(nextItem)
    setTab('question')
  }

  const next = () => {
    if (itemIdx < bundle.items.length - 1) {
      setItemIdx((i) => i + 1)
      return
    }
    if (partIdx < parts.length - 1) go(partIdx + 1, 0)
  }

  const prev = () => {
    if (itemIdx > 0) {
      setItemIdx((i) => i - 1)
      return
    }
    if (partIdx > 0) {
      const prevPart = parts[partIdx - 1]
      go(partIdx - 1, prevPart.items.length - 1)
    }
  }

  const setClassic = (opt) => {
    setAnswers((prev) => ({ ...prev, [item.id]: opt }))
  }

  const setLetter = (key) => {
    setAnswers((prev) => ({ ...prev, [item.id]: key }))
  }

  const toggleMr = (opt) => {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[item.id]) ? [...prev[item.id]] : []
      const i = cur.indexOf(opt)
      if (i >= 0) cur.splice(i, 1)
      else if (cur.length < 2) cur.push(opt)
      return { ...prev, [item.id]: cur }
    })
  }

  const answeredCount = lines.filter((ln) => {
    const a = answers[ln.id]
    if (ln.type === 'mr') return Array.isArray(a) && a.length === 2
    return a != null && a !== ''
  }).length

  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, '0')
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const lowTime = secondsLeft <= 5 * 60

  if (submitted) {
    return (
      <PractitionerReview
        paper={paper}
        answers={answers}
        result={result}
        onExit={onExit}
      />
    )
  }

  const extra = bundle.part.extra
  const q = bundle.question

  return (
    <div className="agile-pr">
      <div className="agile-pr__bar">
        <button type="button" className="agile-btn agile-btn--ghost" onClick={onExit}>
          ‹ Exit
        </button>
        <div className="agile-pr__meta">
          <strong>{title}</strong>
          <span>
            {answeredCount}/{PRACTITIONER_CONFIG.questionCount} answered · open
            book
          </span>
        </div>
        <div
          className={`agile-timer${lowTime ? ' agile-timer--low' : ''}`}
          role="timer"
        >
          ⏱ {hh}:{mm}:{ss}
        </div>
      </div>

      <nav className="agile-pr__chart" aria-label="Question progress">
        {paper.questions.map((question, qi) => (
          <div key={question.id} className="agile-pr__qblock">
            <span className="agile-pr__qcode">
              Q{qi + 1}: {PRACTITIONER_LABELS[question.code] || question.code}
            </span>
            <div className="agile-pr__parts">
              {question.parts.map((part, pi) => {
                const idx = paper.questions
                  .slice(0, qi)
                  .reduce((n, qq) => n + qq.parts.length, 0) + pi
                const filled = part.items.filter((it) => {
                  const a = answers[it.id]
                  if (part.type === 'mr') return Array.isArray(a) && a.length === 2
                  return a != null && a !== ''
                }).length
                const all = filled === part.items.length
                const some = filled > 0 && !all
                return (
                  <button
                    key={part.id}
                    type="button"
                    className={[
                      'agile-pr__pill',
                      idx === partIdx ? 'is-current' : '',
                      all ? 'is-done' : '',
                      some ? 'is-partial' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => go(idx, 0)}
                  >
                    {part.id}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="agile-pr__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'question'}
          className={`agile-pr__tab${tab === 'question' ? ' is-active' : ''}`}
          onClick={() => setTab('question')}
        >
          Current question
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'scenario'}
          className={`agile-pr__tab${tab === 'scenario' ? ' is-active' : ''}`}
          onClick={() => setTab('scenario')}
        >
          Scenario
        </button>
        {extra ? (
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'extra'}
            className={`agile-pr__tab${tab === 'extra' ? ' is-active' : ''}`}
            onClick={() => setTab('extra')}
          >
            Additional information
          </button>
        ) : null}
      </div>

      {tab === 'scenario' ? (
        <ScenarioPanel scenario={paper.scenario} />
      ) : tab === 'extra' && extra ? (
        <article className="agile-pr__booklet">
          <h2>{extra.title || 'Additional information'}</h2>
          {extra.body.split('\n\n').map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </article>
      ) : (
        <section className="agile-pr__q">
          <header className="agile-pr__qhead">
            <span className="agile-question__topic">
              {PRACTITIONER_TOPICS[q.code]} · Part {bundle.part.id} —{' '}
              {itemIdx + 1} of {bundle.items.length}
            </span>
            <p className="agile-pr__instruction">{bundle.part.instruction}</p>
            {extra ? (
              <p className="agile-pr__extra-hint">
                Using the additional information provided for this part.
              </p>
            ) : null}
          </header>
          <ItemPrompt
            item={item}
            part={bundle.part}
            answer={answers[item.id]}
            onClassic={setClassic}
            onMr={toggleMr}
            onLetter={setLetter}
          />
          <OptionGrid
            part={bundle.part}
            items={bundle.items}
            answers={answers}
            activeId={item.id}
            onPick={(it, value) => {
              if (bundle.part.type === 'mr') {
                setAnswers((prev) => {
                  const cur = Array.isArray(prev[it.id]) ? [...prev[it.id]] : []
                  const i = cur.indexOf(value)
                  if (i >= 0) cur.splice(i, 1)
                  else if (cur.length < 2) cur.push(value)
                  return { ...prev, [it.id]: cur }
                })
              } else {
                setAnswers((prev) => ({ ...prev, [it.id]: value }))
              }
              const idx = bundle.items.findIndex((x) => x.id === it.id)
              if (idx >= 0) setItemIdx(idx)
            }}
          />
        </section>
      )}

      <div className="agile-runner__nav">
        <button
          type="button"
          className="agile-btn"
          disabled={partIdx === 0 && itemIdx === 0}
          onClick={prev}
        >
          ‹ Prev
        </button>
        {partIdx === parts.length - 1 && itemIdx === bundle.items.length - 1 ? (
          <button
            type="button"
            className="agile-btn agile-btn--success"
            onClick={handleSubmit}
          >
            Finish the exam
          </button>
        ) : (
          <button type="button" className="agile-btn agile-btn--primary" onClick={next}>
            Next ›
          </button>
        )}
      </div>
    </div>
  )
}

function ItemPrompt({ item, part, answer, onClassic, onMr, onLetter }) {
  if (part.type === 'ar') {
    return (
      <div className="agile-pr__stem">
        <p>
          <strong>Assertion</strong> {item.assertion}
        </p>
        <p className="agile-pr__because">BECAUSE</p>
        <p>
          <strong>Reason</strong> {item.reason}
        </p>
        <ol className="agile-pr__ar-key">
          {AR_OPTIONS.map((opt) => (
            <li key={opt.key}>
              <button
                type="button"
                className={`agile-option${answer === opt.key ? ' is-selected' : ''}`}
                onClick={() => onLetter(opt.key)}
              >
                <span className="agile-option__radio" aria-hidden />
                <span>
                  {opt.key}. {opt.text}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  if (part.type === 'matching') {
    return (
      <div className="agile-pr__stem">
        <p>
          <strong>Column 1</strong> {item.q}
        </p>
        <p className="agile-pr__col2-label">Column 2 — each option may be used once, more than once, or not at all</p>
        <ol className="agile-pr__ar-key">
          {part.column2.map((opt) => (
            <li key={opt.key}>
              <button
                type="button"
                className={`agile-option${answer === opt.key ? ' is-selected' : ''}`}
                onClick={() => onLetter(opt.key)}
              >
                <span className="agile-option__radio" aria-hidden />
                <span>
                  {opt.key}. {opt.text}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  const multi = part.type === 'mr'
  const picked = multi ? (Array.isArray(answer) ? answer : []) : answer
  return (
    <div className="agile-pr__stem">
      <h2 className="agile-question__text">{item.q}</h2>
      <div className="agile-options">
        {item.options.map((opt) => {
          const on = multi ? picked.includes(opt) : picked === opt
          return (
            <button
              key={opt}
              type="button"
              className={`agile-option${on ? ' is-selected' : ''}`}
              onClick={() => (multi ? onMr(opt) : onClassic(opt))}
            >
              <span className="agile-option__radio" aria-hidden />
              <span>{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function OptionGrid({ part, items, answers, activeId, onPick }) {
  const cols =
    part.type === 'mr'
      ? ['A', 'B', 'C', 'D', 'E']
      : part.type === 'classic'
        ? ['A', 'B', 'C', 'D']
        : (part.column2 || AR_OPTIONS).map((o) => o.key)

  const valueFor = (item, col) => {
    if (part.type === 'classic' || part.type === 'mr') {
      return item.options.find((opt) => letterOf(opt) === col)
    }
    return col
  }

  const selected = (item, col) => {
    const a = answers[item.id]
    if (part.type === 'mr') {
      const opt = valueFor(item, col)
      return Array.isArray(a) && a.includes(opt)
    }
    if (part.type === 'classic') return a === valueFor(item, col)
    return a === col
  }

  return (
    <div className="agile-pr__grid-wrap">
      <p className="agile-pr__grid-hint">
        Option grid — click an oval on the active row. You can change answers
        until time expires.
      </p>
      <table className="agile-pr__grid">
        <thead>
          <tr>
            <th> </th>
            {cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it.id} className={it.id === activeId ? 'is-active' : ''}>
              <th>{i + 1}.</th>
              {cols.map((c) => {
                const val = valueFor(it, c)
                if (!val) return <td key={c} />
                return (
                  <td key={c}>
                    <button
                      type="button"
                      className={`agile-pr__oval${selected(it, c) ? ' is-on' : ''}`}
                      aria-label={`Row ${i + 1} option ${c}`}
                      onClick={() => onPick(it, val)}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ScenarioPanel({ scenario }) {
  return (
    <article className="agile-pr__booklet">
      <h2>{scenario.title}</h2>
      {scenario.sections.map((s) => (
        <section key={s.heading}>
          <h3>{s.heading}</h3>
          {s.body.split('\n\n').map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  )
}

export function PractitionerReview({ paper, answers, result, onExit, exitLabel }) {
  const lines = flattenPractitioner(paper)
  return (
    <div className="agile-review">
      <div className={`agile-result ${result.passed ? 'is-pass' : 'is-fail'}`}>
        <div className="agile-result__score">{result.percent}%</div>
        <div className="agile-result__detail">
          <strong>{result.passed ? 'PASS' : 'NOT YET'}</strong>
          <span>
            {result.score}/{result.total} · need {result.passMark}/
            {result.total} · 150 minutes · open book
          </span>
        </div>
        <div className="agile-result__actions">
          <button type="button" className="agile-btn" onClick={onExit}>
            {exitLabel || 'Back to papers'}
          </button>
        </div>
      </div>
      <ol className="agile-review__list">
        {lines.map((item, i) => {
          const a = answers[item.id]
          const ok = scorePractitionerLine(item, a)
          return (
            <li
              key={item.id}
              className={`agile-review__item ${ok ? 'is-right' : 'is-wrong'}`}
            >
              <span className="agile-review__topic">
                {i + 1}. {PRACTITIONER_TOPICS[item.topic]} · {item.questionId}
                {item.partId}
              </span>
              <p className="agile-review__q">{practitionerStem(item)}</p>
              <p className="agile-review__explain">
                Your answer: {formatAnswer(item, a) || '—'}
                {' · '}
                Correct: {practitionerCorrectLabel(item)}
              </p>
              {item.explain ? (
                <p className="agile-review__explain">{item.explain}</p>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function formatAnswer(item, answer) {
  if (answer == null) return ''
  if (item.type === 'mr' && Array.isArray(answer)) return answer.join(' + ')
  return String(answer)
}

export function isPractitionerSnapshot(exam) {
  return Boolean(exam && exam.kind === 'practitioner' && exam.paper)
}
