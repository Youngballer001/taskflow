import api from './axiosInstance';

export const getReports = async () => (await api.get('/reports')).data;

export default {
  getReports,
};
