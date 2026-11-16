import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import loginVideo from '../assets/login.mp4';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !pass) {
      return setMsg('❌ Please enter both email and password');
    }

    setLoading(true);
    setMsg('');
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        
        // 👇 Yeh nayi line add ki gayi hai Role save karne ke liye
        localStorage.setItem('role', res.data.role || 'STUDENT'); 
        
        setMsg('✅ Login successful! Redirecting...');
        setTimeout(() => navigate('/home'), 1000); // Redirect to Home
      } else {
        setMsg('❌ Invalid credentials');
      }
    } catch (e) {
      setMsg('❌ Error: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= STYLES ================= */}
      <style>{`
        .login-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .login-video-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: -1;
          pointer-events: none;

          /* ✅ Quality / sharpness improvements */
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;

          /* GPU acceleration + avoid soft edges */
          transform: translateZ(0) scale(1.02);
          backface-visibility: hidden;
          will-change: transform;

          /* Slightly sharp + vibrant, no blur */
          filter: contrast(1.05) saturate(1.1);
        }

        .login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.65) 0%,
            rgba(30, 41, 59, 0.45) 100%
          );
          z-index: -1;
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 40px 35px;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 420px;
          color: #fff;
          animation: loginFadeIn 0.6s ease-out;
        }

        @keyframes loginFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-header h1 {
          font-size: 32px;
          color: #ffffff;
          margin-bottom: 8px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
          background: linear-gradient(135deg, #ffffff, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-header p {
          color: rgba(255, 255, 255, 0.75);
          font-size: 14px;
          letter-spacing: 0.3px;
        }

        .login-card .form-group {
          margin-bottom: 15px;
        }

        .login-card .form-group input {
          width: 100%;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          padding: 14px;
          font-size: 15px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .login-card .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }

        .login-card .form-group input:focus {
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.22);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          outline: none;
        }

        .login-card button {
          width: 100%;
          margin-top: 20px;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.45);
          transition: all 0.3s ease;
        }

        .login-card button:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          box-shadow: 0 6px 22px rgba(59, 130, 246, 0.65);
          transform: translateY(-2px);
        }

        .login-card button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-card .msg {
          padding: 12px;
          border-radius: 8px;
          margin-top: 15px;
          font-size: 14px;
          text-align: center;
          font-weight: 500;
        }

        .login-card .msg.success {
          background: rgba(16, 185, 129, 0.25);
          color: #a7f3d0;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .login-card .msg.error {
          background: rgba(239, 68, 68, 0.25);
          color: #fecaca;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .login-footer {
          text-align: center;
          margin-top: 22px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .login-footer a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .login-footer a:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        @media (max-width: 500px) {
          .login-card {
            padding: 30px 22px;
            margin: 15px;
          }
          .login-header h1 {
            font-size: 26px;
          }
        }
      `}</style>

      {/* ================= JSX ================= */}
      <div className="login-page">
        {/* 🎥 Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          className="login-video-bg"
        >
          <source src={loginVideo} type="video/mp4" />
        </video>

        {/* 🌑 Dark Overlay */}
        <div className="login-overlay"></div>

        {/* 🪟 Glassmorphism Card */}
        <div className="login-card">
          <div className="login-header">
            <h1>UniQuest AI</h1>
            <p>Smart Campus Navigation</p>
          </div>

          <div className="form-group">
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Password"
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          <button onClick={login} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {msg && (
            <p className={`msg ${msg.includes('✅') ? 'success' : 'error'}`}>
              {msg}
            </p>
          )}

          <p className="login-footer">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
}