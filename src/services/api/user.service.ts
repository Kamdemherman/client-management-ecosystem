
import { api } from "../api-config";
import type { User } from "@/types/user";

export const userService = {
  getAll: async () => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (user: Omit<User, "id" | "createdAt">) => {
    const response = await api.post<User>("/users", user);
    return response.data;
  },

  update: async (id: string, user: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },

  updatePassword: async (id: string, currentPassword: string, newPassword: string) => {
    const response = await api.put(`/users/${id}/password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};
