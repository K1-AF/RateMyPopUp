// AgilePM Practitioner mocks — original scenario papers in the official
// 80-mark booklet layout. Nothing here is copied from APMG sample papers.
//
// Paper shape (APMG Practitioner Candidate Guidance):
//   4 syllabus questions × 20 answer lines = 80 marks
//   150 minutes, open book (official handbook only), 40/80 (50%) to pass
//   Scenario booklet + optional Additional Information per part
//   Four objective-test layouts: classic, multiple-response, matching,
//   assertion/reason

import { PRACTITIONER_PAPER_1 } from './agilePractitioner1.js'
import { PRACTITIONER_PAPER_2 } from './agilePractitioner2.js'
import { PRACTITIONER_PAPER_3 } from './agilePractitioner3.js'
import { PRACTITIONER_PAPER_4 } from './agilePractitioner4.js'
import { PRACTITIONER_PAPER_5 } from './agilePractitioner5.js'

export const PRACTITIONER_CONFIG = {
  questionCount: 80,
  durationMinutes: 150,
  passMark: 40,
  passPercent: 50,
  openBook: true,
}

// Practitioner syllabus labels (v3 area codes, shown like the official chart).
export const PRACTITIONER_TOPICS = {
  AF: 'AgilePM Fundamentals',
  IC: 'Individuals, Collaboration & Communication',
  RK: 'Risk Management & the Project Approach',
  DE: 'Defining & Estimating the Work',
  PG: 'Planning, Control, Governance & Products',
}

export const PRACTITIONER_LABELS = {
  AF: 'SY_FI',
  IC: 'SY_IC',
  RK: 'SY_RK',
  DE: 'SY_ES',
  PG: 'SY_PG',
}

// Official assertion/reason option key. Letters may be reused or unused.
export const AR_OPTIONS = [
  { key: 'A', text: 'True, True AND the reason explains the assertion' },
  { key: 'B', text: 'True, True BUT the reason does not explain the assertion' },
  { key: 'C', text: 'Assertion true, Reason false' },
  { key: 'D', text: 'Assertion false, Reason true' },
  { key: 'E', text: 'Assertion false, Reason false' },
]

export const PRACTITIONER_EXAMS = [
  PRACTITIONER_PAPER_1,
  PRACTITIONER_PAPER_2,
  PRACTITIONER_PAPER_3,
  PRACTITIONER_PAPER_4,
  PRACTITIONER_PAPER_5,
]

// Official APMG sample — launched on their player only. Their questions
// are copyrighted, so this app never stores or reconstructs that paper.
export const OFFICIAL_PRACTITIONER_SAMPLE = {
  id: 'official-apmg-sample',
  title: 'Official APMG sample',
  project: 'AgilePM (v3) Practitioner — APMG sample exam player',
  href: 'https://oea2022.apmg-international.com/Marlin/SamplePapers.aspx',
}

/** Flatten a paper into 16 parts (4 questions × 4 parts) for the runner. */
export function practitionerParts(paper) {
  return paper.questions.flatMap((question) =>
    question.parts.map((part) => ({
      question,
      part,
      items: part.items,
    })),
  )
}

/** Flatten a paper into 80 scored lines. */
export function flattenPractitioner(paper) {
  const lines = []
  for (const question of paper.questions) {
    for (const part of question.parts) {
      for (const item of part.items) {
        lines.push({
          ...item,
          type: part.type,
          topic: question.code,
          questionId: question.id,
          partId: part.id,
          column2: part.column2 ?? null,
        })
      }
    }
  }
  return lines
}

/**
 * Score one line. Multiple-response awards the mark only when both
 * required options are selected and nothing else is selected.
 */
export function scorePractitionerLine(item, answer) {
  if (item.type === 'mr') {
    const picked = Array.isArray(answer) ? [...answer].sort() : []
    const need = [...item.correct].sort()
    return (
      picked.length === need.length &&
      need.every((opt, i) => opt === picked[i])
    )
  }
  return answer === item.correct
}

export function scorePractitionerPaper(paper, answers) {
  const lines = flattenPractitioner(paper)
  const score = lines.reduce(
    (acc, item) => acc + (scorePractitionerLine(item, answers[item.id]) ? 1 : 0),
    0,
  )
  const { passMark, questionCount } = PRACTITIONER_CONFIG
  const percent = Math.round((score / questionCount) * 100)
  return {
    score,
    total: questionCount,
    percent,
    passMark,
    passed: score >= passMark,
  }
}

/** Human-readable stem for review / wrong-bank cards. */
export function practitionerStem(item) {
  if (item.type === 'ar') {
    return `Assertion: ${item.assertion}\nBECAUSE\nReason: ${item.reason}`
  }
  return item.q
}

export function practitionerCorrectLabel(item) {
  if (item.type === 'mr') return item.correct.join(' + ')
  if (item.type === 'matching' || item.type === 'ar') return item.correct
  return item.correct
}
