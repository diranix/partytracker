import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { apiFetch, setToken } from '../api/client'
import type { AuthResponse } from '../api/types'
import type { User } from '../api/types'

interface AuthPageProps {
  onAuth: (user: User) => void
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let data: AuthResponse
      if (mode === 'register') {
        data = await apiFetch<AuthResponse>('/users/', {
          method: 'POST',
          body: JSON.stringify({ username, email, password }),
        })
      } else {
        data = await apiFetch<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
      }
      setToken(data.token)
      onAuth(data.user)
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
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Brand side */}
      <div style={{
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px 56px',
      }}>
        <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '32px' }}>
          <span style={{ color: 'var(--color-accent)' }}>Party</span>Tracker
        </div>
        <h1 style={{
          fontSize: '36px', fontWeight: 700,
          lineHeight: 1.2, letterSpacing: '-0.8px',
          color: 'var(--color-foreground)', marginBottom: '16px',
        }}>
          Document the nights<br />worth remembering.
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-secondary)', lineHeight: 1.6, maxWidth: '320px' }}>
          A social feed for your nightlife. Share where you were,
          how it felt, and what made it unforgettable.
        </p>

        {/* Decorative stat cards */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '48px' }}>
          {[
            { value: '1.2k', label: 'Nights logged' },
            { value: '8.4', label: 'Avg rating' },
            { value: '340', label: 'Active users' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 16px',
              flex: 1,
            }}>
              <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--color-accent)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form side */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '64px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', marginBottom: '6px' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-secondary)', marginBottom: '32px' }}>
            {mode === 'login'
              ? 'Sign in to your account to continue.'
              : 'Join and start documenting your nights.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Username
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-accent)' }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)' }}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Email
              </label>
              <input
                style={inputStyle}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-accent)' }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Password
              </label>
              <input
                style={inputStyle}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-accent)' }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--color-border)' }}
                required
              />
            </div>

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

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                background: 'var(--color-accent)', color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px', fontWeight: 600,
                marginTop: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.15s ease, opacity 0.15s ease',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-hover)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-accent)' }}
            >
              {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--color-muted)' }}>
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('register'); setError('') }}
                  style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: '13px', marginLeft: '4px' }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError('') }}
                  style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: '13px', marginLeft: '4px' }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
