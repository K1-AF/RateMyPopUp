/**
 * Collab pop-up helpers — e.g. "Ilia Beauty x Space NK".
 *
 * Collab companies are stored as a single `company` row. They appear on Explore
 * but are hidden from the review-form typeahead so reviewers pick individual
 * brands and we merge them on submit.
 */

export const COLLAB_NAME_SEPARATOR = ' x '

/** True when the stored company name represents a collaboration. */
export function isCollabCompanyName(name) {
  return String(name ?? '').includes(COLLAB_NAME_SEPARATOR)
}

/**
 * Builds a canonical collab display name from one or more inputs.
 * Splits any existing " x " segments, dedupes, sorts alphabetically, rejoins.
 */
export function buildCollabCompanyName(names) {
  const unique = [
    ...new Set(
      (Array.isArray(names) ? names : [names])
        .flatMap((entry) => String(entry ?? '').split(COLLAB_NAME_SEPARATOR))
        .map((part) => part.trim())
        .filter(Boolean)
    ),
  ]

  if (unique.length === 0) return ''
  if (unique.length === 1) return unique[0]
  return unique.sort((a, b) => a.localeCompare(b)).join(COLLAB_NAME_SEPARATOR)
}
