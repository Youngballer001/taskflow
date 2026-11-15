import api from './axiosInstance';

export const getProjects = async () => (await api.get('/projects')).data;

export const getProjectById = async (id) => {
  return (await api.get(`/projects/${id}`)).data;
};

export const createProject = async (payload) => {
  return (await api.post('/projects', payload)).data;
};
export const updateProject = async (id, payload) => (await api.put(`/projects/${id}`, payload)).data;
export const deleteProject = async (id) => api.delete(`/projects/${id}`);
export const getProjectMembers = async (id) => (await api.get(`/projects/${id}/members`)).data;
export const addProjectMember = async (id, payload) => (await api.post(`/projects/${id}/members`, payload)).data;
export const removeProjectMember = async (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`);

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
};
