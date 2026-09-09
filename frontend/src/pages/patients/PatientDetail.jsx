import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientById } from '../../services/patientService';
import { getMedicalRecordsByPatient } from '../../services/medicalRecordService';
import Layout from '../../components/Layout';
import './PatientForm.css';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatient();
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPatient = async () => {
    try {
      const res = await getPatientById(id);
      setPatient(res.data);
    } catch (err) {
      setError('Gagal memuat data pasien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await getMedicalRecordsByPatient(id);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRecordsLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Layout title="Detail Pasien">
      <div className="patient-form-card">
        {loading && <p className="state-text">Memuat data...</p>}
        {error && <p className="state-error">{error}</p>}
        {patient && (
          <>
            <div className="detail-row"><span>No. Rekam Medis</span><strong>{patient.medical_record_no}</strong></div>
            <div className="detail-row"><span>NIK</span><strong>{patient.nik}</strong></div>
            <div className="detail-row"><span>Nama</span><strong>{patient.name}</strong></div>
            <div className="detail-row"><span>Jenis Kelamin</span><strong>{patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</strong></div>
            <div className="detail-row"><span>Tanggal Lahir</span><strong>{formatDate(patient.birth_date)}</strong></div>
            <div className="detail-row"><span>No. Telepon</span><strong>{patient.phone}</strong></div>
            <div className="detail-row"><span>Alamat</span><strong>{patient.address}</strong></div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => navigate('/patients')}>Kembali</button>
              <button className="btn-primary" onClick={() => navigate(`/patients/${id}/edit`)}>Edit</button>
            </div>
          </>
        )}
      </div>

      <div className="patient-form-card history-card">
        <h3 className="exam-section-title" style={{ marginTop: 0 }}>Riwayat Pemeriksaan</h3>

        {recordsLoading ? (
          <p className="state-text">Memuat riwayat...</p>
        ) : records.length === 0 ? (
          <p className="state-text">Belum ada riwayat pemeriksaan.</p>
        ) : (
          <div className="history-list">
            {records.map((r) => (
              <div className="history-item" key={r.id}>
                <div className="history-item-header">
                  <strong>{formatDate(r.visit_date)}</strong>
                  <span className="state-text">dr. {r.doctor_name}</span>
                </div>

                <div className="detail-row"><span>Keluhan</span><strong>{r.complaint || '-'}</strong></div>
                <div className="detail-row"><span>Tekanan Darah</span><strong>{r.blood_pressure || '-'}</strong></div>
                <div className="detail-row"><span>Suhu</span><strong>{r.temperature || '-'}</strong></div>
                <div className="detail-row"><span>Berat / Tinggi</span><strong>{r.weight || '-'} kg / {r.height || '-'} cm</strong></div>
                <div className="detail-row"><span>Diagnosa</span><strong>{r.diagnosis || '-'}</strong></div>
                <div className="detail-row"><span>Rencana Terapi</span><strong>{r.treatment_plan || '-'}</strong></div>

                {r.actions.length > 0 && (
                  <div className="history-sub">
                    <span className="state-text">Tindakan:</span>
                    <ul>
                      {r.actions.map((a) => <li key={a.id}>{a.action_name}</li>)}
                    </ul>
                  </div>
                )}

                {r.prescriptions.length > 0 && (
                  <div className="history-sub">
                    <span className="state-text">Resep Obat:</span>
                    <ul>
                      {r.prescriptions.map((p) => (
                        <li key={p.id}>{p.medicine_name} — {p.dosage} ({p.quantity})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}