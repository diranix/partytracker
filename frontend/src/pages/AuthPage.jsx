import { useState } from 'react'
import { apiFetch, setToken } from '../api/client'

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let data
      if (mode === 'register') {
        data = await apiFetch('/users/', {
          method: 'POST',
          body: JSON.stringify({ username, email, password }),
        })
      } else {
        data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
      }
      setToken(data.token)
      onAuth(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-logo">
          <span>Party</span>Tracker
        </div>
        <h1 className="auth-brand-headline">
          Document the nights<br />worth remembering.
        </h1>
        <p className="auth-brand-sub">
          A social feed for your nightlife. Share where you were,
          how it felt, and what made it unforgettable.
        </p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-box">
          <h2 className="auth-form-title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-form-subtitle">
            {mode === 'login'
              ? 'Sign in to your account to continue.'
              : 'Join and start documenting your nights.'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="your_username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{
                color: '#f87171',
                fontSize: '13px',
                marginBottom: '12px',
                padding: '10px 12px',
                background: 'rgba(239,68,68,0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.2)',
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?
                <button onClick={() => { setMode('register'); setError('') }}>Sign up</button>
              </>
            ) : (
              <>
                Already have an account?
                <button onClick={() => { setMode('login'); setError('') }}>Sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
