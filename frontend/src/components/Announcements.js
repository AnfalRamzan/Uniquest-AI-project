import { useState, useEffect } from 'react';
import api from '../api';

const CATEGORIES = ['', 'GENERAL', 'EXAM', 'EVENT', 'NOTICE', 'EMERGENCY'];
const CAT_COLORS = {
  GENERAL: '#3b82f6', EXAM: '#f59e0b', EVENT: '#10b981', 
  NOTICE: '#8b5cf6', EMERGENCY: '#ef4444'
};

export default function Announcements() {
  const [list, setList] = useState([]);
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'GENERAL' });

  useEffect(() => { load(); }, [category]);

  const load = async () => {
    try {
      const params = category ? { category } : {};
      const res = await api.get('/announcements', { params });
      setList(res.data);
    } catch (e) { alert('Error loading announcements'); }
  };

  const submit = async () => {
    try {
      await api.post('/announcements', form);
      setForm({ title: '', body: '', category: 'GENERAL' });
      setShowForm(false);
      load();
    } catch (e) { alert('Only admins can post announcements'); }
  };

  return (
    <div className="card card-wide" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>📢 Campus Announcements</h2>
        <button style={{ width: 'auto', padding: '8px 16px', margin: 0 }} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f1f5f9', borderRadius: '8px' }}>
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ marginBottom: '10px' }} />
          <textarea placeholder="Body" value={form.body} onChange={e => setForm({...form, body: e.target.value})} rows={3} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px' }} />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px' }}>
            {CATEGORIES.filter(c => c).map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={submit} style={{ background: '#10b981' }}>Publish</button>
        </div>
      )}

      <div style={{ margin: '20px 0' }}>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '6px' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
      </div>

      {list.map(a => (
        <div key={a.id} style={{ padding: '15px', marginBottom: '10px', borderLeft: `5px solid ${CAT_COLORS[a.category] || '#3b82f6'}`, background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: CAT_COLORS[a.category] }}>{a.category}</span>
          <h3 style={{ margin: '5px 0' }}>{a.title}</h3>
          <p style={{ color: '#475569' }}>{a.body}</p>
        </div>
      ))}
    </div>
  );
}