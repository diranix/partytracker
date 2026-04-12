import { useRef, useState } from 'react'
import { apiFetch } from '../api/client'
import { CameraIcon, XIcon } from './icons'

const MOODS = ['Euphoric', 'Chill', 'Happy', 'Intense', 'Wild', 'Tired']

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [mood, setMood] = useState('')
  const [drinks, setDrinks] = useState('')
  const [rating, setRating] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  if (!isOpen) return null

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const post = await apiFetch('/nights/', {
        method: 'POST',
        body: JSON.stringify({
          title: caption,
          location,
          mood,
          drinks_count: parseInt(drinks) || 0,
          rating: rating || 5,
        }),
      })
      onSubmit(post)
      handleClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCaption('')
    setLocation('')
    setMood('')
    setDrinks('')
    setRating(null)
    setError('')
    onClose()
  }

  const canSubmit = location.trim() && mood && !loading

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">New Night</span>
          <button className="modal-close" onClick={handleClose}>
            <XIcon size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Photo placeholder */}
          <div className="upload-area" onClick={() => fileRef.current.click()}>
            <div className="upload-icon"><CameraIcon size={32} /></div>
            <div className="upload-hint">
              <strong>Click to upload</strong> or drag a photo here
            </div>
            <div className="upload-sub">Photo upload coming soon</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} />

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Caption</label>
            <textarea
              className="form-textarea"
              placeholder="How was the night?"
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Location</label>
              <input
                className="form-input"
                placeholder="Club / Bar / City"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mood</label>
              <select className="form-select" value={mood} onChange={e => setMood(e.target.value)}>
                <option value="">Select mood</option>
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Drinks</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="30"
                placeholder="0"
                value={drinks}
                onChange={e => setDrinks(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Rating (1–10)</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button
                    key={n}
                    className={`rating-btn ${rating === n ? 'selected' : ''}`}
                    onClick={() => setRating(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              color: '#f87171', fontSize: '13px', padding: '10px 12px',
              background: 'rgba(239,68,68,0.08)', borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
          >
            {loading ? 'Saving...' : 'Share Night'}
          </button>
        </div>
      </div>
    </div>
  )
}
