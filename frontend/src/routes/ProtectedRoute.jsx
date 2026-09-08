import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Belum login sama sekali -> lempar ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sudah login, tapi role-nya tidak diizinkan untuk halaman ini
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
