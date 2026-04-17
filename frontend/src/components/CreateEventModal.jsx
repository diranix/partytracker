import { useState } from 'react'

const VIBES = ['Club', 'Rooftop', 'House Party', 'Lounge', 'Festival', 'Beach', 'Dinner', 'Bar Crawl']

export default function CreateEventModal({ onClose }) {
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '',
    location: '', maxGuests: '', privacy: 'friends', vibe: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">🎉 Create Event</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input className="form-input2" placeholder="Name your event..." value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="What's the vibe? Tell your guests..." value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Date</label>
              <input className="form-input2" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Time</label>
              <input className="form-input2" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input2" placeholder="Venue or address..." value={form.location} onChange={e => set('location', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Max Guests</label>
              <input className="form-input2" type="number" placeholder="∞" min={1} value={form.maxGuests} onChange={e => set('maxGuests', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Privacy</label>
              <select className="form-select" value={form.privacy} onChange={e => set('privacy', e.target.value)}>
                <option value="public">🌐 Public</option>
                <option value="friends">👥 Friends Only</option>
                <option value="invite">🔒 Invite Only</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Vibe Tags</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {VIBES.map(v => (
                <button key={v} type="button"
                  onClick={() => set('vibe', v)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: form.vibe === v ? 'var(--accent)' : 'var(--surface2)',
                    border: `1px solid ${form.vibe === v ? 'var(--accent)' : 'var(--border)'}`,
                    color: form.vibe === v ? '#fff' : 'var(--muted)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="modal-submit" onClick={onClose}>
            🎉 Create Event
          </button>
        </div>
      </div>
    </div>
  )
}
