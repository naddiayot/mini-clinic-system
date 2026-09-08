const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/dashboard
// Menampilkan ringkasan statistik untuk dashboard
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Pasien (keseluruhan, semua waktu)
    const totalPatientsResult = await pool.query(
      'SELECT COUNT(*) AS total FROM patients'
    );

    // 2. Total Pasien Hari Ini (dihitung dari registrasi/kunjungan baru hari ini)
    //    Kita hitung pasien UNIK yang mendaftar hari ini, bukan jumlah registrasi
    const patientsTodayResult = await pool.query(
      `SELECT COUNT(DISTINCT patient_id) AS total
       FROM registrations
       WHERE DATE(visit_date) = CURRENT_DATE`
    );

    // 3. Total Antrean Hari Ini (semua antrean yang dibuat hari ini, semua status)
    const queuesTodayResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM queues
       WHERE DATE(created_at) = CURRENT_DATE`
    );

    // 4. Total Pasien Menunggu (antrean hari ini dengan status 'menunggu')
    const waitingResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM queues
       WHERE DATE(created_at) = CURRENT_DATE
         AND status = 'menunggu'`
    );

    // 5. Total Pasien Selesai Dilayani (registrasi hari ini dengan status 'selesai')
    const completedResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM registrations
       WHERE DATE(visit_date) = CURRENT_DATE
         AND status = 'selesai'`
    );

    const stats = {
      total_pasien: parseInt(totalPatientsResult.rows[0].total, 10),
      total_pasien_hari_ini: parseInt(patientsTodayResult.rows[0].total, 10),
      total_antrean_hari_ini: parseInt(queuesTodayResult.rows[0].total, 10),
      total_pasien_menunggu: parseInt(waitingResult.rows[0].total, 10),
      total_pasien_selesai: parseInt(completedResult.rows[0].total, 10),
    };

    return successResponse(res, 'Berhasil mengambil data dashboard', stats, 200);
} catch (error) {
    console.error('Error getDashboardStats:', error);
    return errorResponse(res, 'Terjadi kesalahan pada server', {}, 500);
}
};

module.exports = { getDashboardStats };