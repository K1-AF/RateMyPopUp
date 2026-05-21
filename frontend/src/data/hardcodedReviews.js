/**
 * Demo reviews for the home carousel — edit here to change what appears on the
 * main page without touching Supabase.
 */

export const HARDCODED_REVIEWS = [
  {
    id: 'demo-chanel',
    company: 'Chanel',
    createdAt: '2026-05-15T21:22:00.000Z',
    reviewer: 'Lena W.',
    ratings: { vibe: 3, queue: 4, goodie: 5 },
    secured: ['Sample', 'Photo opportunity'],
    visitMain: ['Photos', 'Freebies'],
    hearAbout: 'Instagram',
    comments: 'Lots of interactive games! The fragrance sampling stations were a nice touch.',
  },
  {
    id: 'demo-ilia-spacenk',
    company: 'Ilia Beauty x Space NK',
    createdAt: '2026-05-12T16:30:00.000Z',
    reviewer: 'Sophie M.',
    ratings: { vibe: 4, queue: 5, goodie: 5 },
    secured: ['Goodie bag', 'Sample', 'Tote bag'],
    visitMain: ['Freebies', 'In the area'],
    hearAbout: 'Walk-by',
    comments: 'Quick in-and-out — friendly staff and a solid goodie bag with travel-size skincare.',
  },
  {
    id: 'demo-rhode',
    company: 'Rhode',
    createdAt: '2026-05-10T10:18:00.000Z',
    reviewer: 'Ava L.',
    ratings: { vibe: 4, queue: 3, goodie: 4 },
    secured: ['Sample', 'Photo opportunity'],
    visitMain: ['Photos', 'Freebies'],
    hearAbout: 'TikTok',
    comments: 'Had a great time — peptide glazing fluid sample was worth the wait.',
  },
  {
    id: 'demo-nars-refy',
    company: 'Nars x Refy',
    createdAt: '2026-05-08T22:05:00.000Z',
    reviewer: 'Priya S.',
    ratings: { vibe: 4, queue: 5, goodie: 5 },
    secured: ['Goodie bag', 'Full product', 'Stickers'],
    visitMain: ['Freebies', 'Photos'],
    hearAbout: 'Friend',
    comments: 'In love with the goodie bag! Photobooth was amazing and staff were so helpful.',
  },
  {
    id: 'demo-ordinary',
    company: 'Ordinary',
    createdAt: '2026-05-04T14:20:00.000Z',
    reviewer: 'Daniel K.',
    ratings: { vibe: 5, queue: 4, goodie: 5 },
    secured: ['Sample', 'Full product'],
    visitMain: ['Freebies', 'Photos'],
    hearAbout: 'Instagram',
    comments:
      'The serum bar was unreal — staff walked me through the whole routine and I left with two minis.',
  },
  {
    id: 'demo-refy',
    company: 'Refy',
    createdAt: '2026-05-02T00:05:00.000Z',
    reviewer: 'Jess T.',
    ratings: { vibe: 5, queue: 5, goodie: 5 },
    secured: ['Goodie bag', 'Sample'],
    visitMain: ['Freebies', 'Shopping'],
    hearAbout: 'Friend',
    comments: 'Best pop-up ever! The goodie bag had full-size staples I actually use.',
  },
]

/** Newest first — ready for the carousel. */
export function getHardcodedReviews(limit = 6) {
  return [...HARDCODED_REVIEWS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

/** Merges demo reviews with live submissions, newest first. */
export function mergeCarouselReviews(hardcoded, live) {
  return [...live, ...hardcoded].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}
