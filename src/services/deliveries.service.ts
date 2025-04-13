
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
        return response.data.map(item => ({
          id: item.id.toString(),
          orderId: item.order_id || item.orderId || '',
          status: item.status || 'En attente',
          scheduledDate: item.scheduled_date || item.scheduledDate || '',
          deliveryDate: item.delivery_date || item.deliveryDate || '',
          address: item.address || '',
          driver: item.driver || '',
          notes: item.notes || '',
          clientId: item.client_id || item.clientId || '',
          clientName: item.client_name || item.clientName || 'Client non défini',
          agencyId: item.agency_id || item.agencyId || '',
          agencyName: item.agency_name || item.agencyName || 'Agence non définie',
          products: item.products || '[]',
          createdAt: item.created_at || item.createdAt || '',
          updatedAt: item.updated_at || item.updatedAt || ''
        }));
      } 
      
      // If response.data has a data property that might be an array
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const nestedData = response.data.data;
        if (Array.isArray(nestedData)) {
          return nestedData.map(item => ({
            id: item.id.toString(),
            orderId: item.order_id || item.orderId || '',
            status: item.status || 'En attente',
            scheduledDate: item.scheduled_date || item.scheduledDate || '',
            deliveryDate: item.delivery_date || item.deliveryDate || '',
            address: item.address || '',
            driver: item.driver || '',
            notes: item.notes || '',
            clientId: item.client_id || item.clientId || '',
            clientName: item.client_name || item.clientName || 'Client non défini',
            agencyId: item.agency_id || item.agencyId || '',
            agencyName: item.agency_name || item.agencyName || 'Agence non définie',
            products: item.products || '[]',
            createdAt: item.created_at || item.createdAt || '',
            updatedAt: item.updated_at || item.updatedAt || ''
          }));
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
        const deliveryData = 'data' in response.data ? response.data.data : response.data;
        
        return {
          id: deliveryData.id.toString(),
          orderId: deliveryData.order_id || deliveryData.orderId || '',
          status: deliveryData.status || 'En attente',
          scheduledDate: deliveryData.scheduled_date || deliveryData.scheduledDate || '',
          deliveryDate: deliveryData.delivery_date || deliveryData.deliveryDate || '',
          address: deliveryData.address || '',
          driver: deliveryData.driver || '',
          notes: deliveryData.notes || '',
          clientId: deliveryData.client_id || deliveryData.clientId || '',
          clientName: deliveryData.client_name || deliveryData.clientName || 'Client non défini',
          agencyId: deliveryData.agency_id || deliveryData.agencyId || '',
          agencyName: deliveryData.agency_name || deliveryData.agencyName || 'Agence non définie',
          products: deliveryData.products || '[]',
          createdAt: deliveryData.created_at || deliveryData.createdAt || '',
          updatedAt: deliveryData.updated_at || deliveryData.updatedAt || ''
        };
      }
      
      throw new Error("Invalid delivery data received");
    } catch (error) {
      console.error(`Error fetching delivery ${id}:`, error);
      throw error;
    }
  },

  create: async (delivery: Partial<Delivery>): Promise<Delivery> => {
    try {
      // Adapter les noms de champs pour le backend
      const apiPayload: Record<string, any> = {
        order_id: delivery.orderId,
        status: delivery.status,
        scheduled_date: delivery.scheduledDate,
        delivery_date: delivery.deliveryDate,
        address: delivery.address,
        driver: delivery.driver,
        notes: delivery.notes,
        client_id: delivery.clientId,
        client_name: delivery.clientName,
        agency_id: delivery.agencyId,
        agency_name: delivery.agencyName,
        products: delivery.products,
      };
      
      console.log("Creating delivery with data:", apiPayload);
      const response = await api.post<ApiResponse<Delivery>>("/deliveries", apiPayload);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        const deliveryData = 'data' in response.data ? response.data.data : response.data;
        
        return {
          id: deliveryData.id.toString(),
          orderId: deliveryData.order_id || deliveryData.orderId || '',
          status: deliveryData.status || 'En attente',
          scheduledDate: deliveryData.scheduled_date || deliveryData.scheduledDate || '',
          deliveryDate: deliveryData.delivery_date || deliveryData.deliveryDate || '',
          address: deliveryData.address || '',
          driver: deliveryData.driver || '',
          notes: deliveryData.notes || '',
          clientId: deliveryData.client_id || deliveryData.clientId || '',
          clientName: deliveryData.client_name || deliveryData.clientName || 'Client non défini',
          agencyId: deliveryData.agency_id || deliveryData.agencyId || '',
          agencyName: deliveryData.agency_name || deliveryData.agencyName || 'Agence non définie',
          products: deliveryData.products || '[]',
          createdAt: deliveryData.created_at || deliveryData.createdAt || '',
          updatedAt: deliveryData.updated_at || deliveryData.updatedAt || ''
        };
      }
      
      throw new Error("Invalid delivery response data");
    } catch (error) {
      console.error("Error creating delivery:", error);
      throw error;
    }
  },

  update: async (id: string, delivery: Partial<Delivery>): Promise<Delivery> => {
    try {
      // Adapter les noms de champs pour le backend
      const apiPayload: Record<string, any> = {};
      
      if (delivery.orderId !== undefined) apiPayload.order_id = delivery.orderId;
      if (delivery.status !== undefined) apiPayload.status = delivery.status;
      if (delivery.scheduledDate !== undefined) apiPayload.scheduled_date = delivery.scheduledDate;
      if (delivery.deliveryDate !== undefined) apiPayload.delivery_date = delivery.deliveryDate;
      if (delivery.address !== undefined) apiPayload.address = delivery.address;
      if (delivery.driver !== undefined) apiPayload.driver = delivery.driver;
      if (delivery.notes !== undefined) apiPayload.notes = delivery.notes;
      if (delivery.clientId !== undefined) apiPayload.client_id = delivery.clientId;
      if (delivery.clientName !== undefined) apiPayload.client_name = delivery.clientName;
      if (delivery.agencyId !== undefined) apiPayload.agency_id = delivery.agencyId;
      if (delivery.agencyName !== undefined) apiPayload.agency_name = delivery.agencyName;
      
      console.log(`Updating delivery ${id} with data:`, apiPayload);
      const response = await api.put<ApiResponse<Delivery>>(`/deliveries/${id}`, apiPayload);
      
      // Parse response based on structure
      if (response.data && typeof response.data === 'object') {
        const deliveryData = 'data' in response.data ? response.data.data : response.data;
        
        return {
          id: deliveryData.id.toString(),
          orderId: deliveryData.order_id || deliveryData.orderId || '',
          status: deliveryData.status || 'En attente',
          scheduledDate: deliveryData.scheduled_date || deliveryData.scheduledDate || '',
          deliveryDate: deliveryData.delivery_date || deliveryData.deliveryDate,
          address: deliveryData.address || '',
          driver: deliveryData.driver,
          notes: deliveryData.notes,
          clientId: deliveryData.client_id || deliveryData.clientId || '',
          clientName: deliveryData.client_name || deliveryData.clientName || 'Client non défini',
          agencyId: deliveryData.agency_id || deliveryData.agencyId || '',
          agencyName: deliveryData.agency_name || deliveryData.agencyName || 'Agence non définie',
          createdAt: deliveryData.created_at || deliveryData.createdAt || '',
          updatedAt: deliveryData.updated_at || deliveryData.updatedAt || ''
        };
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
        const deliveryData = 'data' in response.data ? response.data.data : response.data;
        
        return {
          id: deliveryData.id.toString(),
          orderId: deliveryData.order_id || deliveryData.orderId || '',
          status: deliveryData.status || 'En attente',
          scheduledDate: deliveryData.scheduled_date || deliveryData.scheduledDate || '',
          deliveryDate: deliveryData.delivery_date || deliveryData.deliveryDate,
          address: deliveryData.address || '',
          driver: deliveryData.driver,
          notes: deliveryData.notes,
          clientId: deliveryData.client_id || deliveryData.clientId || '',
          clientName: deliveryData.client_name || deliveryData.clientName || 'Client non défini',
          agencyId: deliveryData.agency_id || deliveryData.agencyId || '',
          agencyName: deliveryData.agency_name || deliveryData.agencyName || 'Agence non définie',
          createdAt: deliveryData.created_at || deliveryData.createdAt || '',
          updatedAt: deliveryData.updated_at || deliveryData.updatedAt || ''
        };
      }
      
      throw new Error("Invalid delivery response data");
    } catch (error) {
      console.error(`Error updating delivery status ${id}:`, error);
      throw error;
    }
  }
};
