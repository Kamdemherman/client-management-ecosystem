
import { Reservation } from "@/types/reservation";
import { api } from "./api-config";

export const reservationsService = {
  getAll: async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>("/reservations");
    return response.data;
  },

  getById: async (id: string): Promise<Reservation> => {
    const response = await api.get<Reservation>(`/reservations/${id}`);
    return response.data;
  },

  create: async (reservation: Omit<Reservation, "id" | "createdAt" | "updatedAt">): Promise<Reservation> => {
    const response = await api.post<Reservation>("/reservations", reservation);
    return response.data;
  },

  update: async (id: string, reservation: Partial<Reservation>): Promise<Reservation> => {
    const response = await api.put<Reservation>(`/reservations/${id}`, reservation);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  },

  updateStatus: async (id: string, status: Reservation["status"]): Promise<Reservation> => {
    const response = await api.patch<Reservation>(`/reservations/${id}/status`, { status });
    return response.data;
  },

  getByAgency: async (agencyId: string): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>(`/agencies/${agencyId}/reservations`);
    return response.data;
  },

  getByClient: async (clientId: string): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>(`/clients/${clientId}/reservations`);
    return response.data;
  },

  getByProduct: async (productId: string): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>(`/products/${productId}/reservations`);
    return response.data;
  }
};
