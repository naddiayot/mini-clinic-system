import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRegistration } from '../../services/registrationService';
import { getPatients } from '../../services/patientService';
import { getDoctors } from '../../services/doctorService';
import { getPolyclinics } from '../../services/polyclinicService';
import Layout from '../../components/Layout';
import './Registrations.css';

const initialForm = {
  patient_id: '',
  doctor_id: '',
  poly_id: '',
  payment_type: 'Umum',
  initial_complaint: '',
};

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [polyclinics, setPolyclinics] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [patientsRes, doctorsRes, polyclinicsRes] = await Promise.all([
        getPatients({ limit: 100 }),
        getDoctors(),
        getPolyclinics(),
      ]);
      setPatients(patientsRes.data.patients);
      setDoctors(doctorsRes.data);
      setPolyclinics(polyclinicsRes.data);
    } catch (err) {
      setSubmitError('Gagal memuat data pasien/dokter/poli');
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
    if (!form.patient_id) newErrors.patient_id = 'Pasien wajib dipilih';
    if (!form.doctor_id) newErrors.doctor_id = 'Dokter wajib dipilih';
    if (!form.poly_id) newErrors.poly_id = 'Poli wajib dipilih';
    if (!form.payment_type) newErrors.payment_type = 'Jenis pembayaran wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createRegistration(form);
      navigate('/registrations');
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) setErrors((prev) => ({ ...prev, ...backendErrors }));
      setSubmitError(backendMessage || 'Gagal membuat pendaftaran');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Tambah Pendaftaran">
        <p className="state-text">Memuat data...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Tambah Pendaftaran">
      <div className="patient-form-card">
        <form onSubmit={handleSubmit} noValidate>
          {submitError && <p className="state-error">{submitError}</p>}

          <div className="form-group">
            <label>Pasien</label>
            <select name="patient_id" value={form.patient_id} onChange={handleChange}>
              <option value="">-- Pilih Pasien --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.medical_record_no})
                </option>
              ))}
            </select>
            {errors.patient_id && <span className="field-error">{errors.patient_id}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dokter</label>
              <select name="doctor_id" value={form.doctor_id} onChange={handleChange}>
                <option value="">-- Pilih Dokter --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.doctor_id && <span className="field-error">{errors.doctor_id}</span>}
            </div>

            <div className="form-group">
              <label>Poli</label>
              <select name="poly_id" value={form.poly_id} onChange={handleChange}>
                <option value="">-- Pilih Poli --</option>
                {polyclinics.map((pol) => (
                  <option key={pol.id} value={pol.id}>{pol.name}</option>
                ))}
              </select>
              {errors.poly_id && <span className="field-error">{errors.poly_id}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Jenis Pembayaran</label>
            <select name="payment_type" value={form.payment_type} onChange={handleChange}>
              <option value="Umum">Umum</option>
              <option value="BPJS">BPJS</option>
              <option value="Asuransi">Asuransi</option>
            </select>
            {errors.payment_type && <span className="field-error">{errors.payment_type}</span>}
          </div>

          <div className="form-group">
            <label>Keluhan Awal</label>
            <textarea
              name="initial_complaint"
              value={form.initial_complaint}
              onChange={handleChange}
              rows={3}
              placeholder="Contoh: Demam dan batuk sejak 2 hari"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/registrations')}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Daftarkan'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}