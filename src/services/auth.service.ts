
import { api } from './api-config';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Stockons également la date d'expiration (24 heures à partir de maintenant)
        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
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
      localStorage.removeItem('tokenExpiresAt');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

    if (!token || !tokenExpiresAt) {
      throw new Error('No token found');
    }

    // Vérifier si le token n'est pas expiré
    if (new Date().getTime() > parseInt(tokenExpiresAt)) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresAt');
      throw new Error('Token expired');
    }

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresAt');
      throw error;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

    if (!token || !tokenExpiresAt) {
      return false;
    }

    // Vérifier si le token n'est pas expiré
    return new Date().getTime() <= parseInt(tokenExpiresAt);
  }
};
