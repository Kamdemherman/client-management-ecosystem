export interface Agency {
  id: number;
  name: string;
  location: string;
  manager: string;
  managerEmail: string;
  phone: string;
  address: string;
  status: "Actif" | "Inactif";
  revenue: {
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  complaints: {
    total: number;
    resolved: number;
    pending: number;
  };
  employeeCount: number;
  createdAt: string;
}