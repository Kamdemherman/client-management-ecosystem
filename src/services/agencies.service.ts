import { API_BASE_URL, getAuthHeaders } from './api-config';
import { Agency } from '@/types/agency';

export const agenciesService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/agencies`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch agencies');
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/agencies/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch agency');
    return response.json();
  },

  create: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/agencies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    if (!response.ok) throw new Error('Failed to create agency');
    return response.json();
  },

  update: async (id: number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/agencies/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    if (!response.ok) throw new Error('Failed to update agency');
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/agencies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete agency');
    return response.json();
  },

  getRevenue: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/agencies/${id}/revenue`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch agency revenue');
    return response.json();
  },

  getComplaints: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/agencies/${id}/complaints`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch agency complaints');
    return response.json();
  }
};