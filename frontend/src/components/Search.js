import { useState, useEffect } from 'react';
import api from '../api';

const TYPES = ['', 'CLASSROOM', 'LAB', 'LIBRARY', 'OFFICE', 'CAFETERIA', 'PARKING', 'HOSTEL', 'OTHER'];

export default function Search() {
  const [q, setQ] = useState('');
  const [building, setBuilding] = useState('');
  const [type, setType] = useState('');
  const [list, setList] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [recent, setRecent] = useState([]);

  // Load recent searches + favorites on mount
  useEffect(() => {
    loadRecent();
    loadFavorites();
  }, []);

  const loadRecent = async () => {
    try {
      const res = await api.get('/recent-searches');
      setRecent(res.data || []);
    } catch { /* ignore */ }
  };

  const loadFavorites = async () => {
    try {
      const res = await api.get('/favorites');
      setFavorites(new Set(res.data.map(f => f.id)));
    } catch { /* ignore */ }
  };

  const search = async (overrideQ) => {
    const query = overrideQ !== undefined ? overrideQ : q;
    setLoading(true);
    try {
      const params = {};
      if (query) params.q = query;
      if (building) params.building = building;
      if (type) params.type = type;

      const res = await api.get('/locations', { params });
      setList(res.data);
      setSearched(true);

      // Record search (if query non-empty)
      if (query && query.trim()) {
        try {
          await api.post('/recent-searches', { query: query.trim() });
          loadRecent();
        } catch { /* ignore */ }
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    const isFav = favorites.has(id);
    try {
      if (isFav) {
        await api.delete(`/favorites/${id}`);
        const next = new Set(favorites);
        next.delete(id);
        setFavorites(next);
      } else {
        await api.post(`/favorites/${id}`);
        const next = new Set(favorites);
        next.add(id);
        setFavorites(next);
      }
    } catch (e) {
      alert('Error: ' + (e.response?.data || e.message));
    }
  };

  const clearRecent = async () => {
    try {
      await api.delete('/recent-searches');
      setRecent([]);
    } catch { /* ignore */ }
  };

  return (
    <div className="card card-wide">
      <h2>Search Location</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
        <input
          placeholder="Search by name..."
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          style={{ margin: 0 }}
        />
        <input
          placeholder="Building..."
          value={building}
          onChange={e => setBuilding(e.target.value)}
          style={{ margin: 0 }}
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        >
          {TYPES.map(t => <option key={t} value={t}>{t || 'All types'}</option>)}
        </select>
      </div>

      <button onClick={() => search()} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Recent searches */}
      {recent.length > 0 && (
        <div style={{ marginTop: '15px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '14px', color: '#475569' }}>🕘 Recent Searches</strong>
            <button
              style={{ width: 'auto', padding: '2px 8px', margin: 0, background: '#94a3b8', fontSize: '11px' }}
              onClick={clearRecent}
            >
              Clear
            </button>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {recent.map((r, i) => (
              <button
                key={i}
                style={{
                  width: 'auto', padding: '4px 12px', margin: 0,
                  background: '#e2e8f0', color: '#1e293b', fontSize: '13px', fontWeight: 'normal'
                }}
                onClick={() => { setQ(r); search(r); }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <ul>
        {list.map(l => (
          <li key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <strong>{l.name}</strong> — {l.building} / {l.type} / Floor {l.floor}
              {l.accessible && ' ♿'}
              {l.description && (
                <div style={{ fontSize: '13px', color: '#666' }}>{l.description}</div>
              )}
            </span>
            <button
              style={{
                width: 'auto', padding: '4px 10px', margin: 0, fontSize: '14px',
                background: favorites.has(l.id) ? '#ef4444' : '#94a3b8'
              }}
              onClick={() => toggleFavorite(l.id)}
              title={favorites.has(l.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favorites.has(l.id) ? '♥' : '♡'}
            </button>
          </li>
        ))}
      </ul>

      {searched && list.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#ef4444', marginTop: '15px' }}>
          😔 Koi location nahi mili.
        </p>
      )}
    </div>
  );
}