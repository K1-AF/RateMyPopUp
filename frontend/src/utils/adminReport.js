import { parseMultiField } from './reviews.js'
import { supabase } from './supabase.js'

function avg(values) {
  const nums = values.filter((n) => Number.isFinite(n))
  if (!nums.length) return null
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function pct(part, total) {
  if (!total) return null
  return (part / total) * 100
}

/**
 * Admin dataset for company reporting.
 *
 * Security:
 * - Data is loaded only through the admin RPC (`admin_company_review_export`)
 *   so Supabase can enforce server-side admin checks.
 */
export async function fetchAdminCompanyReport() {
  const { data: rpcRows, error: rpcErr } = await supabase.rpc('admin_company_review_export')
  if (rpcErr) {
    throw new Error(
      rpcErr.message ||
        'Admin report function is not available. Run migration 0005_admin_report_rpc.sql.'
    )
  }
  return buildCompanyReport(Array.isArray(rpcRows) ? rpcRows : [])
}

function buildCompanyReport(rows) {
  const byCompany = new Map()

  for (const row of rows || []) {
    const companyId = row.company_id
    if (!companyId) continue
    if (!byCompany.has(companyId)) {
      byCompany.set(companyId, {
        companyId,
        companyName: row.company_name || 'Unknown company',
        reviews: [],
      })
    }
    if (!row.review_id) continue
    byCompany.get(companyId).reviews.push({
      reviewId: row.review_id,
      date: row.date || null,
      reviewerName: row.reviewer_name || null,
      accountId: row.account_id || null,
      comments: row.comments || '',
      vibe: Number(row.vibe) || 0,
      queueSpeed: Number(row.queue_speed) || 0,
      goodieQuality: Number(row.goodie_bag_quality) || 0,
      itemsSecured: parseMultiField(row.items_secured),
      reasonVisit: parseMultiField(row.reason_visit),
      hearAbout: row.hear_about || '',
      brandPerceptionLikert: Number(row.brand_perception_likert) || 0,
      purchasedAtPopup: row.purchased_at_popup === true,
      heardBrandBefore: row.heard_brand_before === true,
      attendedWith: row.attended_with || '',
    })
  }

  const companies = Array.from(byCompany.values())
    .map((company) => {
      const reviews = company.reviews.sort((a, b) => {
        const da = new Date(a.date || 0).getTime()
        const db = new Date(b.date || 0).getTime()
        return db - da
      })
      const reviewCount = reviews.length

      const vibeAvg = avg(reviews.map((r) => r.vibe || null))
      const queueAvg = avg(reviews.map((r) => r.queueSpeed || null))
      const goodieAvg = avg(reviews.map((r) => r.goodieQuality || null))
      const perceptionAvg = avg(reviews.map((r) => r.brandPerceptionLikert || null))
      const overallAvg = avg([vibeAvg, queueAvg, goodieAvg].map((n) => (Number.isFinite(n) ? n : null)))

      const purchases = reviews.filter((r) => r.purchasedAtPopup).length
      const heardBefore = reviews.filter((r) => r.heardBrandBefore).length

      const comments = reviews.filter((r) => r.comments.trim().length > 0).length

      return {
        ...company,
        reviews,
        summary: {
          reviewCount,
          commentsCount: comments,
          vibeAvg,
          queueAvg,
          goodieAvg,
          perceptionAvg,
          overallAvg,
          purchaseRate: pct(purchases, reviewCount),
          heardBeforeRate: pct(heardBefore, reviewCount),
        },
      }
    })
    .sort((a, b) => b.summary.reviewCount - a.summary.reviewCount || a.companyName.localeCompare(b.companyName))

  return {
    companies,
    totals: {
      companyCount: companies.length,
      reviewCount: companies.reduce((sum, c) => sum + c.summary.reviewCount, 0),
      commentsCount: companies.reduce((sum, c) => sum + c.summary.commentsCount, 0),
    },
  }
}

