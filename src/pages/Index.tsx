
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ReminderInput from '@/components/ReminderInput';
import ReminderList from '@/components/ReminderList';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useReminders } from '@/context/ReminderContext';
import { useNavigate } from 'react-router-dom';
import { BellIcon, CalendarIcon, MailIcon, MessageSquareIcon } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const Index = () => {
  const { user } = useAuth();
  const { hasCompletedOnboarding, isLoading } = useReminders();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const startOnboarding = () => {
    navigate('/onboarding');
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-20 sm:pt-24 px-4 sm:px-6 pb-24">
        {user && !hasCompletedOnboarding && !isLoading && (
          <AnimatedTransition animation="slide-up" delay={100}>
            <div className="max-w-3xl mx-auto mb-8 p-6 glass-card rounded-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <BellIcon className="w-6 h-6 text-amber-500" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-medium mb-2">Complete Setup to Unlock Full Potential</h2>
                  <p className="text-muted-foreground mb-4">
                    Connect your calendars, emails, and messages to get personalized reminders instead of example data.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      <span>Calendar Integration</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MailIcon className="w-4 h-4 text-primary" />
                      <span>Email Scanning</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquareIcon className="w-4 h-4 text-primary" />
                      <span>Message Detection</span>
                    </div>
                  </div>
                  
                  <Button onClick={startOnboarding}>Complete Setup</Button>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        )}
        
        <ReminderInput />
        <div className="mt-8">
          <ReminderList />
        </div>
      </main>
    </div>
  );
};

export default Index;
