import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";

const mockOrders = [
  { id: 1, client: "Jean Dupont", date: "2024-02-20", status: "En cours", total: "1500€" },
  { id: 2, client: "Marie Martin", date: "2024-02-19", status: "Livré", total: "2300€" },
  { id: 3, client: "Pierre Durant", date: "2024-02-18", status: "En attente", total: "1800€" },
];

const Orders = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
            <p className="mt-2 text-gray-600">Suivez et gérez les commandes clients</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            <ShoppingCart className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.client}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.total}</TableCell>
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

export default Orders;