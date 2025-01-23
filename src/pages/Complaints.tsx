import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MessageSquare } from "lucide-react";

const mockComplaints = [
  { id: 1, client: "Jean Dupont", date: "2024-02-20", type: "Livraison", status: "En cours" },
  { id: 2, client: "Marie Martin", date: "2024-02-19", type: "Produit", status: "Résolu" },
  { id: 3, client: "Pierre Durant", date: "2024-02-18", type: "Service", status: "En attente" },
];

const Complaints = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Plaintes</h1>
            <p className="mt-2 text-gray-600">Suivez et gérez les plaintes clients</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            <MessageSquare className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Plaintes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>{complaint.id}</TableCell>
                    <TableCell>{complaint.client}</TableCell>
                    <TableCell>{complaint.date}</TableCell>
                    <TableCell>{complaint.type}</TableCell>
                    <TableCell>{complaint.status}</TableCell>
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

export default Complaints;