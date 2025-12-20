import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import News from "./pages/News";
import Activities from "./pages/Activities";
import Games from "./pages/Games";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "@/components/admin/AdminLayout";
import WarriorList from "@/pages/admin/warriors/WarriorList";
import WarriorForm from "@/pages/admin/warriors/WarriorForm";
import WarriorDetail from "@/pages/admin/warriors/WarriorDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" duration={1000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/news" element={<News />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/games" element={<Games />} />
          <Route path="/contact" element={<Contact />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div className="text-2xl font-bold">Chào mừng bạn đến với Bảng quản trị</div>} />
            <Route path="warriors" element={<WarriorList />} />
            <Route path="warriors/new" element={<WarriorForm />} />
            <Route path="warriors/:id" element={<WarriorForm />} />
            <Route path="warriors/:id/detail" element={<WarriorDetail />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
