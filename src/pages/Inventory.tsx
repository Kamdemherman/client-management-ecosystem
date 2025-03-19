import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertCircle, TrendingUp, Truck } from "lucide-react";
import { ProductList } from "@/components/inventory/ProductList";
import { ProductForm } from "@/components/inventory/ProductForm";
import { ProductDetailsDialog } from "@/components/inventory/ProductDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";

const Inventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: inventoryService.getAll,
  });

  const createProductMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const product: Omit<Product, "id"> = {
        name: formData.get("name") as string,
        sku: formData.get("sku") as string,
        category: formData.get("category") as string,
        price: Number(formData.get("price")),
        stockLevel: Number(formData.get("stockLevel")),
        minimumStock: Number(formData.get("minimumStock")),
        description: formData.get("description") as string,
        status: formData.get("status") as "En stock" | "Stock faible" | "Rupture de stock",
        lastDelivery: new Date().toISOString().split('T')[0],
        supplier: formData.get("supplier") as string,
      };
      return inventoryService.create(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsFormOpen(false);
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la création du produit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      const product: Partial<Product> = {
        name: formData.get("name") as string,
        sku: formData.get("sku") as string,
        category: formData.get("category") as string,
        price: Number(formData.get("price")),
        stockLevel: Number(formData.get("stockLevel")),
        minimumStock: Number(formData.get("minimumStock")),
        description: formData.get("description") as string,
        status: formData.get("status") as "En stock" | "Stock faible" | "Rupture de stock",
        supplier: formData.get("supplier") as string,
      };
      return inventoryService.update(id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsFormOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la modification du produit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => inventoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression du produit: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProduct = (formData: FormData) => {
    createProductMutation.mutate(formData);
  };

  const handleUpdateProduct = (formData: FormData) => {
    if (!selectedProduct) return;
    updateProductMutation.mutate({ id: selectedProduct.id, formData });
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete.id);
  };

  const stats = {
    total: products.length,
    lowStock: products.filter((p) => p.status === "Stock faible").length,
    outOfStock: products.filter((p) => p.status === "Rupture de stock").length,
    pendingDeliveries: products.filter((p) => p.nextDelivery).length,
  };

  if (error) {
    toast({
      title: "Erreur de chargement",
      description: "Impossible de charger les produits. Veuillez réessayer plus tard.",
      variant: "destructive",
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
            <p className="mt-2 text-gray-600">Gérez vos produits et suivez leur inventaire</p>
          </div>
          <Button onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
          }}>
            Ajouter un produit
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rupture de Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.outOfStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livraisons en Attente</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Produits</CardTitle>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-4">
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="En stock">En stock</SelectItem>
                    <SelectItem value="Stock faible">Stock faible</SelectItem>
                    <SelectItem value="Rupture de stock">Rupture de stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <p className="text-muted-foreground">Chargement des produits...</p>
              </div>
            ) : (
              <ProductList
                products={filteredProducts}
                onView={(product) => {
                  setSelectedProduct(product);
                  setIsDetailsOpen(true);
                }}
                onEdit={(product) => {
                  setSelectedProduct(product);
                  setIsFormOpen(true);
                }}
                onDelete={(product) => {
                  setProductToDelete(product);
                  setIsDeleteDialogOpen(true);
                }}
              />
            )}
          </CardContent>
        </Card>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Modifier le produit" : "Ajouter un produit"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={selectedProduct}
              onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
            />
          </DialogContent>
        </Dialog>

        <ProductDetailsDialog
          product={selectedProduct}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le produit sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteProduct}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
