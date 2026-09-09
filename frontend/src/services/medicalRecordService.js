import api from './api';

export const createMedicalRecord = async (data) => {
  const response = await api.post('/medical-records', data);
  return response.data;
};

export const getMedicalRecordsByPatient = async (patientId) => {
  const response = await api.get(`/medical-records/${patientId}`);
  return response.data;
};