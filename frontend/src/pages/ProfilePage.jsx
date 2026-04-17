import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import Sidebar from '../components/Sidebar'
import CreateNightModal from '../components/CreateNightModal'

const MOODS = { euphoric: '🔥', chill: '😌', happy: '😊', intense: '⚡', wild: '🌪️', tired: '😴' }

export default function ProfilePage({ currentUser, onLogout }) {
  const [nights, setNights] = useState([])
  const [stats, setStats] = useState(null)
  const [tab, setTab] = useState('nights')
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)

  const initial = currentUser?.username?.[0]?.toUpperCase() || '?'

  useEffect(() => {
    Promise.all([
      apiFetch('/nights/my'),
      apiFetch('/stats/'),
    ]).then(([nightsData, statsData]) => {
      setNights(nightsData)
      setStats(statsData)
    }).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreated = (post) => {
    setNights(prev => [post, ...prev])
    setShowCreate(false)
  }

  const STAT_CARDS = [
    { icon: '🌙', value: stats?.total_nights ?? nights.length, label: 'Nights' },
    { icon: '🍹', value: stats?.total_drinks ?? 0, label: 'Drinks' },
    { icon: '⭐', value: stats?.avg_rating ? stats.avg_rating.toFixed(1) : '—', label: 'Avg Rating' },
    { icon: '❤️', value: nights.reduce((s, n) => s + (n.like_count || 0), 0), label: 'Likes' },
  ]

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onLogout={onLogout} onCreateClick={() => setShowCreate(true)} />

      <main className="app-content">
        <div className="profile-layout">
          {/* Hero */}
          <div className="profile-hero">
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 50%, #0a0a0d 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 300, height: 300,
                background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                borderRadius: '50%',
              }} />
            </div>
            <div className="profile-hero-gradient" />
          </div>

          {/* Info */}
          <div className="profile-info">
            <div className="profile-avatar-wrap">{initial}</div>
            <div className="profile-name-area">
              <div className="profile-name">{currentUser?.username}</div>
              <div className="profile-handle">@{currentUser?.username?.toLowerCase()}</div>
            </div>
            <button className="profile-edit-btn" onClick={() => setShowCreate(true)}>
              + Log Night
            </button>
          </div>

          {/* Stats */}
          <div className="profile-stats-row">
            {STAT_CARDS.map((s, i) => (
              <div key={i} className="profile-stat-card">
                <div className="profile-stat-icon">{s.icon}</div>
                <div className="profile-stat-value">{loading ? '—' : s.value}</div>
                <div className="profile-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            {['nights', 'highlights', 'memories'].map(t => (
              <div key={t} className={`profile-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>

          {/* Grid */}
          {tab === 'nights' && (
            <>
              {loading && <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Loading...</div>}

              {!loading && nights.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>No nights logged yet</div>
                  <button onClick={() => setShowCreate(true)} style={{ background: 'var(--accent)', color: '#fff', padding: '10px 24px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 14 }}>
                    + Log your first night
                  </button>
                </div>
              )}

              {nights.length > 0 && (
                <div className="profile-grid">
                  {nights.map((night) => (
                    <div key={night.id} className="profile-grid-item">
                      <div className="profile-grid-placeholder">
                        <div style={{ fontSize: 24 }}>{MOODS[night.mood] || '🌙'}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', textAlign: 'center', padding: '0 8px' }}>
                          {night.title}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{night.location}</div>
                      </div>
                      <div className="profile-grid-overlay">
                        <div className="grid-stat"><span>❤️</span><span>{night.like_count || 0}</span></div>
                        <div className="grid-stat"><span>⭐</span><span>{night.rating || '?'}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'highlights' && (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
              <div>Highlights coming soon</div>
            </div>
          )}

          {tab === 'memories' && (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌟</div>
              <div>Memories coming soon</div>
            </div>
          )}
        </div>
      </main>

      {showCreate && (
        <CreateNightModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </div>
  )
}
