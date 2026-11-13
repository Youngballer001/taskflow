import api from './axiosInstance';

const fallbackComments = [
  { id: 1, author: 'Sarah Chen', message: 'The hero layout is ready for approval.', createdAt: '2025-01-10T10:00:00' },
  { id: 2, author: 'Demo User', message: 'Please include the updated CTA copy before publishing.', createdAt: '2025-01-11T13:00:00' },
];

export const getComments = async (taskId) => {
  try {
    const response = await api.get(`/comments/task/${taskId}`);
    return response.data;
  } catch (error) {
    return fallbackComments;
  }
};

export default {
  getComments,
};
