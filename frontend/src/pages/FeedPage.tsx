import { Calendar, Map, Plus, Users, Moon, ArrowUp } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'
import Sidebar from '../components/Sidebar'
import CreateNightModal from '../components/CreateNightModal'
import CreateEventModal from '../components/CreateEventModal'
import PostCard from '../components/PostCard'

interface Props { currentUser: User; onLogout: () => void }

export default function FeedPage({ currentUser, onLogout }: Props) {
  const [posts, setPosts] = useState<Night[]>([])
  const [loading, setLoading] = useState(true)
  const [showNight, setShowNight] = useState(false)
  const [showEvent, setShowEvent] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    apiFetch<Night[]>('/nights/')
      .then(setPosts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => setShowScrollTop(el.scrollTop > 300)
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })

  const quickActions = [
    { icon: <Moon size={22} />, label: 'New Night', sub: 'Share your vibe', onClick: () => setShowNight(true) },
    { icon: <Calendar size={22} />, label: 'New Event', sub: 'Plan something', onClick: () => setShowEvent(true) },
    { icon: <Users size={22} />, label: 'Invite', sub: 'Grow your crew', onClick: () => navigate('/friends') },
    { icon: <Map size={22} />, label: 'Live Map', sub: "See who's out", onClick: () => navigate('/map') },
  ]

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowNight(true)} onLogout={onLogout} />

      <main className="app-content" ref={mainRef}>
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
              {posts.map(p => <PostCard key={p.id} post={p} currentUsername={currentUser.username} />)}
            </div>
          </div>
        </div>
      </main>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop} title="Back to top">
          <ArrowUp size={18} />
        </button>
      )}

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
