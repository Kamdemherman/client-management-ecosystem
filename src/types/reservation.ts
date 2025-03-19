
export interface Reservation {
  id: string;
  client_id: string;      // Changed from clientId
  clientName: string;
  product_id: string;     // Changed from productId
  productName: string;
  quantity: number;
  status: "En attente" | "Confirmée" | "Annulée";
  reservation_date: string;  // Changed from reservationDate
  deliveryDate: string;
  notes?: string;
  agency_id: string;      // Changed from agencyId
  agencyName: string;
  createdAt: string;
  updatedAt: string;
}
