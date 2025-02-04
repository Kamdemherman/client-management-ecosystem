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
    const response = await api.get("/complaints");
    return response.data;
  },

  create: async (complaint: Omit<Complaint, "id" | "date">) => {
    const response = await api.post("/complaints", complaint);
    return response.data;
  },

  update: async (id: number, status: ComplaintStatus) => {
    const response = await api.patch(`/complaints/${id}`, { status });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/complaints/${id}`);
  }
};