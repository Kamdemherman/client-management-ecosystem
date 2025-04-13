
export type PaymentStatus = "paid" | "pending" | "overdue";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  client: string | null;
  amount: string;
  paymentStatus: PaymentStatus;
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}
