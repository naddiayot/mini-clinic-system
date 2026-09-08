import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import './Dashboard.css';

const statCards = [
  { key: 'total_pasien', label: 'Total Pasien' },
  { key: 'total_pasien_hari_ini', label: 'Total Pasien Hari Ini' },
  { key: 'total_antrean_hari_ini', label: 'Total Antrean Hari Ini' },
  { key: 'total_pasien_menunggu', label: 'Total Pasien Menunggu' },
  { key: 'total_pasien_selesai', label: 'Total Pasien Selesai Dilayani' },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data.data);
      } catch (err) {
        setError('Gagal memuat data dashboard. Coba muat ulang halaman.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout title="Dashboard">
      {loading && <p className="state-text">Memuat data...</p>}

      {error && (
        <p className="state-text state-error">{error}</p>
      )}

      {!loading && !error && stats && (
        <div className="stat-grid">
          {statCards.map((card) => (
            <div className="stat-card" key={card.key}>
              <span className="stat-card-label">{card.label}</span>
              <span className="stat-card-value">{stats[card.key]}</span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;