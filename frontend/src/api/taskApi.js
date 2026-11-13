import api from './axiosInstance';

const fallbackTasks = [
  {
    id: 1,
    title: 'Design homepage hero',
    description: 'Finalize the new homepage hero and revise CTA copy.',
    projectId: 1,
    projectName: 'Website Redesign',
    assignedToId: 2,
    assignedToName: 'Sarah Chen',
    createdById: 1,
    createdByName: 'Demo User',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    startDate: '2025-01-10',
    dueDate: '2025-01-18',
    createdAt: '2025-01-10T08:00:00',
    updatedAt: '2025-01-12T10:00:00',
  },
  {
    id: 2,
    title: 'Prepare launch checklist',
    description: 'Create the launch checklist for the mobile onboarding release.',
    projectId: 2,
    projectName: 'Mobile App Launch',
    assignedToId: 3,
    assignedToName: 'Alex Park',
    createdById: 1,
    createdByName: 'Demo User',
    priority: 'MEDIUM',
    status: 'TODO',
    startDate: '2025-01-15',
    dueDate: '2025-01-25',
    createdAt: '2025-01-15T09:30:00',
    updatedAt: '2025-01-15T09:30:00',
  },
  {
    id: 3,
    title: 'QA signoff',
    description: 'Complete QA and approve final release signoff for the onboarding pass.',
    projectId: 1,
    projectName: 'Website Redesign',
    assignedToId: 4,
    assignedToName: 'Priya Singh',
    createdById: 1,
    createdByName: 'Demo User',
    priority: 'LOW',
    status: 'DONE',
    startDate: '2025-01-14',
    dueDate: '2025-01-16',
    createdAt: '2025-01-14T11:30:00',
    updatedAt: '2025-01-16T17:40:00',
  },
];

export const getTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    return fallbackTasks;
  }
};

export const getTasksForProject = async (projectId) => {
  try {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  } catch (error) {
    return fallbackTasks.filter((task) => task.projectId === Number(projectId));
  }
};

export const createTask = async (payload) => {
  try {
    const response = await api.post('/tasks', payload);
    return response.data;
  } catch (error) {
    const created = {
      id: Date.now(),
      title: payload.title,
      description: payload.description || '',
      projectId: payload.projectId,
      projectName: 'Demo Project',
      assignedToId: payload.assignedToId || null,
      assignedToName: payload.assignedToId ? 'Team Member' : null,
      createdById: 1,
      createdByName: 'Demo User',
      priority: payload.priority || 'MEDIUM',
      status: payload.status || 'TODO',
      startDate: payload.startDate || null,
      dueDate: payload.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return created;
  }
};

export default {
  getTasks,
  getTasksForProject,
  createTask,
};
