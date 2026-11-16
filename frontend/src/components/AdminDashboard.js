import { useState, useEffect } from 'react';
import api from '../api';

const TYPES = ['CLASSROOM', 'LAB', 'LIBRARY', 'OFFICE', 'CAFETERIA', 'PARKING', 'HOSTEL', 'OTHER'];

const emptyForm = {
  name: '', building: '', type: 'CLASSROOM', floor: 0,
  description: '', latitude: 33.6844, longitude: 73.0479, accessible: false,
};

export default function AdminDashboard() {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  
  // 👇 Security Check (Role)
  const role = localStorage.getItem('role');

  const load = async () => {
    try {
      const res = await api.get('/locations');
      setList(res.data);
    } catch (e) {
      setMsg('❌ Load failed: ' + (e.response?.data || e.message));
    }
  };

  useEffect(() => { 
    // Agar role ADMIN hai tabhi data load karein
    if (role === 'ADMIN') {
      load(); 
    }
  }, [role]);

  const onChange = (field, val) => setForm({ ...form, [field]: val });

  const submit = async () => {
    if (!form.name || !form.building) return setMsg('❌ Name and Building are required');
    setLoading(true); setMsg('');
    try {
      if (editingId) {
        await api.put(`/locations/${editingId}`, form);
        setMsg('✅ Updated successfully!');
      } else {
        await api.post('/locations', form);
        setMsg('✅ Created successfully!');
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data || e.message));
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (loc) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name, building: loc.building, type: loc.type,
      floor: loc.floor, description: loc.description || '',
      latitude: loc.latitude, longitude: loc.longitude,
      accessible: !!loc.accessible,
    });
  };

  const cancelEdit = () => { setEditingId(null); setForm(emptyForm); setMsg(''); };

  const remove = async (id) => {
    if (!window.confirm('Delete this location?')) return;
    try {
      await api.delete(`/locations/${id}`);
      setMsg('✅ Deleted successfully');
      load();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data || e.message));
    }
  };

  // 👇 ACCESS DENIED SCREEN
  if (role !== 'ADMIN') {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: '50px', maxWidth: '500px' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>⛔ Access Denied</h2>
        <p style={{ color: '#64748b', lineHeight: '1.6' }}>
          You do not have permission to view this page. <br />
          Admin access is required.
        </p>
      </div>
    );
  }

  return (
    <div className="card card-wide" style={{ maxWidth: '800px' }}>
      <h2>Admin — Locations</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <input placeholder="Name" value={form.name}
          onChange={e => onChange('name', e.target.value)} />
        <input placeholder="Building" value={form.building}
          onChange={e => onChange('building', e.target.value)} />
        <select value={form.type} onChange={e => onChange('type', e.target.value)}
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <input type="number" placeholder="Floor" value={form.floor}
          onChange={e => onChange('floor', Number(e.target.value))} />
        <input type="number" step="0.0001" placeholder="Latitude" value={form.latitude}
          onChange={e => onChange('latitude', Number(e.target.value))} />
        <input type="number" step="0.0001" placeholder="Longitude" value={form.longitude}
          onChange={e => onChange('longitude', Number(e.target.value))} />
        <input placeholder="Description" value={form.description}
          onChange={e => onChange('description', e.target.value)}
          style={{ gridColumn: '1 / span 2' }} />
        <label style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" checked={form.accessible}
            onChange={e => onChange('accessible', e.target.checked)}
            style={{ width: 'auto' }} />
          Wheelchair accessible
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button onClick={submit} disabled={loading}>
          {loading ? 'Processing...' : editingId ? 'Update Location' : 'Add Location'}
        </button>
        {editingId && (
          <button onClick={cancelEdit} style={{ background: '#94a3b8' }}>Cancel</button>
        )}
      </div>

      {msg && <p className={`msg ${msg.includes('✅') ? 'success' : 'error'}`}>{msg}</p>}

      <hr style={{ margin: '20px 0' }} />

      <h3>All Locations ({list.length})</h3>
      <ul>
        {list.map(l => (
          <li key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <strong>{l.name}</strong> — {l.building} / {l.type} / Floor {l.floor}
              {l.accessible && ' ♿'}
            </span>
            <span style={{ display: 'flex', gap: '6px' }}>
              <button style={{ width: 'auto', padding: '4px 10px', margin: 0 }}
                onClick={() => startEdit(l)}>Edit</button>
              <button style={{ width: 'auto', padding: '4px 10px', margin: 0, background: '#ef4444' }}
                onClick={() => remove(l.id)}>Del</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}