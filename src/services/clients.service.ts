import { API_BASE_URL, getAuthHeaders } from './api-config';
import { Client } from '@/types/client';

export const clientsService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch client');
    return response.json();
  },

  create: async (client: Omit<Client, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to create client');
    return response.json();
  },

  update: async (id: number, client: Partial<Client>) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to update client');
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete client');
    return response.json();
  }
};