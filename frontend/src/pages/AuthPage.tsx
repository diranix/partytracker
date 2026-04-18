import { Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { apiFetch, setToken } from '../api/client'
import type { AuthResponse, User } from '../api/types'

export default function AuthPage({ onAuth }: { onAuth: (u: User) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
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

  return (
    <div className="auth-page">
      {/* Left – hero */}
      <div className="auth-left">
        <img
          src="https://picsum.photos/seed/party-hero/900/1200"
          alt=""
          className="auth-left-bg"
        />
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Sparkles size={16} color="#fff" />
          </div>
          Party Tracker
        </div>
        <div className="auth-left-content">
          <h1 className="auth-headline">
            Your nights,<br />your memories,<br />your crew
          </h1>
          <p className="auth-tagline">
            Track legendary nights, share epic moments, and never lose touch with your favorite people.
          </p>
        </div>
      </div>

      {/* Right – form */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h2 className="auth-form-title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-form-sub">
            {mode === 'login'
              ? 'Sign in to continue to your account'
              : 'Join and start documenting your nights'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" type="text" placeholder="your_username" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="alex@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}

            <button type="submit" className="form-submit" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>Don&apos;t have an account?<button onClick={() => { setMode('register'); setError('') }}>Sign up</button></>
            ) : (
              <>Already have an account?<button onClick={() => { setMode('login'); setError('') }}>Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
