
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Client } from "@/types/client";

interface ClientListProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  isLoading?: boolean;
}

export const ClientList = ({ clients, onView, onEdit, onDelete, isLoading = false }: ClientListProps) => {
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const formatAgency = (agency: any): string => {
    if (!agency) return "Non spécifié";
    if (typeof agency === "object" && agency !== null) {
      return agency.name || String(agency) || "Non spécifié";
    }
    return String(agency) || "Non spécifié";
  };
  
  const formatCurrency = (value: string | number): string => {
    if (!value) return "0 F";
    const numValue = typeof value === "string" ? parseInt(value, 10) : value;
    return isNaN(numValue) ? "0 F" : `${numValue.toLocaleString()} F`;
  };

  if (isLoading) {
    return <div className="py-10 text-center">Chargement des clients...</div>;
  }

  if (!clients || clients.length === 0) {
    return <div className="py-10 text-center">Aucun client trouvé</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Adresse</TableHead>
          <TableHead>Région</TableHead>
          <TableHead>Agence</TableHead>
          <TableHead>Volume d'Affaires</TableHead>
          <TableHead>Commandes en Attente</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={client.avatar} />
                <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
              </Avatar>
              {client.name || "Client sans nom"}
            </TableCell>
            <TableCell>{client.phone || "Non spécifié"}</TableCell>
            <TableCell className="max-w-[200px] truncate" title={client.address}>
              {client.address || "Non spécifié"}
            </TableCell>
            <TableCell>{client.region || "Non spécifié"}</TableCell>
            <TableCell>{formatAgency(client.agency)}</TableCell>
            <TableCell>{formatCurrency(client.volume)}</TableCell>
            <TableCell>{client.pendingOrders || 0}</TableCell>
            <TableCell>
              <Badge variant={client.status === "Actif" ? "default" : "secondary"}>
                {client.status || "Indéfini"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onView(client)}
                  title="Voir détails"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(client)}
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(client)}
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
