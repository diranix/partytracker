import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'
import CreateNightModal from '../components/CreateNightModal'
import Sidebar from '../components/Sidebar'

interface Props { currentUser: User; onLogout: () => void }

const MOODS: Record<string, string> = {
  euphoric: '🔥', chill: '😌', happy: '😊', intense: '⚡',
  wild: '🌪️', tired: '😴', vibes: '✨', intimate: '🕯️',
}

export default function ProfilePage({ currentUser, onLogout }: Props) {
  const [nights, setNights] = useState<Night[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'nights' | 'highlights' | 'memories'>('nights')
  const [showCreate, setShowCreate] = useState(false)

  const initial = currentUser.username[0].toUpperCase()

  useEffect(() => {
    apiFetch<Night[]>('/nights/my')
      .then(setNights).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const totalDrinks = nights.reduce((s, n) => s + n.drinks_count, 0)
  const avgRating = nights.length ? (nights.reduce((s, n) => s + n.rating, 0) / nights.length).toFixed(1) : '—'
  const totalLikes = nights.reduce((s, n) => s + (n.likes_count ?? 0), 0)

  const STATS = [
    { icon: '🌙', value: loading ? '—' : nights.length, label: 'Nights' },
    { icon: '🍹', value: loading ? '—' : totalDrinks, label: 'Drinks' },
    { icon: '⭐', value: loading ? '—' : avgRating, label: 'Avg Rating' },
    { icon: '❤️', value: loading ? '—' : totalLikes, label: 'Likes' },
  ]

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowCreate(true)} onLogout={onLogout} />

      <main className="app-content">
        {/* Hero */}
        <div className="profile-hero">
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 50%, #0a0a0d 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 280, height: 280,
              background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />
          </div>
          <div className="profile-hero-gradient" />
          <div className="profile-hero-overlay" />
        </div>

        {/* Info */}
        <div className="profile-info">
          <div className="profile-avatar-large">{initial}</div>
          <div style={{ paddingBottom: 8 }}>
            <div className="profile-name">{currentUser.username}</div>
            <div className="profile-handle">@{currentUser.username.toLowerCase()}</div>
          </div>
          <button className="profile-edit-btn" onClick={() => setShowCreate(true)}>
            + Log Night
          </button>
        </div>

        {/* Stats */}
        <div className="profile-stats-row">
          {STATS.map(s => (
            <div key={s.label} className="profile-stat-card">
              <div className="profile-stat-icon">{s.icon}</div>
              <div className="profile-stat-value">{s.value}</div>
              <div className="profile-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          {(['nights', 'highlights', 'memories'] as const).map(t => (
            <div key={t} className={`profile-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>

        {/* Grid */}
        {tab === 'nights' && (
          <div style={{ padding: '16px 28px 48px' }}>
            {loading && <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading...</div>}

            {!loading && nights.length === 0 && (
              <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '48px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>No nights logged yet</div>
                <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => setShowCreate(true)}>
                  + Log your first night
                </button>
              </div>
            )}

            {nights.length > 0 && (
              <div className="profile-grid">
                {nights.map(n => (
                  <div key={n.id} className="profile-grid-item">
                    <div className="profile-grid-placeholder">
                      <div style={{ fontSize: 28 }}>{MOODS[n.mood?.toLowerCase() ?? ''] ?? '🌙'}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', padding: '0 8px', color: 'var(--text)' }}>{n.title}</div>
                      {n.location && <div style={{ fontSize: 10, color: 'var(--muted)' }}>📍 {n.location}</div>}
                    </div>
                    <div className="profile-grid-overlay">
                      <div className="grid-stat"><span>❤️</span><span>{n.likes_count ?? 0}</span></div>
                      <div className="grid-stat"><span>⭐</span><span>{n.rating}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab !== 'nights' && (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              {tab === 'highlights' ? '✨' : '🌟'}
            </div>
            <div style={{ fontWeight: 600 }}>{tab.charAt(0).toUpperCase() + tab.slice(1)} coming soon</div>
          </div>
        )}
      </main>

      {showCreate && (
        <CreateNightModal
          currentUser={currentUser}
          onClose={() => setShowCreate(false)}
          onCreated={n => { setNights(p => [n, ...p]); setShowCreate(false) }}
        />
      )}
    </div>
  )
}
