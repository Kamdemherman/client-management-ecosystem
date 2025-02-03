export interface Delivery {
  id: string;
  orderId: string;
  status: "En attente" | "En cours" | "Livrée" | "Annulée";
  scheduledDate: string;
  deliveryDate?: string;
  address: string;
  driver?: string;
  notes?: string;
  clientId: string;
  clientName: string;
  agencyId: string;
  agencyName: string;
  createdAt: string;
  updatedAt: string;
}