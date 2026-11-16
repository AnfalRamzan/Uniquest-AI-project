import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import loginVideo from '../assets/login.mp4';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [role, setRole] = useState('STUDENT'); // STUDENT | ADMIN
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    // Validation
    if (!name || !email || !pass || !confirmPass) {
      return setMsg('❌ Please fill in all fields');
    }
    if (pass.length < 6) {
      return setMsg('❌ Password must be at least 6 characters');
    }
    if (pass !== confirmPass) {
      return setMsg('❌ Passwords do not match');
    }

    setLoading(true);
    setMsg('');
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password: pass,
        role,
      });

      // If backend returns a token → auto-login
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        
        // 👇 Yeh nayi line add ki gayi hai Role save karne ke liye
        localStorage.setItem('role', res.data.role || role); 
        
        setMsg('✅ Account created! Redirecting...');
        setTimeout(() => navigate('/home'), 1200); // Redirect to Home
      } else {
        setMsg('✅ Account created! Please log in.');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (e) {
      setMsg('❌ Error: ' + (e.response?.data?.message || e.response?.data || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 20px 0;
        }

        .register-video-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: -1;
          pointer-events: none;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
          transform: translateZ(0) scale(1.02);
          backface-visibility: hidden;
          will-change: transform;
          filter: contrast(1.05) saturate(1.1);
        }

        .register-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.7) 0%,
            rgba(30, 41, 59, 0.5) 100%
          );
          z-index: -1;
          pointer-events: none;
        }

        .register-card {
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
          max-width: 440px;
          color: #fff;
          animation: registerFadeIn 0.6s ease-out;
        }

        @keyframes registerFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .register-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .register-header h1 {
          font-size: 30px;
          margin-bottom: 8px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
          background: linear-gradient(135deg, #ffffff, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .register-header p {
          color: rgba(255, 255, 255, 0.75);
          font-size: 14px;
          letter-spacing: 0.3px;
        }

        .register-card .form-group {
          margin-bottom: 13px;
        }

        .register-card .form-group input,
        .register-card .form-group select {
          width: 100%;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          padding: 13px;
          font-size: 15px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .register-card .form-group select option {
          color: #1e293b;
        }

        .register-card .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }

        .register-card .form-group input:focus,
        .register-card .form-group select:focus {
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.22);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          outline: none;
        }

        .register-card button {
          width: 100%;
          margin-top: 18px;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.45);
          transition: all 0.3s ease;
        }

        .register-card button:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          box-shadow: 0 6px 22px rgba(16, 185, 129, 0.65);
          transform: translateY(-2px);
        }

        .register-card button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-card .msg {
          padding: 12px;
          border-radius: 8px;
          margin-top: 15px;
          font-size: 14px;
          text-align: center;
          font-weight: 500;
        }

        .register-card .msg.success {
          background: rgba(16, 185, 129, 0.25);
          color: #a7f3d0;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .register-card .msg.error {
          background: rgba(239, 68, 68, 0.25);
          color: #fecaca;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .register-footer {
          text-align: center;
          margin-top: 20px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }

        .register-footer a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .register-footer a:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        @media (max-width: 500px) {
          .register-card {
            padding: 30px 22px;
            margin: 15px;
          }
          .register-header h1 {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="register-page">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          className="register-video-bg"
        >
          <source src={loginVideo} type="video/mp4" />
        </video>

        <div className="register-overlay"></div>

        <div className="register-card">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join UniQuest AI</p>
          </div>

          <div className="form-group">
            <input
              placeholder="Full Name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
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
              placeholder="Password (min 6 chars)"
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
            />
          </div>

          <div className="form-group">
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button onClick={register} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>

          {msg && (
            <p className={`msg ${msg.includes('✅') ? 'success' : 'error'}`}>
              {msg}
            </p>
          )}

          <p className="register-footer">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}