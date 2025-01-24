export interface Order {
  id: string;
  client: string;
  date: string;
  status: "En attente" | "En cours" | "Livrée";
  total: string;
  items: string;
}