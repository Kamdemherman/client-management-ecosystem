
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
    // Convert FormData to a proper object
    const formObject = Object.fromEntries(data);
    
    // Ensure products is properly formatted as JSON
    if (typeof formObject.products === 'string') {
      try {
        JSON.parse(formObject.products); // Validate JSON format
      } catch (error) {
        console.error("Invalid products JSON format:", error);
        formObject.products = JSON.stringify([]);
      }
    } else {
      formObject.products = JSON.stringify([]);
    }
    
    console.log("Sending invoice data:", formObject);
    
    const response = await api.post<Invoice>("/invoices", formObject);
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    // Convert FormData to a proper object
    const formObject = Object.fromEntries(data);
    
    // Ensure products is properly formatted as JSON
    if (typeof formObject.products === 'string') {
      try {
        JSON.parse(formObject.products); // Validate JSON format
      } catch (error) {
        console.error("Invalid products JSON format:", error);
        formObject.products = JSON.stringify([]);
      }
    } else {
      formObject.products = JSON.stringify([]);
    }
    
    console.log("Updating invoice data:", formObject);
    
    const response = await api.put<Invoice>(`/invoices/${id}`, formObject);
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
