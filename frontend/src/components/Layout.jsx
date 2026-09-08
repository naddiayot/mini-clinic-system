import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const roleLabels = {
  admin: 'Administrator',
  dokter: 'Dokter',
  petugas_pendaftaran: 'Petugas Pendaftaran',
};

function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark" aria-hidden="true" />
          <span>Mini Clinic</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link">
            Dashboard
          </NavLink>
          <NavLink to="/patients" className="sidebar-link">
            Data Pasien
          </NavLink>
          <NavLink to="/registrations" className="sidebar-link">
            Pendaftaran
          </NavLink>
          <NavLink to="/queues" className="sidebar-link">
            Antrean
          </NavLink>
          <NavLink to="/medical-records" className="sidebar-link">
            Pemeriksaan
          </NavLink>
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="topbar-user">
            <div className="topbar-user-info">
              <span className="topbar-user-name">{user?.name}</span>
              <span className="topbar-user-role">
                {roleLabels[user?.role] || user?.role}
              </span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Keluar
            </button>
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}

export default Layout;