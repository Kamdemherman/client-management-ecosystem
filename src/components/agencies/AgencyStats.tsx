import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, BadgeDollarSign, Flag } from "lucide-react";
import { Agency } from "@/types/agency";

interface AgencyStatsProps {
  agencies: Agency[];
}

export const AgencyStats = ({ agencies }: AgencyStatsProps) => {
  const totalAgencies = agencies.length;
  const activeAgencies = agencies.filter(a => a.status === "Actif").length;
  const totalEmployees = agencies.reduce((sum, agency) => sum + agency.employeeCount, 0);
  const totalComplaints = agencies.reduce((sum, agency) => sum + agency.complaints.total, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Agences</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAgencies}</div>
          <p className="text-xs text-muted-foreground">
            {activeAgencies} agences actives
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">
            Moyenne: {Math.round(totalEmployees / totalAgencies)} par agence
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
          <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {agencies.reduce((sum, agency) => sum + agency.revenue.yearly, 0).toLocaleString()}€
          </div>
          <p className="text-xs text-muted-foreground">
            Année en cours
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plaintes</CardTitle>
          <Flag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalComplaints}</div>
          <p className="text-xs text-muted-foreground">
            {agencies.reduce((sum, agency) => sum + agency.complaints.resolved, 0)} résolues
          </p>
        </CardContent>
      </Card>
    </div>
  );
};