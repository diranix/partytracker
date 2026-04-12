import { useState } from 'react'
import { moodColors } from '../data/mockData'
import { HeartIcon, MapPinIcon, StarIcon, WineIcon } from './icons'

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffH = Math.floor((now - date) / (1000 * 60 * 60))
  const diffD = Math.floor(diffH / 24)
  if (diffH < 1) return 'just now'
  if (diffH < 24) return `${diffH}h ago`
  if (diffD < 7) return `${diffD}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const handleLike = () => {
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  const moodClass = moodColors[post.mood] || 'tag-mood'
  const avatar = `https://i.pravatar.cc/150?u=${post.user_id}`

  return (
    <article className="post-card">
      <div className="post-header">
        <img src={avatar} alt={post.user?.username} className="avatar" width={36} height={36} />
        <div className="post-user-info">
          <div className="post-username">{post.user?.username}</div>
        </div>
        <span className="post-time">{timeAgo(post.created_at)}</span>
      </div>

      <div className="post-image-wrap">
        <img src={`https://picsum.photos/seed/${post.id}/600/750`} alt={post.title} loading="lazy" />
      </div>

      <div className="post-body">
        {post.title && <p className="post-caption">{post.title}</p>}

        <div className="post-meta">
          <div className="post-meta-left">
            <MapPinIcon size={13} />
            {post.location}
          </div>
          <div className="post-tags">
            <span className={`tag ${moodClass}`}>{post.mood}</span>
          </div>
        </div>

        <div className="post-stats">
          <div className="stat-item">
            <WineIcon size={13} />
            {post.drinks_count} drinks
          </div>
          <div className="stat-item">
            <StarIcon size={13} filled />
            {post.rating}/10
          </div>
        </div>

        <div className="post-actions">
          <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <HeartIcon size={17} filled={liked} />
            {likeCount}
          </button>
        </div>
      </div>
    </article>
  )
}
