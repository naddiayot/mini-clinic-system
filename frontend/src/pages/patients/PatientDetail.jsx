import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientById } from '../../services/patientService';
import Layout from '../../components/Layout';
import './PatientForm.css';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatient();
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
    </Layout>
  );
}