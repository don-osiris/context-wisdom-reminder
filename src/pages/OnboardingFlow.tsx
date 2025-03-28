
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MailIcon, 
  CalendarIcon, 
  BellIcon, 
  MessageSquareIcon, 
  MapPinIcon, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface IntegrationStatus {
  gmail: boolean;
  outlook: boolean;
  googleCalendar: boolean;
  outlookCalendar: boolean;
  sms: boolean;
  notifications: boolean;
  location: boolean;
}

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    gmail: false,
    outlook: false,
    googleCalendar: false,
    outlookCalendar: false,
    sms: false,
    notifications: false,
    location: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/onboarding' } });
    }
  }, [user, navigate]);

  // Calculate progress
  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Handle connecting services (simulated)
  const handleConnect = async (service: keyof IntegrationStatus) => {
    setIsLoading(true);
    
    // Simulate API call for service connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIntegrations(prev => ({
      ...prev,
      [service]: true
    }));
    
    setIsLoading(false);
    toast.success(`Connected to ${service} successfully!`);
    
    // Save integration status to user metadata
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: {
          integrations: {
            ...user.user_metadata?.integrations,
            [service]: true
          }
        }
      });
      
      if (error) {
        console.error('Error saving integration status:', error);
      }
    }
  };

  // Check if current step is completed
  const isStepCompleted = () => {
    switch (currentStep) {
      case 0: // Welcome screen
        return true;
      case 1: // Email connections
        return integrations.gmail || integrations.outlook;
      case 2: // Calendar connections
        return integrations.googleCalendar || integrations.outlookCalendar;
      case 3: // Permissions
        return integrations.sms && integrations.notifications && integrations.location;
      case 4: // Completion
        return true;
      default:
        return false;
    }
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Complete onboarding and navigate to home
  const completeOnboarding = async () => {
    setIsLoading(true);
    
    // Mark onboarding as completed in user metadata
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: {
          onboarding_completed: true
        }
      });
      
      if (error) {
        console.error('Error saving onboarding status:', error);
      }
    }
    
    toast.success('Setup complete! Welcome to Arlo Alert');
    navigate('/home');
  };

  // Skip onboarding
  const skipOnboarding = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BellIcon className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-medium">Arlo Alert</h1>
        </div>
        
        {currentStep < totalSteps - 1 && (
          <Button variant="ghost" size="sm" onClick={skipOnboarding}>
            Skip Setup
          </Button>
        )}
      </header>
      
      <div className="px-4 py-2">
        <Progress value={progress} className="h-1" />
      </div>
      
      <main className="flex-1 flex flex-col px-6 py-8 max-w-3xl mx-auto w-full">
        <AnimatedTransition animation="fade" className="flex-1 flex flex-col">
          {currentStep === 0 && (
            <div className="text-center flex flex-col items-center justify-center flex-1 gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <BellIcon className="h-10 w-10 text-primary" />
              </div>
              
              <h1 className="text-3xl font-bold">Welcome to Arlo Alert</h1>
              
              <p className="text-muted-foreground max-w-md">
                Let's set up your reminder assistant to work with your emails, calendars, and messages to deliver personalized, timely reminders.
              </p>
              
              <div className="mt-4 space-y-4 max-w-md w-full">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Personalized reminders</h3>
                    <p className="text-sm text-muted-foreground">Arlo will learn your preferences and priorities</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Appointment detection</h3>
                    <p className="text-sm text-muted-foreground">Automatically identify appointments from emails and messages</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Smart scheduling</h3>
                    <p className="text-sm text-muted-foreground">Find the best times for reminders based on your calendar</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-2">Connect Your Email</h2>
              <p className="text-muted-foreground mb-8">
                Arlo needs access to your emails to identify appointments and create reminders automatically.
              </p>
              
              <div className="space-y-6 flex-1">
                <div className="glass-card p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${integrations.gmail ? 'bg-green-500/10' : 'bg-primary/10'} flex items-center justify-center`}>
                        <MailIcon className={`h-6 w-6 ${integrations.gmail ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Gmail</h3>
                        <p className="text-sm text-muted-foreground mb-2">Connect your personal Gmail account</p>
                        
                        {integrations.gmail && (
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Connected
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant={integrations.gmail ? "outline" : "default"}
                      onClick={() => handleConnect('gmail')}
                      disabled={isLoading || integrations.gmail}
                    >
                      {integrations.gmail ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${integrations.outlook ? 'bg-green-500/10' : 'bg-primary/10'} flex items-center justify-center`}>
                        <MailIcon className={`h-6 w-6 ${integrations.outlook ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Outlook</h3>
                        <p className="text-sm text-muted-foreground mb-2">Connect your work Outlook account</p>
                        
                        {integrations.outlook && (
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Connected
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant={integrations.outlook ? "outline" : "default"}
                      onClick={() => handleConnect('outlook')}
                      disabled={isLoading || integrations.outlook}
                    >
                      {integrations.outlook ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  You need to connect at least one email account to continue. Arlo will scan these accounts for appointment information.
                </p>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-2">Connect Your Calendars</h2>
              <p className="text-muted-foreground mb-8">
                Connecting your calendars helps Arlo suggest the best times for reminders and avoid scheduling conflicts.
              </p>
              
              <div className="space-y-6 flex-1">
                <div className="glass-card p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${integrations.googleCalendar ? 'bg-green-500/10' : 'bg-primary/10'} flex items-center justify-center`}>
                        <CalendarIcon className={`h-6 w-6 ${integrations.googleCalendar ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Google Calendar</h3>
                        <p className="text-sm text-muted-foreground mb-2">Connect your personal calendar</p>
                        
                        {integrations.googleCalendar && (
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Connected
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant={integrations.googleCalendar ? "outline" : "default"}
                      onClick={() => handleConnect('googleCalendar')}
                      disabled={isLoading || integrations.googleCalendar}
                    >
                      {integrations.googleCalendar ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${integrations.outlookCalendar ? 'bg-green-500/10' : 'bg-primary/10'} flex items-center justify-center`}>
                        <CalendarIcon className={`h-6 w-6 ${integrations.outlookCalendar ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Outlook Calendar</h3>
                        <p className="text-sm text-muted-foreground mb-2">Connect your work calendar</p>
                        
                        {integrations.outlookCalendar && (
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Connected
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant={integrations.outlookCalendar ? "outline" : "default"}
                      onClick={() => handleConnect('outlookCalendar')}
                      disabled={isLoading || integrations.outlookCalendar}
                    >
                      {integrations.outlookCalendar ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  You need to connect at least one calendar to continue. Arlo will use your calendar to suggest optimal reminder times.
                </p>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="flex flex-col flex-1">
              <h2 className="text-2xl font-bold mb-2">Allow Necessary Permissions</h2>
              <p className="text-muted-foreground mb-8">
                Arlo needs these permissions to create smart, context-aware reminders for you.
              </p>
              
              <div className="space-y-6 flex-1">
                <div className="glass-card p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${integrations.notifications ? 'bg-green-500/10' : 'bg-primary/10'} flex items-center justify-center`}>
                        <BellIcon className={`h-6 w-6 ${integrations.notifications ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Notifications Access</h3>
                        <p className="text-sm text-muted-foreground mb-2">Allow scanning notifications for important events</p>
                        
                        {integrations.notifications && (
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Enabled
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant={integrations.notifications ? "outline" : "default"}
                      onClick={() => handleConnect('notifications')}
                      disabled={isLoading || integrations.notifications}
                    >
                      {integrations.notifications ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${integrations.sms ? 'bg-green-500/10' : 'bg-primary/10'} flex items-center justify-center`}>
                        <MessageSquareIcon className={`h-6 w-6 ${integrations.sms ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">SMS & Message Access</h3>
                        <p className="text-sm text-muted-foreground mb-2">Allow scanning messages for appointment details</p>
                        
                        {integrations.sms && (
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Enabled
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant={integrations.sms ? "outline" : "default"}
                      onClick={() => handleConnect('sms')}
                      disabled={isLoading || integrations.sms}
                    >
                      {integrations.sms ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${integrations.location ? 'bg-green-500/10' : 'bg-primary/10'} flex items-center justify-center`}>
                        <MapPinIcon className={`h-6 w-6 ${integrations.location ? 'text-green-500' : 'text-primary'}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Location Access</h3>
                        <p className="text-sm text-muted-foreground mb-2">Enable location-based reminders</p>
                        
                        {integrations.location && (
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Enabled
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant={integrations.location ? "outline" : "default"}
                      onClick={() => handleConnect('location')}
                      disabled={isLoading || integrations.location}
                    >
                      {integrations.location ? 'Enabled' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="text-center flex flex-col items-center justify-center flex-1 gap-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-bold">Setup Complete!</h1>
              
              <p className="text-muted-foreground max-w-md">
                Arlo is now set up to provide personalized reminders based on your emails, messages, calendar, and location.
              </p>
              
              <div className="mt-4 space-y-4 max-w-md w-full">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Arlo is analyzing your data</h3>
                    <p className="text-sm text-muted-foreground">Your reminders will appear shortly as Arlo processes your information</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <MessageSquareIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Try adding a reminder</h3>
                    <p className="text-sm text-muted-foreground">Use the voice or text input to add your first reminder</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatedTransition>
        
        <div className="flex justify-between mt-auto pt-8">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div> // Empty div to maintain flex layout
          )}
          
          <Button 
            onClick={nextStep} 
            disabled={!isStepCompleted() || isLoading}
            className="flex items-center gap-2"
          >
            {currentStep === totalSteps - 1 ? 'Get Started' : 'Continue'}
            {currentStep < totalSteps - 1 && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingFlow;
