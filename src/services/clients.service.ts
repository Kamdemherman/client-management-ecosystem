import { api } from './api-config';
import { Client } from '@/types/client';

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get('/clients');
    return response.data;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Client> => {
    const data = Object.fromEntries(formData.entries());
    const response = await api.post('/clients', data);
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Client> => {
    const data = Object.fromEntries(formData.entries());
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },

  getStats: async () => {
    const response = await api.get('/clients/stats');
    return response.data;
  }
};