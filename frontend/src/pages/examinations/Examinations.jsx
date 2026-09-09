import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRegistrations } from '../../services/registrationService';
import Layout from '../../components/Layout';
import '../registrations/Registrations.css';

export default function Examinations() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getRegistrations();
      // Hanya tampilkan pendaftaran yang siap diperiksa dokter
      setRegistrations(res.data.filter((r) => r.status === 'pemeriksaan'));
    } catch (err) {
      setError('Gagal mengambil daftar pemeriksaan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Pemeriksaan">
      <div className="patients-page">
        <div className="patients-header">
          <h1>Pasien Siap Diperiksa</h1>
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
                  <th>Poli</th>
                  <th>Keluhan Awal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="state-text empty-row">
                      Tidak ada pasien yang siap diperiksa saat ini
                    </td>
                  </tr>
                ) : (
                  registrations.map((r) => (
                    <tr key={r.id}>
                      <td>{r.queue_number || '-'}</td>
                      <td>{r.patient_name}</td>
                      <td>{r.poly_name}</td>
                      <td>{r.initial_complaint || '-'}</td>
                      <td className="actions">
                        <button onClick={() => navigate(`/examinations/${r.id}`)}>
                          Periksa
                        </button>
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