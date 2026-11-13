import api from './axiosInstance';

const fallbackUsers = [
  { id: 1, fullName: 'Demo User', email: 'demo@taskflow.app', role: 'ADMIN' },
  { id: 2, fullName: 'Sarah Chen', email: 'sarah@taskflow.app', role: 'PROJECT_MANAGER' },
  { id: 3, fullName: 'Alex Park', email: 'alex@taskflow.app', role: 'TEAM_MEMBER' },
  { id: 4, fullName: 'Priya Singh', email: 'priya@taskflow.app', role: 'TEAM_MEMBER' },
];

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    return fallbackUsers[0];
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    return fallbackUsers;
  }
};

export default {
  getCurrentUser,
  getUsers,
};
