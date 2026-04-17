export default function CreateMenuModal({ onClose, onSelect }) {
  const items = [
    { type: 'night', icon: '🌙', label: 'New Night', desc: 'Log a night out with mood, drinks & location', bg: 'rgba(139,92,246,0.15)' },
    { type: 'event', icon: '🎉', label: 'New Event', desc: 'Create an event and invite your friends', bg: 'rgba(236,72,153,0.15)' },
    { type: 'recap', icon: '📸', label: 'New Recap', desc: 'Share a photo story from your night', bg: 'rgba(16,185,129,0.15)' },
    { type: 'invite', icon: '👥', label: 'Invite Friends', desc: 'Bring your crew to Party Tracker', bg: 'rgba(245,158,11,0.15)' },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Create</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="create-menu-grid">
          {items.map(item => (
            <div key={item.type} className="create-menu-item" onClick={() => onSelect(item.type)}>
              <div className="create-menu-icon" style={{ background: item.bg }}>
                {item.icon}
              </div>
              <div className="create-menu-label">{item.label}</div>
              <div className="create-menu-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
