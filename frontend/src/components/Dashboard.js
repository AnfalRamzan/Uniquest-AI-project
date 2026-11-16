import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name') || 'User'; // Agar aapne login pe name save kiya hai
  
  const [stats, setStats] = useState({ locations: 0, announcements: 0 });
  const [recentAnns, setRecentAnns] = useState([]);

  useEffect(() => {
    // Data Fetch karein
    const fetchData = async () => {
      try {
        const locRes = await api.get('/locations');
        const annRes = await api.get('/announcements');
        
        setStats({
          locations: locRes.data.length,
          announcements: annRes.data.length
        });
        setRecentAnns(annRes.data.slice(0, 3)); // Sirf latest 3 announcements
      } catch (e) {
        console.error("Error loading dashboard data");
      }
    };
    fetchData();
  }, []);

  // ================= ADMIN DASHBOARD =================
  if (role === 'ADMIN') {
    return (
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2>👑 Admin Dashboard</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>System Overview and Management</p>

        {/* Stats Cards */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ flex: 1, background: '#3b82f6', color: 'white', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '32px' }}>{stats.locations}</h3>
            <p style={{ margin: 0 }}>Total Locations</p>
          </div>
          <div style={{ flex: 1, background: '#10b981', color: 'white', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '32px' }}>{stats.announcements}</h3>
            <p style={{ margin: 0 }}>Announcements</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h3>⚡ Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <button onClick={() => navigate('/admin')} style={{ flex: 1, padding: '15px', background: '#1e293b' }}>
            ➕ Add / Manage Locations
          </button>
          <button onClick={() => navigate('/announcements')} style={{ flex: 1, padding: '15px', background: '#8b5cf6' }}>
            📢 Post Announcement
          </button>
        </div>
      </div>
    );
  }

  // ================= STUDENT / USER DASHBOARD =================
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Welcome back, {name}! 🎓</h2>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Find your way around the campus easily.</p>

      {/* Quick Links (Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div onClick={() => navigate('/search')} style={{ cursor: 'pointer', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>🔍</h1>
          <h3 style={{ margin: '10px 0 5px 0' }}>Search</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Find classrooms & labs</p>
        </div>
        <div onClick={() => navigate('/map')} style={{ cursor: 'pointer', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>🗺️</h1>
          <h3 style={{ margin: '10px 0 5px 0' }}>Campus Map</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Get directions</p>
        </div>
        <div onClick={() => navigate('/ai')} style={{ cursor: 'pointer', background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>🤖</h1>
          <h3 style={{ margin: '10px 0 5px 0' }}>AI Assistant</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Ask campus questions</p>
        </div>
      </div>

      {/* Latest Announcements */}
      <h3>📢 Latest Announcements</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        {recentAnns.length > 0 ? recentAnns.map(a => (
          <div key={a.id} style={{ padding: '15px', background: '#fff', borderLeft: '4px solid #3b82f6', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <strong>{a.title}</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#475569' }}>{a.body}</p>
          </div>
        )) : (
          <p style={{ color: '#94a3b8' }}>No announcements yet.</p>
        )}
      </div>
    </div>
  );
}