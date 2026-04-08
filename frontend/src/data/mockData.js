export const currentUser = {
  id: 1,
  username: 'anton_nights',
  avatar: 'https://i.pravatar.cc/150?img=12',
  bio: 'Documenting the nights worth remembering.',
  totalPosts: 18,
  avgRating: 8.2,
  totalLikes: 487,
}

export const mockPosts = [
  {
    id: 1,
    user: { id: 2, username: 'mila_v', avatar: 'https://i.pravatar.cc/150?img=47' },
    image: 'https://picsum.photos/seed/night1/600/750',
    location: 'Closer, Kyiv',
    mood: 'Euphoric',
    amountDrank: 5,
    rating: 9,
    likes: 63,
    caption: 'This set from Dixon was something else. Three hours flew by like nothing.',
    createdAt: '2026-04-07T01:15:00Z',
    liked: false,
  },
  {
    id: 2,
    user: { id: 3, username: 'dima.sol', avatar: 'https://i.pravatar.cc/150?img=33' },
    image: 'https://picsum.photos/seed/bar2/600/750',
    location: 'Native Bar, Amsterdam',
    mood: 'Chill',
    amountDrank: 2,
    rating: 7,
    likes: 28,
    caption: 'Low-key Friday. Great cocktails, even better company.',
    createdAt: '2026-04-05T22:40:00Z',
    liked: true,
  },
  {
    id: 3,
    user: { id: 4, username: 'sara.night', avatar: 'https://i.pravatar.cc/150?img=25' },
    image: 'https://picsum.photos/seed/club3/600/750',
    location: 'Tresor, Berlin',
    mood: 'Intense',
    amountDrank: 6,
    rating: 10,
    likes: 112,
    caption: 'Every time. No words.',
    createdAt: '2026-04-03T04:20:00Z',
    liked: false,
  },
  {
    id: 4,
    user: { id: 1, username: 'anton_nights', avatar: 'https://i.pravatar.cc/150?img=12' },
    image: 'https://picsum.photos/seed/rooftop4/600/750',
    location: 'Sky Bar, Kyiv',
    mood: 'Happy',
    amountDrank: 3,
    rating: 8,
    likes: 41,
    caption: 'Rooftop season is back. Finally.',
    createdAt: '2026-04-01T20:30:00Z',
    liked: false,
  },
  {
    id: 5,
    user: { id: 5, username: 'lena.bv', avatar: 'https://i.pravatar.cc/150?img=9' },
    image: 'https://picsum.photos/seed/party5/600/750',
    location: 'Arena Club, Berlin',
    mood: 'Wild',
    amountDrank: 7,
    rating: 9,
    likes: 89,
    caption: "Didn't plan on staying till 8am. Absolutely worth it.",
    createdAt: '2026-03-30T23:50:00Z',
    liked: true,
  },
]

export const mockProfilePosts = [
  { id: 4, image: 'https://picsum.photos/seed/rooftop4/300/300', rating: 8, likes: 41 },
  { id: 6, image: 'https://picsum.photos/seed/night6/300/300', rating: 7, likes: 29 },
  { id: 7, image: 'https://picsum.photos/seed/bar7/300/300', rating: 9, likes: 55 },
  { id: 8, image: 'https://picsum.photos/seed/club8/300/300', rating: 6, likes: 18 },
  { id: 9, image: 'https://picsum.photos/seed/event9/300/300', rating: 10, likes: 103 },
  { id: 10, image: 'https://picsum.photos/seed/night10/300/300', rating: 8, likes: 47 },
]

export function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  const diffD = Math.floor(diffH / 24)
  if (diffH < 1) return 'just now'
  if (diffH < 24) return `${diffH}h ago`
  if (diffD < 7) return `${diffD}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const moodColors = {
  Euphoric: 'tag-mood-euphoric',
  Chill:    'tag-mood-chill',
  Happy:    'tag-mood-happy',
  Intense:  'tag-mood-intense',
  Wild:     'tag-mood-wild',
  Tired:    'tag-mood-tired',
}
