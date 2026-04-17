import { useState } from 'react'
import { apiFetch } from '../api/client'

export default function CreateNightModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', location: '', mood: 'chill',
    drinks_count: 0, rating: 5, privacy: 'public',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.location) { setError('Title and location are required'); return }
    setError('')
    setLoading(true)
    try {
      const post = await apiFetch('/nights/', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          mood: form.mood,
          drinks_count: Number(form.drinks_count),
          rating: Number(form.rating),
        }),
      })
      onCreated(post)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const MOODS = ['chill', 'happy', 'euphoric', 'intense', 'wild', 'tired']

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">🌙 Log a Night</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input2" placeholder="What did you call this night?" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input2" placeholder="Club, bar, venue..." value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Drinks</label>
                <input className="form-input2" type="number" min={0} max={50} value={form.drinks_count} onChange={e => set('drinks_count', e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Privacy</label>
                <select className="form-select" value={form.privacy} onChange={e => set('privacy', e.target.value)}>
                  <option value="public">🌐 Public</option>
                  <option value="friends">👥 Friends</option>
                  <option value="private">🔒 Private</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mood</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MOODS.map(m => (
                  <button key={m} type="button"
                    onClick={() => set('mood', m)}
                    style={{
                      padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                      background: form.mood === m ? 'var(--accent)' : 'var(--surface2)',
                      border: `1px solid ${form.mood === m ? 'var(--accent)' : 'var(--border)'}`,
                      color: form.mood === m ? '#fff' : 'var(--muted)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" className={`rating-btn${form.rating === n ? ' selected' : ''}`} onClick={() => set('rating', n)}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-submit" disabled={loading}>
              {loading ? 'Logging...' : '🌙 Log Night'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
