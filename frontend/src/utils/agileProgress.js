import { supabase } from './supabase.js'

/**
 * Cloud persistence for the hidden /agile study area.
 *
 * Security model:
 * - This feature is only enabled for ONE account (the owner). The gate is
 *   enforced in two independent layers:
 *     1. Client side: `isAgileCloudUser()` checks the logged-in user id.
 *     2. Database side: Row Level Security policies (see the migration) only
 *        allow this exact account id to read/write its own rows. The client
 *        gate is convenience/UX; RLS is the real security boundary.
 * - All helpers fail soft (return null/false and log) so a network/DB issue
 *   never crashes the study UI — local progress still works.
 */

// The single account permitted to use cloud progress.
export const ALLOWED_AGILE_ACCOUNT_ID =
  '27ca82a3-fdb0-41df-98bb-f29accdb9750'

/** True only for the allowed, logged-in owner account. */
export function isAgileCloudUser(user) {
  return Boolean(user?.id) && user.id === ALLOWED_AGILE_ACCOUNT_ID
}

const DEFAULT_MATCHING = { correct: 0, wrong: 0, rounds: 0 }

// True when a Postgres/PostgREST error means the wrong_bank column does not
// exist yet (i.e. the migration hasn't been run). Used to fall back gracefully.
function isMissingWrongBankColumn(error) {
  const msg = `${error?.message ?? ''} ${error?.code ?? ''}`
  return /wrong_bank|42703|PGRST204/.test(msg)
}

/**
 * Load the aggregate progress row for an account.
 * @returns {Promise<{matching_stats:object, exam_results:object, wrong_bank:Array}|null>}
 */
export async function loadAgileProgress(accountId) {
  if (!accountId) return null
  try {
    let { data, error } = await supabase
      .from('agile_progress')
      .select('matching_stats, exam_results, wrong_bank')
      .eq('account_id', accountId)
      .maybeSingle()
    // Fall back to the legacy column list if the migration hasn't run yet.
    if (error && isMissingWrongBankColumn(error)) {
      ;({ data, error } = await supabase
        .from('agile_progress')
        .select('matching_stats, exam_results')
        .eq('account_id', accountId)
        .maybeSingle())
    }
    if (error) throw error
    if (!data) return null
    return {
      matching_stats: data.matching_stats ?? { ...DEFAULT_MATCHING },
      exam_results: data.exam_results ?? {},
      wrong_bank: data.wrong_bank ?? [],
    }
  } catch (err) {
    console.error('[agile] loadAgileProgress failed:', err.message)
    return null
  }
}

/**
 * Upsert the aggregate progress row. Returns true on success.
 */
export async function saveAgileProgress(
  accountId,
  { matchingStats, examResults, wrongBank },
) {
  if (!accountId) return false
  const base = {
    account_id: accountId,
    matching_stats: matchingStats ?? { ...DEFAULT_MATCHING },
    exam_results: examResults ?? {},
  }
  try {
    let { error } = await supabase
      .from('agile_progress')
      .upsert({ ...base, wrong_bank: wrongBank ?? [] }, { onConflict: 'account_id' })
    // Fall back without the column if the migration hasn't run yet, so the
    // rest of the progress still syncs.
    if (error && isMissingWrongBankColumn(error)) {
      ;({ error } = await supabase
        .from('agile_progress')
        .upsert(base, { onConflict: 'account_id' }))
    }
    if (error) throw error
    return true
  } catch (err) {
    console.error('[agile] saveAgileProgress failed:', err.message)
    return false
  }
}

/**
 * Append a single completed mock-exam attempt to the history log.
 */
export async function logAgileExamAttempt(accountId, attempt) {
  if (!accountId || !attempt) return false
  try {
    const { error } = await supabase.from('agile_exam_attempts').insert({
      account_id: accountId,
      exam_key: attempt.examKey,
      title: attempt.title,
      percent: attempt.percent,
      score: attempt.score,
      total: attempt.total,
      passed: attempt.passed,
    })
    if (error) throw error
    return true
  } catch (err) {
    console.error('[agile] logAgileExamAttempt failed:', err.message)
    return false
  }
}

/**
 * Load the most recent exam attempts for an account (newest first).
 */
export async function loadAgileExamAttempts(accountId, limit = 12) {
  if (!accountId) return []
  try {
    const { data, error } = await supabase
      .from('agile_exam_attempts')
      .select('id, title, percent, score, total, passed, created_at')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data ?? []
  } catch (err) {
    console.error('[agile] loadAgileExamAttempts failed:', err.message)
    return []
  }
}
