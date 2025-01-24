import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  onSubmit: (formData: FormData) => void;
}

export const ProductForm = ({ product, onSubmit }: ProductFormProps) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input 
              id="name" 
              name="name"
              defaultValue={product?.name} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input 
              id="sku" 
              name="sku"
              defaultValue={product?.sku} 
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Input 
              id="category" 
              name="category"
              defaultValue={product?.category} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Prix</Label>
            <Input 
              id="price" 
              name="price"
              type="number"
              defaultValue={product?.price} 
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stockLevel">Niveau de stock</Label>
            <Input 
              id="stockLevel" 
              name="stockLevel"
              type="number"
              defaultValue={product?.stockLevel} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumStock">Stock minimum</Label>
            <Input 
              id="minimumStock" 
              name="minimumStock"
              type="number"
              defaultValue={product?.minimumStock} 
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description"
            defaultValue={product?.description} 
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supplier">Fournisseur</Label>
            <Input 
              id="supplier" 
              name="supplier"
              defaultValue={product?.supplier} 
              required
            />
          </div>
          <div className="space-y-2">

            <Label htmlFor="status">Statut</Label>
            <Select name="status" defaultValue={product?.status || "En stock"}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En stock">En stock</SelectItem>
                <SelectItem value="Stock faible">Stock faible</SelectItem>
                <SelectItem value="Rupture de stock">Rupture de stock</SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          {product ? "Enregistrer les modifications" : "Créer le produit"}
        </Button>
      </div>
    </form>
  );
};
