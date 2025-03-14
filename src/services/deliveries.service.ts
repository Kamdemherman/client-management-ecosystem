
import { Delivery } from "@/types/delivery";
import { api } from "./api-config";

export const deliveriesService = {
  getAll: async (): Promise<Delivery[]> => {
    const response = await api.get<Delivery[]>("/deliveries");
    return response.data;
  },

  getById: async (id: string): Promise<Delivery> => {
    const response = await api.get<Delivery>(`/deliveries/${id}`);
    return response.data;
  },

  create: async (delivery: Omit<Delivery, "id" | "createdAt" | "updatedAt">): Promise<Delivery> => {
    const response = await api.post<Delivery>("/deliveries", delivery);
    return response.data;
  },

  update: async (id: string, delivery: Partial<Delivery>): Promise<Delivery> => {
    const response = await api.put<Delivery>(`/deliveries/${id}`, delivery);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/deliveries/${id}`);
  },

  updateStatus: async (id: string, status: Delivery["status"]): Promise<Delivery> => {
    const response = await api.patch<Delivery>(`/deliveries/${id}/status`, { status });
    return response.data;
  },

  getByAgency: async (agencyId: string): Promise<Delivery[]> => {
    const response = await api.get<Delivery[]>(`/agencies/${agencyId}/deliveries`);
    return response.data;
  },

  getByClient: async (clientId: string): Promise<Delivery[]> => {
    const response = await api.get<Delivery[]>(`/clients/${clientId}/deliveries`);
    return response.data;
  }
};
