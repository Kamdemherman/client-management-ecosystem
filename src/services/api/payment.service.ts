
import { api } from "../api-config";
import type { Payment } from "@/types/payment";

// Define a type for possible API response formats
type ApiResponse<T> = T | { data: T } | Record<string, any>;

export const paymentService = {
  getAll: async () => {
    try {
      const response = await api.get<ApiResponse<Payment[]>>("/payments");
      
      // Log the raw response for debugging
      console.log("Raw payments API response:", response.data);
      
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
      console.error("Error fetching payments:", error);
      return [];
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
      
      // Check if response.data is the payment object or has a nested data property
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Payment;
        }
        return response.data as Payment;
      }
      
      throw new Error("Invalid payment data received");
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error);
      throw error;
    }
  },

  getByClient: async (clientId: string) => {
    try {
      const response = await api.get<ApiResponse<Payment[]>>(`/clients/${clientId}/payments`);
      
      // Similar parsing as getAll
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const nestedData = response.data.data;
        if (Array.isArray(nestedData)) {
          return nestedData;
        }
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching payments for client ${clientId}:`, error);
      return [];
    }
  },

  create: async (payment: Omit<Payment, "id">) => {
    try {
      const response = await api.post<ApiResponse<Payment>>("/payments", payment);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Payment;
        }
        return response.data as Payment;
      }
      
      throw new Error("Invalid payment response data");
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  },

  update: async (id: string, payment: Partial<Payment>) => {
    try {
      const response = await api.put<ApiResponse<Payment>>(`/payments/${id}`, payment);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Payment;
        }
        return response.data as Payment;
      }
      
      throw new Error("Invalid payment response data");
    } catch (error) {
      console.error(`Error updating payment ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/payments/${id}`);
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get<ApiResponse<any>>("/payments/stats");
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data;
        }
        return response.data;
      }
      
      return {}; // Default empty stats
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      return {};
    }
  }
};
