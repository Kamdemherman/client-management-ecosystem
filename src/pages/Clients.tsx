import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Users } from "lucide-react";

const mockClients = [
  { id: 1, name: "Jean Dupont", region: "Nord", orders: 12, status: "Actif" },
  { id: 2, name: "Marie Martin", region: "Sud", orders: 8, status: "Actif" },
  { id: 3, name: "Pierre Durant", region: "Est", orders: 15, status: "Inactif" },
];

const Clients = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="mt-2 text-gray-600">Gérez vos comptes clients et leurs informations</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Région</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.region}</TableCell>
                    <TableCell>{client.orders}</TableCell>
                    <TableCell>{client.status}</TableCell>
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

export default Clients;