import { summarizeCompanyReviews } from './adminReport.js'

/** Max companies for side-by-side compare and charts (keeps UI readable). */
export const ADMIN_COMPARE_MAX = 5

function reviewTimestampMs(review) {
  const t = new Date(review?.date || 0).getTime()
  return Number.isNaN(t) ? null : t
}

/**
 * Filter reviews to an inclusive local calendar-day range.
 * Empty strings mean "no bound" on that side.
 */
export function filterReviewsByDateRange(reviews, dateFromStr, dateToStr) {
  if (!dateFromStr && !dateToStr) return [...(reviews || [])]
  const fromMs = dateFromStr ? new Date(`${dateFromStr}T00:00:00`).getTime() : null
  const toMs = dateToStr ? new Date(`${dateToStr}T23:59:59.999`).getTime() : null
  return (reviews || []).filter((r) => {
    const ts = reviewTimestampMs(r)
    if (ts == null) return false
    if (fromMs != null && ts < fromMs) return false
    if (toMs != null && ts > toMs) return false
    return true
  })
}

function maxReviewMs(reviews) {
  let m = null
  for (const r of reviews || []) {
    const t = reviewTimestampMs(r)
    if (t == null) continue
    if (m == null || t > m) m = t
  }
  return m
}

function minReviewMs(reviews) {
  let m = null
  for (const r of reviews || []) {
    const t = reviewTimestampMs(r)
    if (t == null) continue
    if (m == null || t < m) m = t
  }
  return m
}

function sortCompanies(list, sortBy) {
  const key = sortBy || 'reviews_desc'
  const cmpName = (a, b) => a.companyName.localeCompare(b.companyName, undefined, { sensitivity: 'base' })
  const num = (v) => (Number.isFinite(v) ? v : -Infinity)

  const sorted = [...list]
  switch (key) {
    case 'reviews_asc':
      sorted.sort((a, b) => a.summary.reviewCount - b.summary.reviewCount || cmpName(a, b))
      break
    case 'name_asc':
      sorted.sort(cmpName)
      break
    case 'name_desc':
      sorted.sort((a, b) => -cmpName(a, b))
      break
    case 'overall_desc':
      sorted.sort((a, b) => num(b.summary.overallAvg) - num(a.summary.overallAvg) || cmpName(a, b))
      break
    case 'overall_asc':
      sorted.sort((a, b) => num(a.summary.overallAvg) - num(b.summary.overallAvg) || cmpName(a, b))
      break
    case 'vibe_desc':
      sorted.sort((a, b) => num(b.summary.vibeAvg) - num(a.summary.vibeAvg) || cmpName(a, b))
      break
    case 'purchase_desc':
      sorted.sort((a, b) => num(b.summary.purchaseRate) - num(a.summary.purchaseRate) || cmpName(a, b))
      break
    case 'newest_activity':
      sorted.sort((a, b) => (maxReviewMs(b.reviews) || 0) - (maxReviewMs(a.reviews) || 0) || cmpName(a, b))
      break
    case 'oldest_activity':
      sorted.sort((a, b) => (minReviewMs(a.reviews) || Infinity) - (minReviewMs(b.reviews) || Infinity) || cmpName(a, b))
      break
    case 'reviews_desc':
    default:
      sorted.sort((a, b) => b.summary.reviewCount - a.summary.reviewCount || cmpName(a, b))
      break
  }
  return sorted
}

/**
 * Apply date window (re-summarize), search, min review count, optional hide empty, then sort.
 */
export function buildFilteredCompanyList(companies, options) {
  const {
    searchQuery = '',
    dateFrom = '',
    dateTo = '',
    minReviews = '',
    sortBy = 'reviews_desc',
    hideCompaniesWithNoReviewsInRange = false,
  } = options || {}

  const q = String(searchQuery).trim().toLowerCase()
  let list = (companies || []).map((company) => {
    const inRange = filterReviewsByDateRange(company.reviews, dateFrom, dateTo)
    const { reviews, summary } = summarizeCompanyReviews(inRange)
    return {
      ...company,
      reviews,
      summary,
    }
  })

  if (hideCompaniesWithNoReviewsInRange && (dateFrom || dateTo)) {
    list = list.filter((c) => c.summary.reviewCount > 0)
  }

  if (q) {
    list = list.filter((c) => String(c.companyName || '').toLowerCase().includes(q))
  }

  const minN = Math.max(0, parseInt(String(minReviews).trim(), 10) || 0)
  if (minN > 0) {
    list = list.filter((c) => c.summary.reviewCount >= minN)
  }

  return sortCompanies(list, sortBy)
}

/** Flatten reviews from companies for a single timeline. */
export function collectReviewsForTimeline(companies) {
  const out = []
  for (const c of companies || []) {
    for (const r of c.reviews || []) {
      out.push(r)
    }
  }
  return out
}

/**
 * Monthly counts (YYYY-MM) sorted ascending.
 */
export function buildMonthlyBuckets(reviews) {
  const map = new Map()
  for (const r of reviews || []) {
    const d = r?.date ? new Date(r.date) : null
    if (!d || Number.isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(key, (map.get(key) || 0) + 1)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))
}

export function chartCompaniesFromSelection(filteredCompanies, compareIds) {
  const set = new Set(compareIds || [])
  const picked = (filteredCompanies || []).filter((c) => set.has(c.companyId))
  if (picked.length > 0) return picked.slice(0, ADMIN_COMPARE_MAX)
  return (filteredCompanies || []).slice(0, ADMIN_COMPARE_MAX)
}
