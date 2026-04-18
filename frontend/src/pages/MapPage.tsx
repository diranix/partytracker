import { useState } from 'react'
import type { User } from '../api/types'
import CreateNightModal from '../components/CreateNightModal'
import Sidebar from '../components/Sidebar'

interface Props { currentUser: User; onLogout: () => void }

const ACTIVITY = [
  { id: 1, text: <><strong>Sarah</strong> checked in at The Rooftop Bar</>, time: '2 min ago', seed: 'sarah1' },
  { id: 2, text: <><strong>Mike</strong> joined The Rooftop Bar</>, time: '15 min ago', seed: 'mike2' },
  { id: 3, text: <><strong>Emma</strong> posted from The Rooftop Bar</>, time: '28 min ago', seed: 'emma3' },
  { id: 4, text: <><strong>Jake</strong> is heading to Club 44</>, time: '42 min ago', seed: 'jake4' },
]

const CLUSTERS = [
  { top: '18%', left: '60%', count: 3, seed: 'cluster1' },
  { top: '12%', left: '75%', count: 1, seed: 'cluster2' },
  { top: '40%', left: '68%', count: 2, seed: 'cluster3' },
  { top: '35%', left: '55%', count: 2, seed: 'cluster4' },
  { top: '60%', left: '72%', count: 1, seed: 'cluster5' },
]

type Filter = 'Friends Only' | 'Upcoming Events' | 'Active Nights'

export default function MapPage({ currentUser, onLogout }: Props) {
  const [activeFilters, setActiveFilters] = useState<Filter[]>(['Friends Only'])
  const [showCreate, setShowCreate] = useState(false)

  const toggleFilter = (f: Filter) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowCreate(true)} onLogout={onLogout} />

      <main className="app-content" style={{ padding: 0 }}>
        <div className="map-layout" style={{ height: '100vh' }}>
          {/* Left panel */}
          <div className="map-panel">
            <div className="map-panel-section">
              <div className="page-title" style={{ marginBottom: 4 }}>Live Map</div>
              <div className="page-subtitle">See where your friends are tonight</div>
            </div>

            <div className="map-panel-section">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>▽</span> Filters
              </div>
              {(['Friends Only', 'Upcoming Events', 'Active Nights'] as Filter[]).map(f => (
                <button
                  key={f}
                  className={`filter-btn ${activeFilters.includes(f) ? '' : 'off'}`}
                  onClick={() => toggleFilter(f)}
                >
                  {f}
                  <span style={{ fontSize: 16 }}>
                    {f === 'Friends Only' ? '👥' : f === 'Upcoming Events' ? '📍' : '🕐'}
                  </span>
                </button>
              ))}
            </div>

            <div className="map-panel-section" style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Recent Activity</div>
              {ACTIVITY.map(a => (
                <div key={a.id} className="activity-item">
                  <img
                    src={`https://i.pravatar.cc/60?u=${a.seed}`}
                    alt=""
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map area */}
          <div className="map-area">
            <div className="map-grid" />

            {/* Photo clusters */}
            {CLUSTERS.map((c, i) => (
              <div key={i} className="map-cluster" style={{ top: c.top, left: c.left }}>
                <img
                  src={`https://picsum.photos/seed/${c.seed}/200/200`}
                  alt=""
                  className="map-cluster-img"
                />
                {c.count > 1 && <div className="map-cluster-badge">{c.count}</div>}
              </div>
            ))}

            {/* Legend */}
            <div className="map-legend">
              <div className="map-legend-item">
                <div className="map-legend-dot" style={{ background: 'var(--accent)' }} />
                Active Now
              </div>
              <div className="map-legend-item">
                <div className="map-legend-dot" style={{ background: 'var(--muted)' }} />
                Upcoming
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCreate && (
        <CreateNightModal currentUser={currentUser} onClose={() => setShowCreate(false)} onCreated={() => setShowCreate(false)} />
      )}
    </div>
  )
}
