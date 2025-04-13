
import { Reservation } from "@/types/reservation";
import { api } from "./api-config";

// Define a type for possible API response formats
type ApiResponse<T> = T | { data: T } | Record<string, any>;

// Define the request payload type to match what the API expects
type ReservationRequest = {
  client_id: string;
  clientName: string;
  product_id: string;
  productName: string;
  quantity: number;
  status: string;
  reservation_date: string;
  deliveryDate: string;
  agency_id: string;
  agencyName: string;
  notes?: string;
};

export const reservationsService = {
  getAll: async (): Promise<Reservation[]> => {
    try {
      const response = await api.get<ApiResponse<Reservation[]>>("/reservations");
      
      // Log the raw response for debugging
      console.log("Raw reservations API response:", response.data);
      
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
      console.error("Error fetching reservations:", error);
      return [];
    }
  },

  getById: async (id: string): Promise<Reservation> => {
    try {
      const response = await api.get<ApiResponse<Reservation>>(`/reservations/${id}`);
      
      // Check if response.data is the reservation or if it's nested
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Reservation;
        }
        return response.data as Reservation;
      }
      
      throw new Error("Invalid reservation response data");
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      throw error;
    }
  },

  create: async (reservation: ReservationRequest): Promise<Reservation> => {
    try {
      console.log("Creating reservation with data:", reservation);
      
      // Ensure required fields are present
      if (!reservation.client_id || !reservation.product_id) {
        throw new Error("Client ID and Product ID are required");
      }
      
      const response = await api.post<ApiResponse<Reservation>>("/reservations", reservation);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Reservation;
        }
        return response.data as Reservation;
      }
      
      throw new Error("Invalid reservation response data");
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  },

  update: async (id: string, reservation: Partial<Reservation>): Promise<Reservation> => {
    try {
      const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}`, reservation);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Reservation;
        }
        return response.data as Reservation;
      }
      
      throw new Error("Invalid reservation response data");
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/reservations/${id}`);
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: Reservation["status"]): Promise<Reservation> => {
    try {
      const response = await api.patch<ApiResponse<Reservation>>(`/reservations/${id}/status`, { status });
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Reservation;
        }
        return response.data as Reservation;
      }
      
      throw new Error("Invalid reservation response data");
    } catch (error) {
      console.error(`Error updating reservation status ${id}:`, error);
      throw error;
    }
  },

  getByAgency: async (agencyId: string): Promise<Reservation[]> => {
    try {
      const response = await api.get<ApiResponse<Reservation[]>>(`/agencies/${agencyId}/reservations`);
      
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
      console.error(`Error fetching reservations for agency ${agencyId}:`, error);
      return [];
    }
  },

  getByClient: async (clientId: string): Promise<Reservation[]> => {
    try {
      const response = await api.get<ApiResponse<Reservation[]>>(`/clients/${clientId}/reservations`);
      
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
      console.error(`Error fetching reservations for client ${clientId}:`, error);
      return [];
    }
  },

  getByProduct: async (productId: string): Promise<Reservation[]> => {
    try {
      const response = await api.get<ApiResponse<Reservation[]>>(`/products/${productId}/reservations`);
      
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
      console.error(`Error fetching reservations for product ${productId}:`, error);
      return [];
    }
  }
};
