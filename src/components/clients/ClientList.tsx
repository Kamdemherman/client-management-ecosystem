
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
  return (
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
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={client.avatar} />
                <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {client.name}
            </TableCell>
            <TableCell>{client.region}</TableCell>
            <TableCell>{typeof client.agency === 'object' ? client.agency.name || String(client.agency) : client.agency}</TableCell>
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
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onView(client)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(client)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(client)}
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
