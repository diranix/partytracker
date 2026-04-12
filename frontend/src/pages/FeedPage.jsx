import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import CreatePostModal from '../components/CreatePostModal'
import { PlusIcon } from '../components/icons'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'

export default function FeedPage({ currentUser, onLogout }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    apiFetch('/nights/')
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCreatePost = (newPost) => {
    setPosts(prev => [newPost, ...prev])
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
          <div className="feed-header">
            <span className="feed-title">Feed</span>
            <button className="create-btn-inline" onClick={() => setModalOpen(true)}>
              <PlusIcon size={14} />
              New Night
            </button>
          </div>

          {loading && (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              Loading...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              No nights yet. Be the first to share one.
            </div>
          )}

          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
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
