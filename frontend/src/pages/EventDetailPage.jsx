import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const MOCK_EVENT = {
  title: 'Rooftop Rave 2025',
  date: 'Saturday, April 19 · 10 PM',
  location: 'Club Vertex, Floor 12',
  description: 'The biggest rooftop party of the season. Come feel the energy under the stars with the best DJs in the city. Dress code: all black.',
  host: 'Mia K.',
  going: 24,
  maybe: 8,
  guests: ['Alex', 'Sam', 'Zoe', 'Dan', 'Leo', 'Nina', 'Kai', 'Lara'],
  vibe: 'Rooftop',
}

const MOCK_COMMENTS = [
  { user: 'Alex', text: 'Can\'t wait! This is going to be insane 🔥', time: '2h ago' },
  { user: 'Sam', text: 'Who else is coming early? Let\'s pregame 🍾', time: '1h ago' },
  { user: 'Zoe', text: 'Already got my outfit ready 👑', time: '30m ago' },
]

export default function EventDetailPage({ currentUser, onLogout }) {
  const navigate = useNavigate()
  const [rsvp, setRsvp] = useState(null)
  const [comment, setComment] = useState('')

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="app-content">
        <div className="event-layout">
          {/* Back */}
          <button onClick={() => navigate('/feed')} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 14, marginBottom: 20, fontWeight: 500 }}>
            ← Back to Feed
          </button>

          {/* Hero */}
          <div className="event-hero">
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0a2e, #0d0d1a)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div className="event-hero-gradient" />
            <div className="event-hero-content">
              <div className="event-hero-tag">🎉 {MOCK_EVENT.vibe}</div>
              <div className="event-hero-title">{MOCK_EVENT.title}</div>
              <div className="event-hero-info">
                <span>📅 {MOCK_EVENT.date}</span>
                <span>📍 {MOCK_EVENT.location}</span>
              </div>
            </div>
          </div>

          {/* RSVP Bar */}
          <div className="event-rsvp-bar">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {MOCK_EVENT.going} going · {MOCK_EVENT.maybe} maybe
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Hosted by {MOCK_EVENT.host}</div>
            </div>
            <button className={`rsvp-btn ${rsvp === 'going' ? 'rsvp-btn-primary' : 'rsvp-btn-secondary'}`} onClick={() => setRsvp('going')}>
              {rsvp === 'going' ? '✓ Going' : '🎉 Going'}
            </button>
            <button className={`rsvp-btn ${rsvp === 'maybe' ? 'rsvp-btn-primary' : 'rsvp-btn-secondary'}`} onClick={() => setRsvp('maybe')}>
              Maybe
            </button>
            <button className="rsvp-btn rsvp-btn-secondary">
              🔗 Share
            </button>
          </div>

          <div className="event-content">
            {/* Left */}
            <div>
              {/* About */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>About</div>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{MOCK_EVENT.description}</p>
              </div>

              {/* Comments */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Comments</div>
                {MOCK_COMMENTS.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', flexShrink: 0, fontSize: 13 }}>
                      {c.user[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{c.user}</span>
                        <span style={{ fontSize: 11, color: 'var(--muted2)' }}>{c.time}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{c.text}</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <input
                    className="form-input2"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                  <button style={{ background: 'var(--accent)', color: '#fff', padding: '0 20px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Guests */}
            <div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Guests ({MOCK_EVENT.guests.length})</div>
                {MOCK_EVENT.guests.map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < MOCK_EVENT.guests.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent)', fontSize: 14 }}>
                      {g[0]}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{g}</div>
                    <div style={{ marginLeft: 'auto' }}><span className="tag tag-green" style={{ fontSize: 11 }}>Going</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
