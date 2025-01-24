import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Eye, Package, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD001",
    client: "Jean Dupont",
    date: "2024-01-20",
    status: "En attente",
    total: "1500€",
    items: "Engrais Bio (x3), Pesticides Naturels (x2)",
  },
  {
    id: "ORD002",
    client: "Marie Martin",
    date: "2024-01-19",
    status: "En cours",
    total: "2300€",
    items: "Semences Bio (x5), Outils de jardinage",
  },
  {
    id: "ORD003",
    client: "Pierre Durant",
    date: "2024-01-18",
    status: "Livrée",
    total: "1800€",
    items: "Fertilisants (x4), Protection des cultures",
  },
];

const statusColors = {
  "En attente": "bg-yellow-100 text-yellow-800",
  "En cours": "bg-blue-100 text-blue-800",
  "Livrée": "bg-green-100 text-green-800",
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Stats calculations
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(order => order.status === "En attente").length;
  const inProgressOrders = mockOrders.filter(order => order.status === "En cours").length;
  const deliveredOrders = mockOrders.filter(order => order.status === "Livrée").length;

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteOrder = (orderId: string) => {
    toast({
      title: "Commande supprimée",
      description: `La commande ${orderId} a été supprimée avec succès.`,
    });
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Statut mis à jour",
      description: `Le statut de la commande ${orderId} a été mis à jour à "${newStatus}".`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
            <p className="mt-2 text-gray-600">Suivez et gérez les commandes clients</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            <ShoppingCart className="w-6 h-6 text-primary-600" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Cours</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livrées</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredOrders}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une commande..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Livrée">Livrée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.client}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Détails de la Commande {order.id}</DialogTitle>
                              <DialogDescription>
                                <div className="mt-4 space-y-4">
                                  <div>
                                    <p className="font-medium">Client</p>
                                    <p className="text-sm text-gray-600">{order.client}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Articles</p>
                                    <p className="text-sm text-gray-600">{order.items}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Date</p>
                                    <p className="text-sm text-gray-600">{order.date}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Total</p>
                                    <p className="text-sm text-gray-600">{order.total}</p>
                                  </div>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>

                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleUpdateStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="En attente">En attente</SelectItem>
                            <SelectItem value="En cours">En cours</SelectItem>
                            <SelectItem value="Livrée">Livrée</SelectItem>
                          </SelectContent>
                        </Select>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer la commande</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Orders;