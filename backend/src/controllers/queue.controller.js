
const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// POST /queues -> buat antrean manual untuk registrasi yang belum punya antrean
// (Catatan: pada alur normal, antrean sudah otomatis dibuat saat POST /registrations.
// Endpoint ini disediakan terpisah sesuai requirement API, misal untuk kebutuhan re-generate.)
async function createQueue(req, res) {
  try {
    const { registration_id } = req.body;

    if (!registration_id) {
      return errorResponse(res, 'Validation Error', { registration_id: 'registration_id wajib diisi' }, 400);
    }

    const existing = await pool.query('SELECT * FROM queues WHERE registration_id = $1', [registration_id]);
    if (existing.rows.length > 0) {
      return errorResponse(res, 'Registrasi ini sudah memiliki nomor antrean', {}, 400);
    }

    const today = new Date().toISOString().split('T')[0];
    const countResult = await pool.query(`SELECT COUNT(*) FROM queues WHERE DATE(created_at) = $1`, [today]);
    const nextNumber = parseInt(countResult.rows[0].count) + 1;
    const queueNumber = `A${String(nextNumber).padStart(3, '0')}`;

    const result = await pool.query(
      `INSERT INTO queues (registration_id, queue_number) VALUES ($1, $2) RETURNING *`,
      [registration_id, queueNumber]
    );

    return successResponse(res, 'Nomor antrean berhasil dibuat', result.rows[0], 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal membuat nomor antrean', { detail: err.message }, 500);
  }
}

// GET /queues -> daftar antrean HARI INI (yang paling relevan buat ditampilkan di layar antrean)
async function getAllQueues(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        q.id, q.queue_number, q.status, q.called_at,
        p.name AS patient_name,
        pol.name AS poly_name
      FROM queues q
      JOIN registrations r ON r.id = q.registration_id
      JOIN patients p ON p.id = r.patient_id
      JOIN polyclinics pol ON pol.id = r.poly_id
      WHERE DATE(q.created_at) = CURRENT_DATE
      ORDER BY q.id ASC
    `);

    return successResponse(res, 'Berhasil mengambil daftar antrean', result.rows);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengambil daftar antrean', { detail: err.message }, 500);
  }
}

// PUT /queues/:id/call -> panggil antrean ini (ubah status jadi 'dipanggil')
async function callQueue(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE queues SET status = 'dipanggil', called_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Data antrean tidak ditemukan', {}, 404);
    }

    return successResponse(res, `Antrean ${result.rows[0].queue_number} berhasil dipanggil`, result.rows[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal memanggil antrean', { detail: err.message }, 500);
  }
}

// PUT /queues/:id/status -> ubah status antrean secara manual (misal jadi 'selesai')
async function updateQueueStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['menunggu', 'dipanggil', 'selesai'];
    if (!status || !validStatuses.includes(status)) {
      return errorResponse(res, 'Validation Error', {
        status: `Status harus salah satu dari: ${validStatuses.join(', ')}`,
      }, 400);
    }

    const result = await pool.query(
      `UPDATE queues SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Data antrean tidak ditemukan', {}, 404);
    }

    return successResponse(res, 'Status antrean berhasil diubah', result.rows[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengubah status antrean', { detail: err.message }, 500);
  }
}

module.exports = { getAllQueues, callQueue, updateQueueStatus, createQueue };