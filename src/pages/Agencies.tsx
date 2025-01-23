import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Building2 } from "lucide-react";

const mockAgencies = [
  { id: 1, name: "Agence Nord", location: "Lille", employees: 15, status: "Active" },
  { id: 2, name: "Agence Sud", location: "Marseille", employees: 12, status: "Active" },
  { id: 3, name: "Agence Est", location: "Strasbourg", employees: 10, status: "Active" },
];

const Agencies = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Agences</h1>
            <p className="mt-2 text-gray-600">Gérez vos agences et leurs opérations</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Agences</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Employés</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>{agency.id}</TableCell>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.location}</TableCell>
                    <TableCell>{agency.employees}</TableCell>
                    <TableCell>{agency.status}</TableCell>
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

export default Agencies;