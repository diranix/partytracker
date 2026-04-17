import Sidebar from '../components/Sidebar'

const STATS = [
  { icon: '🌙', value: '47', label: 'Total Nights' },
  { icon: '🍹', value: '284', label: 'Total Drinks' },
  { icon: '⭐', value: '4.2', label: 'Avg Rating' },
  { icon: '👥', value: '12', label: 'Friends Tagged' },
]

const THROWBACKS = [
  { title: 'Rooftop Rave 2024', date: '1 year ago', location: 'Club Vertex', mood: '🔥', rating: 5 },
  { title: 'New Year\'s Eve Party', date: '4 months ago', location: 'Downtown Lounge', mood: '🎉', rating: 5 },
]

const TIMELINE = [
  { date: 'Apr 12', title: 'Chill Lounge Night', location: 'Bar Neon', mood: '😌', rating: 4 },
  { date: 'Apr 5', title: 'Birthday Bash', location: 'Rooftop 22', mood: '🔥', rating: 5 },
  { date: 'Mar 29', title: 'Saturday Vibes', location: 'Club Echo', mood: '⚡', rating: 3 },
  { date: 'Mar 22', title: 'Dinner & After', location: 'Noma + Bar 33', mood: '😊', rating: 4 },
  { date: 'Mar 15', title: 'Casual Friday', location: 'The Local', mood: '😌', rating: 3 },
]

export default function MemoriesPage({ currentUser, onLogout }) {
  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="app-content">
        <div className="memories-layout">
          <div className="section-header" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px' }}>🌟 Memories</div>
          </div>

          {/* Stats */}
          <div className="memories-stats">
            {STATS.map((s, i) => (
              <div key={i} className="memory-stat-card">
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Throwbacks */}
          <div style={{ marginBottom: 32 }}>
            <div className="section-header">
              <div className="section-title">✨ Throwbacks</div>
            </div>
            {THROWBACKS.map((t, i) => (
              <div key={i} className="throwback-card">
                <div className="throwback-header">
                  <span style={{ fontSize: 16 }}>⏪</span>
                  <div>
                    <div className="throwback-label">On this day</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{t.date}</div>
                  </div>
                </div>
                <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    {t.mood}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>📍 {t.location}</div>
                  </div>
                  <div style={{ color: 'var(--yellow)', fontSize: 16 }}>{'★'.repeat(t.rating)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div>
            <div className="section-header">
              <div className="section-title">📅 Timeline</div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 20px' }}>
              {TIMELINE.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-dot">
                    <div className="timeline-dot-circle" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">
                      {item.mood} {item.title}
                    </div>
                    <div className="timeline-meta">📍 {item.location} · {'★'.repeat(item.rating)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
