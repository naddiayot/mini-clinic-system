// src/controllers/registration.controller.js

const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// Fungsi bantuan: generate nomor antrean berikutnya untuk HARI INI
// Format: A001, A002, dst. Reset otomatis tiap hari karena hitungnya
// berdasarkan jumlah antrean yang dibuat hari ini saja.
// Menerima 'client' supaya query ini ikut dalam transaction yang sama.
async function generateQueueNumber(client) {
  const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD

  const result = await client.query(
    `SELECT COUNT(*) FROM queues WHERE DATE(created_at) = $1`,
    [today]
  );

  const countToday = parseInt(result.rows[0].count);
  const nextNumber = countToday + 1;

  return `A${String(nextNumber).padStart(3, '0')}`;
}

// GET /registrations -> list semua pendaftaran (join biar informasinya lengkap)
async function getAllRegistrations(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        r.id, r.visit_date, r.payment_type, r.initial_complaint, r.status,
        p.id AS patient_id, p.name AS patient_name, p.medical_record_no,
        d.id AS doctor_id, d.name AS doctor_name,
        pol.id AS poly_id, pol.name AS poly_name,
        q.queue_number, q.status AS queue_status
      FROM registrations r
      JOIN patients p ON p.id = r.patient_id
      JOIN doctors d ON d.id = r.doctor_id
      JOIN polyclinics pol ON pol.id = r.poly_id
      LEFT JOIN queues q ON q.registration_id = r.id
      ORDER BY r.id DESC
    `);

    return successResponse(res, 'Berhasil mengambil data pendaftaran', result.rows);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengambil data pendaftaran', { detail: err.message }, 500);
  }
}

// POST /registrations -> buat pendaftaran baru + otomatis buat antrean
async function createRegistration(req, res) {
  const client = await pool.connect();
  try {
    const { patient_id, doctor_id, poly_id, payment_type, initial_complaint } = req.body;

    // Validasi input dasar
    const errors = {};
    if (!patient_id) errors.patient_id = 'Pasien wajib dipilih';
    if (!doctor_id) errors.doctor_id = 'Dokter wajib dipilih';
    if (!poly_id) errors.poly_id = 'Poli wajib dipilih';
    if (!payment_type) errors.payment_type = 'Jenis pembayaran wajib diisi';

    if (Object.keys(errors).length > 0) {
      return errorResponse(res, 'Validation Error', errors, 400);
    }

    // Pakai transaction: registrasi + antrean harus berhasil BERSAMA-SAMA,
    // kalau salah satu gagal, semua dibatalkan (supaya data tidak setengah-setengah)
    await client.query('BEGIN');

    const regResult = await client.query(
      `INSERT INTO registrations (patient_id, doctor_id, poly_id, payment_type, initial_complaint)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, doctor_id, poly_id, payment_type, initial_complaint]
    );

    const registration = regResult.rows[0];
    const queueNumber = await generateQueueNumber(client);

    const queueResult = await client.query(
      `INSERT INTO queues (registration_id, queue_number) VALUES ($1, $2) RETURNING *`,
      [registration.id, queueNumber]
    );

    await client.query('COMMIT');

    return successResponse(res, 'Pendaftaran berhasil, nomor antrean telah dibuat', {
      registration,
      queue: queueResult.rows[0],
    }, 201);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    return errorResponse(res, 'Gagal membuat pendaftaran', { detail: err.message }, 500);
  } finally {
    client.release();
  }
}

// PUT /registrations/:id -> update status pendaftaran
async function updateRegistration(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['menunggu', 'check_in', 'pemeriksaan', 'selesai'];
    if (!status || !validStatuses.includes(status)) {
      return errorResponse(res, 'Validation Error', {
        status: `Status harus salah satu dari: ${validStatuses.join(', ')}`,
      }, 400);
    }

    const result = await pool.query(
      `UPDATE registrations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Data pendaftaran tidak ditemukan', {}, 404);
    }

    return successResponse(res, 'Status pendaftaran berhasil diubah', result.rows[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengubah status pendaftaran', { detail: err.message }, 500);
  }
}

module.exports = { getAllRegistrations, createRegistration, updateRegistration };