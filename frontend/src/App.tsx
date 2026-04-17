import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { apiFetch, getToken, removeToken } from './api/client'
import type { User } from './api/types'
import AuthPage from './pages/AuthPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import StatsPage from './pages/StatsPage'

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    apiFetch<User>('/users/me')
      .then(user => setCurrentUser(user))
      .catch(() => removeToken())
      .finally(() => setLoading(false))
  }, [])

  const handleAuth = (user: User) => setCurrentUser(user)

  const handleLogout = () => {
    removeToken()
    setCurrentUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span style={{ color: 'var(--color-muted)', fontSize: '14px' }}>Loading...</span>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/feed" /> : <AuthPage onAuth={handleAuth} />}
        />
        <Route
          path="/feed"
          element={currentUser ? <FeedPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={currentUser ? <ProfilePage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/stats"
          element={currentUser ? <StatsPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
