import { useState } from 'react'
import { currentUser } from '../data/mockData'

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock auth — swap for real API calls later
    onAuth({ ...currentUser, username: username || currentUser.username })
  }

  return (
    <div className="auth-page">
      {/* Branding side */}
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

      {/* Form side */}
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

            <button type="submit" className="form-submit">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?
                <button onClick={() => setMode('register')}>Sign up</button>
              </>
            ) : (
              <>
                Already have an account?
                <button onClick={() => setMode('login')}>Sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
