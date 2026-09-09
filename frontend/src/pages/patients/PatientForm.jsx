import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientById, createPatient, updatePatient } from '../../services/patientService';
import Layout from '../../components/Layout';
import './PatientForm.css';

const initialForm = {
  nik: '',
  name: '',
  gender: 'L',
  birth_date: '',
  phone: '',
  address: '',
};

export default function PatientForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isEdit) fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const res = await getPatientById(id);
      const p = res.data;
      setForm({
        nik: p.nik,
        name: p.name,
        gender: p.gender,
        birth_date: p.birth_date ? p.birth_date.substring(0, 10) : '',
        phone: p.phone,
        address: p.address,
      });
    } catch (err) {
      setSubmitError('Gagal memuat data pasien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!/^\d{16}$/.test(form.nik)) newErrors.nik = 'NIK wajib 16 digit angka';
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!form.birth_date) newErrors.birth_date = 'Tanggal lahir wajib diisi';
    if (!form.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!form.address.trim()) newErrors.address = 'Alamat wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEdit) {
        await updatePatient(id, form);
      } else {
        await createPatient(form);
      }
      navigate('/patients');
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      }
      setSubmitError(backendMessage || 'Gagal menyimpan data pasien');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title={isEdit ? 'Edit Pasien' : 'Tambah Pasien'}>
        <p className="state-text">Memuat data...</p>
      </Layout>
    );
  }

  return (
    <Layout title={isEdit ? 'Edit Pasien' : 'Tambah Pasien'}>
      <div className="patient-form-card">
        <form onSubmit={handleSubmit} noValidate>
          {submitError && <p className="state-error">{submitError}</p>}

          <div className="form-group">
            <label>NIK</label>
            <input
              type="text"
              name="nik"
              value={form.nik}
              onChange={handleChange}
              maxLength={16}
              placeholder="16 digit NIK"
            />
            {errors.nik && <span className="field-error">{errors.nik}</span>}
          </div>

          <div className="form-group">
            <label>Nama Pasien</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Jenis Kelamin</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tanggal Lahir</label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
              />
              {errors.birth_date && <span className="field-error">{errors.birth_date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Nomor Telepon</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Alamat</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/patients')}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}