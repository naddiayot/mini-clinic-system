const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// GET /polyclinics -> list semua poli (untuk dropdown pendaftaran)
async function getAllPolyclinics(req, res) {
  try {
    const result = await pool.query('SELECT * FROM polyclinics ORDER BY name ASC');
    return successResponse(res, 'Berhasil mengambil data poli', result.rows);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengambil data poli', { detail: err.message }, 500);
  }
}

module.exports = {
  getAllPolyclinics,
};