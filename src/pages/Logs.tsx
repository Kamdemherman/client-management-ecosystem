import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { Log, LogType, LogAction, LogModule } from "@/types/log";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Logs = () => {
  const [logs] = useState<Log[]>([
    {
      id: "1",
      type: "info",
      action: "login",
      module: "users",
      message: "Connexion utilisateur",
      userId: "1",
      userName: "John Doe",
      agencyId: "1",
      agencyName: "Agence Paris",
      createdAt: new Date(),
    },
    {
      id: "2",
      type: "success",
      action: "create",
      module: "inventory",
      message: "Nouveau produit ajouté",
      userId: "1",
      userName: "John Doe",
      agencyId: "1",
      agencyName: "Agence Paris",
      createdAt: new Date(),
    },
  ]);

  const [filters, setFilters] = useState({
    type: "",
    action: "",
    module: "",
    search: "",
  });

  const getLogTypeColor = (type: LogType) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "warning";
      case "success":
        return "success";
      default:
        return "default";
    }
  };

  const handleExport = () => {
    // Pour l'instant, juste un message console
    console.log("Export des logs...");
  };

  const filteredLogs = logs.filter((log) => {
    if (filters.type && log.type !== filters.type) return false;
    if (filters.action && log.action !== filters.action) return false;
    if (filters.module && log.module !== filters.module) return false;
    if (filters.search && !log.message.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Logs du Système</h1>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={filters.action}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, action: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les actions</SelectItem>
                    <SelectItem value="login">Connexion</SelectItem>
                    <SelectItem value="create">Création</SelectItem>
                    <SelectItem value="update">Modification</SelectItem>
                    <SelectItem value="delete">Suppression</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={filters.module}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, module: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les modules</SelectItem>
                    <SelectItem value="users">Utilisateurs</SelectItem>
                    <SelectItem value="inventory">Stock</SelectItem>
                    <SelectItem value="orders">Commandes</SelectItem>
                    <SelectItem value="complaints">Plaintes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input
                  placeholder="Rechercher..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Agence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{format(log.createdAt, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                <TableCell>
                  <Badge variant={getLogTypeColor(log.type)}>{log.type}</Badge>
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.module}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.userName}</TableCell>
                <TableCell>{log.agencyName || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Logs;