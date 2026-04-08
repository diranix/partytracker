import { useState } from 'react'
import Navbar from '../components/Navbar'
import CreatePostModal from '../components/CreatePostModal'
import { mockProfilePosts } from '../data/mockData'
import { StarIcon, HeartIcon } from '../components/icons'

export default function ProfilePage({ currentUser, onLogout }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [profilePosts, setProfilePosts] = useState(mockProfilePosts)

  const handleCreatePost = (newPost) => {
    setProfilePosts([
      { id: newPost.id, image: newPost.image, rating: newPost.rating, likes: 0 },
      ...profilePosts,
    ])
  }

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
              src={`https://picsum.photos/seed/profilebg/700/200`}
              alt="cover"
              className="profile-hero-bg"
            />
            <div className="profile-hero-content">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="avatar"
                width={64}
                height={64}
                style={{ border: '3px solid var(--bg)' }}
              />
              <div>
                <div className="profile-name">{currentUser.username}</div>
                <div className="profile-bio">{currentUser.bio}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats-row">
            <div className="profile-stat-card">
              <div className="profile-stat-value">{currentUser.totalPosts}</div>
              <div className="profile-stat-label">Nights</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-value">{currentUser.avgRating}</div>
              <div className="profile-stat-label">Avg Rating</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-value">{currentUser.totalLikes}</div>
              <div className="profile-stat-label">Likes</div>
            </div>
          </div>

          {/* Grid */}
          <div className="profile-grid-title">All Nights</div>
          <div className="profile-grid">
            {profilePosts.map(post => (
              <div key={post.id} className="profile-grid-item">
                <img src={post.image} alt="" loading="lazy" />
                <div className="profile-grid-overlay">
                  <div className="grid-overlay-stat">
                    <StarIcon size={13} filled />
                    {post.rating}
                  </div>
                  <div className="grid-overlay-stat">
                    <HeartIcon size={13} filled />
                    {post.likes}
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
