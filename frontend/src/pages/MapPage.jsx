import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const FILTERS = ['All', 'Active Now', 'Friends', 'Tonight', 'This Week']

const LOCATIONS = [
  { id: 1, name: 'Club Vertex', info: 'Rooftop · 24 going', active: true, x: '45%', y: '35%' },
  { id: 2, name: 'Bar Neon', info: 'Lounge · 12 going', active: true, x: '65%', y: '55%' },
  { id: 3, name: 'The Local', info: 'Bar · 6 going', active: false, x: '30%', y: '60%' },
  { id: 4, name: 'Rooftop 22', info: 'Rooftop · 18 going', active: true, x: '70%', y: '30%' },
  { id: 5, name: 'Club Echo', info: 'Club · 31 going', active: true, x: '50%', y: '70%' },
]

export default function MapPage({ currentUser, onLogout }) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = LOCATIONS.filter(l => {
    if (filter === 'Active Now') return l.active
    return true
  })

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="app-content" style={{ padding: 0 }}>
        <div className="map-layout">
          {/* Left Panel */}
          <div className="map-sidebar">
            <div className="map-sidebar-header">
              <div className="map-sidebar-title">🗺️ Live Map</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {LOCATIONS.filter(l => l.active).length} active spots near you
              </div>
              <div className="map-filter-tags">
                {FILTERS.map(f => (
                  <button key={f} className={`map-filter-tag${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="map-sidebar-scroll">
              <div style={{ fontSize: 12, color: 'var(--muted2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
                Nearby Spots
              </div>
              {filtered.map(loc => (
                <div
                  key={loc.id}
                  className={`map-location-card${selected === loc.id ? ' active' : ''}`}
                  onClick={() => setSelected(loc.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div className="map-loc-name">{loc.name}</div>
                    {loc.active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />}
                  </div>
                  <div className="map-loc-info">{loc.info}</div>
                  {loc.active && (
                    <div className="map-loc-badge">
                      <span>🟢</span> Active now
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Map Area */}
          <div className="map-area">
            <div className="map-grid" />

            {/* Markers */}
            {filtered.map(loc => (
              <div
                key={loc.id}
                className="map-marker"
                style={{ left: loc.x, top: loc.y }}
                onClick={() => setSelected(loc.id)}
              >
                <div className="map-marker-dot" style={{ background: loc.active ? 'var(--accent)' : 'var(--muted2)' }} />
                <div className="map-marker-label" style={{ borderColor: selected === loc.id ? 'var(--accent)' : 'var(--border)' }}>
                  {loc.name}
                </div>
              </div>
            ))}

            {/* Center label */}
            <div className="map-placeholder" style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🗺️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Live Map</div>
              <div style={{ fontSize: 13 }}>Real map integration coming soon</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
