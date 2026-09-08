const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Semua role yang login boleh lihat dashboard
router.get('/', verifyToken, getDashboardStats);

module.exports = router;