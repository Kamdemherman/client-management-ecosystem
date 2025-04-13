
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { clientsService } from "@/services/clients.service";
import { inventoryService } from "@/services/inventory.service";
import type { Order } from "@/types/order";

interface OrderFormProps {
  order?: Order | null;
  onSubmit: (data: Omit<Order, "id" | "date">) => void;
}

export function OrderForm({ order, onSubmit }: OrderFormProps) {
  const [client, setClient] = useState(order?.client || "");
  const [status, setStatus] = useState<Order['status']>(order?.status || "En attente");
  const [items, setItems] = useState(order?.items || "");
  const [total, setTotal] = useState(order?.total || "0");

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: inventoryService.getAll
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!client) {
      alert("Veuillez sélectionner un client");
      return;
    }
    
    if (!items || items === "[]") {
      alert("Veuillez ajouter au moins un produit");
      return;
    }
    
    const orderData = {
      client,
      status,
      items,
      total,
    };
    
    console.log("Submitting order data:", orderData);
    onSubmit(orderData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <Select 
          value={client} 
          onValueChange={setClient}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            {clients.length === 0 ? (
              <SelectItem value="default-client">Aucun client disponible</SelectItem>
            ) : (
              clients.map((client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={status} 
          onValueChange={(value) => setStatus(value as Order["status"])}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Livrée">Livrée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="items">Produits</Label>
        <Textarea 
          id="items"
          placeholder="Liste des produits (JSON)"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          className="min-h-[100px]"
          required
        />
        <p className="text-xs text-muted-foreground">
          Format JSON: '[{"name":"Produit 1","quantity":2,"price":100},{"name":"Produit 2","quantity":1,"price":50}]'
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total">Total</Label>
        <Input
          id="total"
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {order ? "Mettre à jour" : "Créer la commande"}
        </Button>
      </div>
    </form>
  );
}
