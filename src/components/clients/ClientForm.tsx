import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/types/client";

interface ClientFormProps {
  client?: Client;
  onSubmit: (formData: FormData) => void;
}

export const ClientForm = ({ client, onSubmit }: ClientFormProps) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom et prénom</Label>
            <Input 
              id="name" 
              name="name"
              defaultValue={client?.name} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              defaultValue={client?.email} 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input 
              id="phone" 
              name="phone"
              defaultValue={client?.phone} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientId">Identifiant client</Label>
            <Input 
              id="clientId" 
              defaultValue={client?.clientId} 
              disabled={!!client}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse postale</Label>
          <Textarea 
            id="address" 
            name="address"
            defaultValue={client?.address} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="farmInfo">Informations d'élevage</Label>
          <Textarea 
            id="farmInfo" 
            name="farmInfo"
            defaultValue={client?.farmInfo}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select name="status" defaultValue={client?.status}>
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
            <Label htmlFor="password">
              {client ? "Nouveau mot de passe" : "Mot de passe temporaire"}
            </Label>
            <Input 
              id="password" 
              name="password"
              type="password"
              placeholder={client ? "Laisser vide pour ne pas modifier" : undefined}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          {client ? "Enregistrer les modifications" : "Créer le client"}
        </Button>
      </div>
    </form>
  );
};