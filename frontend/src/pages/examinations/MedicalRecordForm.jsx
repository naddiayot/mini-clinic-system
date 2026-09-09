import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRegistrations } from '../../services/registrationService';
import { createMedicalRecord } from '../../services/medicalRecordService';
import Layout from '../../components/Layout';
import './Examinations.css';

const initialForm = {
  complaint: '',
  blood_pressure: '',
  temperature: '',
  weight: '',
  height: '',
  diagnosis: '',
  treatment_plan: '',
};

export default function MedicalRecordForm() {
  const { registrationId } = useParams();
  const navigate = useNavigate();

  const [registration, setRegistration] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [actions, setActions] = useState(['']);
  const [prescriptions, setPrescriptions] = useState([{ medicine_name: '', dosage: '', quantity: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchRegistration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationId]);

  const fetchRegistration = async () => {
    try {
      const res = await getRegistrations();
      const found = res.data.find((r) => String(r.id) === registrationId);
      setRegistration(found || null);
    } catch (err) {
      setSubmitError('Gagal memuat data pendaftaran');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Tindakan Medis (list dinamis, cukup teks) ---
  const handleActionChange = (index, value) => {
    setActions((prev) => prev.map((a, i) => (i === index ? value : a)));
  };
  const addAction = () => setActions((prev) => [...prev, '']);
  const removeAction = (index) => setActions((prev) => prev.filter((_, i) => i !== index));

  // --- Resep Obat (list dinamis, 3 field per baris) ---
  const handlePrescriptionChange = (index, field, value) => {
    setPrescriptions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };
  const addPrescription = () =>
    setPrescriptions((prev) => [...prev, { medicine_name: '', dosage: '', quantity: '' }]);
  const removePrescription = (index) =>
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const newErrors = {};
    if (!form.diagnosis.trim()) newErrors.diagnosis = 'Diagnosa wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        registration_id: Number(registrationId),
        ...form,
        actions: actions.filter((a) => a.trim() !== ''),
        prescriptions: prescriptions.filter((p) => p.medicine_name.trim() !== ''),
      };
      await createMedicalRecord(payload);
      navigate('/examinations');
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) setErrors((prev) => ({ ...prev, ...backendErrors }));
      setSubmitError(backendMessage || 'Gagal menyimpan hasil pemeriksaan');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Pemeriksaan Pasien">
        <p className="state-text">Memuat data...</p>
      </Layout>
    );
  }

  if (!registration) {
    return (
      <Layout title="Pemeriksaan Pasien">
        <p className="state-error">Data pendaftaran tidak ditemukan.</p>
      </Layout>
    );
  }

  return (
    <Layout title="Pemeriksaan Pasien">
      <div className="exam-form-card">
        <div className="exam-patient-info">
          <div><span>Pasien</span><strong>{registration.patient_name}</strong></div>
          <div><span>No. Antrean</span><strong>{registration.queue_number || '-'}</strong></div>
          <div><span>Poli</span><strong>{registration.poly_name}</strong></div>
          <div><span>Keluhan Awal</span><strong>{registration.initial_complaint || '-'}</strong></div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {submitError && <p className="state-error">{submitError}</p>}

          <h3 className="exam-section-title">Subjective</h3>
          <div className="form-group">
            <label>Keluhan Pasien</label>
            <textarea name="complaint" value={form.complaint} onChange={handleChange} rows={2} />
          </div>

          <h3 className="exam-section-title">Objective</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Tekanan Darah</label>
              <input type="text" name="blood_pressure" value={form.blood_pressure} onChange={handleChange} placeholder="120/80" />
            </div>
            <div className="form-group">
              <label>Suhu Tubuh (°C)</label>
              <input type="text" name="temperature" value={form.temperature} onChange={handleChange} placeholder="36.5" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Berat Badan (kg)</label>
              <input type="text" name="weight" value={form.weight} onChange={handleChange} placeholder="60" />
            </div>
            <div className="form-group">
              <label>Tinggi Badan (cm)</label>
              <input type="text" name="height" value={form.height} onChange={handleChange} placeholder="165" />
            </div>
          </div>

          <h3 className="exam-section-title">Assessment</h3>
          <div className="form-group">
            <label>Diagnosa</label>
            <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} rows={2} />
            {errors.diagnosis && <span className="field-error">{errors.diagnosis}</span>}
          </div>

          <h3 className="exam-section-title">Plan</h3>
          <div className="form-group">
            <label>Rencana Terapi</label>
            <textarea name="treatment_plan" value={form.treatment_plan} onChange={handleChange} rows={2} />
          </div>

          <h3 className="exam-section-title">Tindakan Medis</h3>
          {actions.map((action, index) => (
            <div className="dynamic-row" key={index}>
              <input
                type="text"
                value={action}
                onChange={(e) => handleActionChange(index, e.target.value)}
                placeholder="Contoh: Nebulizer"
              />
              {actions.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeAction(index)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addAction}>+ Tambah Tindakan</button>

          <h3 className="exam-section-title">Resep Obat</h3>
          {prescriptions.map((p, index) => (
            <div className="dynamic-row prescription-row" key={index}>
              <input
                type="text"
                value={p.medicine_name}
                onChange={(e) => handlePrescriptionChange(index, 'medicine_name', e.target.value)}
                placeholder="Nama obat"
              />
              <input
                type="text"
                value={p.dosage}
                onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                placeholder="Dosis (3x1)"
              />
              <input
                type="text"
                value={p.quantity}
                onChange={(e) => handlePrescriptionChange(index, 'quantity', e.target.value)}
                placeholder="Jumlah (10 tablet)"
              />
              {prescriptions.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removePrescription(index)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addPrescription}>+ Tambah Obat</button>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/examinations')}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}