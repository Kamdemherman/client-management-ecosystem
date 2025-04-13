
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { clientsService } from "@/services/clients.service";
import { ordersService } from "@/services/orders.service";
import { agencies } from "@/services/agencies.service";
import type { Delivery } from "@/types/delivery";
import { format } from "date-fns";

interface DeliveryFormProps {
  delivery?: Delivery | null;
  onSubmit: (data: Partial<Delivery>) => void;
}

export function DeliveryForm({ delivery, onSubmit }: DeliveryFormProps) {
  const [formData, setFormData] = useState({
    orderId: delivery?.orderId || "",
    status: delivery?.status || "En attente",
    scheduledDate: delivery?.scheduledDate || format(new Date(), "yyyy-MM-dd"),
    address: delivery?.address || "",
    driver: delivery?.driver || "",
    notes: delivery?.notes || "",
    clientId: delivery?.clientId || "",
    clientName: delivery?.clientName || "",
    agencyId: delivery?.agencyId || "",
    agencyName: delivery?.agencyName || "",
  });

  // Fetch data for dropdowns
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll
  });

  const { data: agencyList = [] } = useQuery({
    queryKey: ['agencies'],
    queryFn: agencies.getAll
  });

  // Set selected client data
  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setFormData({
        ...formData,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        address: selectedClient.address || formData.address,
      });
    }
  };

  // Set selected agency data
  const handleAgencyChange = (agencyId: string) => {
    const selectedAgency = agencyList.find(a => a.id === agencyId);
    if (selectedAgency) {
      setFormData({
        ...formData,
        agencyId: selectedAgency.id,
        agencyName: selectedAgency.name,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting delivery data:", formData);
    
    // Make sure required fields are present
    if (!formData.clientId || !formData.clientName) {
      alert("Veuillez sélectionner un client");
      return;
    }
    
    if (!formData.agencyId || !formData.agencyName) {
      alert("Veuillez sélectionner une agence");
      return;
    }
    
    if (!formData.address) {
      alert("Veuillez saisir une adresse de livraison");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="orderId">Commande associée</Label>
          <Select 
            value={formData.orderId}
            onValueChange={(value) => setFormData({...formData, orderId: value})}
          >
            <SelectTrigger id="orderId">
              <SelectValue placeholder="Sélectionner une commande" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Aucune commande</SelectItem>
              {orders.map(order => (
                <SelectItem key={order.id} value={order.id}>
                  #{order.id} - {order.client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status}
            onValueChange={(value) => setFormData({...formData, status: value as Delivery["status"]})}
            required
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Livrée">Livrée</SelectItem>
              <SelectItem value="Annulée">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client</Label>
          <Select
            value={formData.clientId}
            onValueChange={handleClientChange}
            required
          >
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agencyId">Agence</Label>
          <Select
            value={formData.agencyId}
            onValueChange={handleAgencyChange}
            required
          >
            <SelectTrigger id="agencyId">
              <SelectValue placeholder="Sélectionner une agence" />
            </SelectTrigger>
            <SelectContent>
              {agencyList.map(agency => (
                <SelectItem key={agency.id} value={agency.id}>
                  {agency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse de livraison</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="Adresse complète"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Date prévue</Label>
          <Input
            id="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="driver">Chauffeur</Label>
          <Input
            id="driver"
            type="text"
            value={formData.driver || ""}
            onChange={(e) => setFormData({...formData, driver: e.target.value})}
            placeholder="Nom du chauffeur"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Instructions spéciales pour la livraison"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {delivery ? "Mettre à jour" : "Créer la livraison"}
        </Button>
      </div>
    </form>
  );
}
