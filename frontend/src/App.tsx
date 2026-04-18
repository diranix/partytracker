import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { apiFetch, getToken, removeToken } from './api/client'
import type { User } from './api/types'
import AuthPage from './pages/AuthPage'
import EventsPage from './pages/EventsPage'
import FeedPage from './pages/FeedPage'
import FriendsPage from './pages/FriendsPage'
import MapPage from './pages/MapPage'
import MemoriesPage from './pages/MemoriesPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    apiFetch<User>('/users/me')
      .then(u => setCurrentUser(u))
      .catch(() => removeToken())
      .finally(() => setLoading(false))
  }, [])

  const handleAuth = (user: User) => setCurrentUser(user)
  const handleLogout = () => { removeToken(); setCurrentUser(null) }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading...</div>
      </div>
    )
  }

  const auth = (el: React.ReactElement) => currentUser ? el : <Navigate to="/" />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/feed" /> : <AuthPage onAuth={handleAuth} />} />
        <Route path="/feed"     element={auth(<FeedPage     currentUser={currentUser!} onLogout={handleLogout} />)} />
        <Route path="/events"   element={auth(<EventsPage   currentUser={currentUser!} onLogout={handleLogout} />)} />
        <Route path="/friends"  element={auth(<FriendsPage  currentUser={currentUser!} onLogout={handleLogout} />)} />
        <Route path="/memories" element={auth(<MemoriesPage currentUser={currentUser!} onLogout={handleLogout} />)} />
        <Route path="/map"      element={auth(<MapPage      currentUser={currentUser!} onLogout={handleLogout} />)} />
        <Route path="/profile"  element={auth(<ProfilePage  currentUser={currentUser!} onLogout={handleLogout} />)} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
