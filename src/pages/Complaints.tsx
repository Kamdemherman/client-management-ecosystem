
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus } from "lucide-react";
import { ComplaintDialog } from "@/components/complaints/ComplaintDialog";
import { useToast } from "@/hooks/use-toast";
import { ComplaintStatus } from "@/types/complaint";
import { complaintService } from "@/services/api/complaint.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Complaints = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintService.getAll
  });

  const createMutation = useMutation({
    mutationFn: complaintService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast({
        title: "Plainte créée",
        description: "La nouvelle plainte a été enregistrée avec succès.",
      });
      setIsDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: ComplaintStatus }) => 
      complaintService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la plainte a été mis à jour avec succès.",
      });
    }
  });

  const handleStatusUpdate = (complaintId: number, newStatus: ComplaintStatus) => {
    updateMutation.mutate({ id: complaintId, status: newStatus });
  };

  const handleAddComplaint = (newComplaint: Omit<any, "id" | "date">) => {
    createMutation.mutate(newComplaint);
  };

  const getStatusBadgeVariant = (status: ComplaintStatus) => {
    switch (status) {
      case "En cours":
        return "secondary";
      case "Résolu":
        return "outline";
      case "En attente":
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Plaintes</h1>
            <p className="mt-2 text-gray-600">Suivez et gérez les plaintes clients</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Plainte
            </Button>
            <div className="p-3 bg-primary-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Plaintes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint: any) => (
                  <TableRow key={complaint.id}>
                    <TableCell>{complaint.client}</TableCell>
                    <TableCell>{complaint.date}</TableCell>
                    <TableCell>{complaint.subject}</TableCell>
                    <TableCell>{complaint.description}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setIsDialogOpen(true);
                          }}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(complaint.id, "Résolu")}
                          disabled={complaint.status === "Résolu"}
                        >
                          Marquer comme résolu
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ComplaintDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        complaint={selectedComplaint}
        onSubmit={handleAddComplaint}
        onStatusChange={handleStatusUpdate}
      />
    </DashboardLayout>
  );
};

export default Complaints;
