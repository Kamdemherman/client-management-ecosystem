
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/types/client";
import { useQuery } from "@tanstack/react-query";
import { agenciesService } from "@/services/agencies.service";
import { useState, useEffect } from "react";

interface ClientFormProps {
  client?: Client;
  onSubmit: (formData: FormData) => void;
  isSubmitting?: boolean;
}

export const ClientForm = ({ client, onSubmit, isSubmitting = false }: ClientFormProps) => {
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  
  // Fetch agencies for the dropdown
  const { data: agencies = [], isLoading } = useQuery({
    queryKey: ['agencies'],
    queryFn: agenciesService.getAll
  });

  useEffect(() => {
    if (client?.agency) {
      if (typeof client.agency === 'object' && client.agency !== null) {
        setSelectedAgency(client.agency.id?.toString() || '1'); // Default to '1' if id is empty
      } else {
        setSelectedAgency(client.agency?.toString() || '1'); // Default to '1' if agency is empty
      }
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Ensure the field name is farm_info (not farmInfo)
    const farmInfo = formData.get('farmInfo');
    if (farmInfo) {
      formData.delete('farmInfo');
      formData.append('farm_info', farmInfo.toString());
    }
    
    // If we're updating a client, add the ID to the form data
    if (client?.id) {
      formData.append('id', client.id.toString());
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom et prénom</Label>
            <Input 
              id="name" 
              name="name"
              defaultValue={client?.name} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              defaultValue={client?.email} 
              required
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientId">Identifiant client</Label>
            <Input 
              id="clientId" 
              name="clientId"
              defaultValue={client?.clientId} 
              disabled={!!client}
              required={!client}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse postale</Label>
          <Textarea 
            id="address" 
            name="address"
            defaultValue={client?.address} 
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="farmInfo">Informations d'élevage</Label>
          <Textarea 
            id="farmInfo" 
            name="farmInfo"
            defaultValue={client?.farmInfo}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select name="status" defaultValue={client?.status || "Actif"}>
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
            <Label htmlFor="region">Région</Label>
            <Select name="region" defaultValue={client?.region || "Nord"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nord">Nord</SelectItem>
                <SelectItem value="Sud">Sud</SelectItem>
                <SelectItem value="Est">Est</SelectItem>
                <SelectItem value="Ouest">Ouest</SelectItem>
                <SelectItem value="Centre">Centre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="agency_id">Agence</Label>
          <Select 
            name="agency_id" 
            value={selectedAgency || "1"} 
            onValueChange={setSelectedAgency} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une agence" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading">Chargement...</SelectItem>
              ) : (
                agencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id.toString() || "1"}>
                    {agency.name}
                  </SelectItem>
                ))
              )}
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
            required={!client}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? "Traitement en cours..." 
            : (client ? "Enregistrer les modifications" : "Créer le client")
          }
        </Button>
      </div>
    </form>
  );
};
