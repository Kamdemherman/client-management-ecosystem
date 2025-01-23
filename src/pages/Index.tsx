import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Building2, ShoppingCart, AlertCircle } from "lucide-react";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
];

const stats = [
  { 
    title: "Clients Total", 
    value: "1,234", 
    icon: Users,
    change: "+12%",
    changeType: "positive" 
  },
  { 
    title: "Agences", 
    value: "15", 
    icon: Building2,
    change: "+2",
    changeType: "positive" 
  },
  { 
    title: "Commandes", 
    value: "854", 
    icon: ShoppingCart,
    change: "+18%",
    changeType: "positive" 
  },
  { 
    title: "Plaintes", 
    value: "23", 
    icon: AlertCircle,
    change: "-5%",
    changeType: "negative" 
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="mt-2 text-gray-600">Bienvenue sur votre tableau de bord AgriManager</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.title === "Plaintes" ? "bg-red-100 text-red-600" : "bg-primary-100 text-primary-600"
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className={`mt-4 text-sm ${
                stat.changeType === "positive" ? "text-green-600" : "text-red-600"
              }`}>
                {stat.change} depuis le dernier mois
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Commandes</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4A6741" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;