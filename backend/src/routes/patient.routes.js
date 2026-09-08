// src/routes/patient.routes.js

const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patient.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

// Semua endpoint di bawah ini WAJIB login dulu (pakai verifyToken)
router.use(verifyToken);

router.get('/', getAllPatients);
router.get('/:id', getPatientById);

// Hanya admin & petugas pendaftaran yang boleh tambah/ubah/hapus data pasien
// (dokter cukup bisa LIHAT data pasien, tidak perlu mengelola)
router.post('/', authorize('admin', 'petugas_pendaftaran'), createPatient);
router.put('/:id', authorize('admin', 'petugas_pendaftaran'), updatePatient);
router.delete('/:id', authorize('admin', 'petugas_pendaftaran'), deletePatient);

module.exports = router;