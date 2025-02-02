export type PaymentStatus = "pending" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  date: string;
  amount: string;
  paymentStatus: PaymentStatus;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}