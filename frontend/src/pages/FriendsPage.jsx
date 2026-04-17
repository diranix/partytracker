import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const REQUESTS = [
  { id: 1, name: 'Taylor R.', mutual: 3 },
  { id: 2, name: 'Jordan K.', mutual: 7 },
]

const SUGGESTIONS = [
  { id: 1, name: 'Mia S.', nights: 12, mutual: 4 },
  { id: 2, name: 'Alex P.', nights: 8, mutual: 2 },
  { id: 3, name: 'Zoe W.', nights: 21, mutual: 6 },
  { id: 4, name: 'Leo D.', nights: 5, mutual: 1 },
  { id: 5, name: 'Nina B.', nights: 15, mutual: 9 },
  { id: 6, name: 'Kai M.', nights: 3, mutual: 2 },
]

const ALL_FRIENDS = [
  { id: 1, name: 'Sam T.', nights: 18, online: true },
  { id: 2, name: 'Dan K.', nights: 11, online: false },
  { id: 3, name: 'Lara M.', nights: 7, online: true },
  { id: 4, name: 'Chris V.', nights: 24, online: true },
]

export default function FriendsPage({ currentUser, onLogout }) {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [added, setAdded] = useState(new Set())

  const filtered = SUGGESTIONS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="app-content">
        <div className="friends-layout">
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div className="section-title" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px' }}>Friends</div>
          </div>

          {/* Search */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search friends..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Friend Requests */}
          {REQUESTS.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div className="section-header">
                <div className="feed-section-title">Friend Requests</div>
                <span className="tag">{REQUESTS.length}</span>
              </div>
              {REQUESTS.map(r => (
                <div key={r.id} className="request-card">
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 16, flexShrink: 0 }}>
                    {r.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.mutual} mutual friends</div>
                  </div>
                  <button style={{ background: 'var(--accent)', color: '#fff', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13, marginRight: 8 }}>
                    Accept
                  </button>
                  <button style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13 }}>
                    Decline
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="profile-tabs" style={{ marginBottom: 20 }}>
            {['all', 'online', 'suggestions'].map(t => (
              <div key={t} className={`profile-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>

          {/* All Friends */}
          {tab === 'all' && (
            <div className="friends-grid">
              {ALL_FRIENDS.map(f => (
                <div key={f.id} className="friend-card">
                  <div className="friend-card-avatar">{f.name[0]}</div>
                  <div className="friend-card-name">{f.name}</div>
                  <div className="friend-card-meta">{f.nights} nights · {f.online ? '🟢 Online' : '⚫ Offline'}</div>
                  <div className="friend-card-actions">
                    <button className="friend-btn-add">Message</button>
                    <button className="friend-btn-remove">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Online */}
          {tab === 'online' && (
            <div className="friends-grid">
              {ALL_FRIENDS.filter(f => f.online).map(f => (
                <div key={f.id} className="friend-card">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div className="friend-card-avatar">{f.name[0]}</div>
                    <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, background: 'var(--green)', borderRadius: '50%', border: '2px solid var(--surface)' }} />
                  </div>
                  <div className="friend-card-name">{f.name}</div>
                  <div className="friend-card-meta">{f.nights} nights</div>
                  <div className="friend-card-actions">
                    <button className="friend-btn-add">Invite Out</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {tab === 'suggestions' && (
            <div className="friends-grid">
              {filtered.map(f => (
                <div key={f.id} className="friend-card">
                  <div className="friend-card-avatar">{f.name[0]}</div>
                  <div className="friend-card-name">{f.name}</div>
                  <div className="friend-card-meta">{f.nights} nights · {f.mutual} mutual</div>
                  <div className="friend-card-actions">
                    {added.has(f.id) ? (
                      <button className="friend-btn-add" style={{ background: 'var(--green)', cursor: 'default' }}>✓ Sent</button>
                    ) : (
                      <button className="friend-btn-add" onClick={() => setAdded(prev => new Set([...prev, f.id]))}>
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
