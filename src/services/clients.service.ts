
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
    
    // Ensure no ID is included when creating a new client
    if (formData.has('id')) {
      formData.delete('id');
    }
    
    // Send the FormData directly
    const response = await api.post('/clients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Client creation response:', response.data);
    return response.data;
  },

  update: async (id: number, formData: FormData): Promise<Client> => {
    console.log('Updating client with form data:', Object.fromEntries(formData.entries()));
    
    // Ensure the correct ID is set for updating
    if (formData.has('id')) {
      // Make sure the ID matches the path parameter
      const formId = formData.get('id');
      if (formId !== id.toString()) {
        formData.set('id', id.toString());
      }
    } else {
      // Add the ID if it's not in the form data
      formData.append('id', id.toString());
    }
    
    const response = await api.put(`/clients/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
