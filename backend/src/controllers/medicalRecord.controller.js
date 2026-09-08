
const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

async function createMedicalRecord(req, res) {
  const client = await pool.connect();
  try {
    const {
      registration_id,
      complaint,
      blood_pressure,
      temperature,
      weight,
      height,
      diagnosis,
      treatment_plan,
      actions,        
      prescriptions,  
    } = req.body;

    
    const errors = {};
    if (!registration_id) errors.registration_id = 'registration_id wajib diisi';
    if (!diagnosis) errors.diagnosis = 'Diagnosa wajib diisi';

    if (Object.keys(errors).length > 0) {
      return errorResponse(res, 'Validation Error', errors, 400);
    }

    await client.query('BEGIN');

    // 1. Simpan data SOAP utama
    const recordResult = await client.query(
      `INSERT INTO medical_records
        (registration_id, complaint, blood_pressure, temperature, weight, height, diagnosis, treatment_plan)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [registration_id, complaint, blood_pressure, temperature, weight, height, diagnosis, treatment_plan]
    );
    const medicalRecord = recordResult.rows[0];

    // 2. Simpan tindakan medis (kalau ada)
    const savedActions = [];
    if (Array.isArray(actions)) {
      for (const actionName of actions) {
        if (!actionName) continue;
        const actionResult = await client.query(
          `INSERT INTO medical_actions (medical_record_id, action_name) VALUES ($1, $2) RETURNING *`,
          [medicalRecord.id, actionName]
        );
        savedActions.push(actionResult.rows[0]);
      }
    }

    // 3. Simpan resep obat (kalau ada)
    const savedPrescriptions = [];
    if (Array.isArray(prescriptions)) {
      for (const p of prescriptions) {
        if (!p.medicine_name) continue;
        const presResult = await client.query(
          `INSERT INTO prescriptions (medical_record_id, medicine_name, dosage, quantity)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [medicalRecord.id, p.medicine_name, p.dosage, p.quantity]
        );
        savedPrescriptions.push(presResult.rows[0]);
      }
    }

    // 4. Otomatis ubah status pendaftaran jadi 'selesai' karena pemeriksaan sudah dicatat
    await client.query(
      `UPDATE registrations SET status = 'selesai', updated_at = NOW() WHERE id = $1`,
      [registration_id]
    );

    await client.query('COMMIT');

    return successResponse(res, 'Hasil pemeriksaan berhasil disimpan', {
      medical_record: medicalRecord,
      actions: savedActions,
      prescriptions: savedPrescriptions,
    }, 201);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    return errorResponse(res, 'Gagal menyimpan hasil pemeriksaan', { detail: err.message }, 500);
  } finally {
    client.release();
  }
}

// GET /medical-records/:patientId -> riwayat pemeriksaan pasien tertentu
async function getMedicalRecordsByPatient(req, res) {
  try {
    const { patientId } = req.params;

    const recordsResult = await pool.query(
      `SELECT mr.*, r.visit_date, d.name AS doctor_name
       FROM medical_records mr
       JOIN registrations r ON r.id = mr.registration_id
       JOIN doctors d ON d.id = r.doctor_id
       WHERE r.patient_id = $1
       ORDER BY mr.created_at DESC`,
      [patientId]
    );

    // Untuk tiap rekam medis, ambil juga tindakan & resepnya
    const records = [];
    for (const record of recordsResult.rows) {
      const actionsResult = await pool.query(
        'SELECT * FROM medical_actions WHERE medical_record_id = $1',
        [record.id]
      );
      const prescriptionsResult = await pool.query(
        'SELECT * FROM prescriptions WHERE medical_record_id = $1',
        [record.id]
      );

      records.push({
        ...record,
        actions: actionsResult.rows,
        prescriptions: prescriptionsResult.rows,
      });
    }

    return successResponse(res, 'Berhasil mengambil riwayat pemeriksaan', records);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Gagal mengambil riwayat pemeriksaan', { detail: err.message }, 500);
  }
}

module.exports = { createMedicalRecord, getMedicalRecordsByPatient };