
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { PaymentStatus, Invoice } from "@/types/invoice";
import { useQuery } from "@tanstack/react-query";
import { clientsService } from "@/services/clients.service";
import { inventoryService } from "@/services/inventory.service";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSubmit: (formData: FormData) => void;
}

export const InvoiceForm = ({ invoice, onSubmit }: InvoiceFormProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    invoice?.products || []
  );

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: inventoryService.getAll
  });

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FAC-${year}${month}-${random}`;
  };

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { id: "temp-" + Date.now(), name: "", quantity: 1, price: 0 }
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    const updatedProducts = [...selectedProducts];
    if (field === "id") {
      const product = products.find(p => p.id.toString() === value);
      if (product) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          id: product.id.toString(),
          name: product.name,
          price: product.price
        };
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value
      };
    }
    setSelectedProducts(updatedProducts);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  const invoiceNumber = invoice?.invoiceNumber || generateInvoiceNumber();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(invoice?.paymentStatus || "pending");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Ensure required fields are present and properly formatted
    const date = formData.get('date') || format(new Date(), "yyyy-MM-dd");
    formData.set("date", date.toString());
    
    // Set invoice number
    formData.set("invoiceNumber", invoiceNumber);
    
    // Set payment status
    formData.set("paymentStatus", paymentStatus);
    
    // Ensure products is properly formatted as an array
    // We're directly providing the array, not a string
    formData.set("products", JSON.stringify(selectedProducts));
    
    // Set total amount
    formData.set("amount", calculateTotal().toString());
    
    // Log the form data for debugging
    console.log("Form data before submission:", Object.fromEntries(formData));
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>N° Facture</Label>
            <Input 
              name="invoiceNumber"
              value={invoiceNumber} 
              readOnly 
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input 
              type="date" 
              name="date"
              defaultValue={invoice?.date || format(new Date(), "yyyy-MM-dd")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select name="client" defaultValue={invoice?.client || ""} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.length === 0 ? (
                <SelectItem value="default-client">Aucun client disponible</SelectItem>
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
          <Label htmlFor="paymentStatus">Statut de paiement</Label>
          <Select 
            name="paymentStatus" 
            defaultValue={paymentStatus}
            onValueChange={(value: PaymentStatus) => setPaymentStatus(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Payé</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="overdue">En retard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Produits</Label>
            <Button type="button" variant="outline" onClick={handleAddProduct}>
              Ajouter un produit
            </Button>
          </div>

          {selectedProducts.length === 0 && (
            <div className="p-4 border rounded-lg text-center text-gray-500">
              Aucun produit ajouté. Veuillez ajouter au moins un produit.
            </div>
          )}

          {selectedProducts.map((product, index) => (
            <div key={index} className="grid gap-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Produit</Label>
                  <Select
                    value={product.id}
                    onValueChange={(value) => handleProductChange(index, "id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.length === 0 ? (
                        <SelectItem value="default-product">Aucun produit disponible</SelectItem>
                      ) : (
                        products.map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name} - {p.price}€
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Total: {(product.price * product.quantity).toFixed(2)}€
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveProduct(index)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg">{calculateTotal().toFixed(2)}€</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {invoice ? "Mettre à jour" : "Créer la facture"}
        </Button>
      </div>
    </form>
  );
};
