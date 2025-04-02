
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PaymentStatus = "pending" | "paid" | "overdue" | "cancelled";

interface PaymentStatusProps {
  status: PaymentStatus;
}

const statusConfig: Record<PaymentStatus, { label: string; class: string }> = {
  pending: { label: "En attente", class: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Payé", class: "bg-green-100 text-green-800" },
  overdue: { label: "En retard", class: "bg-red-100 text-red-800" },
  cancelled: { label: "Annulé", class: "bg-gray-100 text-gray-800" },
};

export const PaymentStatusBadge = ({ status }: PaymentStatusProps) => {
  // Ensure status is one of the valid keys
  const safeStatus = (Object.keys(statusConfig).includes(status) ? status : "pending") as PaymentStatus;
  const config = statusConfig[safeStatus];
  
  return (
    <Badge className={cn("font-medium", config.class)}>
      {config.label}
    </Badge>
  );
};
