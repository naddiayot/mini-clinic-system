const express = require('express');
const router = express.Router();
const { getAllDoctors } = require('../controllers/doctor.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Semua role yang login boleh lihat daftar dokter (dibutuhkan untuk dropdown)
router.use(verifyToken);

router.get('/', getAllDoctors);

module.exports = router;