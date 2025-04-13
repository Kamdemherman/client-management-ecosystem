
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { reservationsService } from "@/services/reservations.service";
import { clientsService } from "@/services/clients.service";
import { inventoryService } from "@/services/inventory.service";
import { useQuery } from "@tanstack/react-query";
import type { Reservation } from "@/types/reservation";

interface ReservationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  reservation?: Reservation;
}

export const ReservationForm = ({ onSuccess, onCancel, reservation }: ReservationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client_id: reservation?.client_id || "",
    clientName: reservation?.clientName || "",
    product_id: reservation?.product_id || "",
    productName: reservation?.productName || "",
    quantity: reservation?.quantity || 1,
    status: reservation?.status || "En attente",
    reservation_date: reservation?.reservation_date ? new Date(reservation.reservation_date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
    deliveryDate: reservation?.deliveryDate ? new Date(reservation.deliveryDate).toISOString().substring(0, 10) : "",
    agency_id: reservation?.agency_id || "",
    agencyName: reservation?.agencyName || "",
    notes: reservation?.notes || "",
  });

  // Récupérer la liste des clients
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll
  });

  // Récupérer la liste des produits
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: inventoryService.getAll
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (clientId: string) => {
    const selectedClient = clients.find(c => c.id.toString() === clientId);
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        client_id: clientId,
        clientName: selectedClient.name
      }));
    }
  };

  const handleProductSelect = (productId: string) => {
    const selectedProduct = products.find(p => p.id.toString() === productId);
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        product_id: productId,
        productName: selectedProduct.name
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que les champs requis sont remplis
    if (!formData.client_id || !formData.clientName) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un client.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.product_id || !formData.productName) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un produit.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (reservation) {
        // Mettre à jour la réservation existante
        await reservationsService.update(reservation.id, formData);
        toast({
          title: "Réservation mise à jour",
          description: "La réservation a été mise à jour avec succès."
        });
      } else {
        // Créer une nouvelle réservation
        await reservationsService.create(formData);
        toast({
          title: "Réservation créée",
          description: "La réservation a été créée avec succès."
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving reservation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la réservation.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_id">Client *</Label>
          <Select
            value={formData.client_id}
            onValueChange={handleClientSelect}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.length === 0 ? (
                <SelectItem value="no-client">Aucun client disponible</SelectItem>
              ) : (
                clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientName">Nom du Client</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder="Nom du client"
            readOnly
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product_id">Produit *</Label>
          <Select
            value={formData.product_id}
            onValueChange={handleProductSelect}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un produit" />
            </SelectTrigger>
            <SelectContent>
              {products.length === 0 ? (
                <SelectItem value="no-product">Aucun produit disponible</SelectItem>
              ) : (
                products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="productName">Nom du Produit</Label>
          <Input
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Nom du produit"
            readOnly
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            name="status"
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Confirmée">Confirmée</SelectItem>
              <SelectItem value="Annulée">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reservation_date">Date de Réservation</Label>
          <Input
            id="reservation_date"
            name="reservation_date"
            type="date"
            value={formData.reservation_date}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryDate">Date de Livraison</Label>
          <Input
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            value={formData.deliveryDate}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="agency_id">ID Agence</Label>
          <Input
            id="agency_id"
            name="agency_id"
            value={formData.agency_id}
            onChange={handleInputChange}
            placeholder="ID de l'agence"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agencyName">Nom de l'Agence</Label>
          <Input
            id="agencyName"
            name="agencyName"
            value={formData.agencyName}
            onChange={handleInputChange}
            placeholder="Nom de l'agence"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Informations supplémentaires"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : reservation ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};
