import api from './axiosInstance';

export const getOverview = async () => (await api.get('/dashboard')).data;

export default {
  getOverview,
};
