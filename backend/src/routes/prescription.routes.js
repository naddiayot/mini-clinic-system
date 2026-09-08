// src/routes/prescription.routes.js

const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescriptionsByRecord,
} = require('../controllers/prescription.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.post('/', authorize('admin', 'dokter'), createPrescription);
router.get('/:id', getPrescriptionsByRecord);

module.exports = router;