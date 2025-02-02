export interface Invoice {
  id: string;
  number: string;
  date: Date;
  clientId: string;
  clientName: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "paid" | "pending" | "overdue";
  paymentDue: Date;
}