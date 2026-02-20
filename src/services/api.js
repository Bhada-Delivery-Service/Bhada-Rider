import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  verifyFirebase: (idToken) => api.post('/auth/verify-firebase', { idToken, role: 'rider' }),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  checkSession: () => api.get('/auth/check-session'),
};

// ─── Riders ────────────────────────────────────────────────────────────────
export const ridersAPI = {
  getById: (id) => api.get(`/riders/${id}`),
  updateProfile: (id, data) => api.put(`/riders/${id}/profile`, data),
  submitVehicle: (id, data) => api.post(`/riders/${id}/vehicle`, data),
  submitKyc: (id, data) => api.post(`/riders/${id}/kyc`, data),
  submitOnboarding: (id) => api.post(`/riders/${id}/onboarding`),
  revokeOnboarding: (id) => api.delete(`/riders/${id}/onboarding`),
  updateOnboarding: (id, data) => api.put(`/riders/${id}/onboarding`, data),
  getOnboardingStatus: (id) => api.get(`/riders/${id}/onboarding/status`),
  goOnline: (id) => api.put(`/riders/${id}/online`),
  goOffline: (id) => api.put(`/riders/${id}/offline`),
  takeBreak: (id) => api.put(`/riders/${id}/break`),
  resume: (id) => api.put(`/riders/${id}/resume`),
  getRoutes: (id) => api.get(`/riders/${id}/routes`),
  addRoute: (id, data) => api.post(`/riders/${id}/routes`, data),
  updateRoute: (id, routeId, data) => api.put(`/riders/${id}/routes/${routeId}`, data),
  deleteRoute: (id, routeId) => api.delete(`/riders/${id}/routes/${routeId}`),
  getAreas: (id) => api.get(`/riders/${id}/areas`),
  addArea: (id, data) => api.post(`/riders/${id}/areas`, data),
  updateArea: (id, areaId, data) => api.put(`/riders/${id}/areas/${areaId}`, data),
  deleteArea: (id, areaId) => api.delete(`/riders/${id}/areas/${areaId}`),
  getPerformance: (id) => api.get(`/riders/${id}/performance`),
  completeDelivery: (id) => api.put(`/riders/${id}/delivery/complete`),
};

// ─── Orders ────────────────────────────────────────────────────────────────
export const ordersAPI = {
  getAvailable: () => api.get('/orders/available'),
  getById: (id) => api.get(`/orders/${id}`),
  accept: (id) => api.put(`/orders/${id}/accept`),
  cancelDelivery: (id, reason) => api.put(`/orders/${id}/cancel-delivery`, { reason }),
  handover: (id, pickupOtp) => api.post(`/orders/${id}/handover`, { pickupOtp }),
  deliver: (id, dropOtp) => api.post(`/orders/${id}/deliver`, { dropOtp }),
};

// ─── File Upload ───────────────────────────────────────────────────────────
export const filesAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Notifications ─────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll:      (limit = 30) => api.get(`/notifications?limit=${limit}`),
  getCount:    ()           => api.get('/notifications/count'),
  markSeen:    (id)         => api.put(`/notifications/${id}/seen`),
  markAllSeen: ()           => api.put('/notifications/seen-all'),
};

export default api;
