import api from './axiosInstance';

const fallbackReport = {
  totalProductivity: 82,
  deliveryTrend: [68, 73, 75, 80, 88, 83],
  workloadByPerson: [
    { name: 'Sarah', value: 38 },
    { name: 'Alex', value: 24 },
    { name: 'Priya', value: 19 },
    { name: 'You', value: 28 },
  ],
};

export const getReports = async () => {
  try {
    const response = await api.get('/reports/summary');
    return response.data;
  } catch (error) {
    return fallbackReport;
  }
};

export default {
  getReports,
};
