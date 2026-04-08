import { useState } from 'react'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'
import { mockPosts } from '../data/mockData'
import { PlusIcon } from '../components/icons'

export default function FeedPage({ currentUser, onLogout }) {
  const [posts, setPosts] = useState(mockPosts)
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreatePost = (newPost) => {
    setPosts([{ ...newPost, user: currentUser }, ...posts])
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
