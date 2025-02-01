import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Invoice {
  id: string;
  client: string;
  date: string;
  amount: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const mockInvoices: Invoice[] = [
  { 
    id: "INV001", 
    client: "Jean Dupont", 
    date: "2024-02-20", 
    amount: "1500€",
    products: [
      { id: "P1", name: "Aliment A", quantity: 2, price: 750 }
    ]
  },
  { 
    id: "INV002", 
    client: "Marie Martin", 
    date: "2024-02-19", 
    amount: "2300€",
    products: [
      { id: "P2", name: "Aliment B", quantity: 3, price: 766.67 }
    ]
  }
];

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const handleCreateInvoice = (formData: FormData) => {
    const newInvoice: Invoice = {
      id: `INV${(invoices.length + 1).toString().padStart(3, '0')}`,
      client: formData.get("client") as string,
      date: new Date().toISOString().split('T')[0],
      amount: `${formData.get("amount")}€`,
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
          amount: `${formData.get("amount")}€`,
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
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
    </DashboardLayout>
  );
};

export default Invoices;