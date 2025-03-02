
import { api } from './api-config';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email);
      const response = await api.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      // Check both response.data.token and response.data.access_token (common API pattern)
      const token = response.data.token || response.data.access_token;
      
      if (token) {
        // Store token in localStorage with consistent format
        localStorage.setItem('token', token);
        
        // Store expiration (24 hours from now)
        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
        
        // Add debug logs to verify token storage
        console.log('Token stored successfully:', !!token);
        console.log('Token expiration set to:', new Date(expiresAt).toISOString());
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        console.log('Token in localStorage after storing:', storedToken ? 'Present' : 'Missing');
      } else {
        console.error('Login response did not contain a token:', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Only attempt to call logout API if we have a token
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/auth/logout');
      }
      
      // Always clear token data
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresAt');
      console.log('Token removed from localStorage during logout');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Always clear token data even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresAt');
      console.log('Token removed from localStorage after logout error');
      return false;
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    
    console.log('Token from localStorage:', token);

    if (!token || !tokenExpiresAt) {
      console.log('No token found in localStorage');
      throw new Error('No token found');
    }

    // Check if token is expired
    if (new Date().getTime() > parseInt(tokenExpiresAt)) {
      console.log('Token expired, clearing localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresAt');
      throw new Error('Token expired');
    }

    try {
      console.log('Making API call to /auth/me with token');
      const response = await api.get('/auth/me');
      console.log('Current user fetched successfully');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      
      // Only remove token if it's an authentication error (401)
      if (error.response && error.response.status === 401) {
        console.log('Authentication error, clearing token');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiresAt');
      } else {
        console.log('Network or server error, keeping token');
        // For network errors or non-auth errors, don't remove token
      }
      throw error;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    
    console.log('Checking auth status - Token exists:', !!token);
    
    if (!token || !tokenExpiresAt) {
      return false;
    }

    // Check if token is expired
    const isValid = new Date().getTime() <= parseInt(tokenExpiresAt);
    console.log('Token is valid:', isValid);
    return isValid;
  }
};
