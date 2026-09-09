import { useState, useEffect } from 'react';
import { getQueues, callQueue, updateQueueStatus } from '../../services/queueService';
import Layout from '../../components/Layout';
import './Queues.css';

const statusLabels = {
  menunggu: 'Menunggu',
  dipanggil: 'Dipanggil',
  selesai: 'Selesai',
};

export default function Queues() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getQueues();
      setQueues(res.data);
    } catch (err) {
      setError('Gagal mengambil daftar antrean');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = async (id) => {
    try {
      await callQueue(id);
      fetchQueues();
    } catch (err) {
      alert('Gagal memanggil antrean');
      console.error(err);
    }
  };

  const handleFinish = async (id) => {
    try {
      await updateQueueStatus(id, 'selesai');
      fetchQueues();
    } catch (err) {
      alert('Gagal mengubah status antrean');
      console.error(err);
    }
  };

  // Antrean yang sedang dipanggil, ditampilkan besar di atas (kayak layar panggilan klinik)
  const currentlyCalled = queues.find((q) => q.status === 'dipanggil');

  return (
    <Layout title="Antrean">
      <div className="patients-page">
        {currentlyCalled && (
          <div className="queue-now-calling">
            <span className="queue-now-label">Sedang Dipanggil</span>
            <span className="queue-now-number" key={currentlyCalled.queue_number}>
              {currentlyCalled.queue_number}
            </span>
            <span className="queue-now-patient">
              {currentlyCalled.patient_name} — {currentlyCalled.poly_name}
            </span>
          </div>
        )}

        <div className="patients-header">
          <h1>Daftar Antrean Hari Ini</h1>
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
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {queues.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="state-text empty-row">Belum ada antrean hari ini</td>
                  </tr>
                ) : (
                  queues.map((q) => (
                    <tr key={q.id}>
                      <td><strong>{q.queue_number}</strong></td>
                      <td>{q.patient_name}</td>
                      <td>{q.poly_name}</td>
                      <td>
                        <span className={`status-badge status-${q.status}`}>
                          {statusLabels[q.status]}
                        </span>
                      </td>
                      <td className="actions">
                        {q.status === 'menunggu' && (
                          <button className="btn-call" onClick={() => handleCall(q.id)}>
                            Panggil
                          </button>
                        )}
                        {q.status === 'dipanggil' && (
                          <button className="btn-finish" onClick={() => handleFinish(q.id)}>
                            Selesai
                          </button>
                        )}
                        {q.status === 'selesai' && (
                          <span className="state-text">—</span>
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