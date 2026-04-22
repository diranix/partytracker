import { ArrowLeft, MapPin, Upload, X, Film } from 'lucide-react'
import { useState, useCallback } from 'react'
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

const FILE_INPUT_ID = 'night-media-upload'
const FILE_INPUT_MORE_ID = 'night-media-upload-more'

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
  const [mediaFiles, setMediaFiles] = useState<{ file: File; url: string }[]>([])
  const [dragging, setDragging] = useState(false)

  const toggleFriend = (name: string) =>
    setTaggedFriends(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name])

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
    const entries = allowed.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setMediaFiles(prev => [...prev, ...entries].slice(0, 6))
  }

  const removeMedia = (idx: number) => {
    setMediaFiles(prev => {
      URL.revokeObjectURL(prev[idx].url)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [])

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

  const previewImg = mediaFiles[0]?.url
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

              {/* File inputs — outside the label to avoid nesting issues */}
              <input
                id={FILE_INPUT_ID}
                type="file"
                accept="image/*,video/*"
                multiple
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                onChange={e => { addFiles(e.target.files); e.target.value = '' }}
              />
              <input
                id={FILE_INPUT_MORE_ID}
                type="file"
                accept="image/*,video/*"
                multiple
                style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                onChange={e => { addFiles(e.target.files); e.target.value = '' }}
              />

              {/* Drop zone — label opens file dialog natively */}
              <label
                htmlFor={FILE_INPUT_ID}
                className={`upload-area${dragging ? ' dragging' : ''}`}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <Upload size={28} style={{ color: dragging ? 'var(--accent2)' : 'var(--muted)' }} />
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {dragging ? 'Drop here!' : 'Upload media'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Drag & drop or <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>click to browse</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted2)' }}>JPG, PNG, GIF, MP4 · up to 6 files</div>
              </label>

              {/* Thumbnails */}
              {mediaFiles.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
                  {mediaFiles.map((m, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      {m.file.type.startsWith('video/') ? (
                        <div style={{ width: '100%', height: '100%', background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                          <Film size={22} style={{ color: 'var(--muted)' }} />
                          <span style={{ fontSize: 10, color: 'var(--muted)' }}>Video</span>
                        </div>
                      ) : (
                        <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      <button
                        type="button"
                        onClick={e => { e.preventDefault(); removeMedia(i) }}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 20, height: 20, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.75)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', border: 'none',
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {mediaFiles.length < 6 && (
                    <label
                      htmlFor={FILE_INPUT_MORE_ID}
                      style={{
                        aspectRatio: '1', borderRadius: 10, border: '2px dashed var(--border)',
                        background: 'var(--surface3)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)',
                      }}
                    >
                      <Upload size={18} />
                    </label>
                  )}
                </div>
              )}
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
              {previewImg ? (
                <img src={previewImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img
                  src="https://picsum.photos/seed/nightpreview/600/400"
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                />
              )}
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
