import { Check, Search, UserPlus, X, Copy } from 'lucide-react'
import { useState } from 'react'
import type { User } from '../api/types'
import CreateNightModal from '../components/CreateNightModal'
import Sidebar from '../components/Sidebar'

interface Props { currentUser: User; onLogout: () => void }

interface FriendEntry {
  id: number
  name: string
  handle: string
  active: boolean
  seed: string
}

const GROUPS = [
  { name: 'Friday Night Crew', members: 12, seed: 'group1' },
  { name: 'Summer Squad', members: 8, seed: 'group2' },
  { name: 'Downtown Regulars', members: 15, seed: 'group3' },
]
const INITIAL_REQUESTS = [
  { id: 1, name: 'Jessica Martinez', handle: 'jessicam', mutual: 12, seed: 'jessica1' },
  { id: 2, name: 'David Kim', handle: 'davidkim', mutual: 8, seed: 'david2' },
]
const INITIAL_SUGGESTED = [
  { id: 10, name: 'Alex Chen', handle: 'alexchen', mutual: 5, seed: 'alex10' },
  { id: 11, name: 'Mia Santos', handle: 'miasantos', mutual: 3, seed: 'mia11' },
  { id: 12, name: 'Omar Hassan', handle: 'omarh', mutual: 7, seed: 'omar12' },
]
const INITIAL_FRIENDS: FriendEntry[] = [
  { id: 20, name: 'Sarah Chen', handle: 'sarahchen', active: true, seed: 'sarah20' },
  { id: 21, name: 'Mike Torres', handle: 'mikestones', active: true, seed: 'mike21' },
  { id: 22, name: 'Emma Wilson', handle: 'emmaw', active: false, seed: 'emma22' },
  { id: 23, name: 'Jake Park', handle: 'jakep', active: false, seed: 'jake23' },
]

export default function FriendsPage({ currentUser, onLogout }: Props) {
  const [tab, setTab] = useState<'All Friends' | 'Active' | 'Groups'>('All Friends')
  const [search, setSearch] = useState('')
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [suggested, setSuggested] = useState(INITIAL_SUGGESTED)
  const [friends, setFriends] = useState<FriendEntry[]>(INITIAL_FRIENDS)
  const [addedIds, setAddedIds] = useState<number[]>([])
  const [toast, setToast] = useState('')
  const [showNight, setShowNight] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleAccept = (id: number) => {
    const req = requests.find(r => r.id === id)
    if (!req) return
    setFriends(prev => [...prev, { id: req.id, name: req.name, handle: req.handle, active: true, seed: req.seed }])
    setRequests(prev => prev.filter(r => r.id !== id))
    showToast(`${req.name} added to friends`)
  }

  const handleDismiss = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const handleAdd = (id: number) => {
    const s = suggested.find(x => x.id === id)
    if (!s) return
    setFriends(prev => [...prev, { id: s.id, name: s.name, handle: s.handle, active: false, seed: s.seed }])
    setAddedIds(prev => [...prev, id])
    showToast(`${s.name} added to friends`)
    setTimeout(() => {
      setSuggested(prev => prev.filter(x => x.id !== id))
      setAddedIds(prev => prev.filter(x => x !== id))
    }, 1200)
  }

  const handleInvite = () => {
    const link = `${window.location.origin}/join?ref=${currentUser.username}`
    navigator.clipboard.writeText(link).then(() => {
      showToast('Invite link copied to clipboard!')
    }).catch(() => {
      showToast(`Share: ${link}`)
    })
  }

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowNight(true)} onLogout={onLogout} />

      <main className="app-content">
        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            background: 'var(--accent)', color: '#fff',
            padding: '10px 18px', borderRadius: 10, fontWeight: 600,
            fontSize: 13, boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'fadeIn .2s ease',
          }}>
            <Check size={14} /> {toast}
          </div>
        )}

        <div className="page-header">
          <div>
            <div className="page-title">Friends</div>
            <div className="page-subtitle">Your party crew</div>
          </div>
          <button className="btn-primary" onClick={handleInvite}>
            <Copy size={15} /> Invite Friends
          </button>
        </div>

        <div className="friends-layout">
          {/* Search */}
          <div className="search-bar">
            <Search size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
            <input
              className="search-input"
              placeholder="Search friends..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Your Groups */}
          <div>
            <div className="section-header">
              <span className="section-title">Your Groups</span>
            </div>
            <div className="groups-grid">
              {GROUPS.map(g => (
                <div key={g.name} className="group-card">
                  <img src={`https://picsum.photos/seed/${g.seed}/400/300`} alt={g.name} className="group-card-img" />
                  <div className="group-card-info">
                    <div className="group-card-name">{g.name}</div>
                    <div className="group-card-members">👥 {g.members} members</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-row">
            {(['All Friends', 'Active', 'Groups'] as const).map(t => (
              <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
            ))}
          </div>

          {/* Friend Requests */}
          {tab === 'All Friends' && requests.length > 0 && (
            <div>
              <div className="section-header">
                <span className="section-title">Friend Requests ({requests.length})</span>
              </div>
              <div className="friend-request-grid">
                {requests.map(r => (
                  <div key={r.id} className="friend-request-card">
                    <div className="friend-req-info">
                      <img
                        src={`https://i.pravatar.cc/80?u=${r.seed}`}
                        alt={r.name}
                        style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="friend-req-name">{r.name}</div>
                        <div className="friend-req-handle">@{r.handle}</div>
                        <div className="friend-req-mutual">{r.mutual} mutual friends</div>
                      </div>
                    </div>
                    <div className="friend-req-actions">
                      <button className="btn-accept" onClick={() => handleAccept(r.id)}>
                        <Check size={13} /> Accept
                      </button>
                      <button className="btn-dismiss" onClick={() => handleDismiss(r.id)}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested */}
          {tab === 'All Friends' && suggested.length > 0 && (
            <div>
              <div className="section-header">
                <span className="section-title">Suggested Friends</span>
              </div>
              <div className="friend-request-grid">
                {suggested.map(s => (
                  <div key={s.id} className="friend-request-card">
                    <div className="friend-req-info">
                      <img
                        src={`https://i.pravatar.cc/80?u=${s.seed}`}
                        alt={s.name}
                        style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="friend-req-name">{s.name}</div>
                        <div className="friend-req-handle">@{s.handle}</div>
                        <div className="friend-req-mutual">{s.mutual} mutual friends</div>
                      </div>
                    </div>
                    <div className="friend-req-actions">
                      <button
                        className="btn-accept"
                        onClick={() => handleAdd(s.id)}
                        disabled={addedIds.includes(s.id)}
                        style={addedIds.includes(s.id) ? { opacity: 0.6 } : {}}
                      >
                        {addedIds.includes(s.id)
                          ? <><Check size={13} /> Added</>
                          : <><UserPlus size={13} /> Add</>
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends list */}
          {(tab === 'All Friends' || tab === 'Active') && (
            <div>
              <div className="section-header">
                <span className="section-title">
                  {tab === 'Active' ? 'Active Now' : `All Friends (${friends.length})`}
                </span>
              </div>
              <div className="friends-list">
                {friends
                  .filter(f => tab === 'Active' ? f.active : true)
                  .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.handle.toLowerCase().includes(search.toLowerCase()))
                  .map(f => (
                    <div key={f.id} className="friend-list-item">
                      <img
                        src={`https://i.pravatar.cc/80?u=${f.seed}`}
                        alt={f.name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{f.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>@{f.handle}</div>
                      </div>
                      {f.active && <span className="friend-status">● Active now</span>}
                    </div>
                  ))}
                {friends.filter(f => tab === 'Active' ? f.active : true).filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.handle.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                  <div style={{ color: 'var(--muted)', fontSize: 13, padding: '20px 0' }}>No friends found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {showNight && (
        <CreateNightModal currentUser={currentUser} onClose={() => setShowNight(false)} onCreated={() => setShowNight(false)} />
      )}
    </div>
  )
}
