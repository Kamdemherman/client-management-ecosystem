
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types/client";
import { ClientStats } from "@/components/clients/ClientStats";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientList } from "@/components/clients/ClientList";
import { ClientDetailsDialog } from "@/components/clients/ClientDetailsDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/clients.service";

const ITEMS_PER_PAGE = 5;

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => clientsService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client créé",
        description: "Le nouveau client a été créé avec succès.",
      });
    },
    onError: (error) => {
      console.error("Error creating client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du client.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      clientsService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setEditingClient(null);
      toast({
        title: "Client mis à jour",
        description: "Les informations du client ont été mises à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error("Error updating client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du client.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setClientToDelete(null);
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du client.",
        variant: "destructive",
      });
    }
  });

  const handleCreateClient = (formData: FormData) => {
    createMutation.mutate(formData);
  };

  const handleUpdateClient = (formData: FormData) => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, formData });
    }
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteMutation.mutate(clientToDelete.id);
    }
  };

  const filteredClients = clients.filter(client => {
    const nameMatch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const regionMatch = !filterRegion || client.region === filterRegion;
    return nameMatch && regionMatch;
  });

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get unique, non-empty regions from clients that are valid strings
  const regions = Array.from(
    new Set(
      clients
        .map(client => client.region)
        .filter(region => region && typeof region === 'string' && region.trim() !== '')
    )
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="mt-2 text-gray-600">Gérez vos comptes clients et leurs informations</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Nouveau Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau client</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du client ci-dessous
                </DialogDescription>
              </DialogHeader>
              <ClientForm onSubmit={handleCreateClient} />
            </DialogContent>
          </Dialog>
        </div>

        <ClientStats clients={clients} />

        <Card>
          <CardHeader>
            <CardTitle>Liste des Clients</CardTitle>
            <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un client..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterRegion || ""} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrer par région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les régions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ClientList 
              clients={paginatedClients}
              onView={setSelectedClient}
              onEdit={setEditingClient}
              onDelete={setClientToDelete}
            />

            <div className="flex items-center justify-between space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Suivant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client ci-dessous
            </DialogDescription>
          </DialogHeader>
          {editingClient && (
            <ClientForm 
              client={editingClient} 
              onSubmit={handleUpdateClient}
            />
          )}
        </DialogContent>
      </Dialog>

      <ClientDetailsDialog 
        client={selectedClient}
        open={!!selectedClient}
        onOpenChange={(open) => !open && setSelectedClient(null)}
      />

      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le compte client
              {clientToDelete && ` ${clientToDelete.name}`} et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Clients;
