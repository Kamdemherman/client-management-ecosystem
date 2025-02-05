
import { api } from "../api-config";

interface Setting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  group: string;
}

export const settingService = {
  getAll: async () => {
    const response = await api.get<Setting[]>("/settings");
    return response.data;
  },

  getByGroup: async (group: string) => {
    const response = await api.get<Setting[]>(`/settings/group/${group}`);
    return response.data;
  },

  update: async (key: string, value: any) => {
    const response = await api.put<Setting>(`/settings/${key}`, { value });
    return response.data;
  },

  updateBulk: async (settings: Partial<Setting>[]) => {
    const response = await api.put<Setting[]>("/settings", { settings });
    return response.data;
  }
};
