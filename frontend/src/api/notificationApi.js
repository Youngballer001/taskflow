import api from './axiosInstance';

export const getNotifications = async () => (await api.get('/notifications')).data;
export const markAsRead = async (id) => (await api.patch(`/notifications/${id}/read`)).data;
export const markAllAsRead = async () => api.patch('/notifications/read-all');
export const deleteNotification = async (id) => api.delete(`/notifications/${id}`);

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
