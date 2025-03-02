
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
    console.log('Creating client with form data:', Object.fromEntries(formData.entries()));
    
    // Nous envoyons directement le FormData pour que les fichiers soient correctement gérés
    const response = await api.post('/clients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important pour les fichiers
      },
    });
    
    console.log('Client creation response:', response.data);
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Client> => {
    console.log('Updating client with form data:', Object.fromEntries(formData.entries()));
    
    // Nous envoyons directement le FormData pour que les fichiers soient correctement gérés
    const response = await api.put(`/clients/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important pour les fichiers
      },
    });
    
    console.log('Client update response:', response.data);
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
