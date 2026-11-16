import { Link } from 'react-router-dom';
import homeBg from '../assets/image.png';

export default function Home() {
  const features = [
    { to: '/search', icon: '🔍', title: 'Search Locations', desc: 'Find classrooms, labs, libraries, and more by name, building, or type.', color: '#3b82f6' },
    { to: '/map',    icon: '🗺️', title: 'Campus Map',       desc: 'View all campus locations on an interactive map with markers.', color: '#10b981' },
    { to: '/ai',     icon: '🤖', title: 'AI Assistant',     desc: 'Ask questions about the campus and get instant AI-powered answers.', color: '#8b5cf6' },
    { to: '/admin',  icon: '⚙️', title: 'Admin Panel',      desc: 'Add, edit, or delete campus locations (admin access only).', color: '#f59e0b' },
  ];

  return (
    <div className="home-page" style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
      {/* 🖼️ Background Image */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${homeBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -2,
          pointerEvents: 'none',
        }}
      ></div>

      {/* 🌑 Dark Overlay for readability */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.7) 0%, rgba(30,41,59,0.55) 100%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      ></div>

      {/* 📄 Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
        <div className="home-hero">
          <h1>Welcome to <span>UniQuest AI</span></h1>
          <p>Your smart campus navigation companion. Find any place, ask anything, get there faster.</p>
        </div>

        <div className="home-grid">
          {features.map(f => (
            <Link key={f.to} to={f.to} className="home-card" style={{ '--accent': f.color }}>
              <div className="home-card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="home-card-arrow">Go →</span>
            </Link>
          ))}
        </div>

        <div className="home-tips">
          <h2>💡 Quick Tips</h2>
          <ul>
            <li>Use the sidebar to jump between sections quickly.</li>
            <li>On the Search page, filter by building or type to narrow results.</li>
            <li>Ask the AI Assistant things like "Where is the library?"</li>
            <li>Admins can manage all locations from the Admin Panel.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}