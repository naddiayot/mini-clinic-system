
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