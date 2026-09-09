import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardPlus,
  ListOrdered,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const roleLabels = {
  admin: 'Administrator',
  dokter: 'Dokter',
  petugas_pendaftaran: 'Petugas Pendaftaran',
};

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Data Pasien', icon: Users },
  { to: '/registrations', label: 'Pendaftaran', icon: ClipboardPlus },
  { to: '/queues', label: 'Antrean', icon: ListOrdered },
  { to: '/examinations', label: 'Pemeriksaan', icon: Stethoscope },
];

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

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
          <span className="sidebar-brand-mark" aria-hidden="true">MC</span>
          <span>Mini Clinic</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
            >
              <Icon aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="topbar-user">
            <div className="topbar-user-avatar" aria-hidden="true">
              {getInitials(user?.name)}
            </div>
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