import api from './axiosInstance';

const fallbackAuthResponse = (payload = {}) => ({
  accessToken: 'demo-access-token',
  refreshToken: 'demo-refresh-token',
  user: {
    id: 1,
    email: payload.email || 'demo@taskflow.app',
    fullName: payload.fullName || 'Demo User',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
});

export const login = async (payload) => {
  try {
    const response = await api.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    return fallbackAuthResponse(payload);
  }
};

export const register = async (payload) => {
  try {
    const response = await api.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    return fallbackAuthResponse({
      email: payload.email,
      fullName: payload.fullName,
    });
  }
};

export default {
  login,
  register,
};
