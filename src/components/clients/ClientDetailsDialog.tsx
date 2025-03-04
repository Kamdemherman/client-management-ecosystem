
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/client";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { paymentService } from "@/services/api/payment.service";
import { complaintService } from "@/services/api/complaint.service";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientDetailsDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDetailsDialog = ({ client, open, onOpenChange }: ClientDetailsDialogProps) => {
  if (!client) return null;

  const { data: orders = [] } = useQuery({
    queryKey: ['orders', client.id.toString()],
    queryFn: () => ordersService.getByClient(client.id.toString()),
    enabled: open
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments', client.id.toString()],
    queryFn: () => paymentService.getByClient(client.id.toString()),
    enabled: open
  });

  const { data: complaints = [] } = useQuery({
    queryKey: ['complaints', client.id.toString()],
    queryFn: () => complaintService.getByClient(client.id.toString()),
    enabled: open
  });

  const formatAgency = (agency: any) => {
    if (typeof agency === 'object' && agency !== null) {
      return agency.name || JSON.stringify(agency);
    }
    return String(agency);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Détails du client - {client.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">ID Client</p>
                  <p className="text-sm text-muted-foreground">{client.clientId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">{client.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Agence</p>
                  <p className="text-sm text-muted-foreground">{formatAgency(client.agency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Statut</p>
                  <Badge variant={client.status === "Actif" ? "default" : "secondary"}>
                    {client.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="orders">
              <TabsList className="w-full">
                <TabsTrigger value="orders" className="flex-1">Commandes</TabsTrigger>
                <TabsTrigger value="payments" className="flex-1">Paiements</TabsTrigger>
                <TabsTrigger value="complaints" className="flex-1">Plaintes</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{format(new Date(order.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{order.total}€</TableCell>
                            <TableCell>{order.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des paiements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.id}</TableCell>
                            <TableCell>{format(new Date(payment.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{payment.amount}€</TableCell>
                            <TableCell>{payment.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="complaints">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des plaintes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Sujet</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {complaints.map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell>{complaint.id}</TableCell>
                            <TableCell>{format(new Date(complaint.date), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{complaint.subject}</TableCell>
                            <TableCell>{complaint.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
