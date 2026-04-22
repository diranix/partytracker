import { MessageCircle, Search, Send, X, Phone, Video, MoreHorizontal } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { User } from '../api/types'
import CreateNightModal from '../components/CreateNightModal'
import Sidebar from '../components/Sidebar'

interface Props { currentUser: User; onLogout: () => void }

interface Message {
  id: number
  from: 'me' | 'them'
  text: string
  time: string
}

interface Conversation {
  id: number
  name: string
  handle: string
  seed: string
  active: boolean
  unread: number
  messages: Message[]
}

const now = () => {
  const d = new Date()
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

const INITIAL_CONVS: Conversation[] = [
  {
    id: 1, name: 'Sarah Chen', handle: 'sarahchen', seed: 'sarah20', active: true, unread: 2,
    messages: [
      { id: 1, from: 'them', text: 'Hey! You coming tonight? 🎉', time: '9:41 PM' },
      { id: 2, from: 'me', text: 'Yeah definitely! What time?', time: '9:43 PM' },
      { id: 3, from: 'them', text: 'Doors open at 11, pregame at mine at 9?', time: '9:44 PM' },
      { id: 4, from: 'them', text: 'Mike and Emma are coming too 🔥', time: '9:44 PM' },
    ],
  },
  {
    id: 2, name: 'Mike Torres', handle: 'mikestones', seed: 'mike21', active: true, unread: 1,
    messages: [
      { id: 1, from: 'them', text: 'That set last night was absolutely insane 🔥', time: '8:20 PM' },
      { id: 2, from: 'me', text: 'Bro I know, felt like the walls were shaking', time: '8:22 PM' },
      { id: 3, from: 'them', text: 'When is the next one?', time: '8:23 PM' },
    ],
  },
  {
    id: 3, name: 'Emma Wilson', handle: 'emmaw', seed: 'emma22', active: false, unread: 0,
    messages: [
      { id: 1, from: 'me', text: 'Did you see the photos from Friday?', time: 'Fri' },
      { id: 2, from: 'them', text: 'omg yes send them to me pleaseee', time: 'Fri' },
      { id: 3, from: 'me', text: 'Sending now 📸', time: 'Fri' },
      { id: 4, from: 'them', text: '😍😍😍 these are so good', time: 'Fri' },
    ],
  },
  {
    id: 4, name: 'Jake Park', handle: 'jakep', seed: 'jake23', active: false, unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'You hear about the rooftop event Saturday?', time: 'Thu' },
      { id: 2, from: 'me', text: 'No what?? Tell me more', time: 'Thu' },
      { id: 3, from: 'them', text: 'Secret location. Tickets go fast', time: 'Thu' },
    ],
  },
  {
    id: 5, name: 'Zoe Larsen', handle: 'zoelarsen', seed: 'zoe24', active: true, unread: 0,
    messages: [
      { id: 1, from: 'them', text: '🎶', time: 'Wed' },
      { id: 2, from: 'me', text: '🌙', time: 'Wed' },
    ],
  },
]

export default function MessagesPage({ currentUser, onLogout }: Props) {
  const [searchParams] = useSearchParams()
  const [convs, setConvs] = useState<Conversation[]>(INITIAL_CONVS)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Open conversation by ?user=handle from FriendsPage message button
  useEffect(() => {
    const handle = searchParams.get('user')
    if (!handle) return
    const found = convs.find(c => c.handle === handle || c.name.toLowerCase().replace(/\s+/g, '') === handle.toLowerCase())
    if (found) {
      setActiveId(found.id)
      setConvs(prev => prev.map(c => c.id === found.id ? { ...c, unread: 0 } : c))
    } else {
      // Create a new conversation for this friend
      const newConv: Conversation = {
        id: Date.now(),
        name: handle.charAt(0).toUpperCase() + handle.slice(1),
        handle,
        seed: handle,
        active: true,
        unread: 0,
        messages: [],
      }
      setConvs(prev => [newConv, ...prev])
      setActiveId(newConv.id)
    }
  }, [searchParams])

  const activeConv = convs.find(c => c.id === activeId) ?? null

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages.length])

  const openConv = (id: number) => {
    setActiveId(id)
    // Mark as read
    setConvs(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text || !activeId) return
    setInput('')
    const newMsg: Message = { id: Date.now(), from: 'me', text, time: now() }
    setConvs(prev => prev.map(c =>
      c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c
    ))
    // Simulate reply after a bit
    const replies = [
      'haha yes!! 🔥', 'omg same', 'let\'s goooo 🎉', 'sounds good!',
      '😂😂', 'wait really?', 'bro 💀', '🤝', 'yesss', '❤️',
    ]
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        from: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: now(),
      }
      setConvs(prev => prev.map(c =>
        c.id === activeId ? { ...c, messages: [...c.messages, reply] } : c
      ))
    }, 800 + Math.random() * 1200)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const filtered = convs.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase())
  )
  const totalUnread = convs.reduce((s, c) => s + c.unread, 0)

  const lastMessage = (c: Conversation) => c.messages[c.messages.length - 1]

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowCreate(true)} onLogout={onLogout} />

      <main className="app-content" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div className="messages-layout">
          {/* ── Left: conversation list ── */}
          <div className="messages-sidebar">
            <div className="messages-sidebar-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="page-title" style={{ fontSize: 18 }}>Messages</span>
                {totalUnread > 0 && (
                  <span className="friends-widget-badge">{totalUnread}</span>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="messages-search">
              <Search size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input
                className="search-input"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ color: 'var(--muted)', lineHeight: 0 }}>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Conversation list */}
            <div className="conv-list">
              {filtered.map(c => {
                const last = lastMessage(c)
                return (
                  <div
                    key={c.id}
                    className={`conv-item ${activeId === c.id ? 'active' : ''}`}
                    onClick={() => openConv(c.id)}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={`https://i.pravatar.cc/48?u=${c.seed}`}
                        alt={c.name}
                        className="conv-avatar"
                      />
                      {c.active && <span className="friend-online" />}
                    </div>
                    <div className="conv-info">
                      <div className="conv-name-row">
                        <span className="conv-name">{c.name}</span>
                        <span className="conv-time">{last?.time ?? ''}</span>
                      </div>
                      <div className="conv-preview-row">
                        <span className={`conv-preview ${c.unread > 0 ? 'unread' : ''}`}>
                          {last ? (last.from === 'me' ? `You: ${last.text}` : last.text) : ''}
                        </span>
                        {c.unread > 0 && <span className="conv-unread">{c.unread}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  No conversations found
                </div>
              )}
            </div>
          </div>

          {/* ── Right: chat window ── */}
          <div className="messages-main">
            {activeConv ? (
              <>
                {/* Chat header */}
                <div className="chat-header">
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={`https://i.pravatar.cc/48?u=${activeConv.seed}`}
                      alt={activeConv.name}
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    {activeConv.active && <span className="friend-online" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{activeConv.name}</div>
                    <div style={{ fontSize: 12, color: activeConv.active ? 'var(--green)' : 'var(--muted)' }}>
                      {activeConv.active ? '● Online now' : 'Offline'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="chat-icon-btn"><Phone size={15} /></button>
                    <button className="chat-icon-btn"><Video size={15} /></button>
                    <button className="chat-icon-btn"><MoreHorizontal size={15} /></button>
                  </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                  {activeConv.messages.map(m => (
                    <div key={m.id} className={`chat-bubble-wrap ${m.from === 'me' ? 'mine' : 'theirs'}`}>
                      {m.from === 'them' && (
                        <img
                          src={`https://i.pravatar.cc/32?u=${activeConv.seed}`}
                          alt=""
                          className="chat-bubble-avatar"
                        />
                      )}
                      <div className={`chat-bubble ${m.from === 'me' ? 'mine' : 'theirs'}`}>
                        {m.text}
                        <span className="chat-time">{m.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chat-input-row">
                  <input
                    className="chat-input"
                    placeholder={`Message ${activeConv.name.split(' ')[0]}...`}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                  />
                  <button
                    className="chat-send-btn"
                    onClick={sendMessage}
                    disabled={!input.trim()}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="chat-empty">
                <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Your Messages</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 260, textAlign: 'center' }}>
                  Select a conversation from the left to start chatting with your crew
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showCreate && (
        <CreateNightModal currentUser={currentUser} onClose={() => setShowCreate(false)} onCreated={() => setShowCreate(false)} />
      )}
    </div>
  )
}
