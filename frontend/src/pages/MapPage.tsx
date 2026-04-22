import { MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'
import CreateNightModal from '../components/CreateNightModal'
import Sidebar from '../components/Sidebar'

// Fix leaflet default marker icons broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom purple marker for party nights
const partyIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;border-radius:50% 50% 50% 0;
    background:linear-gradient(135deg,#7C3AED,#EC4899);
    transform:rotate(-45deg);
    border:3px solid #fff;
    box-shadow:0 4px 16px rgba(124,58,237,0.6);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
})

const myIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:42px;height:42px;border-radius:50%;
    background:linear-gradient(135deg,#10B981,#0ea5e9);
    border:3px solid #fff;
    box-shadow:0 4px 16px rgba(16,185,129,0.6);
    display:flex;align-items:center;justify-content:center;
    font-size:18px;
  ">🌙</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
})

interface Props { currentUser: User; onLogout: () => void }

type Filter = 'All' | 'Friends' | 'Tonight'

const ACTIVITY = [
  { id: 1, name: 'Sarah', action: 'checked in at The Rooftop Bar', time: '2 min ago', seed: 'sarah1' },
  { id: 2, name: 'Mike', action: 'joined Club Vault', time: '15 min ago', seed: 'mike2' },
  { id: 3, name: 'Emma', action: 'posted from Nørrebro', time: '28 min ago', seed: 'emma3' },
  { id: 4, name: 'Jake', action: 'is heading to Club 44', time: '42 min ago', seed: 'jake4' },
]

// Пересчитываем размер карты когда контейнер становится виден
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

export default function MapPage({ currentUser, onLogout }: Props) {
  const [nights, setNights] = useState<Night[]>([])
  const [filter, setFilter] = useState<Filter>('All')
  const [showCreate, setShowCreate] = useState(false)
  const [selectedNight, setSelectedNight] = useState<Night | null>(null)

  useEffect(() => {
    apiFetch<Night[]>('/nights/').then(data => {
      setNights(data.filter(n => n.lat && n.lng))
    }).catch(() => {})
  }, [])

  const filtered = nights.filter(n => {
    if (filter === 'Tonight') {
      const d = new Date(n.created_at)
      const today = new Date()
      return d.toDateString() === today.toDateString()
    }
    return true
  })

  const nightsWithCoords = filtered.length
  // Default center: Copenhagen (or first night with coords)
  const center: [number, number] = filtered[0]
    ? [filtered[0].lat!, filtered[0].lng!]
    : [55.6761, 12.5683]

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const MOODS: Record<string, string> = {
    euphoric: '🔥', chill: '😌', happy: '😊', intense: '⚡',
    wild: '🌪️', tired: '😴', vibes: '✨', intimate: '🕯️',
  }

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowCreate(true)} onLogout={onLogout} />

      <main className="app-content" style={{ padding: 0 }}>
        <div className="map-layout" style={{ height: '100vh' }}>

          {/* ── Left panel ── */}
          <div className="map-panel">
            <div className="map-panel-section">
              <div className="page-title" style={{ marginBottom: 4 }}>Live Map</div>
              <div className="page-subtitle">
                {nightsWithCoords > 0
                  ? `${nightsWithCoords} night${nightsWithCoords !== 1 ? 's' : ''} pinned on the map`
                  : 'Post a night with a location to appear here'}
              </div>
            </div>

            {/* Filters */}
            <div className="map-panel-section">
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Filter
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(['All', 'Friends', 'Tonight'] as Filter[]).map(f => (
                  <button
                    key={f}
                    className={`filter-btn ${filter !== f ? 'off' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'All' ? '🌍' : f === 'Friends' ? '👥' : '🕐'} {f}
                    {filter === f && <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.75 }}>active</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="map-panel-section">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent2)' }}>{nightsWithCoords}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>pinned</div>
                </div>
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)' }}>3</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>online</div>
                </div>
              </div>
            </div>

            {/* Nights list */}
            {filtered.length > 0 && (
              <div className="map-panel-section" style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Pinned Nights</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filtered.map(n => (
                    <div
                      key={n.id}
                      className={`map-night-item ${selectedNight?.id === n.id ? 'active' : ''}`}
                      onClick={() => setSelectedNight(n.id === selectedNight?.id ? null : n)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{MOODS[n.mood?.toLowerCase() ?? ''] ?? '🌙'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                            <MapPin size={9} /> {n.location ?? 'Unknown'}
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted2)', flexShrink: 0 }}>★{n.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity feed */}
            <div className="map-panel-section" style={{ flex: filtered.length > 0 ? 0 : 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Recent Activity</div>
              {ACTIVITY.map(a => (
                <div key={a.id} className="activity-item">
                  <img
                    src={`https://i.pravatar.cc/60?u=${a.seed}`}
                    alt=""
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <div className="activity-text">
                      <strong>{a.name}</strong> {a.action}
                    </div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Map area ── */}
          <div className="map-area" style={{ position: 'relative' }}>
            <MapContainer
              center={center}
              zoom={12}
              style={{ width: '100%', height: '100%' }}
              zoomControl={true}
            >
              <MapResizer />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {filtered.map(n => (
                <Marker
                  key={n.id}
                  position={[n.lat!, n.lng!]}
                  icon={n.user_id === currentUser.id ? myIcon : partyIcon}
                  eventHandlers={{ click: () => setSelectedNight(n) }}
                >
                  <Popup className="map-popup">
                    <div style={{ minWidth: 180, fontFamily: 'inherit' }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                        {MOODS[n.mood?.toLowerCase() ?? ''] ?? '🌙'} {n.title}
                      </div>
                      {n.location && (
                        <div style={{ fontSize: 11, color: '#888', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                          📍 {n.location}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#aaa', marginBottom: 4 }}>
                        <span>⭐ {n.rating}/10</span>
                        <span>❤️ {n.like_count}</span>
                        <span>🍹 {n.drinks_count}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#888' }}>
                        by <strong>{n.user.username}</strong> · {formatDate(n.created_at)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Empty state overlay */}
            {filtered.length === 0 && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 1000,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(13,14,22,0.75)', pointerEvents: 'none',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>No nights on the map yet</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 260 }}>
                  Post a night and pick a location to pin it here
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="map-legend" style={{ zIndex: 1000 }}>
              <div className="map-legend-item">
                <div className="map-legend-dot" style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }} />
                Others' nights
              </div>
              <div className="map-legend-item">
                <div className="map-legend-dot" style={{ background: 'var(--green)' }} />
                Your nights
              </div>
            </div>

            {/* Add night shortcut */}
            <button
              className="map-add-btn"
              onClick={() => setShowCreate(true)}
              title="Pin a new night"
            >
              + Log Night
            </button>
          </div>
        </div>
      </main>

      {showCreate && (
        <CreateNightModal
          currentUser={currentUser}
          onClose={() => setShowCreate(false)}
          onCreated={n => {
            if (n.lat && n.lng) setNights(prev => [n, ...prev])
            setShowCreate(false)
          }}
        />
      )}
    </div>
  )
}
