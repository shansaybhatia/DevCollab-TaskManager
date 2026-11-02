import { create } from 'zustand';
import api from '../lib/api';

const useTaskStore = create((set) => ({
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
    set((state) => ({ tasks: [data, ...state.tasks] }));
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

  // Handle real-time task creation from socket
  handleSocketTaskCreate: (newTask) => {
    set((state) => {
      if (state.tasks.some((t) => t._id === newTask._id)) return state;
      return { tasks: [newTask, ...state.tasks] };
    });
  },

  // Handle real-time task update from socket
  handleSocketTaskUpdate: (updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      ),
    }));
  },

  // Handle real-time task deletion from socket
  handleSocketTaskDelete: (deletedTaskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== deletedTaskId),
    }));
  },

  // Clear tasks when leaving project
  clearTasks: () => set({ tasks: [], isLoading: false }),
}));

export default useTaskStore;
