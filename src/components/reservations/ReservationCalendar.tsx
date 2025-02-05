
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { fr } from "date-fns/locale";
import { format, addDays } from "date-fns";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationsService } from "@/services/reservations.service";
import { clientsService } from "@/services/clients.service";
import { inventoryService } from "@/services/inventory.service";

const MAX_RESERVATIONS_PER_DAY = 5;

export const ReservationCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [clientName, setClientName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations'],
    queryFn: reservationsService.getAll
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: inventoryService.getAll
  });

  const createReservation = useMutation({
    mutationFn: reservationsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Réservation créée",
        description: "La réservation a été créée avec succès"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la réservation",
        variant: "destructive"
      });
    }
  });

  const getReservationsForDate = (date: Date) => {
    return reservations.filter(res => 
      format(new Date(res.reservationDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const findNextAvailableDate = (startDate: Date): Date => {
    let currentDate = startDate;
    let daysChecked = 0;
    
    while (daysChecked < 30) {
      const reservationsForDay = getReservationsForDate(currentDate);
      if (reservationsForDay.length < MAX_RESERVATIONS_PER_DAY) {
        return currentDate;
      }
      currentDate = addDays(currentDate, 1);
      daysChecked++;
    }
    
    return addDays(startDate, 1);
  };

  const handleAddReservation = () => {
    if (!selectedDate || !clientName || !productName || !quantity) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    const reservationsForDate = getReservationsForDate(selectedDate);
    
    if (reservationsForDate.length >= MAX_RESERVATIONS_PER_DAY) {
      const nextAvailableDate = findNextAvailableDate(addDays(selectedDate, 1));
      toast({
        title: "Jour saturé",
        description: `Le nombre maximum de réservations pour ce jour est atteint. Prochaine date disponible: ${format(nextAvailableDate, 'dd/MM/yyyy')}`,
        variant: "destructive"
      });
      setSelectedDate(nextAvailableDate);
      return;
    }

    const client = clients.find(c => c.name === clientName);
    const product = products.find(p => p.name === productName);

    if (!client || !product) {
      toast({
        title: "Erreur",
        description: "Client ou produit invalide",
        variant: "destructive"
      });
      return;
    }

    createReservation.mutate({
      clientId: client.id.toString(),
      clientName: client.name,
      productId: product.id.toString(),
      productName: product.name,
      quantity: parseInt(quantity),
      status: "En attente",
      reservationDate: format(selectedDate, 'yyyy-MM-dd'),
      deliveryDate: format(addDays(selectedDate, 1), 'yyyy-MM-dd'),
      agencyId: client.agency,
      agencyName: client.agency
    });
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setClientName("");
    setProductName("");
    setQuantity("");
  };

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
                    onClick={() => setSelectedDate(date || new Date())}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : "Sélectionner une date"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <Select value={clientName} onValueChange={setClientName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Produit</label>
                <Select value={productName} onValueChange={setProductName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name}
                      </SelectItem>
                    ))}
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
              onSelect={(newDate) => {
                setDate(newDate);
                setSelectedDate(newDate);
              }}
              locale={fr}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">
              Réservations du jour 
              ({date && getReservationsForDate(date).length}/{MAX_RESERVATIONS_PER_DAY})
            </h3>
            <div className="space-y-2">
              {date && getReservationsForDate(date).map(reservation => (
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
                    <p>{format(new Date(reservation.reservationDate), 'HH:mm')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
