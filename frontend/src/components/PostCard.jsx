import { useState } from 'react'
import { HeartIcon, MapPinIcon, StarIcon, WineIcon } from './icons'
import { timeAgo, moodColors } from '../data/mockData'

export default function PostCard({ post, onLike }) {
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    const next = !liked
    setLiked(next)
    setLikeCount(c => next ? c + 1 : c - 1)
    onLike?.(post.id, next)
  }

  const moodClass = moodColors[post.mood] || 'tag-mood'

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <img
          src={post.user.avatar}
          alt={post.user.username}
          className="avatar"
          width={36}
          height={36}
        />
        <div className="post-user-info">
          <div className="post-username">{post.user.username}</div>
        </div>
        <span className="post-time">{timeAgo(post.createdAt)}</span>
      </div>

      {/* Image */}
      <div className="post-image-wrap">
        <img src={post.image} alt={post.caption} loading="lazy" />
      </div>

      {/* Body */}
      <div className="post-body">
        {post.caption && (
          <p className="post-caption">{post.caption}</p>
        )}

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
            {post.amountDrank} drinks
          </div>
          <div className="stat-item">
            <StarIcon size={13} filled />
            {post.rating}/10
          </div>
        </div>

        <div className="post-actions">
          <button
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <HeartIcon size={17} filled={liked} />
            {likeCount}
          </button>
        </div>
      </div>
    </article>
  )
}
