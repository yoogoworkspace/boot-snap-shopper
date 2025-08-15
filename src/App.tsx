
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Sizes from "./pages/Sizes";
import Models from "./pages/Models";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Order from "./pages/Order";
import NotFound from "./pages/NotFound";
import GlobalAd from "./GlobalAd";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/bootbucket">
          <Layout>
            <GlobalAd />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sizes/:category" element={<Sizes />} />
              <Route path="/models/:category/:size" element={<Models />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/order/:orderId" element={<Order />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <GlobalAd />
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
