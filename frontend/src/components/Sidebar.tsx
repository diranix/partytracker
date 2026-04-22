import { Calendar, Camera, LogOut, Map, MessageSquare, Sparkles, Users, Home, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { User as UserType } from '../api/types'

interface SidebarProps {
  currentUser: UserType
  onCreateClick: () => void
  onLogout: () => void
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  path: string
  badge?: number
}

function NavItem({ icon, label, path, badge }: NavItemProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={() => navigate(path)}>
      {icon}
      <span>{label}</span>
      {badge ? <span className="nav-badge">{badge}</span> : null}
    </div>
  )
}

export default function Sidebar({ currentUser, onLogout }: SidebarProps) {
  const navigate = useNavigate()
  const initial = currentUser.username[0].toUpperCase()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Sparkles size={16} color="#fff" />
        </div>
        Party Tracker
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <NavItem icon={<Home size={17} />}         label="Feed"      path="/feed" />
        <NavItem icon={<Calendar size={17} />}     label="Events"    path="/events" />
        <NavItem icon={<Users size={17} />}        label="Friends"   path="/friends" />
        <NavItem icon={<MessageSquare size={17} />} label="Messages" path="/messages" badge={3} />
        <NavItem icon={<Camera size={17} />}       label="Memories"  path="/memories" />
        <NavItem icon={<Map size={17} />}          label="Live Map"  path="/map" />
        <NavItem icon={<User size={17} />}         label="Profile"   path="/profile" />
      </nav>

      {/* User */}
      <div className="sidebar-bottom">
        <div className="sidebar-user" onClick={() => navigate('/profile')}>
          <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
            {initial}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-username">{currentUser.username}</div>
            <div className="sidebar-handle">@{currentUser.username.toLowerCase()}</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onLogout() }}
            style={{ color: 'var(--muted2)', padding: 4 }}
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
