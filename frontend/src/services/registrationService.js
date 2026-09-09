import api from './api';

export const getRegistrations = async () => {
  const response = await api.get('/registrations');
  return response.data;
};

export const createRegistration = async (data) => {
  const response = await api.post('/registrations', data);
  return response.data;
};

export const updateRegistrationStatus = async (id, status) => {
  const response = await api.put(`/registrations/${id}`, { status });
  return response.data;
};