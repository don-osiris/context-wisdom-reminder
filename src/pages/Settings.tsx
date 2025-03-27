
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContextAwareSettings from '@/components/ContextAwareSettings';
import IntegrationSettings from '@/components/IntegrationSettings';
import AnimatedTransition from '@/components/AnimatedTransition';
import { ReminderProvider } from '@/context/ReminderContext';

const Settings = () => {
  const navigate = useNavigate();
  
  return (
    <ReminderProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="fixed top-0 left-0 right-0 z-40 py-4 px-6 glass shadow-sm">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-medium">Settings</h1>
              </div>
            </div>
          </div>
        </header>
        
        <main className="pt-24 px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <AnimatedTransition animation="slide-down" delay={100}>
              <Tabs defaultValue="context" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="context">Smart Features</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="context" className="mt-0">
                  <ContextAwareSettings />
                </TabsContent>
                
                <TabsContent value="integrations" className="mt-0">
                  <IntegrationSettings />
                </TabsContent>
              </Tabs>
            </AnimatedTransition>
          </div>
        </main>
      </div>
    </ReminderProvider>
  );
};

export default Settings;
