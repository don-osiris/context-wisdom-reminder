
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import Header from '@/components/Header';
import ReminderList from '@/components/ReminderList';
import ReminderInput from '@/components/ReminderInput';
import VoiceInput from '@/components/VoiceInput';
import { Button } from '@/components/ui/button';
import AnimatedTransition from '@/components/AnimatedTransition';
import { ReminderProvider } from '@/context/ReminderContext';

const Index = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  
  const openVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };
  
  const closeVoiceModal = () => {
    setIsVoiceModalOpen(false);
  };
  
  return (
    <ReminderProvider>
      <div className="min-h-screen bg-background text-foreground pb-24">
        <Header onVoiceClick={openVoiceModal} />
        
        <main className="pt-24 px-6">
          <AnimatedTransition animation="fade" delay={100}>
            <div className="max-w-3xl mx-auto mb-8">
              <h1 className="text-4xl font-semibold tracking-tight text-center mb-2">
                Context-Aware <br /> Reminder Agent
              </h1>
              <p className="text-center text-muted-foreground text-lg">
                Intelligently schedules reminders based on context
              </p>
            </div>
          </AnimatedTransition>
          
          <ReminderList className="mb-8" />
          
          {showInput ? (
            <AnimatedTransition animation="slide-up">
              <ReminderInput onVoiceInputStart={openVoiceModal} />
            </AnimatedTransition>
          ) : (
            <AnimatedTransition animation="fade" delay={200}>
              <div className="fixed bottom-6 left-0 right-0 flex justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setShowInput(true)}
                  className="px-6 gap-2 subtle-shadow"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Reminder
                </Button>
              </div>
            </AnimatedTransition>
          )}
        </main>
        
        <VoiceInput isOpen={isVoiceModalOpen} onClose={closeVoiceModal} />
      </div>
    </ReminderProvider>
  );
};

export default Index;
