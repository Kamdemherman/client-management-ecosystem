
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null;
  
  // Parse items from JSON string if needed
  let items = [];
  try {
    if (typeof order.items === 'string') {
      items = JSON.parse(order.items);
    } else {
      items = order.items;
    }
  } catch (error) {
    console.error("Failed to parse order items:", error);
    items = [];
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Commande #{order.id}</span>
            <span className={`px-2 py-1 text-xs rounded-full 
              ${order.status === "En attente" ? "bg-yellow-100 text-yellow-800" : 
               order.status === "En cours" ? "bg-blue-100 text-blue-800" : 
               "bg-green-100 text-green-800"}`}>
              {order.status}
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[600px]">
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Client</p>
                <p className="text-base font-semibold">{order.client}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-base font-semibold">
                  {format(new Date(order.date), "dd MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Articles</p>
              {items && items.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Produit</th>
                        <th className="px-4 py-2 text-right">Quantité</th>
                        <th className="px-4 py-2 text-right">Prix unitaire</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{item.price?.toFixed(2) || '0.00'}€</td>
                          <td className="px-4 py-2 text-right">
                            {((item.price || 0) * (item.quantity || 1)).toFixed(2)}€
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun article défini</p>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <p className="text-base font-medium">Total</p>
              <p className="text-xl font-bold">{order.total}€</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
