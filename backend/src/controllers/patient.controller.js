// src/controllers/patient.controller.js

const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// Fungsi bantuan untuk generate Nomor Rekam Medis otomatis
// Format: RM-000001, RM-000002, dst (berdasarkan id terakhir di tabel)
async function generateMedicalRecordNo() {
  const result = await pool.query('SELECT id FROM patients ORDER BY id DESC LIMIT 1');
  const lastId = result.rows.length > 0 ? result.rows[0].id : 0;
  const nextId = lastId + 1;
  return `RM-${String(nextId).padStart(6, '0')}`;
}

// GET /patients -> list pasien, mendukung pagination & pencarian
async function getAllPatients(req, res) {
  try {
    // Ambil query parameter, kasih nilai default kalau tidak dikirim
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Pencarian berdasarkan nama ATAU NIK (case-insensitive pakai ILIKE)
    const searchQuery = `%${search}%`;

    const dataResult = await pool.query(
      `SELECT * FROM patients
       WHERE name ILIKE $1 OR nik ILIKE $1
       ORDER BY id DESC
       LIMIT $2 OFFSET $3`,
      [searchQuery, limit, offset]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM patients WHERE name ILIKE $1 OR nik ILIKE $1`,
      [searchQuery]
    );

    const totalData = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalData / limit);

    return successResponse(res, 'Berhasil mengambil data pasien', {
      patients: dataResult.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalData,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengambil data pasien', { detail: err.message }, 500);
  }
}

// GET /patients/:id -> detail 1 pasien
async function getPatientById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Data pasien tidak ditemukan', {}, 404);
    }

    return successResponse(res, 'Berhasil mengambil detail pasien', result.rows[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengambil detail pasien', { detail: err.message }, 500);
  }
}

// POST /patients -> tambah pasien baru
async function createPatient(req, res) {
  try {
    const { nik, name, gender, birth_date, phone, address } = req.body;

    // Validasi input dasar
    const errors = {};
    if (!nik) errors.nik = 'NIK wajib diisi';
    if (nik && nik.length !== 16) errors.nik = 'NIK harus 16 digit';
    if (!name) errors.name = 'Nama wajib diisi';
    if (!gender || !['L', 'P'].includes(gender)) errors.gender = 'Jenis kelamin harus L atau P';
    if (!birth_date) errors.birth_date = 'Tanggal lahir wajib diisi';

    if (Object.keys(errors).length > 0) {
      return errorResponse(res, 'Validation Error', errors, 400);
    }

    // Validasi NIK tidak boleh duplikat
    const existingNik = await pool.query('SELECT id FROM patients WHERE nik = $1', [nik]);
    if (existingNik.rows.length > 0) {
      return errorResponse(res, 'Validation Error', { nik: 'NIK sudah terdaftar' }, 400);
    }

    // Generate nomor rekam medis otomatis
    const medicalRecordNo = await generateMedicalRecordNo();

    const result = await pool.query(
      `INSERT INTO patients (medical_record_no, nik, name, gender, birth_date, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [medicalRecordNo, nik, name, gender, birth_date, phone, address]
    );

    return successResponse(res, 'Pasien berhasil ditambahkan', result.rows[0], 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal menambahkan pasien', { detail: err.message }, 500);
  }
}

// PUT /patients/:id -> update data pasien
async function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const { nik, name, gender, birth_date, phone, address } = req.body;

    // Cek pasien ada atau tidak
    const existing = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return errorResponse(res, 'Data pasien tidak ditemukan', {}, 404);
    }

    // Kalau NIK diubah, cek jangan sampai bentrok dengan pasien lain
    if (nik) {
      const nikCheck = await pool.query('SELECT id FROM patients WHERE nik = $1 AND id != $2', [nik, id]);
      if (nikCheck.rows.length > 0) {
        return errorResponse(res, 'Validation Error', { nik: 'NIK sudah dipakai pasien lain' }, 400);
      }
    }

    const result = await pool.query(
      `UPDATE patients
       SET nik = COALESCE($1, nik),
           name = COALESCE($2, name),
           gender = COALESCE($3, gender),
           birth_date = COALESCE($4, birth_date),
           phone = COALESCE($5, phone),
           address = COALESCE($6, address),
           updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [nik, name, gender, birth_date, phone, address, id]
    );

    return successResponse(res, 'Data pasien berhasil diubah', result.rows[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengubah data pasien', { detail: err.message }, 500);
  }
}

// DELETE /patients/:id -> hapus pasien
async function deletePatient(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Data pasien tidak ditemukan', {}, 404);
    }

    return successResponse(res, 'Data pasien berhasil dihapus', {});
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal menghapus data pasien', { detail: err.message }, 500);
  }
}

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};