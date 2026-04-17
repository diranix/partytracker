import { useLocation, useNavigate } from 'react-router-dom'

const NavItem = ({ icon, label, path, badge, onClick, active }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = active !== undefined ? active : location.pathname === path

  return (
    <div className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick || (() => navigate(path))}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </div>
  )
}

export default function Sidebar({ currentUser, onLogout, onCreateClick }) {
  const navigate = useNavigate()
  const initial = currentUser?.username?.[0]?.toUpperCase() || '?'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{ color: 'var(--accent)', fontSize: 22 }}>✦</span>
        Party<span className="sidebar-logo-dot">Tracker</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        <NavItem icon="🏠" label="Feed" path="/feed" />
        <NavItem icon="🗺️" label="Live Map" path="/map" />
        <NavItem icon="🎉" label="Events" path="/events" />

        <div className="sidebar-section-label">Social</div>
        <NavItem icon="👥" label="Friends" path="/friends" badge="3" />
        <NavItem icon="💬" label="Messages" path="/messages" />

        <div className="sidebar-section-label">Personal</div>
        <NavItem icon="🌟" label="Memories" path="/memories" />
        <NavItem icon="👤" label="Profile" path="/profile" />
      </nav>

      <button className="sidebar-create-btn" onClick={onCreateClick}>
        <span style={{ fontSize: 16 }}>✦</span>
        Create
      </button>

      <div className="sidebar-bottom" style={{ marginTop: 16 }}>
        <div className="sidebar-user" onClick={() => navigate('/profile')}>
          <div className="avatar" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), #EC4899)', fontSize: 14, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {initial}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-username">{currentUser?.username || 'User'}</div>
            <div className="sidebar-handle">@{currentUser?.username?.toLowerCase() || 'user'}</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onLogout() }}
            style={{ color: 'var(--muted2)', fontSize: 16, padding: 4, borderRadius: 6, transition: 'color 0.15s' }}
            title="Logout"
          >
            ⎋
          </button>
        </div>
      </div>
    </aside>
  )
}
