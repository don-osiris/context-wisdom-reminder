
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
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    // Check if app is running in Capacitor environment
    const isCapacitorApp = 
      window.navigator.userAgent.includes('capacitor') || 
      window.navigator.userAgent.includes('android');
    
    setIsCapacitor(isCapacitorApp);
    
    // Add a class to the body element for mobile-specific styling
    if (isCapacitorApp) {
      document.body.classList.add('capacitor-app');
      
      // Add additional padding for Android status bar
      const root = document.documentElement;
      root.style.setProperty('--app-padding-top', '28px');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" duration={3000} />
        <BrowserRouter>
          <AuthProvider>
            <ReminderProvider>
              <div className={isCapacitor ? 'capacitor-container' : ''}>
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
              </div>
            </ReminderProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
