import { API_BASE_URL, getAuthHeaders } from './api-config';
import { Product } from '@/types/product';

export const inventoryService = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch inventory');
    return response.json();
  },

  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  create: async (formData: FormData): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  update: async (id: string, formData: FormData): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },
};