
import React, { useState } from 'react';
import { PlusIcon, MicIcon } from 'lucide-react';
import Header from '@/components/Header';
import ReminderList from '@/components/ReminderList';
import ReminderInput from '@/components/ReminderInput';
import VoiceInput from '@/components/VoiceInput';
import { Button } from '@/components/ui/button';
import AnimatedTransition from '@/components/AnimatedTransition';
import { ReminderProvider } from '@/context/ReminderContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const isMobile = useIsMobile();
  
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
        
        <main className="pt-20 sm:pt-24 px-4 sm:px-6">
          <AnimatedTransition animation="fade" delay={100}>
            <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-2">
                Arlo Alert
              </h1>
              <p className="text-center text-muted-foreground text-base sm:text-lg">
                Smart reminders for your daily life
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
              <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-2">
                <Button 
                  size={isMobile ? "default" : "lg"} 
                  onClick={() => setShowInput(true)}
                  className="px-4 py-2 sm:px-6 gap-2 subtle-shadow"
                >
                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add Reminder
                </Button>

                <Button
                  size={isMobile ? "default" : "lg"}
                  variant="secondary"
                  onClick={openVoiceModal}
                  className="px-4 py-2 gap-2 subtle-shadow"
                >
                  <MicIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {!isMobile && "Voice"}
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
