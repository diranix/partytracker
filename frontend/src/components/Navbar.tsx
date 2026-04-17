import { BarChart2, Home, LogOut, PlusCircle, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { User as UserType } from '../api/types'

interface NavbarProps {
  currentUser: UserType
  onCreatePost: () => void
  onLogout: () => void
}

export default function Navbar({ currentUser, onCreatePost, onLogout }: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { icon: Home, label: 'Feed', path: '/feed' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: BarChart2, label: 'Stats', path: '/stats' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0,
        width: 'var(--sidebar-w)', height: '100vh',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 16px',
        zIndex: 100,
      }} className="hidden md:flex">
        {/* Logo */}
        <div style={{
          fontSize: '17px', fontWeight: 700,
          letterSpacing: '-0.4px',
          padding: '8px 12px', marginBottom: '32px',
        }}>
          <span style={{ color: 'var(--color-accent)' }}>Party</span>Tracker
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px', fontWeight: 500,
                color: isActive(path) ? 'var(--color-accent)' : 'var(--color-secondary)',
                background: isActive(path) ? 'rgba(139,92,246,0.12)' : 'transparent',
                transition: 'all 0.15s ease',
                width: '100%', textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!isActive(path)) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-hover)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--color-foreground)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive(path)) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--color-secondary)'
                }
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}

          {/* Create button */}
          <button
            onClick={onCreatePost}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '11px',
              background: 'var(--color-accent)', color: '#fff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px', fontWeight: 600,
              marginTop: '16px', transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-hover)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-accent)' }}
          >
            <PlusCircle size={16} />
            New Night
          </button>
        </nav>

        {/* User bottom */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px', borderRadius: 'var(--radius-sm)',
          }}>
            <img
              src={`https://i.pravatar.cc/150?u=${currentUser.id}`}
              alt={currentUser.username}
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.username}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                {currentUser.email}
              </div>
            </div>
            <button
              onClick={onLogout}
              style={{ color: 'var(--color-muted)', padding: '4px' }}
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <header style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '52px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 100,
      }} className="flex md:hidden">
        <div style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>
          <span style={{ color: 'var(--color-accent)' }}>Party</span>Tracker
        </div>
        <button onClick={onLogout} style={{ color: 'var(--color-muted)' }}>
          <LogOut size={18} />
        </button>
      </header>

      {/* ── Mobile Bottom Bar ── */}
      <nav style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '56px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        alignItems: 'center', justifyContent: 'space-around',
        zIndex: 100,
      }} className="flex md:hidden">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '3px',
              padding: '6px 20px',
              color: isActive(path) ? 'var(--color-accent)' : 'var(--color-muted)',
              fontSize: '11px', fontWeight: 500,
              transition: 'color 0.15s ease',
            }}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
        <button
          onClick={onCreatePost}
          style={{
            width: '44px', height: '44px',
            background: 'var(--color-accent)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}
        >
          <PlusCircle size={20} />
        </button>
      </nav>
    </>
  )
}
