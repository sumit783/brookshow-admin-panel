import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import VerifyArtists from "./pages/VerifyArtists";
import ArtistDetails from "./pages/ArtistDetails";
import PlannerDetails from "./pages/PlannerDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Transactions from "./pages/Transactions";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import WithdrawRequests from "./pages/WithdrawRequests";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import { AdminLayout } from "./components/layout/AdminLayout";
import { SpeedInsights } from "@vercel/speed-insights/react"
// Removed Reports and Settings imports as they don't exist yet

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SpeedInsights/>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AdminLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/artists" element={<VerifyArtists />} />
              <Route path="/artist/:id" element={<ArtistDetails />} />
              <Route path="/verify-planners/:id" element={<PlannerDetails />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:id" element={<BookingDetails />} />
              <Route path="/withdrawals" element={<WithdrawRequests />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
