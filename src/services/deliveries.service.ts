
import { Delivery } from "@/types/delivery";
import { api } from "./api-config";

// Define a type for possible API response formats
type ApiResponse<T> = T | { data: T } | Record<string, any>;

export const deliveriesService = {
  getAll: async (): Promise<Delivery[]> => {
    try {
      const response = await api.get<ApiResponse<Delivery[]>>("/deliveries");
      
      // Log the raw response for debugging
      console.log("Raw deliveries API response:", response.data);
      
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
      console.error("Unexpected deliveries API response format:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      return [];
    }
  },

  getById: async (id: string): Promise<Delivery> => {
    try {
      const response = await api.get<ApiResponse<Delivery>>(`/deliveries/${id}`);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Delivery;
        }
        return response.data as Delivery;
      }
      
      throw new Error("Invalid delivery data received");
    } catch (error) {
      console.error(`Error fetching delivery ${id}:`, error);
      throw error;
    }
  },

  create: async (delivery: Omit<Delivery, "id" | "createdAt" | "updatedAt">): Promise<Delivery> => {
    try {
      const response = await api.post<ApiResponse<Delivery>>("/deliveries", delivery);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Delivery;
        }
        return response.data as Delivery;
      }
      
      throw new Error("Invalid delivery response data");
    } catch (error) {
      console.error("Error creating delivery:", error);
      throw error;
    }
  },

  update: async (id: string, delivery: Partial<Delivery>): Promise<Delivery> => {
    try {
      const response = await api.put<ApiResponse<Delivery>>(`/deliveries/${id}`, delivery);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Delivery;
        }
        return response.data as Delivery;
      }
      
      throw new Error("Invalid delivery response data");
    } catch (error) {
      console.error(`Error updating delivery ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/deliveries/${id}`);
    } catch (error) {
      console.error(`Error deleting delivery ${id}:`, error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: Delivery["status"]): Promise<Delivery> => {
    try {
      const response = await api.patch<ApiResponse<Delivery>>(`/deliveries/${id}/status`, { status });
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Delivery;
        }
        return response.data as Delivery;
      }
      
      throw new Error("Invalid delivery response data");
    } catch (error) {
      console.error(`Error updating delivery status ${id}:`, error);
      throw error;
    }
  },

  getByAgency: async (agencyId: string): Promise<Delivery[]> => {
    try {
      const response = await api.get<ApiResponse<Delivery[]>>(`/agencies/${agencyId}/deliveries`);
      
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
      console.error(`Error fetching deliveries for agency ${agencyId}:`, error);
      return [];
    }
  },

  getByClient: async (clientId: string): Promise<Delivery[]> => {
    try {
      const response = await api.get<ApiResponse<Delivery[]>>(`/clients/${clientId}/deliveries`);
      
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
      console.error(`Error fetching deliveries for client ${clientId}:`, error);
      return [];
    }
  }
};
