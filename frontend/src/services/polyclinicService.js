import api from './api';

export const getPolyclinics = async () => {
  const response = await api.get('/polyclinics');
  return response.data;
};