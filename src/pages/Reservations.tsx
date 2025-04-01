
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReservationCalendar } from "@/components/reservations/ReservationCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { reservationsService } from "@/services/reservations.service";
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { User, Package } from "lucide-react";

const Reservations = () => {
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations'],
    queryFn: reservationsService.getAll
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
  const formatSafeDate = (dateString: string) => {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
            <p className="mt-2 text-gray-600">Planifiez et gérez les réservations</p>
          </div>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
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
                          <Badge variant="outline" className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {reservation.reservation_date ? formatSafeDate(reservation.reservation_date) : "Date non spécifiée"}
                          </span>
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
    </DashboardLayout>
  );
};

export default Reservations;
