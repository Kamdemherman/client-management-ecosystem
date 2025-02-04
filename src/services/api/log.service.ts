import { api } from "../api-config";
import type { Log } from "@/types/log";

export const logService = {
  getAll: async (filters?: {
    type?: string;
    action?: string;
    module?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/logs", { params: filters });
    return response.data;
  },

  create: async (log: Omit<Log, "id" | "createdAt">) => {
    const response = await api.post("/logs", log);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/logs/${id}`);
  },

  export: async (format: 'csv' | 'pdf', filters?: any) => {
    const response = await api.get(`/logs/export/${format}`, {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }
};