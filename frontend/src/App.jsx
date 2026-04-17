import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { apiFetch, getToken, removeToken } from './api/client'
import AuthPage from './pages/AuthPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import EventDetailPage from './pages/EventDetailPage'
import FriendsPage from './pages/FriendsPage'
import MemoriesPage from './pages/MemoriesPage'
import MapPage from './pages/MapPage'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    apiFetch('/users/me')
      .then(user => setCurrentUser(user))
      .catch(() => removeToken())
      .finally(() => setLoading(false))
  }, [])

  const handleAuth = (user) => setCurrentUser(user)

  const handleLogout = () => {
    removeToken()
    setCurrentUser(null)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-dot" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={currentUser ? <Navigate to="/feed" /> : <AuthPage onAuth={handleAuth} />} />
        <Route path="/feed" element={currentUser ? <FeedPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/profile" element={currentUser ? <ProfilePage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/events/:id" element={currentUser ? <EventDetailPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/friends" element={currentUser ? <FriendsPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/memories" element={currentUser ? <MemoriesPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/map" element={currentUser ? <MapPage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
