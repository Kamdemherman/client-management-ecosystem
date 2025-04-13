
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
  const [selectedProducts, setSelectedProducts] = useState<Array<{id: string, name: string, quantity: number, price: number}>>([]);
  const [total, setTotal] = useState(order?.total || "0");

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: inventoryService.getAll
  });

  // Parse existing items if order is provided
  useEffect(() => {
    if (order?.items) {
      try {
        let parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        setSelectedProducts(parsedItems);
      } catch (error) {
        console.error("Failed to parse order items:", error);
      }
    }
  }, [order]);
  
  // Calculate total when products change
  useEffect(() => {
    const calculatedTotal = selectedProducts.reduce(
      (sum, product) => sum + (product.price * product.quantity), 
      0
    ).toFixed(2);
    setTotal(calculatedTotal);
  }, [selectedProducts]);

  // Add a product to the order
  const handleAddProduct = (productId: string) => {
    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;
    
    setSelectedProducts(prev => [
      ...prev, 
      {
        id: productToAdd.id,
        name: productToAdd.name,
        quantity: 1,
        price: parseFloat(productToAdd.price.toString())
      }
    ]);
  };

  // Update product quantity
  const handleUpdateQuantity = (index: number, quantity: number) => {
    const newProducts = [...selectedProducts];
    newProducts[index].quantity = quantity;
    setSelectedProducts(newProducts);
  };

  // Remove product from order
  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!client) {
      alert("Veuillez sélectionner un client");
      return;
    }
    
    if (selectedProducts.length === 0) {
      alert("Veuillez ajouter au moins un produit");
      return;
    }
    
    const orderData = {
      client,
      status,
      items: JSON.stringify(selectedProducts),
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
        <Label>Produits</Label>
        <Select onValueChange={handleAddProduct}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ajouter un produit" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - {product.price}€
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedProducts.length > 0 ? (
          <div className="border rounded-md mt-2">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="py-2 px-4 text-left">Produit</th>
                  <th className="py-2 px-4 text-center">Quantité</th>
                  <th className="py-2 px-4 text-right">Prix</th>
                  <th className="py-2 px-4 text-right">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4 text-center">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value))}
                        className="w-16 mx-auto text-center"
                      />
                    </td>
                    <td className="py-2 px-4 text-right">{item.price.toFixed(2)}€</td>
                    <td className="py-2 px-4 text-right">{(item.price * item.quantity).toFixed(2)}€</td>
                    <td className="py-2 px-4 text-right">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveProduct(index)}
                      >
                        ✕
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun produit sélectionné</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="total">Total</Label>
        <Input
          id="total"
          type="text"
          value={`${total}€`}
          readOnly
          className="bg-muted"
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
