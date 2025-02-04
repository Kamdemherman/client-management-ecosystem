import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Building2, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Agency } from "@/types/agency";
import { AgencyStats } from "@/components/agencies/AgencyStats";
import { AgencyForm } from "@/components/agencies/AgencyForm";
import { AgencyDetailsDialog } from "@/components/agencies/AgencyDetailsDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agenciesService } from "@/services/agencies.service";

const ITEMS_PER_PAGE = 5;

const Agencies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: agencies = [], isLoading } = useQuery({
    queryKey: ['agencies'],
    queryFn: agenciesService.getAll
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => agenciesService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      toast({
        title: "Agence créée",
        description: "La nouvelle agence a été créée avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'agence.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      agenciesService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      setEditingAgency(null);
      toast({
        title: "Agence mise à jour",
        description: "Les informations de l'agence ont été mises à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'agence.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => agenciesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      toast({
        title: "Agence supprimée",
        description: "L'agence a été supprimée avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'agence.",
        variant: "destructive",
      });
    }
  });

  const handleCreateAgency = (formData: FormData) => {
    createMutation.mutate(formData);
  };

  const handleUpdateAgency = (formData: FormData) => {
    if (editingAgency) {
      updateMutation.mutate({ id: editingAgency.id, formData });
    }
  };

  const handleDeleteAgency = (agency: Agency) => {
    deleteMutation.mutate(agency.id);
  };

  const filteredAgencies = agencies.filter(agency => 
    agency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgencies.length / ITEMS_PER_PAGE);
  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Agences</h1>
            <p className="mt-2 text-gray-600">Gérez vos agences et leurs opérations</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Building2 className="w-4 h-4" />
                Nouvelle Agence
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle agence</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de l'agence ci-dessous
                </DialogDescription>
              </DialogHeader>
              <AgencyForm onSubmit={handleCreateAgency} />
            </DialogContent>
          </Dialog>
        </div>

        <AgencyStats agencies={agencies} />

        <Card>
          <CardHeader>
            <CardTitle>Liste des Agences</CardTitle>
            <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une agence..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Gestionnaire</TableHead>
                  <TableHead>Employés</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.manager}</TableCell>
                    <TableCell>{agency.employeeCount}</TableCell>
                    <TableCell>{agency.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedAgency(agency)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingAgency(agency)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Cela supprimera définitivement l'agence
                                et toutes les données associées.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDeleteAgency(agency)}
                              >
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
                Page {currentPage} sur {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editingAgency} onOpenChange={(open) => !open && setEditingAgency(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Modifier l'agence</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'agence ci-dessous
            </DialogDescription>
          </DialogHeader>
          {editingAgency && (
            <AgencyForm 
              agency={editingAgency} 
              onSubmit={handleUpdateAgency}
            />
          )}
        </DialogContent>
      </Dialog>

      <AgencyDetailsDialog 
        agency={selectedAgency}
        open={!!selectedAgency}
        onOpenChange={(open) => !open && setSelectedAgency(null)}
      />
    </DashboardLayout>
  );
}

export default Agencies;
