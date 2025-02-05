
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveriesService } from "@/services/deliveries.service";
import type { Delivery } from "@/types/delivery";

const Deliveries = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [newDelivery, setNewDelivery] = useState<Partial<Delivery>>({});

  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ['deliveries'],
    queryFn: deliveriesService.getAll
  });

  const addMutation = useMutation({
    mutationFn: (delivery: Omit<Delivery, "id" | "createdAt" | "updatedAt">) =>
      deliveriesService.create(delivery),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      setIsAddDialogOpen(false);
      setNewDelivery({});
      toast({
        title: "Succès",
        description: "La livraison a été ajoutée avec succès"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Delivery> }) =>
      deliveriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      setIsEditDialogOpen(false);
      setSelectedDelivery(null);
      toast({
        title: "Succès",
        description: "La livraison a été mise à jour avec succès"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deliveriesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      toast({
        title: "Succès",
        description: "La livraison a été supprimée avec succès"
      });
    }
  });

  const notifyClient = async (deliveryId: string) => {
    toast({
      title: "Notification envoyée",
      description: `Le client a été notifié pour la livraison ${deliveryId}`,
    });
  };

  const handleAddDelivery = () => {
    if (!newDelivery.clientId || !newDelivery.address || !newDelivery.scheduledDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    addMutation.mutate(newDelivery as Omit<Delivery, "id" | "createdAt" | "updatedAt">);
  };

  const handleEditDelivery = () => {
    if (!selectedDelivery) return;

    updateMutation.mutate({
      id: selectedDelivery.id,
      data: selectedDelivery
    });
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
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des livraisons</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add new delivery button */}
            <Button onClick={() => setIsAddDialogOpen(true)} className="mb-4">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle livraison
            </Button>

            {/* Deliveries table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Date prévue</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{delivery.id}</TableCell>
                    <TableCell>{delivery.clientId}</TableCell>
                    <TableCell>{delivery.address}</TableCell>
                    <TableCell>{new Date(delivery.scheduledDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge>{delivery.status}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => notifyClient(delivery.id)}
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteMutation.mutate(delivery.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
