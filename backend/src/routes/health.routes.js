// src/routes/health.routes.js
// Route sederhana buat ngecek apakah server backend hidup dan bisa diakses.
// Ini bukan bagian dari requirement soal, tapi berguna untuk testing awal.

const express = require('express');
const router = express.Router();
const { successResponse } = require('../utils/response');

router.get('/', (req, res) => {
  return successResponse(res, 'Server berjalan dengan baik', {
    status: 'ok',
    timestamp: new Date(),
  });
});

module.exports = router;