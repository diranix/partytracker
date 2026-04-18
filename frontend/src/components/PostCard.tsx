import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night } from '../api/types'

const MOODS: Record<string, string> = {
  euphoric: '🔥', chill: '😌', happy: '😊', intense: '⚡',
  wild: '🌪️', tired: '😴', vibes: '✨', intimate: '🕯️',
}

function timeAgo(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3_600_000)
    if (h < 1) return 'just now'
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  } catch { return '' }
}

export default function PostCard({ post }: { post: Night }) {
  const [liked, setLiked] = useState(post.liked_by_me)
  const [likes, setLikes] = useState(post.like_count)
  const [liking, setLiking] = useState(false)

  const handleLike = async () => {
    if (liking) return
    setLiking(true)
    const was = liked
    setLiked(!was); setLikes(n => was ? n - 1 : n + 1)
    try {
      await apiFetch(`/nights/${post.id}/like`, { method: 'POST' })
    } catch {
      setLiked(was); setLikes(n => was ? n + 1 : n - 1)
    } finally { setLiking(false) }
  }

  const mood = post.mood?.toLowerCase() ?? ''
  const username = post.user?.username ?? 'Unknown'
  const initial = username[0].toUpperCase()

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="user-avatar" style={{ width: 40, height: 40, fontSize: 15 }}>
          {initial}
        </div>
        <div className="post-user-info">
          <div className="post-username">{username}</div>
          <div className="post-time">{timeAgo(post.created_at)}</div>
        </div>
        {mood && (
          <span className="mood-tag">
            {MOODS[mood] ?? '🎉'} {post.mood}
          </span>
        )}
      </div>

      <div className="post-body">
        <div className="post-title">{post.title}</div>
        <div className="post-meta-row">
          {post.location && (
            <div className="post-meta-item"><span>📍</span><span>{post.location}</span></div>
          )}
          {post.drinks_count > 0 && (
            <div className="post-meta-item"><span>🍹</span><span>{post.drinks_count} drinks</span></div>
          )}
          {post.rating > 0 && (
            <div className="rating-stars">
              {'★'.repeat(post.rating)}{'☆'.repeat(Math.max(0, 10 - post.rating))}
            </div>
          )}
        </div>
        {post.caption && (
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--text)' }}>{post.caption}</div>
        )}
        <div className="post-actions">
          <button className={`like-btn${liked ? ' liked' : ''}`} onClick={handleLike}>
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
            <span>{likes > 0 ? likes : 'Like'}</span>
          </button>
          <button className="action-btn">
            <MessageCircle size={14} /> Comment
          </button>
          <button className="action-btn">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    </article>
  )
}
