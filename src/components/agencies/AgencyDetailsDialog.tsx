import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Agency } from "@/types/agency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AgencyDetailsDialogProps {
  agency: Agency | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AgencyDetailsDialog = ({ agency, open, onOpenChange }: AgencyDetailsDialogProps) => {
  if (!agency) return null;

  const revenueData = [
    { name: 'Semaine', value: agency.revenue.weekly },
    { name: 'Mois', value: agency.revenue.monthly },
    { name: 'Trimestre', value: agency.revenue.quarterly },
    { name: 'Année', value: agency.revenue.yearly },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails de l'agence - {agency.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Informations générales</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Gestionnaire:</span> {agency.manager}</p>
                <p><span className="font-medium">Email:</span> {agency.managerEmail}</p>
                <p><span className="font-medium">Téléphone:</span> {agency.phone}</p>
                <p><span className="font-medium">Adresse:</span> {agency.address}</p>
                <p><span className="font-medium">Statut:</span> {agency.status}</p>
                <p><span className="font-medium">Employés:</span> {agency.employeeCount}</p>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Plaintes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p><span className="font-medium">Total:</span> {agency.complaints.total}</p>
                  <p><span className="font-medium">Résolues:</span> {agency.complaints.resolved}</p>
                  <p><span className="font-medium">En attente:</span> {agency.complaints.pending}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenus</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};