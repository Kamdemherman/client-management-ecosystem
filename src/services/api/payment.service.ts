
import { api } from "../api-config";
import type { Payment } from "@/types/payment";

export const paymentService = {
  getAll: async () => {
    const response = await api.get<Payment[]>("/payments");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  create: async (payment: Omit<Payment, "id">) => {
    const response = await api.post<Payment>("/payments", payment);
    return response.data;
  },

  update: async (id: string, payment: Partial<Payment>) => {
    const response = await api.put<Payment>(`/payments/${id}`, payment);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/payments/${id}`);
  },

  getStats: async () => {
    const response = await api.get("/payments/stats");
    return response.data;
  }
};
