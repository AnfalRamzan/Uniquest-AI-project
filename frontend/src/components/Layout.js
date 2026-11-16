import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // 👈 Role check karein

  const links = [
    { to: '/home',          label: 'Dashboard',     icon: '🏠' }, // 👈 Naya Dashboard Tab
    { to: '/search',        label: 'Search',        icon: '🔍' },
    { to: '/favorites',     label: 'Favorites',     icon: '♥' }, 
    { to: '/announcements', label: 'Announcements', icon: '📢' }, 
    { to: '/map',           label: 'Map',           icon: '🗺️' },
    { to: '/ai',            label: 'AI Chat',       icon: '🤖' },
  ];

  // 👈 Agar user ADMIN hai, tabhi Admin link add karein
  if (role === 'ADMIN') {
    links.push({ to: '/admin', label: 'Admin', icon: '⚙️' });
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Logout pe role bhi clear karein
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>UniQuest AI</h2>
          <p>Smart Campus</p>
        </div>

        <nav className="sidebar-nav">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={logout}
            className="sidebar-link logout"
            style={{
              background: 'transparent',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              margin: 0,
              padding: '12px 14px',
            }}
          >
            <span className="sidebar-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}