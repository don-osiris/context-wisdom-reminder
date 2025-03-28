
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BellIcon, CheckIcon } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/login');
    }
  };

  const skipOnboarding = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="pt-6 px-4 flex justify-end">
        <Button variant="ghost" onClick={skipOnboarding} className="text-sm">
          Skip
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-16 h-16 mb-8 rounded-full bg-primary/10 flex items-center justify-center">
          <BellIcon className="w-8 h-8 text-primary" />
        </div>

        {step === 1 && (
          <AnimatedTransition animation="fade" className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Welcome to Arlo Alert</h1>
            <p className="text-muted-foreground mb-8">
              Your intelligent reminder assistant that adapts to your life and priorities
            </p>
            
            <div className="mb-10 flex flex-col gap-4">
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
                  <CheckIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Context Awareness</h3>
                  <p className="text-sm text-muted-foreground">Intelligently schedules based on your activity</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
                  <CheckIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Voice & Text</h3>
                  <p className="text-sm text-muted-foreground">Add reminders however you prefer</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
                  <CheckIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Smart Learning</h3>
                  <p className="text-sm text-muted-foreground">Adapts to your habits and preferences</p>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        )}

        {step === 2 && (
          <AnimatedTransition animation="fade" className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Tailored to You</h1>
            <p className="text-muted-foreground mb-8">
              Arlo Alert learns from your patterns to deliver reminders when they're most useful
            </p>
            
            <div className="w-full max-w-sm mx-auto p-4 border rounded-lg glass-card mb-8">
              <div className="mb-3 text-sm font-medium text-left">Suggested based on your patterns:</div>
              <div className="flex flex-col gap-2">
                <div className="py-2 px-3 rounded-md bg-background/50 text-left">Meeting prep at 9:45 AM</div>
                <div className="py-2 px-3 rounded-md bg-background/50 text-left">Lunch break reminder at 1:00 PM</div>
                <div className="py-2 px-3 rounded-md bg-background/50 text-left">Call Mom when you get home</div>
              </div>
            </div>
          </AnimatedTransition>
        )}

        {step === 3 && (
          <AnimatedTransition animation="fade" className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Ready to Get Started?</h1>
            <p className="text-muted-foreground mb-8">
              Create an account to save your preferences and reminders across devices
            </p>
            
            <div className="flex flex-col gap-4 mb-8 max-w-xs mx-auto">
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
                  <CheckIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Cloud Sync</h3>
                  <p className="text-sm text-muted-foreground">Access your reminders from any device</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
                  <CheckIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Message Integration</h3>
                  <p className="text-sm text-muted-foreground">Connect your emails and messages</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <div className="mt-0.5 p-1.5 rounded-full bg-primary/10">
                  <CheckIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Location Awareness</h3>
                  <p className="text-sm text-muted-foreground">Get reminders at the right place</p>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        )}

        <div className="w-full max-w-md">
          <div className="flex justify-center items-center mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full mx-1 transition-all ${
                  index < step ? 'w-8 bg-primary' : 'w-4 bg-muted'
                }`}
              />
            ))}
          </div>
          
          <Button onClick={nextStep} className="w-full py-6">
            {step < totalSteps ? 'Continue' : 'Create Account'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
