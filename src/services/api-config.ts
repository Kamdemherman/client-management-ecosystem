import axios, { AxiosRequestConfig } from 'axios';

export const API_BASE_URL = 'http://localhost:8000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth headers
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const headers = getAuthHeaders();
  config.headers = headers;
  return config;
});