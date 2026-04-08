import { useNavigate, useLocation } from 'react-router-dom'
import { HomeIcon, UserIcon, PlusIcon, LogOutIcon } from './icons'

export default function Navbar({ currentUser, onCreatePost, onLogout }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>Party</span>Tracker
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${pathname === '/feed' ? 'active' : ''}`}
            onClick={() => navigate('/feed')}
          >
            <HomeIcon size={18} />
            Feed
          </div>
          <div
            className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
          >
            <UserIcon size={18} />
            Profile
          </div>
        </nav>

        <button className="sidebar-create-btn" onClick={onCreatePost}>
          <PlusIcon size={16} />
          New Night
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="avatar"
              width={36}
              height={36}
            />
            <div className="sidebar-user-info">
              <div className="sidebar-username">{currentUser.username}</div>
            </div>
            <button
              onClick={onLogout}
              title="Log out"
              style={{ color: 'var(--text-muted)', padding: '4px', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOutIcon size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <div className="mobile-logo">
          <span>Party</span>Tracker
        </div>
        <img
          src={currentUser.avatar}
          alt={currentUser.username}
          className="avatar"
          width={30}
          height={30}
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Mobile bottom bar */}
      <div className="mobile-bottombar">
        <div
          className={`mobile-tab ${pathname === '/feed' ? 'active' : ''}`}
          onClick={() => navigate('/feed')}
        >
          <HomeIcon size={22} />
          Feed
        </div>

        <div className="mobile-create-tab" onClick={onCreatePost}>
          <PlusIcon size={22} />
        </div>

        <div
          className={`mobile-tab ${pathname === '/profile' ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
        >
          <UserIcon size={22} />
          Profile
        </div>
      </div>
    </>
  )
}
