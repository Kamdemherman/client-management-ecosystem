import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PaymentStatus, Invoice } from "@/types/invoice";

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

const mockClients = [
  "Jean Dupont",
  "Marie Martin",
  "Pierre Durant"
];

const mockProducts = [
  { id: "P1", name: "Aliment A", price: 750 },
  { id: "P2", name: "Aliment B", price: 766.67 },
  { id: "P3", name: "Aliment C", price: 500 }
];

export const InvoiceForm = ({ invoice, onSubmit }: InvoiceFormProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    invoice?.products || []
  );

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
      { id: "", name: "", quantity: 1, price: 0 }
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    const updatedProducts = [...selectedProducts];
    if (field === "id") {
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          id: product.id,
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

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.set("products", JSON.stringify(selectedProducts));
      formData.set("amount", calculateTotal().toString());
      formData.set("date", format(new Date(), "yyyy-MM-dd"));
      formData.set("invoiceNumber", invoice?.invoiceNumber || generateInvoiceNumber());
      formData.set("paymentStatus", "pending");
      onSubmit(formData);
    }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>N° Facture</Label>
            <Input 
              value={invoice?.invoiceNumber || generateInvoiceNumber()} 
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
          <Select name="client" defaultValue={invoice?.client}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map(client => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
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
                      {mockProducts.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} - {p.price}€
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value))}
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