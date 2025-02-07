
import { api } from './api-config';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      localStorage.removeItem('token'); // On supprime le token si l'appel échoue
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
