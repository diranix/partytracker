import { Heart, MessageCircle, Share2, Send, X } from 'lucide-react'
import { useState, useCallback, useRef, useEffect } from 'react'
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

interface Comment {
  id: number
  author: string
  text: string
  time: string
}

// Seed data so cards feel alive before a real backend exists
const SEED_COMMENTS: Record<number, Comment[]> = {}

export default function PostCard({ post, currentUsername }: { post: Night; currentUsername?: string }) {
  const [liked, setLiked] = useState(post.liked_by_me)
  const [likes, setLikes] = useState(post.like_count)
  const [liking, setLiking] = useState(false)
  const [heartKey, setHeartKey] = useState(0)

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(() => SEED_COMMENTS[post.id] ?? [])
  const [commentInput, setCommentInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const mood = post.mood?.toLowerCase() ?? ''
  const username = post.user?.username ?? 'Unknown'
  const initial = username[0].toUpperCase()
  const trending = likes >= 3

  const handleLike = useCallback(async () => {
    if (liking) return
    setLiking(true)
    const was = liked
    setLiked(!was)
    setLikes(n => was ? n - 1 : n + 1)
    if (!was) setHeartKey(k => k + 1)
    try {
      await apiFetch(`/nights/${post.id}/like`, { method: 'POST' })
    } catch {
      setLiked(was); setLikes(n => was ? n + 1 : n - 1)
    } finally { setLiking(false) }
  }, [liking, liked, post.id])

  const toggleComments = () => {
    setShowComments(v => !v)
  }

  // Focus input when comments section opens
  useEffect(() => {
    if (showComments) setTimeout(() => inputRef.current?.focus(), 120)
  }, [showComments])

  const submitComment = () => {
    const text = commentInput.trim()
    if (!text) return
    const newComment: Comment = {
      id: Date.now(),
      author: currentUsername ?? 'You',
      text,
      time: 'just now',
    }
    setComments(prev => [...prev, newComment])
    // Persist in memory so re-renders don't wipe comments
    SEED_COMMENTS[post.id] = [...(SEED_COMMENTS[post.id] ?? []), newComment]
    setCommentInput('')
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment() }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/feed`
    navigator.clipboard.writeText(url).catch(() => {})
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          {trending && (
            <span className="trending-badge" key={`trend-${likes}`}>🔥 Hot</span>
          )}
          {mood && (
            <span className="mood-tag">
              {MOODS[mood] ?? '🎉'} {post.mood}
            </span>
          )}
        </div>
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
            <Heart key={heartKey} size={14} fill={liked ? 'currentColor' : 'none'} />
            <span>{likes > 0 ? likes : 'Like'}</span>
          </button>
          <button
            className={`action-btn${showComments ? ' active' : ''}`}
            onClick={toggleComments}
          >
            <MessageCircle size={14} />
            <span>{comments.length > 0 ? comments.length : 'Comment'}</span>
          </button>
          <button className="action-btn" onClick={handleShare}>
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="comments-section slide-up">
            {comments.length > 0 && (
              <div className="comments-list">
                {comments.map(c => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-avatar">
                      {c.author[0].toUpperCase()}
                    </div>
                    <div className="comment-body">
                      <div className="comment-header-row">
                        <span className="comment-author">{c.author}</span>
                        <span className="comment-time">{c.time}</span>
                      </div>
                      <div className="comment-text">{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {comments.length === 0 && (
              <div className="comments-empty">Be the first to comment 💬</div>
            )}

            {/* Input */}
            <div className="comment-input-row">
              <div className="comment-avatar" style={{ flexShrink: 0 }}>
                {(currentUsername ?? 'Y')[0].toUpperCase()}
              </div>
              <input
                ref={inputRef}
                className="comment-input"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button
                className="comment-send-btn"
                onClick={submitComment}
                disabled={!commentInput.trim()}
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
