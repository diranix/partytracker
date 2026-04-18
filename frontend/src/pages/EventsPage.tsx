import { Calendar, MapPin, Plus, Users } from 'lucide-react'
import { useState } from 'react'
import type { User } from '../api/types'
import CreateEventModal from '../components/CreateEventModal'
import Sidebar from '../components/Sidebar'
import CreateNightModal from '../components/CreateNightModal'

interface Props { currentUser: User; onLogout: () => void }

const EVENTS = [
  { id: 1, title: 'Rooftop Summer Sessions', date: 'Fri, Apr 18', location: 'Club Vertex, London', attending: 24, tag: 'Tonight', seed: 'rooftop1' },
  { id: 2, title: 'Warehouse Rave', date: 'Sat, Apr 19', location: 'E1 Warehouse, London', attending: 48, tag: 'Tomorrow', seed: 'rave2' },
  { id: 3, title: 'Jazz & Cocktails', date: 'Sun, Apr 20', location: 'Bar Neon, Soho', attending: 17, tag: 'This Week', seed: 'jazz3' },
  { id: 4, title: 'Neon Party Night', date: 'Fri, Apr 25', location: 'XOYO, London', attending: 63, tag: 'Next Week', seed: 'neon4' },
]

export default function EventsPage({ currentUser, onLogout }: Props) {
  const [showEvent, setShowEvent] = useState(false)
  const [showNight, setShowNight] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar currentUser={currentUser} onCreateClick={() => setShowNight(true)} onLogout={onLogout} />

      <main className="app-content">
        <div className="page-header">
          <div>
            <div className="page-title">Events</div>
            <div className="page-subtitle">Upcoming parties & gatherings</div>
          </div>
          <button className="btn-primary" onClick={() => setShowEvent(true)}>
            <Plus size={15} /> Create Event
          </button>
        </div>

        <div className="events-layout">
          <div>
            <div className="section-header">
              <span className="section-title">Upcoming Events</span>
              <span className="view-all">See all</span>
            </div>
            <div className="events-grid-large">
              {EVENTS.map(ev => (
                <div key={ev.id} className="event-card-large">
                  <img
                    src={`https://picsum.photos/seed/${ev.seed}/700/400`}
                    alt={ev.title}
                    className="event-card-img-large"
                  />
                  <div className="event-card-large-body">
                    <span className="event-tag">{ev.tag}</span>
                    <div className="event-large-title">{ev.title}</div>
                    <div className="event-large-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} /> {ev.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} /> {ev.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users size={12} /> {ev.attending} attending
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showEvent && <CreateEventModal onClose={() => setShowEvent(false)} />}
      {showNight && <CreateNightModal currentUser={currentUser} onClose={() => setShowNight(false)} onCreated={() => setShowNight(false)} />}
    </div>
  )
}
