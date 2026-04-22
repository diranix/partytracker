import {
  Check, Search, UserPlus, X, MessageCircle, Eye,
  Users, Zap, MapPin, MoreHorizontal, UserMinus, Copy,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../api/types'
import CreateNightModal from '../components/CreateNightModal'
import Sidebar from '../components/Sidebar'

interface Props { currentUser: User; onLogout: () => void }

type Tab = 'All' | 'Online' | 'Requests' | 'Suggested'

interface Friend {
  id: number; name: string; handle: string; active: boolean; seed: string
  mutual: number; lastParty: string; location: string
}

const INITIAL_REQUESTS = [
  { id: 1, name: 'Jessica Martinez', handle: 'jessicam', mutual: 12, seed: 'jessica1' },
  { id: 2, name: 'David Kim', handle: 'davidkim', mutual: 8, seed: 'david2' },
]
const INITIAL_SUGGESTED = [
  { id: 10, name: 'Alex Chen', handle: 'alexchen', mutual: 5, seed: 'alex10', location: 'Copenhagen' },
  { id: 11, name: 'Mia Santos', handle: 'miasantos', mutual: 3, seed: 'mia11', location: 'Aarhus' },
  { id: 12, name: 'Omar Hassan', handle: 'omarh', mutual: 7, seed: 'omar12', location: 'Odense' },
  { id: 13, name: 'Luna Park', handle: 'lunapark', mutual: 2, seed: 'luna13', location: 'Copenhagen' },
]
const INITIAL_FRIENDS: Friend[] = [
  { id: 20, name: 'Sarah Chen', handle: 'sarahchen', active: true, seed: 'sarah20', mutual: 6, lastParty: 'Friday at Hive Bar', location: 'Copenhagen' },
  { id: 21, name: 'Mike Torres', handle: 'mikestones', active: true, seed: 'mike21', mutual: 4, lastParty: 'Yesterday at Club Vault', location: 'Downtown' },
  { id: 22, name: 'Emma Wilson', handle: 'emmaw', active: false, seed: 'emma22', mutual: 9, lastParty: '3 days ago', location: 'Frederiksberg' },
  { id: 23, name: 'Jake Park', handle: 'jakep', active: false, seed: 'jake23', mutual: 3, lastParty: 'Last week', location: 'Nørrebro' },
  { id: 24, name: 'Zoe Larsen', handle: 'zoelarsen', active: true, seed: 'zoe24', mutual: 8, lastParty: 'Tonight at Roskilde', location: 'Roskilde' },
  { id: 25, name: 'Liam Beck', handle: 'liambeck', active: false, seed: 'liam25', mutual: 1, lastParty: '2 weeks ago', location: 'Hellerup' },
]

function SkeletonCard() {
  return (
    <div className="friend-card skeleton-card">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div className="skeleton-circle" style={{ width: 48, height: 48, borderRadius: '50%' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton-line" style={{ width: '60%', height: 13 }} />
          <div className="skeleton-line" style={{ width: '40%', height: 11 }} />
        </div>
      </div>
      <div className="skeleton-line" style={{ width: '80%', height: 11, marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton-line" style={{ flex: 1, height: 32, borderRadius: 8 }} />
        <div className="skeleton-line" style={{ flex: 1, height: 32, borderRadius: 8 }} />
      </div>
    </div>
  )
}

export default function FriendsPage({ currentUser, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('All')
  const [search, setSearch] = useState('')
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [suggested, setSuggested] = useState(INITIAL_SUGGESTED)
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS)
  const [addedIds, setAddedIds] = useState<number[]>([])
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [showNight, setShowNight] = useState(false)
  const navigate = useNavigate()

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const onlineCount = friends.filter(f => f.active).length

  const handleAccept = (id: number) => {
    const req = requests.find(r => r.id === id)
    if (!req) return
    setFriends(prev => [...prev, {
      id: req.id, name: req.name, handle: req.handle, active: true,
      seed: req.seed, mutual: req.mutual, lastParty: 'Just joined', location: 'Unknown',
    }])
    setRequests(prev => prev.filter(r => r.id !== id))
    showToast(`✓ ${req.name} added to your crew`)
  }

  const handleDecline = (id: number) => {
    const req = requests.find(r => r.id === id)
    setRequests(prev => prev.filter(r => r.id !== id))
    if (req) showToast(`Request from ${req.name} declined`)
  }

  const handleAdd = (id: number) => {
    const s = suggested.find(x => x.id === id)
    if (!s) return
    setAddedIds(prev => [...prev, id])
    showToast(`Request sent to ${s.name}`)
    setTimeout(() => {
      setSuggested(prev => prev.filter(x => x.id !== id))
      setAddedIds(prev => prev.filter(x => x !== id))
    }, 1400)
  }

  const handleRemove = (id: number) => {
    const f = friends.find(x => x.id === id)
    setFriends(prev => prev.filter(x => x.id !== id))
    setOpenMenuId(null)
    if (f) showToast(`${f.name} removed from friends`)
  }

  const handleInvite = () => {
    const link = `${window.location.origin}/join?ref=${currentUser.username}`
    navigator.clipboard.writeText(link)
      .then(() => showToast('📋 Invite link copied!'))
      .catch(() => showToast(`Share: ${link}`))
  }

  const filtered = friends
    .filter(f => tab === 'Online' ? f.active : true)
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.handle.toLowerCase().includes(search.toLowerCase()))

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'All', label: 'All Friends', count: friends.length },
    { key: 'Online', label: 'Online', count: onlineCount },
    { key: 'Requests', label: 'Requests', count: requests.length },
    { key: 'Suggested', label: 'Suggested' },
  ]

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowNight(true)} onLogout={onLogout} />

      <main className="app-content" onClick={() => setOpenMenuId(null)}>
        {/* Toast */}
        {toast && (
          <div className="friends-toast fade-in">
            <Check size={13} /> {toast}
          </div>
        )}

        {/* Page header */}
        <div className="page-header">
          <div>
            <div className="page-title">Friends</div>
            <div className="page-subtitle">
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{friends.length}</span> friends ·{' '}
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>{onlineCount} online now</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={handleInvite}>
              <Copy size={14} /> Find People
            </button>
            <button className="btn-primary" onClick={() => setTab('Suggested')}>
              <UserPlus size={14} /> Add Friend
            </button>
          </div>
        </div>

        <div className="friends-page-wrap">
          {/* Main column */}
          <div className="friends-main">

            {/* Search */}
            <div className="friends-search-row">
              <div className="search-bar" style={{ flex: 1 }}>
                <Search size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                <input
                  className="search-input"
                  placeholder="Search by name or @handle..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ color: 'var(--muted)', lineHeight: 0 }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-row">
              {TABS.map(t => (
                <div
                  key={t.key}
                  className={`tab ${tab === t.key ? 'active' : ''}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                  {t.count !== undefined && t.count > 0 && (
                    <span className={`tab-badge ${tab === t.key ? 'tab-badge-active' : ''}`}>{t.count}</span>
                  )}
                </div>
              ))}
            </div>

            {/* ── ALL / ONLINE tab ── */}
            {(tab === 'All' || tab === 'Online') && (
              <>
                {loading ? (
                  <div className="friend-cards-grid">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="friends-empty">
                    <div style={{ fontSize: 44, marginBottom: 12 }}>
                      {tab === 'Online' ? '🌙' : '👥'}
                    </div>
                    <div className="friends-empty-title">
                      {tab === 'Online' ? 'No one online right now' : 'No friends found'}
                    </div>
                    <div className="friends-empty-sub">
                      {tab === 'Online'
                        ? 'Your crew is resting. Check back tonight.'
                        : search ? `No results for "${search}"` : 'Start adding people to see their party activity here.'}
                    </div>
                    {!search && (
                      <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setTab('Suggested')}>
                        <UserPlus size={14} /> Find People
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="friend-cards-grid">
                    {filtered.map(f => (
                      <div key={f.id} className="friend-card" style={{ position: 'relative' }}>
                        {/* Avatar + online dot */}
                        <div style={{ position: 'relative', width: 48, flexShrink: 0 }}>
                          <img
                            src={`https://i.pravatar.cc/96?u=${f.seed}`}
                            alt={f.name}
                            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                          />
                          {f.active && <span className="friend-card-online-dot" />}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="friend-card-name">{f.name}</span>
                            {f.active && <span className="friend-card-online-badge">● Online</span>}
                          </div>
                          <div className="friend-card-handle">@{f.handle}</div>
                          <div className="friend-card-meta">
                            <MapPin size={10} /> {f.location}
                            <span style={{ margin: '0 4px', color: 'var(--muted2)' }}>·</span>
                            <Users size={10} /> {f.mutual} mutual
                          </div>
                          <div className="friend-card-last">
                            🎉 {f.lastParty}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="friend-card-actions">
                          <button className="friend-card-btn-ghost" title="Message" onClick={() => navigate(`/messages?user=${f.handle}`)}>
                            <MessageCircle size={14} />
                          </button>
                          <button className="friend-card-btn-ghost" title="View profile">
                            <Eye size={14} />
                          </button>
                          <button
                            className="friend-card-btn-ghost"
                            title="More"
                            onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === f.id ? null : f.id) }}
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          {openMenuId === f.id && (
                            <div className="friend-dropdown" onClick={e => e.stopPropagation()}>
                              <button className="friend-dropdown-item danger" onClick={() => handleRemove(f.id)}>
                                <UserMinus size={13} /> Remove friend
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── REQUESTS tab ── */}
            {tab === 'Requests' && (
              <>
                {requests.length === 0 ? (
                  <div className="friends-empty">
                    <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                    <div className="friends-empty-title">You're all caught up</div>
                    <div className="friends-empty-sub">No pending friend requests right now.</div>
                  </div>
                ) : (
                  <div className="friend-request-grid">
                    {requests.map(r => (
                      <div key={r.id} className="friend-request-card slide-up">
                        <div className="friend-req-info">
                          <div style={{ position: 'relative' }}>
                            <img
                              src={`https://i.pravatar.cc/80?u=${r.seed}`}
                              alt={r.name}
                              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                            />
                            <span className="friend-card-online-dot" />
                          </div>
                          <div>
                            <div className="friend-req-name">{r.name}</div>
                            <div className="friend-req-handle">@{r.handle}</div>
                            <div className="friend-req-mutual">👥 {r.mutual} mutual friends</div>
                          </div>
                        </div>
                        <div className="friend-req-actions">
                          <button className="btn-accept" onClick={() => handleAccept(r.id)}>
                            <Check size={13} /> Accept
                          </button>
                          <button className="btn-dismiss" onClick={() => handleDecline(r.id)}>
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── SUGGESTED tab ── */}
            {tab === 'Suggested' && (
              <>
                <div className="friends-microcopy">
                  People you may know from the party scene 🎶
                </div>
                {suggested.length === 0 ? (
                  <div className="friends-empty">
                    <div style={{ fontSize: 44, marginBottom: 12 }}>✨</div>
                    <div className="friends-empty-title">You know everyone here!</div>
                    <div className="friends-empty-sub">Check back later for new suggestions.</div>
                  </div>
                ) : (
                  <div className="friend-request-grid">
                    {suggested.map(s => (
                      <div key={s.id} className="friend-request-card slide-up">
                        <div className="friend-req-info">
                          <img
                            src={`https://i.pravatar.cc/80?u=${s.seed}`}
                            alt={s.name}
                            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="friend-req-name">{s.name}</div>
                            <div className="friend-req-handle">@{s.handle}</div>
                            <div className="friend-req-mutual">
                              👥 {s.mutual} mutual · <MapPin size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {s.location}
                            </div>
                          </div>
                        </div>
                        <div className="friend-req-actions">
                          <button
                            className="btn-accept"
                            onClick={() => handleAdd(s.id)}
                            disabled={addedIds.includes(s.id)}
                            style={addedIds.includes(s.id) ? { opacity: 0.65 } : {}}
                          >
                            {addedIds.includes(s.id)
                              ? <><Check size={13} /> Sent!</>
                              : <><UserPlus size={13} /> Add</>}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <aside className="friends-sidebar">
            {/* Party Circle */}
            <div className="party-circle-card">
              <div className="party-circle-title">
                <Zap size={15} style={{ color: '#fb923c' }} /> Your party circle
              </div>
              <div className="party-circle-sub">See who's ready for tonight</div>
              <div className="party-circle-stats">
                <div className="party-circle-stat">
                  <span className="party-circle-num">{onlineCount}</span>
                  <span className="party-circle-label">online now</span>
                </div>
                <div className="party-circle-divider" />
                <div className="party-circle-stat">
                  <span className="party-circle-num">3</span>
                  <span className="party-circle-label">going out this week</span>
                </div>
                <div className="party-circle-divider" />
                <div className="party-circle-stat">
                  <span className="party-circle-num">2</span>
                  <span className="party-circle-label">posted yesterday</span>
                </div>
              </div>
              <div className="party-circle-avatars">
                {friends.filter(f => f.active).slice(0, 5).map(f => (
                  <img
                    key={f.id}
                    src={`https://i.pravatar.cc/48?u=${f.seed}`}
                    alt={f.name}
                    className="party-circle-avatar"
                    title={f.name}
                  />
                ))}
                {onlineCount > 5 && (
                  <div className="party-circle-avatar party-circle-more">+{onlineCount - 5}</div>
                )}
              </div>
            </div>

            {/* Requests mini-widget */}
            {requests.length > 0 && (
              <div className="friends-widget">
                <div className="friends-widget-title">
                  Pending requests
                  <span className="friends-widget-badge">{requests.length}</span>
                </div>
                {requests.map(r => (
                  <div key={r.id} className="friends-widget-row">
                    <img
                      src={`https://i.pravatar.cc/48?u=${r.seed}`}
                      alt={r.name}
                      style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.mutual} mutual</div>
                    </div>
                    <button className="btn-accept" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => handleAccept(r.id)}>
                      <Check size={11} /> Accept
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Microcopy */}
            <div className="friends-vibe-card">
              <div style={{ fontSize: 22, marginBottom: 8 }}>🌙</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Add friends to unlock</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                your private party map and see where your crew is heading tonight.
              </div>
              <button className="btn-primary" style={{ marginTop: 14, width: '100%', justifyContent: 'center' }} onClick={handleInvite}>
                <Copy size={13} /> Copy invite link
              </button>
            </div>
          </aside>
        </div>
      </main>

      {showNight && (
        <CreateNightModal currentUser={currentUser} onClose={() => setShowNight(false)} onCreated={() => setShowNight(false)} />
      )}
    </div>
  )
}
