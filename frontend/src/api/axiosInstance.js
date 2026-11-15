import axios from 'axios';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const auth = getStoredAuth();
    if (auth?.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshInFlight;
api.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  const auth = getStoredAuth();
  if (error.response?.status !== 401 || !auth?.refreshToken || originalRequest?._retry
      || originalRequest?.url?.includes('/auth/')) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;
  try {
    refreshInFlight ||= axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken: auth.refreshToken })
      .then(({ data }) => {
        setStoredAuth(data);
        return data.accessToken;
      })
      .finally(() => { refreshInFlight = undefined; });
    const accessToken = await refreshInFlight;
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return api(originalRequest);
  } catch (refreshError) {
    clearStoredAuth();
    if (typeof window !== 'undefined') window.location.assign('/login');
    return Promise.reject(refreshError);
  }
});

export default api;
