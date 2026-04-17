import { Heart, MapPin, Star, Wine } from 'lucide-react'
import { useState } from 'react'
import { apiFetch } from '../api/client'
import type { Night } from '../api/types'

interface PostCardProps {
  post: Night
}

const MOOD_STYLES: Record<string, { bg: string; color: string }> = {
  euphoric: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
  chill:    { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf' },
  happy:    { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  intense:  { bg: 'rgba(239,68,68,0.12)',  color: '#f87171' },
  wild:     { bg: 'rgba(249,115,22,0.12)', color: '#fb923c' },
  tired:    { bg: 'rgba(113,113,122,0.12)', color: '#a1a1aa' },
}

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.is_liked ?? false)
  const [likes, setLikes] = useState(post.likes_count ?? 0)
  const [liking, setLiking] = useState(false)

  const handleLike = async () => {
    if (liking) return
    setLiking(true)
    const wasLiked = liked
    setLiked(!wasLiked)
    setLikes(prev => wasLiked ? prev - 1 : prev + 1)

    try {
      if (wasLiked) {
        await apiFetch(`/nights/${post.id}/unlike`, { method: 'POST' })
      } else {
        await apiFetch(`/nights/${post.id}/like`, { method: 'POST' })
      }
    } catch {
      // Revert on error
      setLiked(wasLiked)
      setLikes(prev => wasLiked ? prev + 1 : prev - 1)
    } finally {
      setLiking(false)
    }
  }

  const moodStyle = post.mood ? (MOOD_STYLES[post.mood.toLowerCase()] ?? MOOD_STYLES.chill) : null

  return (
    <article style={{
      background: 'var(--color-card)',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      marginBottom: '16px',
      transition: 'border-color 0.15s ease',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px' }}>
        <img
          src={`https://i.pravatar.cc/150?u=${post.owner_id}`}
          alt={post.owner_username ?? 'user'}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {post.owner_username ?? 'Unknown'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
            {formatDate(post.date)}
          </div>
        </div>
        {/* Rating badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'rgba(139,92,246,0.12)',
          color: 'var(--color-accent)',
          padding: '4px 10px', borderRadius: '999px',
          fontSize: '12px', fontWeight: 600,
        }}>
          <Star size={11} fill="currentColor" />
          {post.rating}
        </div>
      </div>

      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: 'var(--color-hover)' }}>
        <img
          src={`https://picsum.photos/seed/${post.id}/600/750`}
          alt={post.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.02)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
        />
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Title + location */}
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.2px' }}>{post.title}</div>
          {post.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-muted)', fontSize: '12px', marginTop: '3px' }}>
              <MapPin size={11} />
              {post.location}
            </div>
          )}
        </div>

        {/* Caption */}
        {post.caption && (
          <p style={{ fontSize: '13.5px', lineHeight: 1.5, color: 'var(--color-foreground)' }}>
            {post.caption}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-secondary)', fontSize: '12.5px' }}>
              <Wine size={13} style={{ color: 'var(--color-muted)' }} />
              {post.drinks_count} drinks
            </div>
          </div>
          {moodStyle && (
            <span style={{
              fontSize: '11px', fontWeight: 500,
              padding: '3px 9px', borderRadius: '999px',
              background: moodStyle.bg, color: moodStyle.color,
              letterSpacing: '0.2px',
            }}>
              {post.mood}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', alignItems: 'center',
          paddingTop: '8px', marginTop: '2px',
          borderTop: '1px solid var(--color-border-subtle)',
        }}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 10px', borderRadius: 'var(--radius-sm)',
              fontSize: '13px', fontWeight: 500,
              color: liked ? 'var(--color-like)' : 'var(--color-muted)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              if (!liked) (e.currentTarget as HTMLElement).style.color = 'var(--color-like)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.1)'
            }}
            onMouseLeave={e => {
              if (!liked) (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)'
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <Heart
              size={15}
              fill={liked ? 'var(--color-like)' : 'none'}
              stroke={liked ? 'var(--color-like)' : 'currentColor'}
            />
            {likes > 0 ? likes : 'Like'}
          </button>
        </div>
      </div>
    </article>
  )
}
