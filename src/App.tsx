import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import Agencies from "./pages/Agencies";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import Complaints from "./pages/Complaints";
import Reservations from "./pages/Reservations";
import Deliveries from "./pages/Deliveries";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/complaints" element={<Complaints />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;