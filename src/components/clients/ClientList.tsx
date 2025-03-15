
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
}

export const ClientList = ({ clients, onView, onEdit, onDelete }: ClientListProps) => {
  // Helper function to safely display agency name
  const displayAgencyName = (agency: any): string => {
    if (!agency) return 'Non assigné';
    if (typeof agency === 'object' && agency !== null && agency.name) {
      return String(agency.name);
    }
    return String(agency);
  };

  // Helper function to safely format volume
  const formatVolume = (volume: string | number | undefined | null): string => {
    if (volume === null || volume === undefined || volume === '') return '0 F';
    const numValue = typeof volume === 'string' ? parseFloat(volume) : Number(volume);
    return isNaN(numValue) ? '0 F' : `${numValue.toLocaleString()} F`;
  };
  
  // Helper function to safely get initials
  const getInitials = (name: string | undefined | null): string => {
    if (!name) return 'CL';
    return name.substring(0, 2).toUpperCase();
  };

  // Helper function to safely get region
  const getRegion = (region: string | undefined | null): string => {
    if (!region) return 'Non spécifiée';
    return region === '' ? 'Non spécifiée' : region;
  };
  
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
              {client.name || 'Sans nom'}
            </TableCell>
            <TableCell>{client.phone || 'N/A'}</TableCell>
            <TableCell className="max-w-[200px] truncate" title={client.address}>
              {client.address || 'N/A'}
            </TableCell>
            <TableCell>{getRegion(client.region)}</TableCell>
            <TableCell>{displayAgencyName(client.agency)}</TableCell>
            <TableCell>{formatVolume(client.volume)}</TableCell>
            <TableCell>{client.pendingOrders || 0}</TableCell>
            <TableCell>
              <Badge variant={client.status === "Actif" ? "default" : "secondary"}>
                {client.status || 'Inconnu'}
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
