import { Delivery } from "@/types/delivery";
import { api } from "./api-config";

export const deliveriesService = {
  getAll: async (): Promise<Delivery[]> => {
    const response = await api.get("/deliveries");
    return response.data;
  },

  getById: async (id: string): Promise<Delivery> => {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },

  create: async (delivery: Omit<Delivery, "id" | "createdAt" | "updatedAt">): Promise<Delivery> => {
    const response = await api.post("/deliveries", delivery);
    return response.data;
  },

  update: async (id: string, delivery: Partial<Delivery>): Promise<Delivery> => {
    const response = await api.put(`/deliveries/${id}`, delivery);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/deliveries/${id}`);
  },

  updateStatus: async (id: string, status: Delivery["status"]): Promise<Delivery> => {
    const response = await api.patch(`/deliveries/${id}/status`, { status });
    return response.data;
  },

  getByAgency: async (agencyId: string): Promise<Delivery[]> => {
    const response = await api.get(`/agencies/${agencyId}/deliveries`);
    return response.data;
  },

  getByClient: async (clientId: string): Promise<Delivery[]> => {
    const response = await api.get(`/clients/${clientId}/deliveries`);
    return response.data;
  }
};