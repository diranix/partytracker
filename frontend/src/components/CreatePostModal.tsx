import { Image, Loader2, MapPin, X } from 'lucide-react'
import { useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night } from '../api/types'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: Night) => void
}

const MOODS = ['euphoric', 'wild', 'happy', 'chill', 'intense', 'tired']

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(0)
  const [mood, setMood] = useState('')
  const [drinksCount, setDrinksCount] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const reset = () => {
    setTitle(''); setCaption(''); setLocation('')
    setRating(0); setMood(''); setDrinksCount(0)
    setDate(new Date().toISOString().split('T')[0])
    setError('')
  }

  const handleClose = () => { reset(); onClose() }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    if (rating === 0) { setError('Please select a rating'); return }

    setLoading(true)
    setError('')
    try {
      const post = await apiFetch<Night>('/nights/', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          caption: caption.trim() || undefined,
          location: location.trim() || undefined,
          rating,
          mood: mood || undefined,
          drinks_count: drinksCount,
          date,
        }),
      })
      onSubmit(post)
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '11px 13px',
    fontSize: '14px',
    color: 'var(--color-foreground)',
    outline: 'none',
    transition: 'border-color 0.15s ease',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      className="animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
          width: '100%', maxWidth: '480px',
          maxHeight: '90vh', overflowY: 'auto',
        }}
        className="animate-slide-up"
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}>
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>New Night</span>
          <button
            onClick={handleClose}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-muted)', transition: 'all 0.15s ease',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Image placeholder */}
            <div style={{
              border: '1.5px dashed var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '28px 20px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px', textAlign: 'center',
            }}>
              <Image size={24} style={{ color: 'var(--color-muted)' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-secondary)' }}>
                <strong style={{ color: 'var(--color-accent)' }}>Photo upload</strong> coming soon
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Random cover will be used</span>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Title *
              </label>
              <input
                style={inputStyle}
                placeholder="Saturday at Fabric"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-accent)' }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)' }}
              />
            </div>

            {/* Location + Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Location
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }} />
                  <input
                    style={{ ...inputStyle, paddingLeft: '30px' }}
                    placeholder="London, UK"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-accent)' }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Date
                </label>
                <input
                  type="date"
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-accent)' }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)' }}
                />
              </div>
            </div>

            {/* Caption */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Caption
              </label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                placeholder="How did the night go?"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--color-accent)' }}
                onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--color-border)' }}
              />
            </div>

            {/* Rating + Drinks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Rating *
                </label>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      style={{
                        width: '34px', height: '34px',
                        borderRadius: 'var(--radius-sm)',
                        background: rating === r ? 'var(--color-accent)' : 'var(--color-hover)',
                        border: `1px solid ${rating === r ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        fontSize: '13px', fontWeight: 600,
                        color: rating === r ? '#fff' : 'var(--color-muted)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Drinks
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  style={inputStyle}
                  value={drinksCount}
                  onChange={e => setDrinksCount(Number(e.target.value))}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-accent)' }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)' }}
                />
              </div>
            </div>

            {/* Mood */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Mood
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {MOODS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(mood === m ? '' : m)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '12px', fontWeight: 500,
                      border: `1px solid ${mood === m ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: mood === m ? 'rgba(139,92,246,0.12)' : 'var(--color-hover)',
                      color: mood === m ? 'var(--color-accent)' : 'var(--color-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                color: '#f87171', fontSize: '13px',
                padding: '10px 12px',
                background: 'rgba(239,68,68,0.08)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border-subtle)' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: 'var(--color-accent)', color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px', fontWeight: 600,
                transition: 'background 0.15s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Posting...' : 'Post Night'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
