import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Check current session
  checkAuth: async () => {
    try {
      const { data } = await api.get('/users/me');
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Register
  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  // Login
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  // Logout
  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null, isAuthenticated: false });
  },

  // Update profile
  updateProfile: async (profileData) => {
    const { data } = await api.put('/users/me', profileData);
    set({ user: data.user });
    return data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Update user's avatar in store
    const current = get().user;
    set({ user: { ...current, avatar: data.avatarUrl } });
    return data;
  },
}));

export default useAuthStore;
