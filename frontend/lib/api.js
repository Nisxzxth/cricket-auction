import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
});

export const playerAPI = {
  getAll: (params = {}) => api.get('/players', { params }),
  getById: (id) => api.get(`/players/${id}`),
  create: (data) => api.post('/players', data),
  updateStatus: (id, data) => api.patch(`/players/${id}/status`, data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  seed: () => api.post('/players/seed/init'),
  downloadExcel: () => {
    window.open(`${API_URL}/api/players/export/excel`, '_blank');
  }
};

export default api;
