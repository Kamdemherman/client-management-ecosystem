export interface Payment {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  client: string;
}