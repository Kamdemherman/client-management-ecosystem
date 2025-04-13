
import { Delivery } from "@/types/delivery";
import { api } from "./api-config";

// Define a type for possible API response formats
type ApiResponse<T> = T | { data: T } | Record<string, any>;

// Type pour la création d'une livraison
type DeliveryCreateRequest = Omit<Delivery, "id" | "createdAt" | "updatedAt"> & {
  client_id?: string;
  client_name?: string;
  agency_id?: string;
  agency_name?: string;
};

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

  create: async (delivery: DeliveryCreateRequest): Promise<Delivery> => {
    try {
      // Adapter les noms de champs si nécessaire pour le backend
      const apiPayload: Record<string, any> = { ...delivery };
      
      // Gérer les conversions de noms de champs si nécessaire
      if (delivery.clientName && !delivery.client_id) {
        apiPayload.client_name = delivery.clientName;
      }
      
      if (delivery.agencyName && !delivery.agency_id) {
        apiPayload.agency_name = delivery.agencyName;
      }
      
      console.log("Creating delivery with data:", apiPayload);
      const response = await api.post<ApiResponse<Delivery>>("/deliveries", apiPayload);
      
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
      // Adapter les noms de champs si nécessaire pour le backend
      const apiPayload: Record<string, any> = { ...delivery };
      
      // Gérer les conversions de noms de champs si nécessaire
      if (delivery.clientName) {
        apiPayload.client_name = delivery.clientName;
      }
      
      if (delivery.agencyName) {
        apiPayload.agency_name = delivery.agencyName;
      }
      
      const response = await api.put<ApiResponse<Delivery>>(`/deliveries/${id}`, apiPayload);
      
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
