import { create } from 'zustand';
import api from '../lib/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,

  // Fetch tasks for a project
  fetchTasks: async (projectId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`);
      set({ tasks: Array.isArray(data) ? data : [], isLoading: false });
    } catch {
      set({ tasks: [], isLoading: false });
    }
  },

  // Create a task
  createTask: async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    set((state) => ({ tasks: [...state.tasks, data] }));
    return data;
  },

  // Update a task
  updateTask: async (taskId, updates) => {
    const { data } = await api.put(`/tasks/${taskId}`, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === taskId ? data : t)),
    }));
    return data;
  },

  // Delete a task
  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    }));
  },

  // Handle real-time task update from socket
  handleSocketTaskUpdate: (updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      ),
    }));
  },

  // Clear tasks when leaving project
  clearTasks: () => set({ tasks: [], isLoading: false }),
}));

export default useTaskStore;
