import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Users } from "lucide-react";
import { useState } from "react";

const mockClients = [
  { 
    id: 1, 
    name: "Jean Dupont", 
    region: "Nord", 
    orders: 12, 
    status: "Actif",
    volume: "150000",
    pendingOrders: 2,
    mostOrdered: "Aliments volaille",
    orderFrequency: "Hebdomadaire",
    agency: "Agence Nord"
  },
  { 
    id: 2, 
    name: "Marie Martin", 
    region: "Sud", 
    orders: 8, 
    status: "Actif",
    volume: "80000",
    pendingOrders: 1,
    mostOrdered: "Aliments bétail",
    orderFrequency: "Mensuel",
    agency: "Agence Sud"
  },
  { 
    id: 3, 
    name: "Pierre Durant", 
    region: "Est", 
    orders: 15, 
    status: "Inactif",
    volume: "200000",
    pendingOrders: 0,
    mostOrdered: "Aliments volaille",
    orderFrequency: "Hebdomadaire",
    agency: "Agence Est"
  },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="mt-2 text-gray-600">Gérez vos comptes clients et leurs informations</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Nouveau Client
            </Button>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Région</TableHead>
                  <TableHead>Agence</TableHead>
                  <TableHead>Volume d'Affaires</TableHead>
                  <TableHead>Commandes en Attente</TableHead>
                  <TableHead>Produit le + Commandé</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClients
                  .filter(client => 
                    client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (filterRegion ? client.region === filterRegion : true)
                  )
                  .map((client) => (
                    <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.region}</TableCell>
                      <TableCell>{client.agency}</TableCell>
                      <TableCell>{parseInt(client.volume).toLocaleString()} F</TableCell>
                      <TableCell>{client.pendingOrders}</TableCell>
                      <TableCell>{client.mostOrdered}</TableCell>
                      <TableCell>{client.orderFrequency}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === "Actif" ? "success" : "secondary"}>
                          {client.status}
                        </Badge>
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