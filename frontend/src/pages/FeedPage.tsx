import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'
import CreatePostModal from '../components/CreatePostModal'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'

interface FeedPageProps {
  currentUser: User
  onLogout: () => void
}

export default function FeedPage({ currentUser, onLogout }: FeedPageProps) {
  const [posts, setPosts] = useState<Night[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    apiFetch<Night[]>('/nights/')
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCreatePost = (newPost: Night) => {
    setPosts(prev => [newPost, ...prev])
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar
        currentUser={currentUser}
        onCreatePost={() => setModalOpen(true)}
        onLogout={onLogout}
      />

      <main style={{
        flex: 1,
        marginLeft: 'var(--sidebar-w)',
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 16px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: '470px' }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '20px', padding: '4px 0',
          }}>
            <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>Feed</span>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px',
                background: 'var(--color-accent)', color: '#fff',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px', fontWeight: 600,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-hover)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-accent)' }}
            >
              <Plus size={14} />
              New Night
            </button>
          </div>

          {loading && (
            <div style={{ color: 'var(--color-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              Loading...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div style={{ color: 'var(--color-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
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
