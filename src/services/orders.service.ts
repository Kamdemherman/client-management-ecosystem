
import { Order } from "@/types/order";
import { api } from "./api-config";

// Define a type for possible API response formats
type ApiResponse<T> = T | { data: T } | Record<string, any>;

export const ordersService = {
  getAll: async (): Promise<Order[]> => {
    try {
      const response = await api.get<ApiResponse<Order[]>>("/orders");
      
      // Log the raw response for debugging
      console.log("Raw orders API response:", response.data);
      
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
      console.error("Unexpected orders API response format:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  getById: async (id: string): Promise<Order> => {
    try {
      const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Order;
        }
        return response.data as Order;
      }
      
      throw new Error("Invalid order data received");
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  create: async (order: Omit<Order, "id" | "date">): Promise<Order> => {
    try {
      console.log("Creating order with data:", order);
      const response = await api.post<ApiResponse<Order>>("/orders", order);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Order;
        }
        return response.data as Order;
      }
      
      throw new Error("Invalid order response data");
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  update: async (id: string, order: Partial<Order>): Promise<Order> => {
    try {
      const response = await api.put<ApiResponse<Order>>(`/orders/${id}`, order);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Order;
        }
        return response.data as Order;
      }
      
      throw new Error("Invalid order response data");
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/orders/${id}`);
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  },

  updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    try {
      const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data) {
          return response.data.data as Order;
        }
        return response.data as Order;
      }
      
      throw new Error("Invalid order response data");
    } catch (error) {
      console.error(`Error updating order status ${id}:`, error);
      throw error;
    }
  },

  getByClient: async (clientId: string): Promise<Order[]> => {
    try {
      const response = await api.get<ApiResponse<Order[]>>(`/clients/${clientId}/orders`);
      
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
      console.error(`Error fetching orders for client ${clientId}:`, error);
      return [];
    }
  },

  getByAgency: async (agencyId: string): Promise<Order[]> => {
    try {
      const response = await api.get<ApiResponse<Order[]>>(`/agencies/${agencyId}/orders`);
      
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
      console.error(`Error fetching orders for agency ${agencyId}:`, error);
      return [];
    }
  },

  getByStatus: async (status: Order["status"]): Promise<Order[]> => {
    try {
      const response = await api.get<ApiResponse<Order[]>>(`/orders/status/${status}`);
      
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
      console.error(`Error fetching orders with status ${status}:`, error);
      return [];
    }
  }
};
