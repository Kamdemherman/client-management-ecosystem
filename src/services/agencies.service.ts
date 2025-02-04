import { api } from './api-config';
import { Agency } from '@/types/agency';

export const agenciesService = {
  getAll: async (): Promise<Agency[]> => {
    const response = await api.get('/agencies');
    return response.data;
  },

  getById: async (id: number): Promise<Agency> => {
    const response = await api.get(`/agencies/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Agency> => {
    const data = Object.fromEntries(formData.entries());
    const response = await api.post('/agencies', data);
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Agency> => {
    const data = Object.fromEntries(formData.entries());
    const response = await api.put(`/agencies/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/agencies/${id}`);
  },

  getStats: async () => {
    const response = await api.get('/agencies/stats');
    return response.data;
  }
};