import axios from 'axios';
import { logger } from '../utils/logger';

const log = logger('API');
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// ─── Client-side rate limiter for sensitive mutation endpoints ──────────────
// Prevents rapid double-taps from firing duplicate requests even if the
// useActionGuard hook is bypassed (e.g. programmatic calls).
const rateLimitMap = new Map(); // key → timestamp of last call
const RATE_LIMIT_WINDOWS = {
  accept:         3000,  // 3s between accepts
  deliver:        3000,
  handover:       3000,
  cancelDelivery: 5000,
  goOnline:       2000,
  goOffline:      2000,
  takeBreak:      2000,
  resume:         2000,
};

function checkRateLimit(actionKey) {
  const window = RATE_LIMIT_WINDOWS[actionKey];
  if (!window) return; // not rate-limited
  const last = rateLimitMap.get(actionKey);
  const now  = Date.now();
  if (last && now - last < window) {
    const remaining = Math.ceil((window - (now - last)) / 1000);
    throw new Error(`Action "${actionKey}" rate limited. Wait ${remaining}s.`);
  }
  rateLimitMap.set(actionKey, now);
}


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
  refreshToken:   (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  checkSession:   () => api.get('/auth/check-session'),
};

// ─── Riders ────────────────────────────────────────────────────────────────
export const ridersAPI = {
  getById:           (id)          => api.get(`/riders/${id}`),
  updateProfile:     (id, data)    => api.put(`/riders/${id}/profile`, data),
  submitVehicle:     (id, data)    => api.post(`/riders/${id}/vehicle`, data),
  submitKyc:         (id, data)    => api.post(`/riders/${id}/kyc`, data),
  submitOnboarding:  (id)          => api.post(`/riders/${id}/onboarding`),
  revokeOnboarding:  (id)          => api.delete(`/riders/${id}/onboarding`),
  updateOnboarding:  (id, data)    => api.put(`/riders/${id}/onboarding`, data),
  getOnboardingStatus:(id)         => api.get(`/riders/${id}/onboarding/status`),
  goOnline:          (id)          => { checkRateLimit('goOnline');  log.action('rider_go_online',  { id }); return api.put(`/riders/${id}/online`); },
  goOffline:         (id)          => { checkRateLimit('goOffline'); log.action('rider_go_offline', { id }); return api.put(`/riders/${id}/offline`); },
  takeBreak:         (id)          => { checkRateLimit('takeBreak'); log.action('rider_take_break', { id }); return api.put(`/riders/${id}/break`); },
  resume:            (id)          => { checkRateLimit('resume');    log.action('rider_resume',     { id }); return api.put(`/riders/${id}/resume`); },
  getRoutes:         (id)          => api.get(`/riders/${id}/routes`),
  addRoute:          (id, data)    => api.post(`/riders/${id}/routes`, data),
  updateRoute:       (id, rid, data) => api.put(`/riders/${id}/routes/${rid}`, data),
  deleteRoute:       (id, rid)     => api.delete(`/riders/${id}/routes/${rid}`),
  getAreas:          (id)          => api.get(`/riders/${id}/areas`),
  addArea:           (id, data)    => api.post(`/riders/${id}/areas`, data),
  updateArea:        (id, aid, data) => api.put(`/riders/${id}/areas/${aid}`, data),
  deleteArea:        (id, aid)     => api.delete(`/riders/${id}/areas/${aid}`),
  getPerformance:    (id)          => api.get(`/riders/${id}/performance`),
  completeDelivery:  (id)          => api.put(`/riders/${id}/delivery/complete`),
  // Save bank account / UPI details via onboarding update
  updateBankAccount: (id, data)    => api.put(`/riders/${id}/onboarding`, data),
};

// ─── Orders ────────────────────────────────────────────────────────────────
export const ordersAPI = {
  getAvailable:   ()               => api.get('/orders/available'),
  getMyOrders:    ()               => api.get('/orders/my-rider-orders'),
  getById:        (id)             => api.get(`/orders/${id}`),
  accept:         (id)             => { checkRateLimit('accept');         log.action('order_accept',   { id }); return api.put(`/orders/${id}/accept`); },
  cancelDelivery: (id, reason)     => { checkRateLimit('cancelDelivery'); log.action('order_cancel',   { id }); return api.put(`/orders/${id}/cancel-delivery`, { reason }); },
  handover:       (id, pickupOtp)  => { checkRateLimit('handover'); log.action('order_handover', { id }); return api.post(`/orders/${id}/handover`, { pickupOtp }); },
  deliver:        (id, dropOtp)    => { checkRateLimit('deliver');  log.action('order_deliver',  { id }); return api.post(`/orders/${id}/deliver`, { dropOtp }); },
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

// ─── Earnings & Withdrawals ────────────────────────────────────────────────
// Routes:
//   GET  /earnings/riders/:riderId               → earning transaction list
//   GET  /earnings/riders/:riderId/summary       → totals + pendingPayout
//   GET  /earnings/riders/:riderId/withdrawals   → rider's withdrawal history
//   POST /earnings/riders/:riderId/withdrawals   → submit withdrawal request
export const earningsAPI = {
  // Current platform commission percentage from active pricing config
  getCommission: () =>
    api.get('/earnings/commission'),

  // Earning transactions list (latest first)
  getEarnings: (riderId, limit = 50) =>
    api.get(`/earnings/riders/${riderId}?limit=${limit}`),

  // Summary: totalEarnings, thisMonthEarnings, lastMonthEarnings,
  //          totalDeliveries, pendingPayout, totalWithdrawn
  getSummary: (riderId) =>
    api.get(`/earnings/riders/${riderId}/summary`),

  // Rider's withdrawal history (latest first)
  getWithdrawals: (riderId) =>
    api.get(`/earnings/riders/${riderId}/withdrawals`),

  // Submit a withdrawal request
  // body: { requestedAmount, paymentMethod, accountDetails, riderName?, riderPhone? }
  initiateWithdrawal: (riderId, data) =>
    api.post(`/earnings/riders/${riderId}/withdrawals`, data),
};

// ─── Security Deposit ──────────────────────────────────────────────────────
export const securityDepositAPI = {
  getMy:    ()     => api.get('/security-deposit/my'),
  initiate: ()     => api.post('/security-deposit/initiate'),
  verify:   (data) => api.post('/security-deposit/verify', data),
};

// ─── Service Area ──────────────────────────────────────────────────────────
export const serviceAreaAPI = {
  getActive:  ()                        => api.get('/service-areas/active'),
  validate:   (pLat, pLng, dLat, dLng) =>
    api.get(`/service-areas/validate?pickupLat=${pLat}&pickupLng=${pLng}&dropLat=${dLat}&dropLng=${dLng}`),
};

export default api;