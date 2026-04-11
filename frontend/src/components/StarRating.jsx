/**
 * Accessible 1–5 star rating — click a star to set that score.
 * Pass value={0} until the user selects (required flows).
 */
export function StarRating({ id, label, value, onChange, required = false, error }) {
  const labelId = `${id}-label`
  const invalid = Boolean(error)

  return (
    <div
      id={id}
      className={`star-rating ${invalid ? 'star-rating--invalid' : ''}`}
      aria-invalid={invalid}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <div className="star-rating__row">
        <span className="star-rating__label" id={labelId}>
          {label}
          {required ? (
            <abbr className="review-required" title="required">
              *
            </abbr>
          ) : null}
        </span>
        <span className="star-rating__score" aria-live="polite">
          {value > 0 ? `${value}/5` : '–'}
        </span>
      </div>
      <div
        className="star-rating__stars"
        role="group"
        aria-labelledby={labelId}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star-rating__btn ${n <= value ? 'star-rating__btn--active' : ''}`}
            onClick={() => onChange(n)}
            aria-label={`${label}: set ${n} out of 5 stars`}
          >
            <StarGlyph filled={value > 0 && n <= value} />
          </button>
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} className="review-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function StarGlyph({ filled }) {
  return (
    <svg
      className="star-rating__glyph"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill={filled ? '#fbbf24' : 'none'}
        stroke="#eab308"
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  )
}
