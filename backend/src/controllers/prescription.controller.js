// src/controllers/prescription.controller.js

const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// POST /prescriptions -> tambah resep baru ke sebuah rekam medis yang sudah ada
// (Catatan: pada alur utama, resep biasanya sudah dibuat sekaligus lewat
// POST /medical-records. Endpoint ini untuk kebutuhan tambah resep susulan.)
async function createPrescription(req, res) {
  try {
    const { medical_record_id, medicine_name, dosage, quantity } = req.body;

    const errors = {};
    if (!medical_record_id) errors.medical_record_id = 'medical_record_id wajib diisi';
    if (!medicine_name) errors.medicine_name = 'Nama obat wajib diisi';

    if (Object.keys(errors).length > 0) {
      return errorResponse(res, 'Validation Error', errors, 400);
    }

    const result = await pool.query(
      `INSERT INTO prescriptions (medical_record_id, medicine_name, dosage, quantity)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [medical_record_id, medicine_name, dosage, quantity]
    );

    return successResponse(res, 'Resep berhasil ditambahkan', result.rows[0], 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal menambahkan resep', { detail: err.message }, 500);
  }
}

// GET /prescriptions/:id -> daftar resep untuk 1 rekam medis tertentu (id = medical_record_id)
async function getPrescriptionsByRecord(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM prescriptions WHERE medical_record_id = $1 ORDER BY id ASC',
      [id]
    );

    return successResponse(res, 'Berhasil mengambil data resep', result.rows);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengambil data resep', { detail: err.message }, 500);
  }
}

module.exports = { createPrescription, getPrescriptionsByRecord };