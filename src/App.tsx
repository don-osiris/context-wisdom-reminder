
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ReminderProvider } from "@/context/ReminderContext";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import OnboardingFlow from "./pages/OnboardingFlow";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PermissionsGuidePage from "./pages/PermissionsGuidePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ReminderProvider>
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/home" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/permissions" element={<PermissionsGuidePage />} />
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ReminderProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
