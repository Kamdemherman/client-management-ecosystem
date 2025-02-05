
import { api } from "../api-config";
import type { ComplaintStatus } from "@/types/complaint";

interface Complaint {
  id: number;
  client: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  date: string;
}

export const complaintService = {
  getAll: async () => {
    const response = await api.get<Complaint[]>("/complaints");
    return response.data;
  },

  create: async (complaint: Omit<Complaint, "id" | "date">) => {
    const response = await api.post<Complaint>("/complaints", complaint);
    return response.data;
  },

  update: async (id: number, complaint: Partial<Complaint>) => {
    const response = await api.patch<Complaint>(`/complaints/${id}`, complaint);
    return response.data;
  },

  updateStatus: async (id: number, status: ComplaintStatus) => {
    const response = await api.patch<Complaint>(`/complaints/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/complaints/${id}`);
  }
};
