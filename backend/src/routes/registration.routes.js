// src/routes/registration.routes.js

const express = require('express');
const router = express.Router();
const {
  getAllRegistrations,
  createRegistration,
  updateRegistration,
} = require('../controllers/registration.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', getAllRegistrations);
// Hanya petugas pendaftaran & admin yang bikin pendaftaran baru
router.post('/', authorize('admin', 'petugas_pendaftaran'), createRegistration);
// Update status boleh oleh petugas, dokter, atau admin (tergantung tahap alurnya)
router.put('/:id', authorize('admin', 'petugas_pendaftaran', 'dokter'), updateRegistration);

module.exports = router;