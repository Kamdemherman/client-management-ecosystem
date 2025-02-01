import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { ComplaintStatus } from "@/types/complaint";

interface ComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint?: {
    id: number;
    client: string;
    subject: string;
    description: string;
    status: ComplaintStatus;
  } | null;
  onSubmit: (complaint: {
    client: string;
    subject: string;
    description: string;
    status: ComplaintStatus;
  }) => void;
  onStatusChange: (id: number, status: ComplaintStatus) => void;
}

export const ComplaintDialog = ({
  open,
  onOpenChange,
  complaint,
  onSubmit,
  onStatusChange,
}: ComplaintDialogProps) => {
  const [formData, setFormData] = useState<{
    client: string;
    subject: string;
    description: string;
    status: ComplaintStatus;
  }>({
    client: "",
    subject: "",
    description: "",
    status: "En attente",
  });

  useEffect(() => {
    if (complaint) {
      setFormData({
        client: complaint.client,
        subject: complaint.subject,
        description: complaint.description,
        status: complaint.status,
      });
    } else {
      setFormData({
        client: "",
        subject: "",
        description: "",
        status: "En attente",
      });
    }
  }, [complaint]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaint) {
      onStatusChange(complaint.id, formData.status);
    } else {
      onSubmit(formData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {complaint ? "Modifier la plainte" : "Nouvelle plainte"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="client" className="text-sm font-medium">
              Client
            </label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, client: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Sujet
            </label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Statut
            </label>
            <Select
              value={formData.status}
              onValueChange={(value: ComplaintStatus) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Résolu">Résolu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {complaint ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};