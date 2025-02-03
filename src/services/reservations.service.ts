import { API_BASE_URL, getAuthHeaders } from './api-config';

export interface Reservation {
  id: string;
  date: Date;
  clientName: string;
  productName: string;
  quantity: number;
  status: "pending" | "confirmed" | "completed";
}

export const reservationsService = {
  getAll: async (): Promise<Reservation[]> => {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
  },

  create: async (formData: FormData): Promise<Reservation> => {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create reservation');
    return response.json();
  },

  update: async (id: string, formData: FormData): Promise<Reservation> => {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update reservation');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete reservation');
  },
};