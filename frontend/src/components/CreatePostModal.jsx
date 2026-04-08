import { useState, useRef } from 'react'
import { XIcon, CameraIcon } from './icons'

const MOODS = ['Euphoric', 'Chill', 'Happy', 'Intense', 'Wild', 'Tired']

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [mood, setMood] = useState('')
  const [drinks, setDrinks] = useState('')
  const [rating, setRating] = useState(null)
  const fileRef = useRef()

  if (!isOpen) return null

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = () => {
    const post = {
      id: Date.now(),
      caption,
      location,
      mood,
      amountDrank: parseInt(drinks) || 0,
      rating: rating || 5,
      image: preview || `https://picsum.photos/seed/${Date.now()}/600/750`,
      likes: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    }
    onSubmit(post)
    handleClose()
  }

  const handleClose = () => {
    setPreview(null)
    setCaption('')
    setLocation('')
    setMood('')
    setDrinks('')
    setRating(null)
    onClose()
  }

  const canSubmit = location.trim() && mood

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
          {/* Photo upload */}
          <div
            className={`upload-area ${preview ? 'has-file' : ''}`}
            onClick={() => !preview && fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              <>
                <div className="upload-icon"><CameraIcon size={32} /></div>
                <div className="upload-hint">
                  <strong>Click to upload</strong> or drag a photo here
                </div>
                <div className="upload-sub">JPG, PNG, WebP</div>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFile}
          />

          {/* Caption */}
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
            {/* Location */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Location</label>
              <input
                className="form-input"
                placeholder="Club / Bar / City"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            {/* Mood */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mood</label>
              <select
                className="form-select"
                value={mood}
                onChange={e => setMood(e.target.value)}
              >
                <option value="">Select mood</option>
                {MOODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Drinks */}
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

            {/* Rating */}
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
        </div>

        <div className="modal-footer">
          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
          >
            Share Night
          </button>
        </div>
      </div>
    </div>
  )
}
