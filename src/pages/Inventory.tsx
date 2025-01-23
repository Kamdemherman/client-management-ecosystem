import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Package } from "lucide-react";

const mockInventory = [
  { id: 1, product: "Produit A", quantity: 150, status: "En stock", lastUpdate: "2024-02-20" },
  { id: 2, product: "Produit B", quantity: 75, status: "Stock faible", lastUpdate: "2024-02-19" },
  { id: 3, product: "Produit C", quantity: 200, status: "En stock", lastUpdate: "2024-02-18" },
];

const Inventory = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
            <p className="mt-2 text-gray-600">Suivez et gérez votre inventaire</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            <Package className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>État du Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.lastUpdate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;