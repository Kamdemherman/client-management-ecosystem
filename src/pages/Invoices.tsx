import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { useToast } from "@/hooks/use-toast";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatus";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Invoice } from "@/types/invoice";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const mockInvoices: Invoice[] = [
  { 
    id: "INV001",
    invoiceNumber: "FAC-2402-001",
    client: "Jean Dupont",
    date: "2024-02-20",
    amount: "1500",
    paymentStatus: "pending",
    products: [
      { id: "P1", name: "Aliment A", quantity: 2, price: 750 }
    ]
  },
  { 
    id: "INV002",
    invoiceNumber: "FAC-2402-002",
    client: "Marie Martin",
    date: "2024-02-19",
    amount: "2300",
    paymentStatus: "paid",
    products: [
      { id: "P2", name: "Aliment B", quantity: 3, price: 766.67 }
    ]
  }
];

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const handleCreateInvoice = (formData: FormData) => {
    const newInvoice: Invoice = {
      id: `INV${(invoices.length + 1).toString().padStart(3, '0')}`,
      invoiceNumber: formData.get("invoiceNumber") as string,
      client: formData.get("client") as string,
      date: formData.get("date") as string,
      amount: formData.get("amount") as string,
      paymentStatus: "pending",
      products: JSON.parse(formData.get("products") as string)
    };

    setInvoices([...invoices, newInvoice]);
    toast({
      title: "Facture créée",
      description: "La nouvelle facture a été créée avec succès."
    });
  };

  const handleUpdateInvoice = (formData: FormData) => {
    if (!editingInvoice) return;

    const updatedInvoices = invoices.map(invoice => {
      if (invoice.id === editingInvoice.id) {
        return {
          ...invoice,
          client: formData.get("client") as string,
          date: formData.get("date") as string,
          amount: formData.get("amount") as string,
          products: JSON.parse(formData.get("products") as string)
        };
      }
      return invoice;
    });

    setInvoices(updatedInvoices);
    setEditingInvoice(null);
    toast({
      title: "Facture mise à jour",
      description: "La facture a été mise à jour avec succès."
    });
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    toast({
      title: "Facture supprimée",
      description: "La facture a été supprimée avec succès."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Factures</h1>
            <p className="mt-2 text-gray-600">Gérez vos factures et paiements</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle Facture
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle facture</DialogTitle>
              </DialogHeader>
              <InvoiceForm onSubmit={handleCreateInvoice} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Factures</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{format(new Date(invoice.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{invoice.amount}€</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={invoice.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingInvoice(invoice)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                              <DialogTitle>Modifier la facture</DialogTitle>
                            </DialogHeader>
                            <InvoiceForm 
                              invoice={editingInvoice} 
                              onSubmit={handleUpdateInvoice} 
                            />
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <InvoicePreview
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      />
    </DashboardLayout>
  );
};

export default Invoices;