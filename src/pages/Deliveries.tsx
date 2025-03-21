
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Truck, Bell, Pencil, Trash2, Plus, Package, User, MapPin, CalendarClock } from "lucide-react";
import { deliveriesService } from "@/services/deliveries.service";
import type { Delivery } from "@/types/delivery";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Deliveries = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [newDelivery, setNewDelivery] = useState<Partial<Delivery>>({
    status: "En attente",
    scheduledDate: format(new Date(), "yyyy-MM-dd"),
  });

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
      setNewDelivery({
        status: "En attente",
        scheduledDate: format(new Date(), "yyyy-MM-dd"),
      });
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
      setDeleteDialogOpen(false);
      setSelectedDelivery(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDelivery(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedDelivery(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDelivery(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setSelectedDelivery(prev => prev ? { ...prev, [name]: value } : null);
  };

  const confirmDelete = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedDelivery) {
      deleteMutation.mutate(selectedDelivery.id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des livraisons</h1>
            <p className="mt-2 text-gray-600">Suivez et gérez toutes vos livraisons</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle livraison
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des livraisons</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Date prévue</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Aucune livraison trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        <div className="font-medium">{delivery.clientName}</div>
                        <div className="text-sm text-gray-500">ID: {delivery.clientId}</div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{delivery.address}</TableCell>
                      <TableCell>
                        {format(new Date(delivery.scheduledDate), "dd MMMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            delivery.status === "Livrée" ? "bg-green-100 text-green-800" : 
                            delivery.status === "En cours" ? "bg-blue-100 text-blue-800" : 
                            delivery.status === "Annulée" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {delivery.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => notifyClient(delivery.id)}
                            title="Notifier le client"
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
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => confirmDelete(delivery)}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Ajouter une nouvelle livraison */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle livraison</DialogTitle>
            <DialogDescription>
              Complétez les informations ci-dessous pour créer une nouvelle livraison.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">ID Client</Label>
                <Input
                  id="clientId"
                  name="clientId"
                  value={newDelivery.clientId || ""}
                  onChange={handleInputChange}
                  placeholder="ID du client"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Nom Client</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={newDelivery.clientName || ""}
                  onChange={handleInputChange}
                  placeholder="Nom du client"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse de livraison</Label>
              <Input
                id="address"
                name="address"
                value={newDelivery.address || ""}
                onChange={handleInputChange}
                placeholder="Adresse complète"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date prévue</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  value={newDelivery.scheduledDate || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select 
                  name="status" 
                  value={newDelivery.status || "En attente"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Livrée">Livrée</SelectItem>
                    <SelectItem value="Annulée">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={newDelivery.notes || ""}
                onChange={handleInputChange}
                placeholder="Informations supplémentaires"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agencyId">ID Agence</Label>
                <Input
                  id="agencyId"
                  name="agencyId"
                  value={newDelivery.agencyId || ""}
                  onChange={handleInputChange}
                  placeholder="ID de l'agence"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agencyName">Nom Agence</Label>
                <Input
                  id="agencyName"
                  name="agencyName"
                  value={newDelivery.agencyName || ""}
                  onChange={handleInputChange}
                  placeholder="Nom de l'agence"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver">Chauffeur</Label>
              <Input
                id="driver"
                name="driver"
                value={newDelivery.driver || ""}
                onChange={handleInputChange}
                placeholder="Nom du chauffeur"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleAddDelivery}>
              Ajouter la livraison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modifier une livraison */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la livraison</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la livraison.
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-clientId">ID Client</Label>
                  <Input
                    id="edit-clientId"
                    name="clientId"
                    value={selectedDelivery.clientId || ""}
                    onChange={handleEditInputChange}
                    placeholder="ID du client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-clientName">Nom Client</Label>
                  <Input
                    id="edit-clientName"
                    name="clientName"
                    value={selectedDelivery.clientName || ""}
                    onChange={handleEditInputChange}
                    placeholder="Nom du client"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Adresse de livraison</Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={selectedDelivery.address || ""}
                  onChange={handleEditInputChange}
                  placeholder="Adresse complète"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-scheduledDate">Date prévue</Label>
                  <Input
                    id="edit-scheduledDate"
                    name="scheduledDate"
                    type="date"
                    value={selectedDelivery.scheduledDate || ""}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Statut</Label>
                  <Select 
                    name="status" 
                    value={selectedDelivery.status}
                    onValueChange={(value) => handleEditSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Livrée">Livrée</SelectItem>
                      <SelectItem value="Annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={selectedDelivery.notes || ""}
                  onChange={handleEditInputChange}
                  placeholder="Informations supplémentaires"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-agencyId">ID Agence</Label>
                  <Input
                    id="edit-agencyId"
                    name="agencyId"
                    value={selectedDelivery.agencyId || ""}
                    onChange={handleEditInputChange}
                    placeholder="ID de l'agence"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-agencyName">Nom Agence</Label>
                  <Input
                    id="edit-agencyName"
                    name="agencyName"
                    value={selectedDelivery.agencyName || ""}
                    onChange={handleEditInputChange}
                    placeholder="Nom de l'agence"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-driver">Chauffeur</Label>
                <Input
                  id="edit-driver"
                  name="driver"
                  value={selectedDelivery.driver || ""}
                  onChange={handleEditInputChange}
                  placeholder="Nom du chauffeur"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleEditDelivery}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmer la suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette livraison ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Deliveries;
