import { API_BASE_URL, getAuthHeaders } from './api-config';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      localStorage.removeItem('token');
      return response.ok;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user data');
      }
      
      return response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }
};