import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi sederhana di sisi frontend, sebelum request dikirim ke backend
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      // Ambil pesan error dari backend kalau ada, kalau tidak pakai pesan default
      const message =
        err.response?.data?.message || 'Terjadi kesalahan, silakan coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand-mark" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v18M3 12h18"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="login-brand-text">
          <h1>Mini Clinic</h1>
          <p>Sistem Informasi Klinik Pratama</p>
        </div>
        <div className="login-brand-footer">
          <p>
            Kelola data pasien, pendaftaran, antrean, dan pemeriksaan dalam
            satu sistem yang terintegrasi.
          </p>
        </div>
      </div>

      <div className="login-form-wrap">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h2>Masuk ke akun Anda</h2>
          <p className="login-form-subtitle">
            Gunakan email dan password yang sudah terdaftar.
          </p>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@clinic.com"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;