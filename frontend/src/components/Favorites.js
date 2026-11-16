import { useState, useEffect } from 'react';
import api from '../api';

export default function Favorites() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites');
      setList(res.data);
    } catch (e) {
      setMsg('❌ ' + (e.response?.data || e.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setList(list.filter(l => l.id !== id));
    } catch (e) {
      setMsg('❌ ' + (e.response?.data || e.message));
    }
  };

  return (
    <div className="card card-wide" style={{ maxWidth: '800px' }}>
      <h2>♥ My Favorites</h2>

      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {msg && <p className="msg error">{msg}</p>}

      {!loading && list.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px' }}>
          Abhi tak koi favorite nahi. Search page par ♥ button dabao.
        </p>
      )}

      <ul>
        {list.map(l => (
          <li key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <strong>{l.name}</strong> — {l.building} / {l.type} / Floor {l.floor}
              {l.accessible && ' ♿'}
            </span>
            <button
              style={{ width: 'auto', padding: '4px 10px', margin: 0, background: '#ef4444', fontSize: '12px' }}
              onClick={() => remove(l.id)}
            >
              ♥ Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}