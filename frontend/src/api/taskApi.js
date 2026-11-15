import api from './axiosInstance';

export const getTasks = async () => (await api.get('/tasks')).data;

export const getTasksForProject = async (projectId) => {
  return (await api.get(`/tasks/project/${projectId}`)).data;
};

export const createTask = async (payload) => {
  return (await api.post('/tasks', payload)).data;
};
export const updateTaskStatus = async (id, status) => (await api.patch(`/tasks/${id}/status`, { status })).data;
export const updateTask = async (id, payload) => (await api.put(`/tasks/${id}`, payload)).data;
export const deleteTask = async (id) => api.delete(`/tasks/${id}`);
export const getTask = async (id) => (await api.get(`/tasks/${id}`)).data;

export default {
  getTasks,
  getTasksForProject,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getTask,
};
