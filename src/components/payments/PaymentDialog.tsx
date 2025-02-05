
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentForm } from "./PaymentForm";
import type { Payment } from "@/types/payment";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  payment?: Payment;
  onSubmit: (formData: FormData) => void;
}

export const PaymentDialog = ({
  open,
  onOpenChange,
  title,
  payment,
  onSubmit,
}: PaymentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <PaymentForm payment={payment} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
