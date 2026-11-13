import api from './axiosInstance';

const fallbackOverview = {
  totalProjects: 6,
  totalTasks: 18,
  completedTasks: 8,
  overdueTasks: 2,
  activeProjectCount: 4,
  monthlyTrend: [4, 6, 7, 9, 8, 10],
  priorityStats: { HIGH: 5, MEDIUM: 9, LOW: 4 },
  recentTasks: [
    { id: 1, title: 'Finalize Q2 roadmap', status: 'IN_PROGRESS' },
    { id: 2, title: 'Prepare sprint review', status: 'TODO' },
    { id: 3, title: 'Review KPI metrics', status: 'DONE' },
  ],
};

export const getOverview = async () => {
  try {
    const response = await api.get('/dashboard/overview');
    return response.data;
  } catch (error) {
    return fallbackOverview;
  }
};

export default {
  getOverview,
};
