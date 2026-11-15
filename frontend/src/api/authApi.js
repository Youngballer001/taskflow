import api from './axiosInstance';

export const login = async (payload) => (await api.post('/auth/login', payload)).data;

export const register = async (payload) => (await api.post('/auth/register', payload)).data;
export const logout = async (refreshToken) => api.post('/auth/logout', { refreshToken });

export default {
  login,
  register,
  logout,
};
