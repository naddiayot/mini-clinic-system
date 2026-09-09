import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/patients/Patients';
import PatientForm from './pages/patients/PatientForm';
import PatientDetail from './pages/patients/PatientDetail';
import Registrations from './pages/registrations/Registrations';
import RegistrationForm from './pages/registrations/RegistrationForm';
import Queues from './pages/queues/Queues';
import Examinations from './pages/examinations/Examinations';
import MedicalRecordForm from './pages/examinations/MedicalRecordForm';
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

      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/new"
        element={
          <ProtectedRoute>
            <PatientForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/:id/edit"
        element={
          <ProtectedRoute>
            <PatientForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute>
            <PatientDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/registrations"
        element={
          <ProtectedRoute>
            <Registrations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/registrations/new"
        element={
          <ProtectedRoute>
            <RegistrationForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/queues"
        element={
          <ProtectedRoute>
            <Queues />
          </ProtectedRoute>
        }
      />

      <Route
        path="/examinations"
        element={
          <ProtectedRoute>
            <Examinations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/examinations/:registrationId"
        element={
          <ProtectedRoute>
            <MedicalRecordForm />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;