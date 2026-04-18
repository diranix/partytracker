import { ArrowLeft, MapPin, Upload } from 'lucide-react'
import { useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'

interface Props {
  currentUser: User
  onClose: () => void
  onCreated: (post: Night) => void
}

const MOODS = ['Chill', 'Vibes', 'Intimate', 'Euphoric', 'Wild', 'Tired']
const TYPES = ['Party', 'Club', 'Bar', 'House Party', 'Concert', 'Festival', 'Dinner', 'Other']
const PRIVACY = ['Public', 'Friends', 'Close Friends', 'Private']
const MOCK_FRIENDS = ['Sarah', 'Mike', 'Emma', 'Jake', 'Lisa', 'Tom']

export default function CreateNightModal({ currentUser, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('Epic night at The Rooftop 🎉')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [mood, setMood] = useState('Vibes')
  const [type, setType] = useState('Party')
  const [privacy, setPrivacy] = useState('Friends')
  const [rating, setRating] = useState(7)
  const [drinks, setDrinks] = useState(0)
  const [taggedFriends, setTaggedFriends] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleFriend = (name: string) =>
    setTaggedFriends(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setError(''); setLoading(true)
    try {
      const post = await apiFetch<Night>('/nights/', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          caption: caption.trim() || undefined,
          location: location.trim() || undefined,
          mood: mood.toLowerCase(),
          drinks_count: drinks,
          rating,
        }),
      })
      onCreated(post)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const initial = currentUser.username[0].toUpperCase()

  return (
    <div className="modal-overlay fade-in" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-panel">
        {/* Left — form */}
        <div className="modal-left">
          <div className="modal-header">
            <button className="modal-back" onClick={onClose}><ArrowLeft size={16} /></button>
            <div>
              <div className="modal-title">New Night</div>
              <div className="modal-subtitle">Share your memorable night</div>
            </div>
            <button className="modal-post-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Posting...' : 'Post Night'}
            </button>
          </div>

          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            {/* Upload */}
            <div>
              <div className="form-label">Photos & Videos</div>
              <div className="upload-area">
                <Upload size={28} style={{ color: 'var(--muted)' }} />
                <div style={{ fontSize: 13, fontWeight: 600 }}>Upload media</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Drag and drop or click to browse</div>
              </div>
            </div>

            {/* Title */}
            <div>
              <div className="form-label">Title</div>
              <input className="form-input2" placeholder="Epic night at The Rooftop" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            {/* Caption */}
            <div>
              <div className="form-label">Caption</div>
              <textarea className="form-textarea" placeholder="Tell the story of your night..." value={caption} onChange={e => setCaption(e.target.value)} />
            </div>

            {/* Location */}
            <div>
              <div className="form-label">Location</div>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
                <input className="form-input2" style={{ paddingLeft: 32 }} placeholder="Where was this?" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>

            {/* Type */}
            <div>
              <div className="form-label">Type</div>
              <div className="type-pills">
                {TYPES.map(t => (
                  <button key={t} type="button" className={`type-pill ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <div className="form-label">Mood / Vibe</div>
              <div className="mood-pills">
                {MOODS.map(m => (
                  <button key={m} type="button" className={`mood-pill ${mood === m ? 'active' : ''}`} onClick={() => setMood(m)}>{m}</button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <div className="form-label">Rating (1–10) — current: {rating}/10</div>
              <div className="rating-stars-selector">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button key={n} type="button" className={`star-btn ${n <= rating ? 'filled' : ''}`} onClick={() => setRating(n)}>★</button>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <div className="form-label">Privacy</div>
              <div className="privacy-row">
                {PRIVACY.map(p => (
                  <button key={p} type="button" className={`privacy-btn ${privacy === p ? 'active' : ''}`} onClick={() => setPrivacy(p)}>{p}</button>
                ))}
              </div>
            </div>

            {/* Drinks */}
            <div>
              <div className="form-label">Drinks count</div>
              <input className="form-input2" type="number" min={0} max={50} value={drinks} onChange={e => setDrinks(Number(e.target.value))} />
            </div>

            {/* Tag Friends */}
            <div>
              <div className="form-label">Tag Friends</div>
              <div className="friends-tag-grid">
                {MOCK_FRIENDS.map(f => (
                  <button key={f} type="button" className={`friend-tag-btn ${taggedFriends.includes(f) ? 'active' : ''}`} onClick={() => toggleFriend(f)}>
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

        {/* Right — live preview */}
        <div className="preview-panel">
          <div>
            <div className="preview-label">Live Preview</div>
            <div className="preview-sub">See how your night will appear</div>
          </div>
          <div className="preview-card">
            <div className="preview-card-img" style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src="https://picsum.photos/seed/nightpreview/600/400"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
            </div>
            <div className="preview-card-body">
              <div className="preview-user">
                <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{initial}</div>
                <div>
                  <div className="preview-username">{currentUser.username}</div>
                  <div className="preview-timestamp">Just now</div>
                </div>
              </div>
              <div className="preview-title">{title || 'Your night title'}</div>
              {caption && <div className="preview-caption">{caption}</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span className="preview-badge">✦ {mood}</span>
                <span style={{ color: 'var(--accent2)', fontSize: 13 }}>{'★'.repeat(rating)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
