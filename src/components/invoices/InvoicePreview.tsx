
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatus";
import type { Invoice } from "@/types/invoice";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { invoiceService } from "@/services/api/invoice.service";

interface InvoicePreviewProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvoicePreview = ({ invoice, open, onOpenChange }: InvoicePreviewProps) => {
  const { toast } = useToast();
  
  if (!invoice) return null;

  const handleSendEmail = async () => {
    try {
      // Appel API pour envoyer l'email
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

  const handleDownload = async () => {
    try {
      const blob = await invoiceService.generatePDF(invoice.id);
      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(blob);
      // Créer un lien temporaire
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture-${invoice.invoiceNumber}.pdf`);
      // Simuler un clic
      document.body.appendChild(link);
      link.click();
      // Nettoyer
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Facture {invoice.invoiceNumber}</span>
            <PaymentStatusBadge status={invoice.paymentStatus} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 p-6">
          {/* En-tête de la facture */}
          <div className="flex justify-between">
            <div>
              <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
              <div className="mt-4">
                <h3 className="font-semibold">Votre Entreprise</h3>
                <p className="text-sm text-gray-600">123 Rue de l'Entreprise</p>
                <p className="text-sm text-gray-600">75000 Paris</p>
                <p className="text-sm text-gray-600">contact@entreprise.com</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date: {format(new Date(invoice.date), "dd MMMM yyyy", { locale: fr })}</p>
              <p className="text-sm text-gray-600">N° Facture: {invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Informations client */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Facturé à:</h3>
            <p className="text-sm">{invoice.client}</p>
          </div>

          {/* Tableau des produits */}
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
                {invoice.products.map((product, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2 text-right">{product.quantity}</td>
                    <td className="px-4 py-2 text-right">{product.price.toFixed(2)}€</td>
                    <td className="px-4 py-2 text-right">{(product.price * product.quantity).toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleSendEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Envoyer par email
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
