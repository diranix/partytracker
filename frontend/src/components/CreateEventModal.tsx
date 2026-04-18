import { ArrowLeft, Clock, MapPin, Users } from 'lucide-react'
import { useState } from 'react'

interface Props { onClose: () => void }

const VIBES = ['Chill', 'Party', 'Dancing', 'Drinks', 'Music', 'Food', 'Late Night', 'Casual']
const MOCK_FRIENDS = ['Sarah', 'Mike', 'Emma', 'Jake', 'Lisa', 'Tom']

export default function CreateEventModal({ onClose }: Props) {
  const [title, setTitle] = useState('Rooftop Summer Sessions')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [privacy, setPrivacy] = useState('Friends')
  const [maxGuests, setMaxGuests] = useState('')
  const [vibes, setVibes] = useState<string[]>(['Party'])
  const [invitedFriends, setInvitedFriends] = useState<string[]>([])

  const toggleVibe = (v: string) =>
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  const toggleFriend = (f: string) =>
    setInvitedFriends(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  return (
    <div className="modal-overlay fade-in" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-panel">
        {/* Left */}
        <div className="modal-left">
          <div className="modal-header">
            <button className="modal-back" onClick={onClose}><ArrowLeft size={16} /></button>
            <div>
              <div className="modal-title">New Event</div>
              <div className="modal-subtitle">Plan your next gathering</div>
            </div>
            <button className="modal-post-btn">Create Event</button>
          </div>

          <div className="modal-body">
            <div>
              <div className="form-label">Event Title</div>
              <input className="form-input2" placeholder="Rooftop Summer Sessions" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div>
              <div className="form-label">Description</div>
              <textarea className="form-textarea" placeholder="Tell people what to expect..." value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="form-row">
              <div>
                <div className="form-label">Date</div>
                <div style={{ position: 'relative' }}>
                  <input className="form-input2" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                </div>
              </div>
              <div>
                <div className="form-label">Time</div>
                <div style={{ position: 'relative' }}>
                  <Clock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
                  <input className="form-input2" type="time" style={{ paddingLeft: 32, colorScheme: 'dark' }} value={time} onChange={e => setTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <div className="form-label">Location</div>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
                <input className="form-input2" style={{ paddingLeft: 32 }} placeholder="Where's the event?" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div>
                <div className="form-label">Privacy</div>
                <select className="form-select" value={privacy} onChange={e => setPrivacy(e.target.value)}>
                  <option>Public</option>
                  <option>Friends</option>
                  <option>Close Friends</option>
                  <option>Private</option>
                </select>
              </div>
              <div>
                <div className="form-label">Max Guests</div>
                <div style={{ position: 'relative' }}>
                  <Users size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
                  <input className="form-input2" style={{ paddingLeft: 32 }} type="number" placeholder="No limit" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <div className="form-label">Vibe Tags</div>
              <div className="type-pills">
                {VIBES.map(v => (
                  <button key={v} type="button" className={`type-pill ${vibes.includes(v) ? 'active' : ''}`} onClick={() => toggleVibe(v)}>{v}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="form-label">Invite Friends ({invitedFriends.length} selected)</div>
              <div className="friends-tag-grid">
                {MOCK_FRIENDS.map(f => (
                  <button key={f} type="button" className={`friend-tag-btn ${invitedFriends.includes(f) ? 'active' : ''}`} onClick={() => toggleFriend(f)}>
                    <span style={{ fontSize: 11, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                      {f[0]}
                    </span>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — preview */}
        <div className="preview-panel">
          <div>
            <div className="preview-label">Live Preview</div>
            <div className="preview-sub">See how your event will appear</div>
          </div>
          <div className="preview-card">
            <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
              <img
                src="https://picsum.photos/seed/eventpreview/600/400"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }}
              />
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span className="preview-badge">{privacy}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{title || 'Event Title'}</div>
                {description && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{description.slice(0, 60)}...</div>}
              </div>
            </div>
            <div className="preview-card-body">
              {date && (
                <div className="preview-user" style={{ gap: 6 }}>
                  <span style={{ fontSize: 13 }}>📅</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{date} {time && `at ${time}`}</span>
                </div>
              )}
              {location && (
                <div className="preview-user" style={{ gap: 6 }}>
                  <span style={{ fontSize: 13 }}>📍</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{location}</span>
                </div>
              )}
              {vibes.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {vibes.map(v => <span key={v} className="preview-badge">{v}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
