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

const mockClients: Client[] = [
  { 
    id: 1, 
    name: "Jean Dupont", 
    email: "jean@example.com",
    phone: "+1234567890",
    address: "123 Rue de Paris",
    farmInfo: "Élevage de volailles, 100 poules",
    clientId: "CLI001",
    status: "Actif",
    orders: 12, 
    volume: "150000",
    pendingOrders: 2,
    mostOrdered: "Aliments volaille",
    orderFrequency: "Hebdomadaire",
    agency: "Agence Nord",
    region: "Nord"
  },
  { 
    id: 2, 
    name: "Marie Martin", 
    email: "marie@example.com",
    phone: "+1234567891",
    address: "456 Avenue de Lyon",
    farmInfo: "Élevage de bétail, 50 vaches",
    clientId: "CLI002",
    status: "Actif",
    orders: 8, 
    volume: "80000",
    pendingOrders: 1,
    mostOrdered: "Aliments bétail",
    orderFrequency: "Mensuel",
    agency: "Agence Sud",
    region: "Sud"
  },
  { 
    id: 3, 
    name: "Pierre Durant", 
    email: "pierre@example.com",
    phone: "+1234567892",
    address: "789 Boulevard de Marseille",
    farmInfo: "Élevage de volailles, 200 poules",
    clientId: "CLI003",
    status: "Inactif",
    orders: 15, 
    volume: "200000",
    pendingOrders: 0,
    mostOrdered: "Aliments volaille",
    orderFrequency: "Hebdomadaire",
    agency: "Agence Est",
    region: "Est"
  },
];

const ITEMS_PER_PAGE = 5;

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleDeleteClient = (client: Client) => {
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès.",
    });
  };

  const handleUpdateClient = (formData: FormData) => {
    if (editingClient) {
      const updatedClient = {
        ...editingClient,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        farmInfo: formData.get('farmInfo') as string,
        status: formData.get('status') as "Actif" | "Inactif",
      };
      toast({
        title: "Client mis à jour",
        description: "Les informations du client ont été mises à jour avec succès.",
      });
      setEditingClient(null);
    }
  };

  const handleCreateClient = (formData: FormData) => {
    toast({
      title: "Client créé",
      description: "Le nouveau client a été créé avec succès.",
    });
  };

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterRegion === "all" || !filterRegion ? true : client.region === filterRegion)
  );

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

        <ClientStats clients={mockClients} />

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
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrer par région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  <SelectItem value="Nord">Nord</SelectItem>
                  <SelectItem value="Sud">Sud</SelectItem>
                  <SelectItem value="Est">Est</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ClientList 
              clients={paginatedClients}
              onView={setSelectedClient}
              onEdit={setEditingClient}
              onDelete={(client) => {
                handleDeleteClient(client);
              }}
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

      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le compte client
              et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
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

export default Clients;
