/**
 * Home sections: category browse grid + live pop-up status list.
 * Icons are inline SVGs — no extra dependencies.
 */

function IconSparkle({ className }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.09 4.26L17 8l-3.91 1.74L12 14l-1.09-4.26L7 8l3.91-1.74L12 2zM5 14l.91 2.09L8 17l-2.09.91L5 20l-.91-2.09L2 17l2.09-.91L5 14zM19 14l.91 2.09L22 17l-2.09.91L19 20l-.91-2.09L16 17l2.09-.91L19 14z" />
    </svg>
  )
}

function IconBag({ className }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M6 8h12l1 14H5L6 8zM9 8V6a3 3 0 016 0v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBubbleTea({ className }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 8h12l-1.2 12a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8z" />
      <path d="M5 8h14" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M10 5.2c.7-.4 1.5-.6 2-.6.8 0 1.6.2 2.2.7" />
      <circle cx="10" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconEye({ className }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconClock({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" strokeLinecap="round" />
    </svg>
  )
}

function IconBagSmall({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M6 7h12l1 12H5L6 7zM9 7V5a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  )
}

const CATEGORIES = [
  { id: 'beauty', label: 'Beauty', Icon: IconSparkle, cardClass: 'category-card--beauty' },
  { id: 'fashion', label: 'Fashion', Icon: IconBag, cardClass: 'category-card--fashion' },
  { id: 'food', label: 'Food & Drink', Icon: IconBubbleTea, cardClass: 'category-card--food' },
  { id: 'immersive', label: 'Immersive', Icon: IconEye, cardClass: 'category-card--immersive' },
]

const LIVE_ROWS = [
  {
    id: '1',
    title: 'Glossier You Pop-Up',
    dotClass: 'live-row__dot--mint',
    wait: '15 min',
    bag: 'Yes',
  },
  {
    id: '2',
    title: 'Nike SNKRS Experience',
    dotClass: 'live-row__dot--yellow',
    wait: '45 min',
    bag: 'Low',
  },
  {
    id: '3',
    title: 'Aperol Spritz Terrace',
    dotClass: 'live-row__dot--coral',
    wait: '5 min',
    bag: 'Sold Out',
  },
]

export function BrowseLiveSections() {
  return (
    <>
      <section
        id="section-explore"
        className="browse-section"
        aria-labelledby="browse-heading"
      >
        <div className="browse-section__container">
          <h2 id="browse-heading" className="section-heading">
            Browse by Category
          </h2>
          <ul className="category-grid">
            {CATEGORIES.map((item) => {
              const IconComponent = item.Icon
              return (
                <li key={item.id}>
                  <button type="button" className={`category-card ${item.cardClass}`}>
                    <IconComponent className="category-card__icon" />
                    <span className="category-card__label">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section id="live-now" className="live-section" aria-labelledby="live-heading">
        <div className="live-section__container">
          <div className="live-section__title-row">
            <span className="live-section__record" aria-hidden />
            <h2 id="live-heading" className="section-heading section-heading--live">
              Live Now
            </h2>
          </div>
          <p className="live-section__sub">Wait times &amp; goodie bag availability</p>
          <ul className="live-list">
            {LIVE_ROWS.map((row) => (
              <li key={row.id} className="live-row">
                <span className={`live-row__dot ${row.dotClass}`} aria-hidden />
                <span className="live-row__title">{row.title}</span>
                <div className="live-row__meta">
                  <span className="live-row__chip">
                    <IconClock className="live-row__chip-icon" />
                    {row.wait}
                  </span>
                  <span className="live-row__chip">
                    <IconBagSmall className="live-row__chip-icon" />
                    {row.bag}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
