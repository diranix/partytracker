import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import CreatePostModal from '../components/CreatePostModal'
import { HeartIcon, StarIcon } from '../components/icons'
import Navbar from '../components/Navbar'

export default function ProfilePage({ currentUser, onLogout }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    apiFetch('/nights/my')
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCreatePost = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  const avgRating = posts.length
    ? (posts.reduce((sum, p) => sum + p.rating, 0) / posts.length).toFixed(1)
    : '—'

  return (
    <div className="app-layout">
      <Navbar
        currentUser={currentUser}
        onCreatePost={() => setModalOpen(true)}
        onLogout={onLogout}
      />

      <main className="app-content">
        <div className="feed-wrapper">
          {/* Hero */}
          <div className="profile-hero">
            <img
              src={`https://picsum.photos/seed/profilebg${currentUser.id}/700/200`}
              alt="cover"
              className="profile-hero-bg"
            />
            <div className="profile-hero-content">
              <img
                src={`https://i.pravatar.cc/150?u=${currentUser.id}`}
                alt={currentUser.username}
                className="avatar"
                width={64}
                height={64}
                style={{ border: '3px solid var(--bg)' }}
              />
              <div>
                <div className="profile-name">{currentUser.username}</div>
                <div className="profile-bio">{currentUser.email}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats-row">
            <div className="profile-stat-card">
              <div className="profile-stat-value">{posts.length}</div>
              <div className="profile-stat-label">Nights</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-value">{avgRating}</div>
              <div className="profile-stat-label">Avg Rating</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-value">
                {posts.reduce((sum, p) => sum + p.drinks_count, 0)}
              </div>
              <div className="profile-stat-label">Total Drinks</div>
            </div>
          </div>

          {/* Grid */}
          <div className="profile-grid-title">All Nights</div>

          {loading && (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
              Loading...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
              No nights yet.
            </div>
          )}

          <div className="profile-grid">
            {posts.map(post => (
              <div key={post.id} className="profile-grid-item">
                <img
                  src={`https://picsum.photos/seed/${post.id}/300/300`}
                  alt={post.title}
                  loading="lazy"
                />
                <div className="profile-grid-overlay">
                  <div className="grid-overlay-stat">
                    <StarIcon size={13} filled />
                    {post.rating}
                  </div>
                  <div className="grid-overlay-stat">
                    <HeartIcon size={13} filled />
                    0
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CreatePostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  )
}
