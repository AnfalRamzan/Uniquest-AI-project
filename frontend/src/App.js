import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home'; // Purana Home (Dashboard ke liye use hoga)
import Login from './components/Login';
import Register from './components/Register';
import Search from './components/Search';
import MapView from './components/MapView';
import AIChat from './components/AIChat';
import AdminDashboard from './components/AdminDashboard';
import Favorites from './components/Favorites';       
import Announcements from './components/Announcements'; 

// 👇 Private Route Component (Security ke liye)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Agar token nahi hai, toh seedha Login page par bhej do
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages — with sidebar & PrivateRoute */}
        <Route path="/home" element={
          <PrivateRoute>
            <Layout><Home /></Layout>
          </PrivateRoute>
        } />

        <Route path="/search" element={
          <PrivateRoute>
            <Layout><Search /></Layout>
          </PrivateRoute>
        } />

        <Route path="/map" element={
          <PrivateRoute>
            <Layout><MapView /></Layout>
          </PrivateRoute>
        } />

        <Route path="/ai" element={
          <PrivateRoute>
            <Layout><AIChat /></Layout>
          </PrivateRoute>
        } />

        <Route path="/admin" element={
          <PrivateRoute>
            <Layout><AdminDashboard /></Layout>
          </PrivateRoute>
        } />
        
        <Route path="/favorites" element={
          <PrivateRoute>
            <Layout><Favorites /></Layout>
          </PrivateRoute>
        } />

        <Route path="/announcements" element={
          <PrivateRoute>
            <Layout><Announcements /></Layout>
          </PrivateRoute>
        } />

        {/* Agar koi galat URL daale toh /home par bhej do */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;