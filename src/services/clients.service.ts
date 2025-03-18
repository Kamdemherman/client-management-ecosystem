
import { api } from './api-config';
import { Client } from '@/types/client';

export const clientsService = {
  getAll: async (): Promise<Client[]> => {
    try {
      const response = await api.get('/clients');
      console.log('Fetched clients:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  getById: async (id: number | string): Promise<Client> => {
    try {
      const response = await api.get(`/clients/${id}`);
      console.log('Fetched client by id:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw error;
    }
  },

  create: async (formData: FormData): Promise<Client> => {
    console.log('Creating client with form data:', Object.fromEntries(formData.entries()));
    
    try {
      // Ensure proper formatting before sending
      const response = await api.post('/clients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Client creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  update: async (id: number | string, formData: FormData): Promise<Client> => {
    console.log('Updating client with form data:', Object.fromEntries(formData.entries()));
    
    try {
      // Use the correct method for updating (PUT or PATCH depending on your API)
      const response = await api.put(`/clients/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Client update response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating client with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number | string): Promise<void> => {
    try {
      await api.delete(`/clients/${id}`);
      console.log(`Client with id ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/clients/stats');
      console.log('Fetched client stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching client stats:', error);
      throw error;
    }
  }
};
