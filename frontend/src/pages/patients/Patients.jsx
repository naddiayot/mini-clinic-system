import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { getPatients, deletePatient } from '../../services/patientService';
import Layout from '../../components/Layout';
import './Patients.css';

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPatients({ page, limit: 10, search });
      setPatients(res.data.patients);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      setError('Gagal mengambil data pasien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPatients();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin hapus data pasien "${name}"?`)) return;
    try {
      await deletePatient(id);
      fetchPatients();
    } catch (err) {
      alert('Gagal menghapus data pasien');
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  return (
    <Layout title="Data Pasien">
      <div className="patients-page">
        <div className="patients-header">
          <h1>Daftar Pasien</h1>
          <button className="btn-primary" onClick={() => navigate('/patients/new')}>
            + Tambah Pasien
          </button>
        </div>

        <form className="patients-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-secondary">Cari</button>
        </form>

        {error && <p className="state-error">{error}</p>}

        <div className="patients-table-card">
          {loading ? (
            <p className="state-text">Memuat data...</p>
          ) : (
            <>
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>No. RM</th>
                    <th>NIK</th>
                    <th>Nama</th>
                    <th>Jenis Kelamin</th>
                    <th>Tanggal Lahir</th>
                    <th>No. Telepon</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="state-text empty-row">Belum ada data pasien</td>
                    </tr>
                  ) : (
                    patients.map((p) => (
                      <tr key={p.id}>
                        <td>{p.medical_record_no}</td>
                        <td>{p.nik}</td>
                        <td>{p.name}</td>
                        <td>{p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                        <td>{formatDate(p.birth_date)}</td>
                        <td>{p.phone}</td>
                        <td className="actions">
                          <button
                            className="btn-view"
                            title="Lihat detail"
                            onClick={() => navigate(`/patients/${p.id}`)}
                          >
                            <Eye aria-hidden="true" />
                          </button>
                          <button
                            className="btn-edit"
                            title="Edit"
                            onClick={() => navigate(`/patients/${p.id}/edit`)}
                          >
                            <Pencil aria-hidden="true" />
                          </button>
                          <button
                            className="btn-danger"
                            title="Hapus"
                            onClick={() => handleDelete(p.id, p.name)}
                          >
                            <Trash2 aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Sebelumnya
                </button>
                <span>Halaman {page} dari {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Selanjutnya
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}