import { useState } from 'react';
import api from '../api';

export default function AIChat() {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!q.trim()) return;
    
    setLoading(true);
    setAns(''); // Purana answer clear karein
    try {
      const res = await api.post('/ai/ask', { question: q });
      setAns(res.data.answer);
    } catch (err) {
      setAns('❌ Sorry, the AI server is currently down. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-wide">
      <h2>AI Assistant 🤖</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Ask me anything about the campus (e.g., "Where is the library?", "Where is the cafeteria?")
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input 
          style={{ flex: 1, margin: 0 }} 
          onChange={e => setQ(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && ask()} // Enter dabane par bhi search ho
          placeholder="Type your question here..." 
          value={q}
        />
        <button 
          style={{ width: 'auto', margin: 0, padding: '0 20px', background: '#8b5cf6' }} 
          onClick={ask}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </div>

      {/* Answer Box */}
      {ans && (
        <div style={{ padding: '20px', background: '#f3e8ff', borderLeft: '4px solid #8b5cf6', borderRadius: '8px', marginTop: '20px' }}>
          <strong style={{ color: '#6b21a8' }}>AI Answer:</strong> 
          <p style={{ marginTop: '8px', whiteSpace: 'pre-line', color: '#333', lineHeight: '1.6' }}>
            {ans}
          </p>
        </div>
      )}
    </div>
  );
}