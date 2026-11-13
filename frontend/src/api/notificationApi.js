import api from './axiosInstance';

const fallbackNotifications = [
  { id: 1, message: 'Project "Website Redesign" had a task assigned to Sarah Chen.', read: false },
  { id: 2, message: 'A new team member joined the mobile launch project.', read: true },
  { id: 3, message: 'The sprint review is scheduled for Friday at 2:00 PM.', read: false },
];

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    return fallbackNotifications;
  }
};

export default {
  getNotifications,
};
