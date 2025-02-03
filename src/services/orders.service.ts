import { Order } from "@/types/order";
import { api } from "./api-config";

export const ordersService = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get("/orders");
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (order: Omit<Order, "id" | "date">): Promise<Order> => {
    const response = await api.post("/orders", order);
    return response.data;
  },

  update: async (id: string, order: Partial<Order>): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, order);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },

  updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  getByClient: async (clientId: string): Promise<Order[]> => {
    const response = await api.get(`/clients/${clientId}/orders`);
    return response.data;
  },

  getByAgency: async (agencyId: string): Promise<Order[]> => {
    const response = await api.get(`/agencies/${agencyId}/orders`);
    return response.data;
  },

  getByStatus: async (status: Order["status"]): Promise<Order[]> => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  }
};