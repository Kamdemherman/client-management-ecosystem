import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

interface ProductDetailsDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailsDialog = ({
  product,
  open,
  onOpenChange,
}: ProductDetailsDialogProps) => {
  if (!product) return null;

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "En stock":
        return "default";
      case "Stock faible":
        return "secondary";
      case "Rupture de stock":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription>
            SKU: {product.sku}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Informations générales</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Catégorie:</span> {product.category}</p>
                <p><span className="font-medium">Prix:</span> {product.price.toLocaleString()} F</p>
                <p><span className="font-medium">Fournisseur:</span> {product.supplier}</p>
                <p>
                  <span className="font-medium">Statut:</span>{" "}
                  <Badge variant={getStatusColor(product.status)}>{product.status}</Badge>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gestion des stocks</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Niveau actuel:</span> {product.stockLevel}</p>
                <p><span className="font-medium">Stock minimum:</span> {product.minimumStock}</p>
                <p><span className="font-medium">Dernière livraison:</span> {product.lastDelivery}</p>
                {product.nextDelivery && (
                  <p><span className="font-medium">Prochaine livraison:</span> {product.nextDelivery}</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};