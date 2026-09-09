import api from './api';

export const getQueues = async () => {
  const response = await api.get('/queues');
  return response.data;
};

export const callQueue = async (id) => {
  const response = await api.put(`/queues/${id}/call`);
  return response.data;
};

export const updateQueueStatus = async (id, status) => {
  const response = await api.put(`/queues/${id}/status`, { status });
  return response.data;
};