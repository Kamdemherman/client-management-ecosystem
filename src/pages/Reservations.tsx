
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReservationCalendar } from "@/components/reservations/ReservationCalendar";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationsService } from "@/services/reservations.service";
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { User, Package, Plus, Calendar, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Reservation } from "@/types/reservation";

const Reservations = () => {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: reservationsService.getAll
  });

  const deleteMutation = useMutation({
    mutationFn: reservationsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès."
      });
      setIsDeleteDialogOpen(false);
      setSelectedReservation(null);
    }
  });

  // Get the most recent 5 reservations
  const recentReservations = [...reservations]
    .sort((a, b) => {
      // Handle createdAt dates safely
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmée":
        return "bg-blue-100 text-blue-800";
      case "Annulée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Safe date formatter that handles invalid dates
  const formatSafeDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Date non spécifiée";
    
    try {
      // Check if the date string is valid before formatting
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return "Date invalide";
      }
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Date invalide";
    }
  };
  
  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsFormDialogOpen(true);
  };
  
  const handleDelete = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDeleteDialogOpen(true);
  };
  
  const handleFormSuccess = () => {
    setIsFormDialogOpen(false);
    setSelectedReservation(null);
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
            <p className="mt-2 text-gray-600">Planifiez et gérez les réservations</p>
          </div>
          <Button onClick={() => setIsFormDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Réservation
          </Button>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Réservations récentes</CardTitle>
              <Calendar className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReservations.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune réservation récente</p>
                ) : (
                  recentReservations.map(reservation => (
                    <div key={reservation.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatSafeDate(reservation.reservation_date)}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(reservation)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(reservation)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{reservation.clientName || "Client inconnu"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>{reservation.productName || "Produit inconnu"} - {reservation.quantity || 0} unités</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <ReservationCalendar />
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedReservation ? "Modifier la réservation" : "Nouvelle réservation"}</DialogTitle>
          </DialogHeader>
          <ReservationForm 
            reservation={selectedReservation} 
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedReservation && deleteMutation.mutate(selectedReservation.id)}
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

export default Reservations;
