

const express = require('express');
const router = express.Router();
const {
  getAllQueues,
  callQueue,
  updateQueueStatus,
  createQueue,
} = require('../controllers/queue.controller');
const { verifyToken, authorize } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', getAllQueues);
router.post('/', authorize('admin', 'petugas_pendaftaran'), createQueue);
router.put('/:id/call', authorize('admin', 'petugas_pendaftaran', 'dokter'), callQueue);
router.put('/:id/status', authorize('admin', 'petugas_pendaftaran', 'dokter'), updateQueueStatus);

module.exports = router;