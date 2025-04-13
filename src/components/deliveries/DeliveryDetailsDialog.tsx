
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Delivery } from "@/types/delivery";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Truck, Calendar, User, ClipboardList } from "lucide-react";

interface DeliveryDetailsDialogProps {
  delivery: Delivery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeliveryDetailsDialog({ delivery, open, onOpenChange }: DeliveryDetailsDialogProps) {
  if (!delivery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Livraison #{delivery.id}</span>
            <span 
              className={`px-2 py-1 text-xs rounded-full font-medium
                ${delivery.status === "En attente" ? "bg-yellow-100 text-yellow-800" : 
                 delivery.status === "En cours" ? "bg-blue-100 text-blue-800" : 
                 delivery.status === "Livrée" ? "bg-green-100 text-green-800" :
                 "bg-red-100 text-red-800"}`}
            >
              {delivery.status}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-500">Client</p>
              <p className="font-medium">{delivery.clientName}</p>
            </div>
          </div>

          {delivery.orderId && (
            <div className="flex items-start gap-3">
              <ClipboardList className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-500">Commande associée</p>
                <p className="font-medium">#{delivery.orderId}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-500">Adresse de livraison</p>
              <p className="font-medium">{delivery.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-500">Date prévue</p>
              <p className="font-medium">
                {format(new Date(delivery.scheduledDate), "dd MMMM yyyy", { locale: fr })}
              </p>
            </div>
          </div>

          {delivery.deliveryDate && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-500">Date de livraison effective</p>
                <p className="font-medium">
                  {format(new Date(delivery.deliveryDate), "dd MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>
          )}

          {delivery.driver && (
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-500">Chauffeur</p>
                <p className="font-medium">{delivery.driver}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-gray-500">Agence responsable</p>
              <p className="font-medium">{delivery.agencyName}</p>
            </div>
          </div>

          {delivery.notes && (
            <div className="flex items-start gap-3">
              <ClipboardList className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-500">Notes</p>
                <p className="font-medium">{delivery.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
