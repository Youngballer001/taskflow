import api from './axiosInstance';

export const getComments = async (taskId) => (await api.get(`/tasks/${taskId}/comments`)).data;
export const createComment = async (taskId, payload) => (await api.post(`/tasks/${taskId}/comments`, payload)).data;
export const updateComment = async (taskId, commentId, payload) => (await api.put(`/tasks/${taskId}/comments/${commentId}`, payload)).data;
export const deleteComment = async (taskId, commentId) => api.delete(`/tasks/${taskId}/comments/${commentId}`);

export default {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
