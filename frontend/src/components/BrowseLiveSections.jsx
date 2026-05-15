/**
 * Home sections: Browse by Category + Live Now (placeholders until those features ship).
 */

function ComingSoonCard() {
  return (
    <p className="home-coming-soon" role="status">
      <span className="home-coming-soon__label">Coming soon</span>{' '}
      <span className="home-coming-soon__emoji" aria-hidden="true">
        👀
      </span>
    </p>
  )
}

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
          <ComingSoonCard />
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
          <ComingSoonCard />
        </div>
      </section>
    </>
  )
}
