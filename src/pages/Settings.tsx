
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingService } from "@/services/api/setting.service";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: generalSettings = {} } = useQuery({
    queryKey: ['settings', 'general'],
    queryFn: () => settingService.getByGroup('general')
  });

  const { data: notificationSettings = {} } = useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: () => settingService.getByGroup('notifications')
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string, value: any }) => 
      settingService.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été mis à jour avec succès.",
      });
    }
  });

  const handleSave = (key: string, value: any) => {
    updateMutation.mutate({ key, value });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Paramètres</h1>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Généraux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input
                    id="company-name"
                    value={generalSettings.companyName || ""}
                    onChange={(e) => handleSave("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email de contact</Label>
                  <Input
                    id="email"
                    type="email"
                    value={generalSettings.email || ""}
                    onChange={(e) => handleSave("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Input
                    id="currency"
                    value={generalSettings.currency || ""}
                    onChange={(e) => handleSave("currency", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat">Taux de TVA (%)</Label>
                  <Input
                    id="vat"
                    type="number"
                    value={generalSettings.vatRate || ""}
                    onChange={(e) => handleSave("vatRate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery">Délai de livraison (jours)</Label>
                  <Input
                    id="delivery"
                    type="number"
                    value={generalSettings.deliveryDelay || ""}
                    onChange={(e) => handleSave("deliveryDelay", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications || false}
                    onCheckedChange={(checked) => handleSave("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                  <Switch
                    id="sms-notifications"
                    checked={notificationSettings.smsNotifications || false}
                    onCheckedChange={(checked) => handleSave("smsNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Personnalisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleSave("logo", reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Couleur principale</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={generalSettings.primaryColor || "#000000"}
                    onChange={(e) => handleSave("primaryColor", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
