import { api } from './api-config';
import { Agency } from '@/types/agency';

export const agenciesService = {
  getAll: async (): Promise<Agency[]> => {
    const response = await api.get('/agencies');
    return response.data;
  },

  getById: async (id: string): Promise<Agency> => {
    const response = await api.get(`/agencies/${id}`);
    return response.data;
  },

  create: async (agency: Omit<Agency, "id">): Promise<Agency> => {
    const response = await api.post('/agencies', agency);
    return response.data;
  },

  update: async (id: string, agency: Partial<Agency>): Promise<Agency> => {
    const response = await api.put(`/agencies/${id}`, agency);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/agencies/${id}`);
  },

  getStats: async () => {
    const response = await api.get('/agencies/stats');
    return response.data;
  }
};