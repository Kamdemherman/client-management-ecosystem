
import { Product } from "@/types/product";
import { api } from "./api-config";

export const inventoryService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>("/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    try {
      const response = await api.post<Product>("/products", product);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const response = await api.put<Product>(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },

  updateStock: async (id: string, quantity: number): Promise<Product> => {
    try {
      const response = await api.patch<Product>(`/products/${id}/stock`, { quantity });
      return response.data;
    } catch (error) {
      console.error(`Error updating stock for product with id ${id}:`, error);
      throw error;
    }
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw error;
    }
  },

  getBySupplier: async (supplier: string): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(`/products/supplier/${supplier}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products by supplier ${supplier}:`, error);
      throw error;
    }
  },

  getLowStock: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>("/products/low-stock");
      return response.data;
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      throw error;
    }
  },

  getOutOfStock: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>("/products/out-of-stock");
      return response.data;
    } catch (error) {
      console.error("Error fetching out of stock products:", error);
      throw error;
    }
  }
};
