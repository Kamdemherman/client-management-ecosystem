import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceGeneratorProps {
  orderId: string;
  clientName: string;
  amount: string;
  date: string;
}

export const InvoiceGenerator = ({ orderId, clientName, amount, date }: InvoiceGeneratorProps) => {
  const { toast } = useToast();

  const handleGenerateInvoice = () => {
    // Simulation de la génération de facture
    toast({
      title: "Facture générée",
      description: `La facture pour la commande ${orderId} a été générée avec succès.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Détails de la facture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="text-sm">{clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Montant</p>
              <p className="text-sm">{amount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-sm">{date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">N° Commande</p>
              <p className="text-sm">{orderId}</p>
            </div>
          </div>
          <Button 
            onClick={handleGenerateInvoice}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Générer la facture
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};