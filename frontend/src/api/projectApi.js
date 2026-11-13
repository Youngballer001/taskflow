import api from './axiosInstance';

const fallbackProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Refresh the marketing site and improve conversion flows.',
    ownerId: 1,
    ownerName: 'Demo User',
    startDate: '2025-01-08',
    dueDate: '2025-02-20',
    status: 'IN_PROGRESS',
    createdAt: '2025-01-08T10:00:00',
    updatedAt: '2025-01-12T08:00:00',
  },
  {
    id: 2,
    name: 'Mobile App Launch',
    description: 'Coordinate the launch plan for the new mobile onboarding flow.',
    ownerId: 1,
    ownerName: 'Demo User',
    startDate: '2025-01-12',
    dueDate: '2025-02-03',
    status: 'PLANNING',
    createdAt: '2025-01-12T09:00:00',
    updatedAt: '2025-01-15T14:00:00',
  },
];

export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    return fallbackProjects;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    return fallbackProjects.find((project) => project.id === Number(id)) || fallbackProjects[0];
  }
};

export const createProject = async (payload) => {
  try {
    const response = await api.post('/projects', payload);
    return response.data;
  } catch (error) {
    const created = {
      id: Date.now(),
      ...payload,
      ownerId: 1,
      ownerName: 'Demo User',
      status: 'PLANNING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return created;
  }
};

export default {
  getProjects,
  getProjectById,
  createProject,
};
