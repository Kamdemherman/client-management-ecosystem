import { api } from './api-config';
import { Client } from '@/types/client';

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get('/clients');
    return response.data;
  },

  getById: async (id: string): Promise<Client> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (client: Omit<Client, "id">): Promise<Client> => {
    const response = await api.post('/clients', client);
    return response.data;
  },

  update: async (id: string, client: Partial<Client>): Promise<Client> => {
    const response = await api.put(`/clients/${id}`, client);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },

  getStats: async () => {
    const response = await api.get('/clients/stats');
    return response.data;
  }
};