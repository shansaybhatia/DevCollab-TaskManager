import { create } from 'zustand';
import api from '../lib/api';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  // Fetch all projects
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/projects');
      set({ projects: Array.isArray(data) ? data : [], isLoading: false });
    } catch {
      set({ projects: [], isLoading: false });
    }
  },

  // Create project
  createProject: async (title, description) => {
    const { data } = await api.post('/projects', { title, description });
    set((state) => ({ projects: [data, ...state.projects] }));
    return data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    await api.delete(`/projects/${projectId}`);
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== projectId),
      currentProject:
        state.currentProject?._id === projectId ? null : state.currentProject,
    }));
  },

  // Set current project
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  // Invite member
  inviteMember: async (projectId, email) => {
    const { data } = await api.post(`/projects/${projectId}/invite`, { email });
    // Update project in list
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === projectId ? data.project : p
      ),
      currentProject:
        state.currentProject?._id === projectId
          ? data.project
          : state.currentProject,
    }));
    return data;
  },
}));

export default useProjectStore;
