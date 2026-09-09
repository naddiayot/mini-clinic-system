// server.js
// Ini adalah "pintu masuk" utama aplikasi backend kita.

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import koneksi database (supaya langsung dicoba connect saat server start)
require('./src/config/db');

// Import routes
const healthRoutes = require('./src/routes/health.routes');
const authRoutes = require('./src/routes/auth.routes');
const patientRoutes = require('./src/routes/patient.routes');
const registrationRoutes = require('./src/routes/registration.routes');
const queueRoutes = require('./src/routes/queue.routes');
const medicalRecordRoutes = require('./src/routes/medicalRecord.routes');
const prescriptionRoutes = require('./src/routes/prescription.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const doctorRoutes = require('./src/routes/doctor.routes');
const polyclinicRoutes = require('./src/routes/polyclinic.routes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware bawaan
app.use(cors());            // supaya frontend (beda port) bisa akses API ini
app.use(express.json());    // supaya server bisa baca body request format JSON

// Routes
app.use('/api/health', healthRoutes);
app.use('/api', authRoutes); // -> /api/login, /api/logout
app.use('/api/patients', patientRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/polyclinics', polyclinicRoutes);



// Route default (kalau buka root url)
app.get('/', (req, res) => {
  res.send('Mini Clinic Information System API is running 🚀');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});