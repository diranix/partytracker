import { ArrowLeft, MapPin, User, FileText, Save } from 'lucide-react'
import { useState } from 'react'
import { apiFetch } from '../api/client'
import type { User as UserType } from '../api/types'

interface Props {
  currentUser: UserType
  onClose: () => void
  onSaved: (user: UserType) => void
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #7C3AED, #a855f7)',
  'linear-gradient(135deg, #EC4899, #f43f5e)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #10b981, #0ea5e9)',
  'linear-gradient(135deg, #f97316, #ec4899)',
  'linear-gradient(135deg, #8b5cf6, #06b6d4)',
]

export default function EditProfileModal({ currentUser, onClose, onSaved }: Props) {
  const [username, setUsername] = useState(currentUser.username)
  const [bio, setBio] = useState(currentUser.bio ?? '')
  const [location, setLocation] = useState(currentUser.location ?? '')
  const [gradientIdx, setGradientIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const initial = username[0]?.toUpperCase() ?? '?'

  const handleSave = async () => {
    if (!username.trim()) { setError('Username is required'); return }
    setError(''); setLoading(true)
    try {
      const updated = await apiFetch<UserType>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          username: username.trim() !== currentUser.username ? username.trim() : undefined,
          bio: bio.trim() || undefined,
          location: location.trim() || undefined,
        }),
      })
      onSaved(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay fade-in" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="edit-profile-panel slide-up">
        {/* Header */}
        <div className="edit-profile-header">
          <button className="modal-back" onClick={onClose}><ArrowLeft size={16} /></button>
          <div>
            <div className="modal-title">Edit Profile</div>
            <div className="modal-subtitle">Update your public info</div>
          </div>
          <button className="modal-post-btn" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : <><Save size={13} /> Save</>}
          </button>
        </div>

        <div className="edit-profile-body">
          {error && <div className="form-error">{error}</div>}

          {/* Avatar picker */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div
              className="profile-avatar-large"
              style={{ background: AVATAR_GRADIENTS[gradientIdx], width: 88, height: 88, fontSize: 32, border: '4px solid var(--border)' }}
            >
              {initial}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Pick a colour</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {AVATAR_GRADIENTS.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGradientIdx(i)}
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: g,
                      border: gradientIdx === i ? '2px solid #fff' : '2px solid transparent',
                      outline: gradientIdx === i ? '2px solid var(--accent)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="edit-profile-divider" />

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
              <input
                className="form-input2"
                style={{ paddingLeft: 34 }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Your username"
                maxLength={30}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Bio</label>
            <div style={{ position: 'relative' }}>
              <FileText size={14} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--muted)', pointerEvents: 'none' }} />
              <textarea
                className="form-textarea"
                style={{ paddingLeft: 34, minHeight: 80 }}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell the world who you are at 3am 🌙"
                maxLength={160}
              />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted2)', textAlign: 'right', marginTop: 4 }}>
              {bio.length}/160
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
              <input
                className="form-input2"
                style={{ paddingLeft: 34 }}
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City or neighbourhood"
                maxLength={60}
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="form-group">
            <label className="form-label">Email <span style={{ color: 'var(--muted2)', fontWeight: 400 }}>(read-only)</span></label>
            <input className="form-input2" value={currentUser.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
