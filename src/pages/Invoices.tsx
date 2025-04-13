import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Pencil, Trash2, Eye, Mail, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { InvoicePreview } from "@/components/invoices/InvoicePreview";
import { useToast } from "@/hooks/use-toast";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatus";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Invoice } from "@/types/invoice";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "@/services/api/invoice.service";

const Invoices = () => {
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoiceService.getAll,
  });
  
  const invoices = Array.isArray(data) ? data : [];

  console.log("Invoices data after processing:", invoices);

  const createMutation = useMutation({
    mutationFn: invoiceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setIsNewDialogOpen(false);
      toast({
        title: "Facture créée",
        description: "La nouvelle facture a été créée avec succès."
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      invoiceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setEditingInvoice(null);
      toast({
        title: "Facture mise à jour",
        description: "La facture a été mise à jour avec succès."
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: invoiceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setDeleteDialogOpen(false);
      setSelectedInvoice(null);
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès."
      });
    },
  });

  const handleCreateInvoice = (formData: FormData) => {
    createMutation.mutate(formData);
  };

  const handleUpdateInvoice = (formData: FormData) => {
    if (!editingInvoice) return;
    updateMutation.mutate({ id: editingInvoice.id, data: formData });
  };

  const confirmDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      deleteMutation.mutate(selectedInvoice.id);
    }
  };

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      await invoiceService.sendEmail(invoice.id);
      toast({
        title: "Email envoyé",
        description: "La facture a été envoyée par email avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      const blob = await invoiceService.generatePDF(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture-${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "PDF généré",
        description: "La facture a été téléchargée avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive"
      });
    }
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-xl font-bold text-red-500">Erreur lors du chargement des factures</h3>
          <p className="text-gray-600">Veuillez réessayer plus tard</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Factures</h1>
            <p className="mt-2 text-gray-600">Gérez vos factures et paiements</p>
          </div>
          <Button className="gap-2" onClick={() => setIsNewDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Nouvelle Facture
          </Button>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucune facture trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber || 'N/A'}</TableCell>
                      <TableCell>{invoice.client || 'Client non défini'}</TableCell>
                      <TableCell>{format(new Date(invoice.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{invoice.amount}€</TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={invoice.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedInvoice(invoice)}
                            title="Aperçu"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingInvoice(invoice)}
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleSendEmail(invoice)}
                            title="Envoyer par email"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDownload(invoice)}
                            title="Télécharger PDF"
                          >
                            <Download className="w-4 h-4" />
                          </Button>

                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => confirmDelete(invoice)}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle facture</DialogTitle>
          </DialogHeader>
          <InvoiceForm onSubmit={handleCreateInvoice} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingInvoice} onOpenChange={(open) => !open && setEditingInvoice(null)}>
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

      <InvoicePreview
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
              onClick={handleDeleteInvoice}
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

export default Invoices;
