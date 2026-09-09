import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRegistrations, updateRegistrationStatus } from '../../services/registrationService';
import Layout from '../../components/Layout';
import './Registrations.css';

const statusLabels = {
  menunggu: 'Menunggu',
  check_in: 'Check In',
  pemeriksaan: 'Pemeriksaan',
  selesai: 'Selesai',
};

const nextStatusMap = {
  menunggu: 'check_in',
  check_in: 'pemeriksaan',
  pemeriksaan: 'selesai',
  selesai: null,
};

export default function Registrations() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getRegistrations();
      setRegistrations(res.data);
    } catch (err) {
      setError('Gagal mengambil data pendaftaran');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStatus = async (reg) => {
    const next = nextStatusMap[reg.status];
    if (!next) return;
    try {
      await updateRegistrationStatus(reg.id, next);
      fetchRegistrations();
    } catch (err) {
      alert('Gagal mengubah status');
      console.error(err);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Layout title="Pendaftaran">
      <div className="patients-page">
        <div className="patients-header">
          <h1>Daftar Pendaftaran</h1>
          <button className="btn-primary" onClick={() => navigate('/registrations/new')}>
            + Tambah Pendaftaran
          </button>
        </div>

        {error && <p className="state-error">{error}</p>}

        <div className="patients-table-card">
          {loading ? (
            <p className="state-text">Memuat data...</p>
          ) : (
            <table className="patients-table">
              <thead>
                <tr>
                  <th>No. Antrean</th>
                  <th>Pasien</th>
                  <th>Dokter</th>
                  <th>Poli</th>
                  <th>Tgl Kunjungan</th>
                  <th>Pembayaran</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="state-text empty-row">Belum ada data pendaftaran</td>
                  </tr>
                ) : (
                  registrations.map((r) => (
                    <tr key={r.id}>
                      <td>{r.queue_number || '-'}</td>
                      <td>{r.patient_name}</td>
                      <td>{r.doctor_name}</td>
                      <td>{r.poly_name}</td>
                      <td>{formatDate(r.visit_date)}</td>
                      <td>{r.payment_type}</td>
                      <td>
                        <span className={`status-badge status-${r.status}`}>
                          {statusLabels[r.status]}
                        </span>
                      </td>
                      <td className="actions">
                        {nextStatusMap[r.status] ? (
                          <button onClick={() => handleAdvanceStatus(r)}>
                            → {statusLabels[nextStatusMap[r.status]]}
                          </button>
                        ) : (
                          <span className="state-text">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}