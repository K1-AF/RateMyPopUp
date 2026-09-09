// Barrel for the 30-paper Final Examination Series.
// Papers live in A–F modules (5 papers each) and are grouped into 3 books
// of 10 so the site can section them as official-style exam booklets
// rather than one long card grid.

import { FINAL_MOCKS_A } from './agileFinalMocksA.js'
import { FINAL_MOCKS_B } from './agileFinalMocksB.js'
import { FINAL_MOCKS_C } from './agileFinalMocksC.js'
import { FINAL_MOCKS_D } from './agileFinalMocksD.js'
import { FINAL_MOCKS_E } from './agileFinalMocksE.js'
import { FINAL_MOCKS_F } from './agileFinalMocksF.js'

export const FINAL_BOOKS = [
  {
    id: 1,
    label: 'Book I',
    range: 'Papers 1–10',
    blurb: 'Key concepts through governance — first sitting block.',
    from: 1,
    to: 10,
  },
  {
    id: 2,
    label: 'Book II',
    range: 'Papers 11–20',
    blurb: 'Same official format, new stems and harder traps.',
    from: 11,
    to: 20,
  },
  {
    id: 3,
    label: 'Book III',
    range: 'Papers 21–30',
    blurb: 'Final stretch — RACI, PAQ, finance and increment traps.',
    from: 21,
    to: 30,
  },
]

export const FINAL_MOCK_EXAMS = [
  ...FINAL_MOCKS_A,
  ...FINAL_MOCKS_B,
  ...FINAL_MOCKS_C,
  ...FINAL_MOCKS_D,
  ...FINAL_MOCKS_E,
  ...FINAL_MOCKS_F,
]

// Paper number from id ("final12" → 12). Used to place a paper in a book.
export function finalPaperNumber(paper) {
  const match = String(paper?.id ?? '').match(/(\d+)$/)
  return match ? Number(match[1]) : 0
}

export function papersInBook(book) {
  return FINAL_MOCK_EXAMS.filter((paper) => {
    const n = finalPaperNumber(paper)
    return n >= book.from && n <= book.to
  })
}
