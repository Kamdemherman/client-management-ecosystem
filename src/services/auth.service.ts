import { API_BASE_URL, getAuthHeaders } from './api-config';

export const authService = {
  login: async (email: string, password: string) => {
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
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    localStorage.removeItem('token');
    return response.ok;
  }
};