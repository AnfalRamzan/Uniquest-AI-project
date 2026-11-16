import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api';
import L from 'leaflet';

// Fix for missing marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView() {
  const [locations, setLocations] = useState([]);
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [strategy, setStrategy] = useState('shortestPath');
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    api.get('/locations').then(res => setLocations(res.data)).catch(console.error);
  }, []);

  const planRoute = async () => {
    if (!startId || !endId) return alert('Please select both Start and Destination');
    if (startId === endId) return alert('Start and Destination cannot be same');
    
    try {
      const res = await api.get(`/routes?startId=${startId}&endId=${endId}&strategy=${strategy}`);
      setRouteInfo(res.data);
    } catch (e) {
      alert('Error planning route');
    }
  };

  const startLoc = locations.find(l => l.id === parseInt(startId));
  const endLoc = locations.find(l => l.id === parseInt(endId));

  return (
    <div className="card card-wide" style={{ maxWidth: '900px' }}>
      <h2>Interactive Campus Map</h2>
      
      {/* Route Planner UI */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <select value={startId} onChange={e => setStartId(e.target.value)} style={{ flex: 1, padding: '10px' }}>
          <option value="">-- Select Start Location --</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select value={endId} onChange={e => setEndId(e.target.value)} style={{ flex: 1, padding: '10px' }}>
          <option value="">-- Select Destination --</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select value={strategy} onChange={e => setStrategy(e.target.value)} style={{ padding: '10px' }}>
          <option value="shortestPath">Shortest Path</option>
          <option value="accessiblePath">Accessible Path</option>
        </select>
        <button onClick={planRoute} style={{ width: 'auto', margin: 0 }}>Find Route</button>
      </div>

      {/* Route Info Box */}
      {routeInfo && (
        <div style={{ padding: '15px', background: '#e0f2fe', borderRadius: '8px', marginBottom: '15px' }}>
          {routeInfo.error ? (
            <p style={{ color: 'red', margin: 0 }}>{routeInfo.error}</p>
          ) : (
            <>
              <p style={{ margin: 0 }}><strong>Distance:</strong> {routeInfo.distanceKm} km | <strong>Est. Time:</strong> {routeInfo.timeMins} mins</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#0369a1' }}>{routeInfo.instructions}</p>
            </>
          )}
        </div>
      )}

      {/* Map Container */}
      <MapContainer center={[33.7463, 73.1380]} zoom={16} style={{ height: '400px', borderRadius: '8px', zIndex: 0 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {locations.map(l => (
          <Marker key={l.id} position={[l.latitude, l.longitude]}>
            <Popup>
              <strong>{l.name}</strong><br/>{l.building}
            </Popup>
          </Marker>
        ))}

        {/* Draw Line if route is planned */}
        {startLoc && endLoc && (
          <Polyline 
            positions={[[startLoc.latitude, startLoc.longitude], [endLoc.latitude, endLoc.longitude]]} 
            color="blue" 
            weight={4}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
}