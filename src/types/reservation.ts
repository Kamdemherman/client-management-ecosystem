export interface Reservation {
  id: string;
  clientId: string;
  clientName: string;
  productId: string;
  productName: string;
  quantity: number;
  status: "En attente" | "Confirmée" | "Annulée";
  reservationDate: string;
  deliveryDate: string;
  notes?: string;
  agencyId: string;
  agencyName: string;
  createdAt: string;
  updatedAt: string;
}