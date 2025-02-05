
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Payment } from "@/types/payment";

interface PaymentFormProps {
  payment?: Payment;
  onSubmit: (formData: FormData) => void;
}

export const PaymentForm = ({ payment, onSubmit }: PaymentFormProps) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client ID</Label>
            <Input 
              id="client" 
              name="client"
              defaultValue={payment?.client} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input 
              id="amount" 
              name="amount"
              type="number" 
              defaultValue={payment?.amount}
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select name="method" defaultValue={payment?.method ?? "card"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="transfer">Virement</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select name="status" defaultValue={payment?.status ?? "pending"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reference">Référence</Label>
          <Input 
            id="reference" 
            name="reference"
            defaultValue={payment?.reference}
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          {payment ? "Mettre à jour" : "Créer le paiement"}
        </Button>
      </div>
    </form>
  );
};
