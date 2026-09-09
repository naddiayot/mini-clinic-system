const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// GET /doctors -> list semua dokter (untuk dropdown pendaftaran)
async function getAllDoctors(req, res) {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY name ASC');
    return successResponse(res, 'Berhasil mengambil data dokter', result.rows);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengambil data dokter', { detail: err.message }, 500);
  }
}

module.exports = {
  getAllDoctors,
};