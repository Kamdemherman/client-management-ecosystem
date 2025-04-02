
import { api } from "../api-config";
import type { ComplaintStatus } from "@/types/complaint";

interface Complaint {
  id: number;
  client: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  date: string;
}

// Define a type for possible API response formats
type ApiResponse<T> = T | { data: T } | Record<string, any>;

export const complaintService = {
  getAll: async () => {
    try {
      const response = await api.get<ApiResponse<Complaint[]>>("/complaints");
      
      // Log the raw response for debugging
      console.log("Raw complaints API response:", response.data);
      
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
      console.error("Unexpected complaints API response format:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching complaints:", error);
      return [];
    }
  },

  getByClient: async (clientId: string) => {
    try {
      const response = await api.get<ApiResponse<Complaint[]>>(`/clients/${clientId}/complaints`);
      
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
      console.error(`Error fetching complaints for client ${clientId}:`, error);
      return [];
    }
  },

  create: async (complaint: Omit<Complaint, "id" | "date">) => {
    try {
      const response = await api.post<ApiResponse<Complaint>>("/complaints", complaint);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Complaint;
        }
        return response.data as Complaint;
      }
      
      throw new Error("Invalid complaint response data");
    } catch (error) {
      console.error("Error creating complaint:", error);
      throw error;
    }
  },

  update: async (id: number, complaint: Partial<Complaint>) => {
    try {
      const response = await api.patch<ApiResponse<Complaint>>(`/complaints/${id}`, complaint);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Complaint;
        }
        return response.data as Complaint;
      }
      
      throw new Error("Invalid complaint response data");
    } catch (error) {
      console.error(`Error updating complaint ${id}:`, error);
      throw error;
    }
  },

  updateStatus: async (id: number, status: ComplaintStatus) => {
    try {
      const response = await api.patch<ApiResponse<Complaint>>(`/complaints/${id}/status`, { status });
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Complaint;
        }
        return response.data as Complaint;
      }
      
      throw new Error("Invalid complaint response data");
    } catch (error) {
      console.error(`Error updating complaint status ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      await api.delete(`/complaints/${id}`);
    } catch (error) {
      console.error(`Error deleting complaint ${id}:`, error);
      throw error;
    }
  }
};
