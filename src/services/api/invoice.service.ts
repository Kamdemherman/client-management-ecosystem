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

  create: async (invoice: Omit<Invoice, "id">) => {
    const response = await api.post("/invoices", invoice);
    return response.data;
  },

  update: async (id: string, invoice: Partial<Invoice>) => {
    const response = await api.put(`/invoices/${id}`, invoice);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/invoices/${id}`);
  }
};