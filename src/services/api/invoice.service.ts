
import { api } from "../api-config";
import type { Invoice } from "@/types/invoice";

export const invoiceService = {
  getAll: async () => {
    const response = await api.get<Invoice[]>("/invoices");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post<Invoice>("/invoices", Object.fromEntries(data));
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put<Invoice>(`/invoices/${id}`, Object.fromEntries(data));
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/invoices/${id}`);
  },

  generatePDF: async (id: string) => {
    const response = await api.get(`/invoices/${id}/pdf`, { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    return response.data;
  },

  sendEmail: async (id: string) => {
    const response = await api.post(`/invoices/${id}/send-email`);
    return response.data;
  }
};
