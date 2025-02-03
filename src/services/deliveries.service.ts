import { API_BASE_URL, getAuthHeaders } from './api-config';

export interface Delivery {
  id: string;
  orderId: string;
  date: string;
  status: "pending" | "in_transit" | "delivered";
  address: string;
  client: string;
  items: string;
}

export const deliveriesService = {
  getAll: async (): Promise<Delivery[]> => {
    const response = await fetch(`${API_BASE_URL}/deliveries`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch deliveries');
    return response.json();
  },

  getById: async (id: string): Promise<Delivery> => {
    const response = await fetch(`${API_BASE_URL}/deliveries/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch delivery');
    return response.json();
  },

  create: async (formData: FormData): Promise<Delivery> => {
    const response = await fetch(`${API_BASE_URL}/deliveries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create delivery');
    return response.json();
  },

  update: async (id: string, formData: FormData): Promise<Delivery> => {
    const response = await fetch(`${API_BASE_URL}/deliveries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update delivery');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/deliveries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete delivery');
  },
};