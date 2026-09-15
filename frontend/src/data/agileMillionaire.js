// Foundation-only question pool for the hidden /agile "Suprise" game.
//
// Source of truth: AgilePM v3 Foundation syllabus (closed book, 50 questions,
// 40 minutes, 30/50). Cards come only from the Foundation study banks
// (QUESTION_BANK + ZEN_QUESTIONS) which are aligned with the flashcards.
// Practitioner papers and Foundation exam-trick formats (numbered
// combinations, missing-word, two-statement true/false) are never included.
// All data is bundled statically — nothing is fetched at runtime.

import { QUESTION_BANK, TOPICS } from './agileContent.js'
import { ZEN_QUESTIONS } from './agileZenQuestions.js'

export const MILLIONAIRE_COUNT = 20

const FOUNDATION_TOPICS = new Set(Object.keys(TOPICS))
const EASY_TOPICS = new Set(['KC', 'SC', 'AF'])
const MEDIUM_TOPICS = new Set(['IN', 'CC', 'PR', 'ES'])
const HARD_TOPICS = new Set(['PC', 'RK', 'GV'])

function fingerprint(question) {
  return String(question)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
}

function shuffle(input) {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function isComboOrStatementOption(text) {
  const t = String(text).trim()
  return (
    /^\d(,\s*\d)+$/.test(t) ||
    /^Only \d is true$/i.test(t) ||
    /^Both 1 and 2 are true$/i.test(t) ||
    /^Neither 1 (nor|or) 2 is true$/i.test(t) ||
    /of the above/i.test(t)
  )
}

// High-confidence Foundation facts. If a stem is clearly asking one of these,
// the marked answer must match the syllabus — otherwise the item is dropped.
function specFactsOk(q) {
  const stem = q.q
  const c = q.correct
  if (
    /what does vuca stand for/i.test(stem) &&
    !(
      /volatility/i.test(c) &&
      /uncertainty/i.test(c) &&
      /complexity/i.test(c) &&
      /ambiguity/i.test(c)
    )
  ) {
    return false
  }
  if (
    /who (sets|is accountable for setting) the definition of done/i.test(stem) &&
    !/solution architect/i.test(c)
  ) {
    return false
  }
  if (
    /how many principles of agile leadership/i.test(stem) &&
    !/^(9|nine)$/i.test(c.trim())
  ) {
    return false
  }
  if (/daily scrum timebox/i.test(stem) && !/15/.test(c)) return false
  if (/when and where was the agile manifesto/i.test(stem) && !/2001/.test(c)) {
    return false
  }
  if (
    /maximum (recommended )?(size of a )?scrum team/i.test(stem) &&
    !/10/.test(c)
  ) {
    return false
  }
  if (/who can cancel a sprint/i.test(stem) && !/product owner/i.test(c)) {
    return false
  }
  if (
    /most (effective|efficient) (form of )?communication/i.test(stem) &&
    !/face/i.test(c)
  ) {
    return false
  }
  if (
    /which three project variables are normally FIXED/i.test(stem) &&
    !(/time/i.test(c) && /cost/i.test(c) && /quality/i.test(c))
  ) {
    return false
  }
  return true
}

// Classic Foundation A–D only: four unique options, marked answer present,
// syllabus topic from the Foundation map, no Practitioner / combo formats.
export function isFoundationClassicMcq(q) {
  if (!q || typeof q.q !== 'string' || typeof q.correct !== 'string') return false
  if (!FOUNDATION_TOPICS.has(q.topic)) return false
  if (!Array.isArray(q.options) || q.options.length !== 4) return false
  const options = q.options.map((o) => String(o).trim())
  const correct = q.correct.trim()
  if (new Set(options).size !== 4) return false
  if (!options.includes(correct)) return false
  if (!String(q.explain || '').trim()) return false
  if (options.some(isComboOrStatementOption)) return false
  if (/missing word/i.test(q.q) || /\[\s*\?\s*\]/.test(q.q)) return false
  if (/consider (the|these) statements/i.test(q.q)) return false
  if (/\n\s*1\./.test(q.q) && /\n\s*2\./.test(q.q)) return false
  if (/^pract/i.test(String(q.id)) || /P\dQ\d+[A-D]\d/.test(String(q.id))) {
    return false
  }
  return specFactsOk(q)
}

function toCard(q) {
  const options = shuffle(q.options.map((o) => String(o).trim()))
  return {
    id: q.id,
    topic: q.topic,
    q: q.q.trim(),
    explain: String(q.explain).trim(),
    correct: q.correct.trim(),
    options,
  }
}

function uniqueClassic(list) {
  const seen = new Set()
  const out = []
  for (const q of list) {
    if (!isFoundationClassicMcq(q)) continue
    const key = fingerprint(q.q)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(q)
  }
  return out
}

function take(pool, count, usedKeys) {
  const picked = []
  for (const q of shuffle(pool)) {
    if (picked.length >= count) break
    const key = fingerprint(q.q)
    if (usedKeys.has(key)) continue
    usedKeys.add(key)
    picked.push(toCard(q))
  }
  return picked
}

const FOUNDATION_POOL = uniqueClassic([...QUESTION_BANK, ...ZEN_QUESTIONS])
const EASY_POOL = FOUNDATION_POOL.filter(
  (q) => EASY_TOPICS.has(q.topic) && String(q.q).length < 220,
)
const MEDIUM_POOL = FOUNDATION_POOL.filter((q) => MEDIUM_TOPICS.has(q.topic))
const HARD_POOL = FOUNDATION_POOL.filter((q) => HARD_TOPICS.has(q.topic))

export function buildMillionairePaper() {
  const used = new Set()
  const easy = take(EASY_POOL, 7, used)
  const medium = take(MEDIUM_POOL, 7, used)
  const hard = take(HARD_POOL, 6, used)
  let paper = [...easy, ...medium, ...hard]

  if (paper.length < MILLIONAIRE_COUNT) {
    paper = [
      ...paper,
      ...take(FOUNDATION_POOL, MILLIONAIRE_COUNT - paper.length, used),
    ]
  }

  // Last-line defence: never serve a non-Foundation or malformed card.
  return paper
    .filter((q) => isFoundationClassicMcq(q))
    .slice(0, MILLIONAIRE_COUNT)
}
