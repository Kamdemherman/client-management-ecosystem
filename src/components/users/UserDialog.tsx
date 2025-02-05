
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import type { User } from "@/types/user";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  user?: User;
  onSubmit: (formData: FormData) => void;
}

export const UserDialog = ({
  open,
  onOpenChange,
  title,
  user,
  onSubmit,
}: UserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <UserForm user={user} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
