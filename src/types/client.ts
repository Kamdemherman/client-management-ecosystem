
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  farmInfo: string;
  clientId: string;
  status: "Actif" | "Inactif";
  orders: number;
  avatar?: string;
  region: string;
  volume: string;
  pendingOrders: number;
  mostOrdered: string;
  orderFrequency: string;
  agency: string | { id: number; name: string } | any;
}
