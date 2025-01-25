import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Bell, Filter } from "lucide-react";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductListProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductList = ({ products, onView, onEdit, onDelete }: ProductListProps) => {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");

  useEffect(() => {
    // Vérifier les produits avec un stock faible
    const lowStockProducts = products.filter(
      (product) => product.stockLevel <= product.minimumStock
    );

    // Notifier pour chaque produit en stock faible
    lowStockProducts.forEach((product) => {
      toast({
        title: "Alerte Stock Faible",
        description: `Le produit "${product.name}" est en stock faible (${product.stockLevel} unités)`,
        variant: "destructive",
      });
    });
  }, [products]);

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

  const getDeliveryStatus = (product: Product) => {
    if (product.nextDelivery) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Prochaine livraison: {product.nextDelivery}
          </span>
          <Bell className="h-4 w-4 text-blue-500" />
        </div>
      );
    }
    return product.lastDelivery;
  };

  const filteredProducts = products.filter(product => {
    if (statusFilter !== "all" && product.status !== statusFilter) return false;
    if (stockFilter === "low" && product.stockLevel > product.minimumStock) return false;
    if (stockFilter === "out" && product.stockLevel !== 0) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtres:</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="En stock">En stock</SelectItem>
            <SelectItem value="Stock faible">Stock faible</SelectItem>
            <SelectItem value="Rupture de stock">Rupture de stock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Niveau de stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="low">Stock faible</SelectItem>
            <SelectItem value="out">Rupture de stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fournisseur</TableHead>
            <TableHead>Livraison</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow 
              key={product.id}
              className={product.stockLevel <= product.minimumStock ? "bg-red-50" : ""}
            >
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.price.toLocaleString()} F</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{product.stockLevel}</span>
                  {product.stockLevel <= product.minimumStock && (
                    <span className="text-xs text-red-500">
                      Minimum: {product.minimumStock}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell>{product.supplier}</TableCell>
              <TableCell>{getDeliveryStatus(product)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onView(product)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(product)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};