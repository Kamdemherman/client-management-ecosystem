
import { Product } from "@/types/product";
import { api } from "./api-config";

export const inventoryService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await api.post<Product>("/products", product);
    return response.data;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  updateStock: async (id: string, quantity: number): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}/stock`, { quantity });
    return response.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/category/${category}`);
    return response.data;
  },

  getBySupplier: async (supplier: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/supplier/${supplier}`);
    return response.data;
  },

  getLowStock: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products/low-stock");
    return response.data;
  },

  getOutOfStock: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products/out-of-stock");
    return response.data;
  }
};
