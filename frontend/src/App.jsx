import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Halaman Pasien, Pendaftaran, Antrean, Pemeriksaan akan ditambahkan
          di sini bertahap, mengikuti pola yang sama seperti /dashboard */}

      {/* Redirect default: buka "/" langsung arahkan ke dashboard
          (nanti ProtectedRoute yang akan lempar ke /login kalau belum login) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;