
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/api/payment.service";
import type { Payment } from "@/types/payment";

const Payments = () => {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentService.getAll
  });

  const { data: stats } = useQuery({
    queryKey: ['payments', 'stats'],
    queryFn: paymentService.getStats
  });

  const getStatusBadgeVariant = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return "Complété";
      case "pending":
        return "En attente";
      case "failed":
        return "Échoué";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Historique des Paiements</h1>
            <p className="text-muted-foreground">Consultez et gérez les paiements</p>
          </div>
          <Button>Nouveau Paiement</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || "0"}€</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paiements Réussis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completed || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Rechercher un paiement..."
                className="max-w-sm"
              />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: Payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>{payment.client}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payment.status)}>
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
