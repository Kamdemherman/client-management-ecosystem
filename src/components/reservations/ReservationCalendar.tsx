import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Reservation {
  id: string;
  date: Date;
  clientName: string;
  productName: string;
  quantity: number;
  status: "pending" | "confirmed" | "completed";
}

export const ReservationCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [clientName, setClientName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const { toast } = useToast();

  // Mock data pour les réservations
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      date: new Date(),
      clientName: "Jean Dupont",
      productName: "Produit A",
      quantity: 5,
      status: "pending"
    }
  ]);

  const handleAddReservation = () => {
    if (!selectedDate || !clientName || !productName || !quantity) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDate,
      clientName,
      productName,
      quantity: parseInt(quantity),
      status: "pending"
    };

    setReservations([...reservations, newReservation]);
    setIsDialogOpen(false);
    resetForm();

    toast({
      title: "Réservation ajoutée",
      description: `Réservation pour ${clientName} le ${format(selectedDate, 'dd/MM/yyyy')}`,
    });
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setClientName("");
    setProductName("");
    setQuantity("");
  };

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Calendrier des réservations</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réservation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une réservation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : "Sélectionner une date"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <Input
                  placeholder="Nom du client"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Produit</label>
                <Select value={productName} onValueChange={setProductName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produit A">Produit A</SelectItem>
                    <SelectItem value="Produit B">Produit B</SelectItem>
                    <SelectItem value="Produit C">Produit C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantité</label>
                <Input
                  type="number"
                  placeholder="Quantité"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleAddReservation}>
                Ajouter la réservation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={fr}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Réservations du jour</h3>
            <div className="space-y-2">
              {reservations
                .filter(res => date && format(res.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                .map(reservation => (
                  <div
                    key={reservation.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{reservation.clientName}</span>
                      <Badge variant="outline" className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{reservation.productName} - {reservation.quantity} unités</p>
                      <p>{format(reservation.date, 'HH:mm')}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );