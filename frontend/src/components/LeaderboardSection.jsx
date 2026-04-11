import { useCallback, useId, useState } from 'react'
import {
  IconClock,
  IconStarFilled,
  IconTrendDown,
  IconTrendUp,
} from './Icons.jsx'
import './LeaderboardSection.css'

const TABS = [
  { id: 'best', label: 'Best', icon: IconTrendUp },
  { id: 'worst', label: 'Worst', icon: IconTrendDown },
  { id: 'queue', label: 'Queue', icon: IconClock },
]

/** Mock rows — replace with API when backend exists. */
const ROWS_BY_TAB = {
  best: [
    {
      rank: 1,
      title: 'Glossier You Pop-Up',
      category: 'Beauty',
      reviews: 342,
      rating: 4.9,
    },
    {
      rank: 2,
      title: 'Nike SNKRS Experience',
      category: 'Fashion',
      reviews: 289,
      rating: 4.8,
    },
    {
      rank: 3,
      title: 'Aperol Spritz Terrace',
      category: 'Food & Drink',
      reviews: 201,
      rating: 4.7,
    },
    {
      rank: 4,
      title: 'Dyson Supersonic Studio',
      category: 'Beauty',
      reviews: 178,
      rating: 4.6,
    },
    {
      rank: 5,
      title: 'Lego Immersive World',
      category: 'Immersive',
      reviews: 156,
      rating: 4.5,
    },
  ],
  worst: [
    {
      rank: 1,
      title: 'Sample Kiosk Alpha',
      category: 'Beauty',
      reviews: 45,
      rating: 2.4,
    },
    {
      rank: 2,
      title: 'Flash Sale Booth',
      category: 'Fashion',
      reviews: 62,
      rating: 2.6,
    },
    {
      rank: 3,
      title: 'Street Pop-Up Cart',
      category: 'Food & Drink',
      reviews: 128,
      rating: 2.9,
    },
    {
      rank: 4,
      title: 'VR Demo Tent',
      category: 'Immersive',
      reviews: 91,
      rating: 3.1,
    },
    {
      rank: 5,
      title: 'Mini Boutique',
      category: 'Fashion',
      reviews: 73,
      rating: 3.3,
    },
  ],
  queue: [
    {
      rank: 1,
      title: 'Aperol Spritz Terrace',
      category: 'Food & Drink',
      reviews: 201,
      rating: 4.7,
    },
    {
      rank: 2,
      title: 'Glossier You Pop-Up',
      category: 'Beauty',
      reviews: 342,
      rating: 4.9,
    },
    {
      rank: 3,
      title: 'Lego Immersive World',
      category: 'Immersive',
      reviews: 156,
      rating: 4.5,
    },
    {
      rank: 4,
      title: 'Nike SNKRS Experience',
      category: 'Fashion',
      reviews: 289,
      rating: 4.8,
    },
    {
      rank: 5,
      title: 'Dyson Supersonic Studio',
      category: 'Beauty',
      reviews: 178,
      rating: 4.6,
    },
  ],
}

function rankBadgeClass(rank) {
  if (rank === 1) return 'leaderboard-rank--first'
  if (rank === 3) return 'leaderboard-rank--third'
  return 'leaderboard-rank--muted'
}

/**
 * Home leaderboards: Best / Worst / Queue (mock data until API is wired).
 */
export function LeaderboardSection() {
  const [tab, setTab] = useState('best')
  const tabId = useId()
  const panelId = `${tabId}-panel`

  const onSelectTab = useCallback((id) => {
    setTab(id)
  }, [])

  const rows = ROWS_BY_TAB[tab] ?? ROWS_BY_TAB.best

  return (
    <section
      id="section-leaderboard"
      className="leaderboard-section"
      aria-labelledby="leaderboard-heading"
    >
      <div className="leaderboard-section__inner">
        <h2 id="leaderboard-heading" className="leaderboard-section__title">
          <span className="leaderboard-section__trophy" aria-hidden>
            🏆
          </span>{' '}
          Leaderboards
        </h2>

        <div
          className="leaderboard-tabs"
          role="tablist"
          aria-label="Leaderboard sort"
        >
          {TABS.map((item) => {
            const { id, label, icon } = item
            const TabIcon = icon
            const selected = tab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`${tabId}-tab-${id}`}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                className={`leaderboard-tab ${selected ? 'leaderboard-tab--active' : ''}`}
                onClick={() => onSelectTab(id)}
              >
                <TabIcon className="leaderboard-tab__icon" ariaHidden />
                {label}
              </button>
            )
          })}
        </div>

        <ul
          id={panelId}
          className="leaderboard-list"
          role="tabpanel"
          aria-labelledby={`${tabId}-tab-${tab}`}
        >
          {rows.map((row) => (
            <li key={`${tab}-${row.rank}-${row.title}`} className="leaderboard-card">
              <div
                className={`leaderboard-rank ${rankBadgeClass(row.rank)}`}
                aria-label={`Rank ${row.rank}`}
              >
                {row.rank}
              </div>
              <div className="leaderboard-card__main">
                <p className="leaderboard-card__title">{row.title}</p>
                <p className="leaderboard-card__meta">
                  {row.category} · {row.reviews.toLocaleString()} reviews
                </p>
              </div>
              <div className="leaderboard-card__score" title={`${row.rating} out of 5`}>
                <IconStarFilled className="leaderboard-card__star" ariaHidden />
                <span className="leaderboard-card__rating">{row.rating.toFixed(1)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
