import { Calendar, Map, Plus, Users, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'
import Sidebar from '../components/Sidebar'
import CreateNightModal from '../components/CreateNightModal'
import CreateEventModal from '../components/CreateEventModal'
import PostCard from '../components/PostCard'

interface Props { currentUser: User; onLogout: () => void }

const MOCK_FRIENDS = [
  { id: 1, name: 'Sarah', loc: 'At The Rooftop', seed: 'sarah1' },
  { id: 2, name: 'Mike', loc: 'Downtown', seed: 'mike2' },
  { id: 3, name: 'Emma', loc: 'House Party', seed: 'emma3' },
  { id: 4, name: 'Jake', loc: 'Club 44', seed: 'jake4' },
  { id: 5, name: 'Zoe', loc: 'Bar Neon', seed: 'zoe5' },
]

const MOCK_EVENTS = [
  { id: 1, title: 'Rooftop Summer Sessions', date: 'Fri, Apr 18', attending: 24, seed: 'event1' },
  { id: 2, title: 'Warehouse Rave', date: 'Sat, Apr 19', attending: 48, seed: 'event2' },
]

export default function FeedPage({ currentUser, onLogout }: Props) {
  const [posts, setPosts] = useState<Night[]>([])
  const [loading, setLoading] = useState(true)
  const [showNight, setShowNight] = useState(false)
  const [showEvent, setShowEvent] = useState(false)

  useEffect(() => {
    apiFetch<Night[]>('/nights/')
      .then(setPosts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const quickActions = [
    { icon: <Moon size={22} />, label: 'New Night', sub: 'Share your vibe', onClick: () => setShowNight(true) },
    { icon: <Calendar size={22} />, label: 'New Event', sub: 'Plan something', onClick: () => setShowEvent(true) },
    { icon: <Users size={22} />, label: 'Invite', sub: 'Grow your crew', onClick: () => {} },
    { icon: <Map size={22} />, label: 'Live Map', sub: "See who's out", onClick: () => {} },
  ]

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowNight(true)} onLogout={onLogout} />

      <main className="app-content">
        <div className="page-header">
          <div>
            <div className="page-title">Feed</div>
            <div className="page-subtitle">What's happening tonight</div>
          </div>
          <button className="btn-primary" onClick={() => setShowNight(true)}>
            <Plus size={15} /> Create
          </button>
        </div>

        <div className="feed-layout">
          {/* Quick Actions */}
          <div>
            <div className="quick-actions">
              {quickActions.map(a => (
                <div key={a.label} className="quick-card" onClick={a.onClick}>
                  <div className="quick-card-icon">{a.icon}</div>
                  <div className="quick-card-label">{a.label}</div>
                  <div className="quick-card-sub">{a.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Out Now */}
          <div>
            <div className="section-header">
              <span className="section-title">Out Now</span>
              <span className="view-all">View all</span>
            </div>
            <div className="friends-row">
              {MOCK_FRIENDS.map(f => (
                <div key={f.id} className="friend-bubble">
                  <div className="friend-bubble-avatar">
                    <div className="friend-ring">
                      <div className="friend-ring-inner">
                        <img src={`https://i.pravatar.cc/80?u=${f.seed}`} alt={f.name} />
                      </div>
                    </div>
                    <div className="friend-online" />
                  </div>
                  <div className="friend-name">{f.name}</div>
                  <div className="friend-loc">{f.loc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="section-header">
              <span className="section-title">Upcoming Events</span>
              <span className="view-all">View all</span>
            </div>
            <div className="events-grid">
              {MOCK_EVENTS.map(ev => (
                <div key={ev.id} className="event-card">
                  <img src={`https://picsum.photos/seed/${ev.seed}/600/300`} alt={ev.title} className="event-card-img" />
                  <div className="event-card-body">
                    <div className="event-card-date">{ev.date}</div>
                    <div className="event-card-title">{ev.title}</div>
                    <div className="event-card-meta">
                      <Users size={12} /> {ev.attending} attending
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div>
            <div className="section-header">
              <span className="section-title">Recent Nights</span>
            </div>

            {loading && <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>Loading...</div>}

            {!loading && posts.length === 0 && (
              <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '48px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>No nights yet</div>
                <div style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>Be the first to log a night!</div>
                <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => setShowNight(true)}>
                  + Log a Night
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </div>
      </main>

      {showNight && (
        <CreateNightModal
          currentUser={currentUser}
          onClose={() => setShowNight(false)}
          onCreated={p => { setPosts(prev => [p, ...prev]); setShowNight(false) }}
        />
      )}
      {showEvent && <CreateEventModal onClose={() => setShowEvent(false)} />}
    </div>
  )
}
