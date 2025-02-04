import { api } from "../api-config";

interface Setting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  group: string;
}

export const settingService = {
  getAll: async () => {
    const response = await api.get("/settings");
    return response.data;
  },

  getByGroup: async (group: string) => {
    const response = await api.get(`/settings/group/${group}`);
    return response.data;
  },

  update: async (key: string, value: any) => {
    const response = await api.put(`/settings/${key}`, { value });
    return response.data;
  },

  updateBulk: async (settings: Partial<Setting>[]) => {
    const response = await api.put("/settings", { settings });
    return response.data;
  }
};