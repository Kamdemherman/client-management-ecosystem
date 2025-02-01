import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Truck, Bell, Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface Delivery {
  id: string;
  client: string;
  address: string;
  date: string;
  status: string;
  order: string;
}

const Deliveries = () => {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([
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
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [newDelivery, setNewDelivery] = useState<Partial<Delivery>>({});

  const notifyClient = (deliveryId: string) => {
    toast({
      title: "Notification envoyée",
      description: `Le client a été notifié pour la livraison ${deliveryId}`,
    });
  };

  const handleAddDelivery = () => {
    if (!newDelivery.client || !newDelivery.address || !newDelivery.date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const delivery: Delivery = {
      id: `DEL${Math.floor(Math.random() * 1000)}`,
      client: newDelivery.client,
      address: newDelivery.address,
      date: newDelivery.date,
      status: "Planifiée",
      order: `ORD${Math.floor(Math.random() * 1000)}`
    };

    setDeliveries([...deliveries, delivery]);
    setIsAddDialogOpen(false);
    setNewDelivery({});
    toast({
      title: "Succès",
      description: "La livraison a été ajoutée avec succès"
    });
  };

  const handleEditDelivery = () => {
    if (!selectedDelivery) return;

    const updatedDeliveries = deliveries.map(delivery => 
      delivery.id === selectedDelivery.id ? selectedDelivery : delivery
    );

    setDeliveries(updatedDeliveries);
    setIsEditDialogOpen(false);
    setSelectedDelivery(null);
    toast({
      title: "Succès",
      description: "La livraison a été mise à jour avec succès"
    });
  };

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(deliveries.filter(delivery => delivery.id !== id));
    toast({
      title: "Succès",
      description: "La livraison a été supprimée avec succès"
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Liste des Livraisons</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Livraison
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une livraison</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer une nouvelle livraison
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Client</label>
                    <Input
                      placeholder="Nom du client"
                      value={newDelivery.client || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, client: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Adresse</label>
                    <Input
                      placeholder="Adresse de livraison"
                      value={newDelivery.address || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={newDelivery.date || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, date: e.target.value })}
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddDelivery}>
                    Ajouter la livraison
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                {deliveries.map((delivery) => (
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
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDelivery(delivery.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => notifyClient(delivery.id)}
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la livraison</DialogTitle>
              <DialogDescription>
                Modifiez les informations de la livraison
              </DialogDescription>
            </DialogHeader>
            {selectedDelivery && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                  <Input
                    value={selectedDelivery.client}
                    onChange={(e) => setSelectedDelivery({ ...selectedDelivery, client: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse</label>
                  <Input
                    value={selectedDelivery.address}
                    onChange={(e) => setSelectedDelivery({ ...selectedDelivery, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={selectedDelivery.date}
                    onChange={(e) => setSelectedDelivery({ ...selectedDelivery, date: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleEditDelivery}>
                  Mettre à jour la livraison
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Deliveries;