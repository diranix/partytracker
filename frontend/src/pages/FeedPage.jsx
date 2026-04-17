import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import Sidebar from '../components/Sidebar'
import CreateMenuModal from '../components/CreateMenuModal'
import CreateNightModal from '../components/CreateNightModal'
import CreateEventModal from '../components/CreateEventModal'

const MOODS = { euphoric: '🔥', chill: '😌', happy: '😊', intense: '⚡', wild: '🌪️', tired: '😴' }

const MOCK_FRIENDS = [
  { id: 1, name: 'Mia', online: true },
  { id: 2, name: 'Alex', online: true },
  { id: 3, name: 'Sam', online: false },
  { id: 4, name: 'Zoe', online: true },
  { id: 5, name: 'Dan', online: false },
  { id: 6, name: 'Leo', online: true },
]

const MOCK_EVENTS = [
  { id: 1, title: 'Rooftop Rave', date: 'Sat Apr 19', location: 'Club Vertex', going: 24 },
  { id: 2, title: 'Chill Lounge Night', date: 'Sun Apr 20', location: 'Bar Neon', going: 12 },
]

const TRENDING = [
  { name: '#RooftopVibes', count: '2.4K nights' },
  { name: '#ClubNight', count: '1.8K nights' },
  { name: '#ChillSesh', count: '980 nights' },
  { name: '#WeekendMood', count: '750 nights' },
]

function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked_by_me || false)
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [loading, setLoading] = useState(false)

  const initial = post.author?.username?.[0]?.toUpperCase() || post.title?.[0]?.toUpperCase() || '?'
  const mood = post.mood || 'chill'

  const handleLike = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await apiFetch(`/nights/${post.id}/like`, { method: 'POST' })
      setLiked(res.liked)
      setLikeCount(res.like_count)
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr)
    const h = Math.floor(diff / 3600000)
    if (h < 1) return 'just now'
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="avatar" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--accent), #EC4899)', color: '#fff', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
          {initial}
        </div>
        <div className="post-user-info">
          <div className="post-username">{post.author?.username || 'You'}</div>
          <div className="post-time">{timeAgo(post.created_at)}</div>
        </div>
        <span className="tag">{MOODS[mood] || '🎉'} {mood}</span>
      </div>

      <div className="post-body">
        <div className="post-title">{post.title}</div>
        <div className="post-meta-row">
          {post.location && (
            <div className="post-meta-item"><span>📍</span><span>{post.location}</span></div>
          )}
          {post.drinks_count > 0 && (
            <div className="post-meta-item"><span>🍹</span><span>{post.drinks_count}</span></div>
          )}
          {post.rating && (
            <div className="rating-stars">
              {'★'.repeat(post.rating)}{'☆'.repeat(5 - post.rating)}
            </div>
          )}
        </div>

        <div className="post-actions">
          <button className={`like-btn${liked ? ' liked' : ''}`} onClick={handleLike}>
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>
          <button className="action-btn"><span>💬</span><span>Comment</span></button>
          <button className="action-btn"><span>🔗</span><span>Share</span></button>
        </div>
      </div>
    </article>
  )
}

export default function FeedPage({ currentUser, onLogout }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showNight, setShowNight] = useState(false)
  const [showEvent, setShowEvent] = useState(false)

  useEffect(() => {
    apiFetch('/nights/')
      .then(data => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreated = (post) => {
    setPosts(prev => [post, ...prev])
    setShowNight(false)
    setShowEvent(false)
  }

  const openCreate = (type) => {
    setShowMenu(false)
    if (type === 'night') setShowNight(true)
    if (type === 'event') setShowEvent(true)
  }

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onLogout={onLogout} onCreateClick={() => setShowMenu(true)} />

      <main className="app-content">
        <div className="feed-layout">
          <div className="feed-main">
            {/* Quick Actions */}
            <div style={{ marginBottom: 28 }}>
              <div className="section-header">
                <div className="section-title">Quick Actions</div>
              </div>
              <div className="quick-actions">
                <div className="quick-action-card" onClick={() => setShowNight(true)}>
                  <div className="quick-action-icon">🌙</div>
                  <div>
                    <div className="quick-action-label">New Night</div>
                    <div className="quick-action-sub">Log your night out</div>
                  </div>
                </div>
                <div className="quick-action-card" onClick={() => setShowEvent(true)}>
                  <div className="quick-action-icon">🎉</div>
                  <div>
                    <div className="quick-action-label">New Event</div>
                    <div className="quick-action-sub">Create an event</div>
                  </div>
                </div>
                <div className="quick-action-card">
                  <div className="quick-action-icon">📸</div>
                  <div>
                    <div className="quick-action-label">New Recap</div>
                    <div className="quick-action-sub">Photo story</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Friends */}
            <div style={{ marginBottom: 28 }}>
              <div className="section-header">
                <div className="section-title">Active Friends</div>
                <span className="see-all">See all</span>
              </div>
              <div className="friends-row">
                {MOCK_FRIENDS.map(f => (
                  <div key={f.id} className="friend-bubble">
                    <div className="friend-bubble-avatar">
                      <div className="friend-avatar-ring">
                        <div className="friend-avatar-inner">{f.name[0]}</div>
                      </div>
                      {f.online && <div className="friend-online-dot" />}
                    </div>
                    <div className="friend-bubble-name">{f.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div style={{ marginBottom: 28 }}>
              <div className="section-header">
                <div className="section-title">Upcoming Events</div>
                <span className="see-all">See all</span>
              </div>
              <div className="events-row">
                {MOCK_EVENTS.map(ev => (
                  <div key={ev.id} className="event-mini-card">
                    <div className="event-mini-title">{ev.title}</div>
                    <div className="event-mini-info">📅 {ev.date}<br />📍 {ev.location}</div>
                    <div className="event-mini-going">✓ {ev.going} going</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="section-header">
              <div className="section-title">Recent Nights</div>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Loading...</div>
            )}

            {!loading && posts.length === 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No nights yet</div>
                <div style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>Be the first to log a night!</div>
                <button onClick={() => setShowNight(true)} style={{ background: 'var(--accent)', color: '#fff', padding: '10px 24px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 14 }}>
                  + Log a Night
                </button>
              </div>
            )}

            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>

          {/* Right Panel */}
          <aside className="feed-right">
            <div className="panel-card">
              <div className="panel-title">🔥 Trending</div>
              {TRENDING.map((t, i) => (
                <div key={i} className="trending-item">
                  <div className="trending-num">{i + 1}</div>
                  <div className="trending-info">
                    <div className="trending-name">{t.name}</div>
                    <div className="trending-count">{t.count}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="panel-card">
              <div className="panel-title">✦ Party Tracker</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                Document your nights, share memories, and relive the best moments with friends.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {showMenu && <CreateMenuModal onClose={() => setShowMenu(false)} onSelect={openCreate} />}
      {showNight && <CreateNightModal onClose={() => setShowNight(false)} onCreated={handleCreated} />}
      {showEvent && <CreateEventModal onClose={() => setShowEvent(false)} />}
    </div>
  )
}
