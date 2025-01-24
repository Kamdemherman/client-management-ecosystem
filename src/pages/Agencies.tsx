import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Building2, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Agency } from "@/types/agency";
import { AgencyStats } from "@/components/agencies/AgencyStats";
import { AgencyForm } from "@/components/agencies/AgencyForm";
import { AgencyDetailsDialog } from "@/components/agencies/AgencyDetailsDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockAgencies: Agency[] = [
  {
    id: 1,
    name: "Agence Paris",
    location: "Paris",
    manager: "Jean Martin",
    managerEmail: "jean.martin@example.com",
    phone: "+33123456789",
    address: "123 Rue de Paris, 75001 Paris",
    status: "Actif",
    revenue: {
      weekly: 15000,
      monthly: 60000,
      quarterly: 180000,
      yearly: 720000
    },
    complaints: {
      total: 25,
      resolved: 20,
      pending: 5
    },
    employeeCount: 15,
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    name: "Agence Lyon",
    location: "Lyon",
    manager: "Marie Dubois",
    managerEmail: "marie.dubois@example.com",
    phone: "+33123456790",
    address: "456 Rue de Lyon, 69001 Lyon",
    status: "Actif",
    revenue: {
      weekly: 12000,
      monthly: 48000,
      quarterly: 144000,
      yearly: 576000
    },
    complaints: {
      total: 18,
      resolved: 15,
      pending: 3
    },
    employeeCount: 12,
    createdAt: "2024-01-15"
  }
];

const ITEMS_PER_PAGE = 5;

export default function Agencies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleCreateAgency = (formData: FormData) => {
    toast({
      title: "Agence créée",
      description: "La nouvelle agence a été créée avec succès.",
    });
  };

  const handleUpdateAgency = (formData: FormData) => {
    if (editingAgency) {
      toast({
        title: "Agence mise à jour",
        description: "Les informations de l'agence ont été mises à jour avec succès.",
      });
      setEditingAgency(null);
    }
  };

  const handleDeleteAgency = (agency: Agency) => {
    toast({
      title: "Agence supprimée",
      description: "L'agence a été supprimée avec succès.",
    });
  };

  const filteredAgencies = mockAgencies.filter(agency => 
    agency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgencies.length / ITEMS_PER_PAGE);
  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

        <AgencyStats agencies={mockAgencies} />

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
