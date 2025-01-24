import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Agency } from "@/types/agency";

interface AgencyFormProps {
  agency?: Agency;
  onSubmit: (formData: FormData) => void;
}

export const AgencyForm = ({ agency, onSubmit }: AgencyFormProps) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'agence</Label>
            <Input 
              id="name" 
              name="name"
              defaultValue={agency?.name} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager">Gestionnaire</Label>
            <Input 
              id="manager" 
              name="manager"
              defaultValue={agency?.manager} 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="managerEmail">Email du gestionnaire</Label>
            <Input 
              id="managerEmail" 
              name="managerEmail"
              type="email"
              defaultValue={agency?.managerEmail} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input 
              id="phone" 
              name="phone"
              defaultValue={agency?.phone} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Textarea 
            id="address" 
            name="address"
            defaultValue={agency?.address} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select name="status" defaultValue={agency?.status}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeCount">Nombre d'employés</Label>
            <Input 
              id="employeeCount" 
              name="employeeCount"
              type="number"
              defaultValue={agency?.employeeCount} 
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          {agency ? "Enregistrer les modifications" : "Créer l'agence"}
        </Button>
      </div>
    </form>
  );
};