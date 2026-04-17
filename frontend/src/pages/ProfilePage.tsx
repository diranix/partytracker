import { Heart, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'
import CreatePostModal from '../components/CreatePostModal'
import Navbar from '../components/Navbar'

interface ProfilePageProps {
  currentUser: User
  onLogout: () => void
}

export default function ProfilePage({ currentUser, onLogout }: ProfilePageProps) {
  const [posts, setPosts] = useState<Night[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    apiFetch<Night[]>('/nights/my')
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCreatePost = (newPost: Night) => {
    setPosts(prev => [newPost, ...prev])
  }

  const avgRating = posts.length
    ? (posts.reduce((sum, p) => sum + p.rating, 0) / posts.length).toFixed(1)
    : '—'

  const totalDrinks = posts.reduce((sum, p) => sum + p.drinks_count, 0)

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
          {/* Hero */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            marginBottom: '24px',
          }}>
            <img
              src={`https://picsum.photos/seed/profilebg${currentUser.id}/700/200`}
              alt="cover"
              style={{ width: '100%', height: '140px', objectFit: 'cover', filter: 'brightness(0.3)' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '16px',
              display: 'flex', alignItems: 'flex-end', gap: '14px',
              background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)',
            }}>
              <img
                src={`https://i.pravatar.cc/150?u=${currentUser.id}`}
                alt={currentUser.username}
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-bg)', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
                  {currentUser.username}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-secondary)', marginTop: '2px' }}>
                  {currentUser.email}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px', marginBottom: '24px',
          }}>
            {[
              { value: posts.length, label: 'Nights' },
              { value: avgRating, label: 'Avg Rating' },
              { value: totalDrinks, label: 'Total Drinks' },
            ].map(({ value, label }) => (
              <div key={label} style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.4px' }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Grid title */}
          <div style={{
            fontSize: '13px', fontWeight: 600, color: 'var(--color-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px',
          }}>
            All Nights
          </div>

          {loading && (
            <div style={{ color: 'var(--color-muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
              Loading...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div style={{ color: 'var(--color-muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
              No nights yet.
            </div>
          )}

          {/* Photo grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3px', borderRadius: 'var(--radius-sm)', overflow: 'hidden',
          }}>
            {posts.map(post => (
              <div
                key={post.id}
                style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--color-hover)', cursor: 'pointer' }}
                onMouseEnter={e => {
                  const overlay = (e.currentTarget as HTMLElement).querySelector('.overlay') as HTMLElement | null
                  if (overlay) overlay.style.opacity = '1'
                  const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement | null
                  if (img) img.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={e => {
                  const overlay = (e.currentTarget as HTMLElement).querySelector('.overlay') as HTMLElement | null
                  if (overlay) overlay.style.opacity = '0'
                  const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement | null
                  if (img) img.style.transform = 'scale(1)'
                }}
              >
                <img
                  src={`https://picsum.photos/seed/${post.id}/300/300`}
                  alt={post.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
                <div
                  className="overlay"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    opacity: 0, transition: 'opacity 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    <Star size={13} fill="currentColor" />
                    {post.rating}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    <Heart size={13} fill="currentColor" />
                    {post.likes_count ?? 0}
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
