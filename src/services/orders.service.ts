
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
        return response.data.map(item => ({
          id: item.id.toString(),
          client: item.client_name || item.client || 'Client non défini',
          date: item.date || new Date().toISOString(),
          status: item.status || "En attente",
          total: item.total?.toString() || "0",
          items: typeof item.items === 'string' ? item.items : JSON.stringify(item.items || [])
        }));
      } 
      
      // If response.data has a data property that might be an array
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const nestedData = response.data.data;
        if (Array.isArray(nestedData)) {
          return nestedData.map(item => ({
            id: item.id.toString(),
            client: item.client_name || item.client || 'Client non défini',
            date: item.date || new Date().toISOString(),
            status: item.status || "En attente",
            total: item.total?.toString() || "0",
            items: typeof item.items === 'string' ? item.items : JSON.stringify(item.items || [])
          }));
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
        const orderData = 'data' in response.data ? response.data.data : response.data;
        
        return {
          id: orderData.id.toString(),
          client: orderData.client_name || orderData.client || 'Client non défini',
          date: orderData.date || new Date().toISOString(),
          status: orderData.status || "En attente",
          total: orderData.total?.toString() || "0",
          items: typeof orderData.items === 'string' ? orderData.items : JSON.stringify(orderData.items || [])
        };
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
      
      // Prepare data for API - convert field names if needed
      const apiData = {
        client_name: order.client,
        status: order.status,
        total: order.total,
        items: order.items,
      };
      
      const response = await api.post<ApiResponse<Order>>("/orders", apiData);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        const orderData = 'data' in response.data ? response.data.data : response.data;
        
        return {
          id: orderData.id.toString(),
          client: orderData.client_name || orderData.client || 'Client non défini',
          date: orderData.date || new Date().toISOString(),
          status: orderData.status || "En attente",
          total: orderData.total?.toString() || "0",
          items: typeof orderData.items === 'string' ? orderData.items : JSON.stringify(orderData.items || [])
        };
      }
      
      throw new Error("Invalid order response data");
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  update: async (id: string, order: Partial<Order>): Promise<Order> => {
    try {
      // Prepare data for API - convert field names if needed
      const apiData: Record<string, any> = {};
      
      if (order.client) apiData.client_name = order.client;
      if (order.status) apiData.status = order.status;
      if (order.total) apiData.total = order.total;
      if (order.items) apiData.items = order.items;
      
      const response = await api.put<ApiResponse<Order>>(`/orders/${id}`, apiData);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        const orderData = 'data' in response.data ? response.data.data : response.data;
        
        return {
          id: orderData.id.toString(),
          client: orderData.client_name || orderData.client || 'Client non défini',
          date: orderData.date || new Date().toISOString(),
          status: orderData.status || "En attente",
          total: orderData.total?.toString() || "0",
          items: typeof orderData.items === 'string' ? orderData.items : JSON.stringify(orderData.items || [])
        };
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
        const orderData = 'data' in response.data ? response.data.data : response.data;
        
        return {
          id: orderData.id.toString(),
          client: orderData.client_name || orderData.client || 'Client non défini',
          date: orderData.date || new Date().toISOString(),
          status: orderData.status || "En attente",
          total: orderData.total?.toString() || "0",
          items: typeof orderData.items === 'string' ? orderData.items : JSON.stringify(orderData.items || [])
        };
      }
      
      throw new Error("Invalid order response data");
    } catch (error) {
      console.error(`Error updating order status ${id}:`, error);
      throw error;
    }
  },
};
