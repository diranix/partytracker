import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)

  const handleAuth = (user) => setCurrentUser(user)
  const handleLogout = () => setCurrentUser(null)

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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
