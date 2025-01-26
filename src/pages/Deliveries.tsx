import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Truck, Bell } from "lucide-react";

const mockDeliveries = [
  {
    id: "DEL001",
    client: "Jean Dupont",
    address: "123 Rue de Paris",
    date: "2024-02-20",
    status: "En route",
    order: "ORD001"
  },
  {
    id: "DEL002",
    client: "Marie Martin",
    address: "456 Avenue des Champs",
    date: "2024-02-21",
    status: "Planifiée",
    order: "ORD002"
  }
];

const Deliveries = () => {
  const { toast } = useToast();

  const notifyClient = (deliveryId: string) => {
    toast({
      title: "Notification envoyée",
      description: `Le client a été notifié pour la livraison ${deliveryId}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Livraisons</h1>
            <p className="mt-2 text-gray-600">Suivez et gérez les livraisons</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            <Truck className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Livraisons</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{delivery.id}</TableCell>
                    <TableCell>{delivery.client}</TableCell>
                    <TableCell>{delivery.address}</TableCell>
                    <TableCell>{delivery.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => notifyClient(delivery.id)}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                    </TableCell>
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

export default Deliveries;