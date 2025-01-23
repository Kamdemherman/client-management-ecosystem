import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Search, Users, Trash2, Edit, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  farmInfo: string;
  clientId: string;
  status: "Actif" | "Inactif";
  orders: number;
  avatar?: string;
  region: string;
  volume: string;
  pendingOrders: number;
  mostOrdered: string;
  orderFrequency: string;
  agency: string;
}

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

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const handleDeleteClient = (clientId: number) => {
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès.",
    });
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleUpdateClient = (updatedClient: Partial<Client>) => {
    if (editingClient) {
      const updated = { ...editingClient, ...updatedClient };
      // Ici, vous feriez normalement un appel API pour mettre à jour le client
      toast({
        title: "Client mis à jour",
        description: "Les informations du client ont été mises à jour avec succès.",
      });
      setEditingClient(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="mt-2 text-gray-600">Gérez vos comptes clients et leurs informations</p>
          </div>
          <div className="flex items-center gap-4">
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom et prénom</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="+1234567890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientId">Identifiant client</Label>
                      <Input id="clientId" placeholder="CLI001" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse postale</Label>
                    <Textarea id="address" placeholder="Adresse complète" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmInfo">Informations d'élevage</Label>
                    <Textarea 
                      id="farmInfo" 
                      placeholder="Type d'élevage, nombre d'animaux, etc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Statut</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="inactif">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe temporaire</Label>
                      <Input id="password" type="password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Photo de profil</Label>
                    <Input id="avatar" type="file" accept="image/*" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockClients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockClients.filter(client => client.status === "Actif").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes en Attente</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockClients.reduce((acc, client) => acc + client.pendingOrders, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volume d'Affaires Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockClients.reduce((acc, client) => acc + parseInt(client.volume), 0).toLocaleString()} F
              </div>
            </CardContent>
          </Card>
        </div>

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
                  <SelectItem value="">Toutes les régions</SelectItem>
                  <SelectItem value="Nord">Nord</SelectItem>
                  <SelectItem value="Sud">Sud</SelectItem>
                  <SelectItem value="Est">Est</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Région</TableHead>
                  <TableHead>Agence</TableHead>
                  <TableHead>Volume d'Affaires</TableHead>
                  <TableHead>Commandes en Attente</TableHead>
                  <TableHead>Produit le + Commandé</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClients
                  .filter(client => 
                    client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (filterRegion ? client.region === filterRegion : true)
                  )
                  .map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {client.name}
                      </TableCell>
                      <TableCell>{client.region}</TableCell>
                      <TableCell>{client.agency}</TableCell>
                      <TableCell>{parseInt(client.volume).toLocaleString()} F</TableCell>
                      <TableCell>{client.pendingOrders}</TableCell>
                      <TableCell>{client.mostOrdered}</TableCell>
                      <TableCell>{client.orderFrequency}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === "Actif" ? "default" : "secondary"}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedClient(client)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Dialog open={editingClient?.id === client.id} onOpenChange={(open) => !open && setEditingClient(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px]">
                              <DialogHeader>
                                <DialogTitle>Modifier le client</DialogTitle>
                                <DialogDescription>
                                  Modifiez les informations du client ci-dessous
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const updatedClient = {
                                  name: formData.get('name') as string,
                                  email: formData.get('email') as string,
                                  phone: formData.get('phone') as string,
                                  address: formData.get('address') as string,
                                  farmInfo: formData.get('farmInfo') as string,
                                  status: formData.get('status') as "Actif" | "Inactif",
                                };
                                handleUpdateClient(updatedClient);
                              }}>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-name">Nom et prénom</Label>
                                      <Input 
                                        id="edit-name" 
                                        name="name"
                                        defaultValue={editingClient?.name} 
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-email">Email</Label>
                                      <Input 
                                        id="edit-email" 
                                        name="email"
                                        type="email" 
                                        defaultValue={editingClient?.email} 
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-phone">Téléphone</Label>
                                      <Input 
                                        id="edit-phone" 
                                        name="phone"
                                        defaultValue={editingClient?.phone} 
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-clientId">Identifiant client</Label>
                                      <Input 
                                        id="edit-clientId" 
                                        defaultValue={editingClient?.clientId} 
                                        disabled 
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-address">Adresse postale</Label>
                                    <Textarea 
                                      id="edit-address" 
                                      name="address"
                                      defaultValue={editingClient?.address} 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-farmInfo">Informations d'élevage</Label>
                                    <Textarea 
                                      id="edit-farmInfo" 
                                      name="farmInfo"
                                      defaultValue={editingClient?.farmInfo}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Statut</Label>
                                      <Select name="status" defaultValue={editingClient?.status}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Actif">Actif</SelectItem>
                                          <SelectItem value="Inactif">Inactif</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-avatar">Photo de profil</Label>
                                      <Input id="edit-avatar" type="file" accept="image/*" />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Enregistrer les modifications</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
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
                                  onClick={() => handleDeleteClient(client.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clients;