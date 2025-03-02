
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Added token to request headers');
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized response received');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresAt');
      // Don't redirect here to avoid infinite loops
    }
    return Promise.reject(error);
  }
);
