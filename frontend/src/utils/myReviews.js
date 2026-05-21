import { supabase } from './supabase.js'

const MY_REVIEW_SELECT = `
  review_id,
  account_id,
  company_id,
  items_secured,
  vibe,
  queue_speed,
  goodie_bag_quality,
  staff_helpfulness,
  reason_visit,
  hear_about,
  comments,
  date,
  proof,
  brand_perception_likert,
  online_purchase_likert,
  purchased_at_popup,
  heard_brand_before,
  attended_with,
  popup_name,
  company:company_id ( company_name )
`

/**
 * Loads all reviews for the signed-in user. RLS must allow
 * `account_id = auth.uid()` reads (public read also works).
 */
export async function fetchMyReviews(accountId) {
  if (!accountId) throw new Error('You must be signed in to view your reviews.')

  const { data, error } = await supabase
    .from('review')
    .select(MY_REVIEW_SELECT)
    .eq('account_id', accountId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message || 'Failed to load your reviews')
  return data ?? []
}

/**
 * Updates a review owned by the current user. RLS enforces ownership server-side.
 */
export async function updateReview(reviewId, updates) {
  const safeId = String(reviewId ?? '').trim()
  if (!safeId) throw new Error('Invalid review id.')

  const { data, error } = await supabase
    .from('review')
    .update(updates)
    .eq('review_id', safeId)
    .select(MY_REVIEW_SELECT)
    .single()

  if (error) throw new Error(error.message || 'Failed to update review')
  return data
}

/**
 * Deletes a review owned by the current user. RLS enforces ownership server-side.
 */
export async function deleteReview(reviewId) {
  const safeId = String(reviewId ?? '').trim()
  if (!safeId) throw new Error('Invalid review id.')

  const { error } = await supabase.from('review').delete().eq('review_id', safeId)
  if (error) throw new Error(error.message || 'Failed to delete review')
}
