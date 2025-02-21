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
import { useToast } from "@/components/ui/use-toast";

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Produit A",
    sku: "SKU001",
    category: "Catégorie 1",
    price: 15000,
    stockLevel: 150,
    minimumStock: 50,
    description: "Description détaillée du produit A",
    status: "En stock",
    lastDelivery: "2024-02-20",
    supplier: "Fournisseur X",
  },
  {
    id: "2",
    name: "Produit B",
    sku: "SKU002",
    category: "Catégorie 2",
    price: 25000,
    stockLevel: 30,
    minimumStock: 40,
    description: "Description détaillée du produit B",
    status: "Stock faible",
    lastDelivery: "2024-02-19",
    supplier: "Fournisseur Y",
  },
  {
    id: "3",
    name: "Produit C",
    sku: "SKU003",
    category: "Catégorie 1",
    price: 35000,
    stockLevel: 0,
    minimumStock: 20,
    description: "Description détaillée du produit C",
    status: "Rupture de stock",
    lastDelivery: "2024-02-18",
    nextDelivery: "2024-03-01",
    supplier: "Fournisseur Z",
  },
];

const Inventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProduct = (formData: FormData) => {
    const newProduct: Product = {
      id: (products.length + 1).toString(),
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      stockLevel: Number(formData.get("stockLevel")),
      minimumStock: Number(formData.get("minimumStock")),
      description: formData.get("description") as string,
      status: formData.get("status") as Product["status"],
      lastDelivery: new Date().toISOString().split("T")[0],
      supplier: formData.get("supplier") as string,
    };

    setProducts([...products, newProduct]);
    setIsFormOpen(false);
    toast({
      title: "Produit créé",
      description: "Le produit a été créé avec succès.",
    });
  };

  const handleUpdateProduct = (formData: FormData) => {
    if (!selectedProduct) return;

    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? {
            ...product,
            name: formData.get("name") as string,
            sku: formData.get("sku") as string,
            category: formData.get("category") as string,
            price: Number(formData.get("price")),
            stockLevel: Number(formData.get("stockLevel")),
            minimumStock: Number(formData.get("minimumStock")),
            description: formData.get("description") as string,
            status: formData.get("status") as Product["status"],
            supplier: formData.get("supplier") as string,
          }
        : product
    );

    setProducts(updatedProducts);
    setIsFormOpen(false);
    setSelectedProduct(null);
    toast({
      title: "Produit modifié",
      description: "Le produit a été modifié avec succès.",
    });
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;

    const updatedProducts = products.filter(
      (product) => product.id !== productToDelete.id
    );
    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès.",
    });
  };

  const stats = {
    total: products.length,
    lowStock: products.filter((p) => p.status === "Stock faible").length,
    outOfStock: products.filter((p) => p.status === "Rupture de stock").length,
    pendingDeliveries: products.filter((p) => p.nextDelivery).length,
  };

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
              <AlertDialogAction onClick={handleDeleteProduct}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
