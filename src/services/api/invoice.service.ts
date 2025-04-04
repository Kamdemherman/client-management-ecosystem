import { api } from "../api-config";
import type { Invoice } from "@/types/invoice";

// Define a type for possible API response formats
type ApiResponse<T> = T | { data: T } | Record<string, any>;

export const invoiceService = {
  getAll: async () => {
    try {
      const response = await api.get<ApiResponse<Invoice[]>>("/invoices");
      
      // Log the raw response for debugging
      console.log("Raw invoices API response:", response.data);
      
      // Check if the response is an array
      if (Array.isArray(response.data)) {
        return response.data;
      } 
      
      // If response.data has a data property that might be an array
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const nestedData = response.data.data;
        if (Array.isArray(nestedData)) {
          return nestedData;
        }
      }
      
      // Return empty array as fallback
      console.error("Unexpected API response format:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<Invoice>(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error);
      throw error;
    }
  },

  create: async (data: FormData) => {
    // Convert FormData to a proper object
    const formObject: Record<string, any> = {};
    
    // Iterate through FormData entries to capture all values
    for (const [key, value] of data.entries()) {
      formObject[key] = value;
    }
    
    // Ensure required fields are present and properly named for API compatibility
    if (formObject.invoiceNumber) {
      formObject.invoice_number = formObject.invoiceNumber;
      delete formObject.invoiceNumber;
    }
    
    if (formObject.paymentStatus) {
      formObject.payment_status = formObject.paymentStatus;
      delete formObject.paymentStatus;
    } else {
      formObject.payment_status = "pending";
    }
    
    // Handle client name field
    if (formObject.client) {
      formObject.client_name = formObject.client;
    }
    
    // Handle products array
    let productsArray = [];
    
    if (formObject.products) {
      try {
        if (typeof formObject.products === 'string') {
          // Attempt to parse JSON string
          const parsed = JSON.parse(formObject.products);
          if (Array.isArray(parsed)) {
            productsArray = parsed;
          }
        } else if (Array.isArray(formObject.products)) {
          productsArray = formObject.products;
        }
      } catch (error) {
        console.error("Failed to parse products JSON:", error);
        productsArray = [];
      }
    }
    
    // Ensure products is an array for API compatibility
    formObject.products = productsArray;
    
    console.log("Sending invoice data to API:", formObject);
    
    const response = await api.post<Invoice>("/invoices", formObject);
    console.log("Create invoice response:", response.data);
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
    
    // Handle products array - same fix as in create
    let productsArray = [];
    
    if (formObject.products) {
      try {
        if (typeof formObject.products === 'string') {
          const parsed = JSON.parse(formObject.products);
          if (Array.isArray(parsed)) {
            productsArray = parsed;
          }
        } else if (Array.isArray(formObject.products)) {
          productsArray = formObject.products;
        }
      } catch (error) {
        console.error("Failed to parse products JSON:", error);
        productsArray = [];
      }
    }
    
    // Ensure products is an array for API compatibility
    formObject.products = productsArray;
    
    console.log("Updating invoice data:", formObject);
    console.log("Products type:", typeof formObject.products);
    console.log("Is products array:", Array.isArray(formObject.products));
    
    const response = await api.put<Invoice>(`/invoices/${id}`, formObject);
    console.log("Update invoice response:", response.data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/invoices/${id}`);
  },

  generatePDF: async (id: string) => {
    console.log(`Generating PDF for invoice ${id}`);
    try {
      const response = await api.get(`/invoices/${id}/pdf`, { 
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      console.log("PDF response received:", response.status);
      return response.data;
    } catch (error) {
      console.error(`Error generating PDF for invoice ${id}:`, error);
      throw error;
    }
  },

  sendEmail: async (id: string) => {
    const response = await api.post(`/invoices/${id}/send-email`);
    return response.data;
  }
};
