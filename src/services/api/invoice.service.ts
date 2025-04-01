
import { api } from "../api-config";
import type { Invoice } from "@/types/invoice";

export const invoiceService = {
  getAll: async () => {
    try {
      const response = await api.get<Invoice[]>("/invoices");
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }
  },

  getById: async (id: string) => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    // Convert FormData to a proper object
    const formObject: Record<string, any> = {};
    
    // Iterate through FormData entries to capture all values
    for (const [key, value] of data.entries()) {
      formObject[key] = value;
    }
    
    // Ensure required fields are present
    if (!formObject.invoiceNumber) {
      throw new Error("Invoice number is required");
    }
    
    // Rename field from invoiceNumber to invoice_number for API compatibility
    formObject.invoice_number = formObject.invoiceNumber;
    delete formObject.invoiceNumber;
    
    // Ensure payment_status is set
    if (!formObject.paymentStatus) {
      formObject.payment_status = "pending";
    } else {
      // Rename field from paymentStatus to payment_status for API compatibility
      formObject.payment_status = formObject.paymentStatus;
      delete formObject.paymentStatus;
    }
    
    // Handle products properly - ensure it's a valid array
    if (typeof formObject.products === 'string') {
      try {
        const parsed = JSON.parse(formObject.products);
        // Ensure it's an array, even if empty
        formObject.products = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Invalid products JSON format:", error);
        formObject.products = [];
      }
    } else if (!formObject.products) {
      // If products is not defined or is null/undefined, create an empty array
      formObject.products = [];
    }
    
    // Explicitly stringify products array for the API
    if (Array.isArray(formObject.products)) {
      formObject.products = JSON.stringify(formObject.products);
    }
    
    console.log("Sending invoice data:", formObject);
    
    const response = await api.post<Invoice>("/invoices", formObject);
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    // Convert FormData to a proper object
    const formObject: Record<string, any> = {};
    
    // Iterate through FormData entries to capture all values
    for (const [key, value] of data.entries()) {
      formObject[key] = value;
    }
    
    // Rename field from invoiceNumber to invoice_number for API compatibility
    if (formObject.invoiceNumber) {
      formObject.invoice_number = formObject.invoiceNumber;
      delete formObject.invoiceNumber;
    }
    
    // Rename field from paymentStatus to payment_status for API compatibility
    if (formObject.paymentStatus) {
      formObject.payment_status = formObject.paymentStatus;
      delete formObject.paymentStatus;
    }
    
    // Handle products properly - ensure it's a valid array
    if (typeof formObject.products === 'string') {
      try {
        const parsed = JSON.parse(formObject.products);
        // Ensure it's an array, even if empty
        formObject.products = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Invalid products JSON format:", error);
        formObject.products = [];
      }
    } else if (!formObject.products) {
      // If products is not defined or is null/undefined, create an empty array
      formObject.products = [];
    }
    
    // Explicitly stringify products array for the API
    if (Array.isArray(formObject.products)) {
      formObject.products = JSON.stringify(formObject.products);
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
