import { BarChart2, Star, TrendingUp, Wine } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { apiFetch } from '../api/client'
import type { Night, User } from '../api/types'
import CreatePostModal from '../components/CreatePostModal'
import Navbar from '../components/Navbar'

interface StatsPageProps {
  currentUser: User
  onLogout: () => void
}

const MOOD_COLORS: Record<string, string> = {
  euphoric: '#a78bfa',
  chill: '#2dd4bf',
  happy: '#fbbf24',
  intense: '#f87171',
  wild: '#fb923c',
  tired: '#a1a1aa',
}

export default function StatsPage({ currentUser, onLogout }: StatsPageProps) {
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

  // Compute stats
  const totalNights = posts.length
  const avgRating = totalNights ? posts.reduce((s, p) => s + p.rating, 0) / totalNights : 0
  const totalDrinks = posts.reduce((s, p) => s + p.drinks_count, 0)
  const bestNight = posts.length ? posts.reduce((a, b) => b.rating > a.rating ? b : a) : null

  // Monthly data
  const byMonth: Record<string, { nights: number; drinks: number; ratingSum: number }> = {}
  posts.forEach(p => {
    const key = p.date ? p.date.slice(0, 7) : 'Unknown'
    if (!byMonth[key]) byMonth[key] = { nights: 0, drinks: 0, ratingSum: 0 }
    byMonth[key].nights++
    byMonth[key].drinks += p.drinks_count
    byMonth[key].ratingSum += p.rating
  })
  const monthlyData = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, d]) => ({
      month: new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(new Date(month + '-01')),
      nights: d.nights,
      drinks: d.drinks,
      avgRating: Math.round((d.ratingSum / d.nights) * 10) / 10,
    }))

  // Mood distribution
  const moodCounts: Record<string, number> = {}
  posts.forEach(p => { if (p.mood) moodCounts[p.mood] = (moodCounts[p.mood] ?? 0) + 1 })
  const moodData = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([mood, count]) => ({ mood, count }))

  const statCards = [
    { icon: BarChart2, label: 'Total Nights', value: totalNights, color: 'var(--color-accent)' },
    { icon: Star, label: 'Avg Rating', value: avgRating.toFixed(1), color: '#fbbf24' },
    { icon: Wine, label: 'Total Drinks', value: totalDrinks, color: '#2dd4bf' },
    { icon: TrendingUp, label: 'Best Night', value: bestNight ? `${bestNight.rating}/10` : '—', color: '#fb923c' },
  ]

  const tooltipStyle = {
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '13px',
    color: 'var(--color-foreground)',
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
        <div style={{ width: '100%', maxWidth: '680px' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>Your Stats</div>
            <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
              Insights from all your nights out
            </div>
          </div>

          {loading && (
            <div style={{ color: 'var(--color-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              Loading...
            </div>
          )}

          {!loading && (
            <>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {statCards.map(({ icon: Icon, label, value, color }) => (
                  <div key={label} style={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-card)',
                    padding: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: `${color}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={16} style={{ color }} />
                      </div>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.4px', color }}>{value}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Monthly chart */}
              <div style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '20px',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Nights per Month</div>
                {monthlyData.length === 0 ? (
                  <div style={{ color: 'var(--color-muted)', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                    Not enough data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                      <XAxis dataKey="month" tick={{ fill: 'var(--color-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(139,92,246,0.08)' }} />
                      <Bar dataKey="nights" radius={[4,4,0,0]} fill="var(--color-accent)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Drinks chart */}
              <div style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: '20px',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Drinks per Month</div>
                {monthlyData.length === 0 ? (
                  <div style={{ color: 'var(--color-muted)', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                    Not enough data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                      <XAxis dataKey="month" tick={{ fill: 'var(--color-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(45,212,191,0.08)' }} />
                      <Bar dataKey="drinks" radius={[4,4,0,0]} fill="#2dd4bf" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Mood distribution */}
              {moodData.length > 0 && (
                <div style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-card)',
                  padding: '20px',
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Mood Distribution</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={moodData} layout="vertical" margin={{ top: 0, right: 8, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: 'var(--color-muted)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <YAxis type="category" dataKey="mood" tick={{ fill: 'var(--color-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(139,92,246,0.08)' }} />
                      <Bar dataKey="count" radius={[0,4,4,0]}>
                        {moodData.map(entry => (
                          <Cell key={entry.mood} fill={MOOD_COLORS[entry.mood] ?? 'var(--color-accent)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
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
