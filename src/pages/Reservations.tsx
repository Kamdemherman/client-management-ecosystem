import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReservationCalendar } from "@/components/reservations/ReservationCalendar";

const Reservations = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Réservations</h1>
            <p className="mt-2 text-gray-600">Planifiez et gérez les réservations</p>
          </div>
        </div>
        <ReservationCalendar />
      </div>
    </DashboardLayout>
  );
};

export default Reservations;