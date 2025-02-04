import { api } from "../api-config";
import type { Invoice } from "@/types/invoice";

export const invoiceService = {
  getAll: async () => {
    const response = await api.get("/invoices");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post("/invoices", Object.fromEntries(data));
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put(`/invoices/${id}`, Object.fromEntries(data));
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/invoices/${id}`);
  },

  generatePDF: async (id: string) => {
    const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  }
};