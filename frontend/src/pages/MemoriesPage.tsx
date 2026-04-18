import { Camera, MapPin, Star, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'
import CreateNightModal from '../components/CreateNightModal'
import Sidebar from '../components/Sidebar'

interface Props { currentUser: User; onLogout: () => void }

export default function MemoriesPage({ currentUser, onLogout }: Props) {
  const [nights, setNights] = useState<Night[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    apiFetch<Night[]>('/nights/my')
      .then(setNights).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const totalNights = nights.length
  const totalDrinks = nights.reduce((s, n) => s + n.drinks_count, 0)
  const avgRating = totalNights ? (nights.reduce((s, n) => s + n.rating, 0) / totalNights).toFixed(1) : '—'
  const topLocation = nights.reduce((acc: Record<string, number>, n) => {
    if (n.location) acc[n.location] = (acc[n.location] ?? 0) + 1
    return acc
  }, {})
  const topLoc = Object.entries(topLocation).sort(([,a],[,b]) => b - a)[0]?.[0] ?? '—'

  const STATS = [
    { icon: <Camera size={18} />, value: loading ? '—' : totalNights, label: 'Total Nights' },
    { icon: <MapPin size={18} />, value: loading ? '—' : (topLoc.length > 8 ? topLoc.slice(0, 8) + '...' : topLoc), label: 'Top Location' },
    { icon: <Star size={18} />, value: loading ? '—' : avgRating, label: 'Avg Rating' },
    { icon: <Users size={18} />, value: 0, label: 'Friends Tagged' },
  ]

  const throwback = nights.find(n => {
    const d = new Date(n.date)
    const now = new Date()
    return Math.abs(d.getMonth() - now.getMonth()) <= 1 && d.getFullYear() === now.getFullYear() - 1
  }) ?? nights[nights.length - 1]

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowCreate(true)} onLogout={onLogout} />

      <main className="app-content">
        <div className="page-header">
          <div>
            <div className="page-title">Memories</div>
            <div className="page-subtitle">Your legendary nights collection</div>
          </div>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '8px 14px',
              fontSize: 13, color: 'var(--text)', cursor: 'pointer',
            }}
          >
            {[2026, 2025, 2024, 2023].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        <div className="memories-layout">
          {/* Stats */}
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-card-icon">{s.icon}</div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Throwback */}
          <div>
            <div className="section-header">
              <span className="section-title">Throwback</span>
            </div>
            {throwback ? (
              <div className="throwback-card">
                <img
                  src={`https://picsum.photos/seed/${throwback.id}/900/400`}
                  alt={throwback.title}
                  className="throwback-img"
                />
                <div className="throwback-badge">One year ago today</div>
                <div className="throwback-info">
                  <div className="throwback-title">{throwback.title}</div>
                  <div className="throwback-sub">Remember this legendary {throwback.mood ?? 'night'} session?</div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '48px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>No memories yet</div>
                <div style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>Start logging nights to build your collection</div>
                <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => setShowCreate(true)}>
                  + Log a Night
                </button>
              </div>
            )}
          </div>

          {/* Timeline */}
          {nights.length > 0 && (
            <div>
              <div className="section-header">
                <span className="section-title">Your Timeline</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {nights.slice(0, 10).map(n => (
                  <div key={n.id} className="timeline-item">
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, background: 'var(--surface3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
                    }}>
                      🌙
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                        {n.location && `📍 ${n.location} · `}{n.date}
                      </div>
                    </div>
                    <div style={{ color: 'var(--accent2)', fontSize: 13 }}>{'★'.repeat(n.rating)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
