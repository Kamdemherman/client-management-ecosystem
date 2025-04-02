
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PaymentStatus = "pending" | "paid" | "overdue" | "cancelled";

interface PaymentStatusProps {
  status: PaymentStatus;
}

const statusConfig = {
  pending: { label: "En attente", class: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Payé", class: "bg-green-100 text-green-800" },
  overdue: { label: "En retard", class: "bg-red-100 text-red-800" },
  cancelled: { label: "Annulé", class: "bg-gray-100 text-gray-800" },
};

export const PaymentStatusBadge = ({ status }: PaymentStatusProps) => {
  // Add a fallback in case status is not in statusConfig
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge className={cn("font-medium", config.class)}>
      {config.label}
    </Badge>
  );
};
