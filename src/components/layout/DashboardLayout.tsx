import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Home, Users, Building2, ShoppingCart, Package, FileText, MessageSquare, LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: Building2, label: "Agences", path: "/agencies" },
    { icon: ShoppingCart, label: "Commandes", path: "/orders" },
    { icon: Package, label: "Stock", path: "/inventory" },
    { icon: FileText, label: "Factures", path: "/invoices" },
    { icon: MessageSquare, label: "Plaintes", path: "/complaints" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarContent>
            <div className="px-3 py-4">
              <div className="mb-10">
                <h1 className="text-2xl font-bold text-primary">AgriManager</h1>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex items-center w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <button className="flex items-center w-full px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200">
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <SidebarTrigger />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};