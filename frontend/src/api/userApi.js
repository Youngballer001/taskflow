import api from './axiosInstance';

export const getCurrentUser = async () => (await api.get('/users/me')).data;

export const getUsers = async (params = {}) => (await api.get('/admin/users', { params })).data;
export const updateUserRole = async (id, role) => (await api.patch(`/admin/users/${id}/role`, { role })).data;
export const setUserActive = async (id, value) => (await api.patch(`/admin/users/${id}/active`, null, { params: { value } })).data;
export const updateProfile = async (payload) => (await api.put('/users/me', payload)).data;
export const changePassword = async (payload) => (await api.put('/users/me/password', payload)).data;

export default {
  getCurrentUser,
  getUsers,
  updateUserRole,
  setUserActive,
  updateProfile,
  changePassword,
};
