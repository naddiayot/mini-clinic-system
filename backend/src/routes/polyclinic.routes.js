const express = require('express');
const router = express.Router();
const { getAllPolyclinics } = require('../controllers/polyclinic.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', getAllPolyclinics);

module.exports = router;