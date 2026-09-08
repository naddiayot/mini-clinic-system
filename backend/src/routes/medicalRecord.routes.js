// src/routes/medicalRecord.routes.js

const express = require('express');
const router = express.Router();
const {
  createMedicalRecord,
  getMedicalRecordsByPatient,
} = require('../controllers/medicalRecord.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

router.use(verifyToken);

// Hanya dokter (dan admin untuk keperluan administratif) yang boleh input pemeriksaan
router.post('/', authorize('admin', 'dokter'), createMedicalRecord);

// Riwayat pemeriksaan boleh dilihat oleh semua role yang login
router.get('/:patientId', getMedicalRecordsByPatient);

module.exports = router;