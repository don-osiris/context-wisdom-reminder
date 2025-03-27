
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MicIcon, XIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useReminders } from '@/context/ReminderContext';
import { toast } from 'sonner';

interface VoiceInputProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ isOpen, onClose }) => {
  const { addReminder } = useReminders();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processingText, setProcessingText] = useState(false);
  
  // Mock speech recognition
  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setTranscript('');
      setProcessingText(false);
      return;
    }
    
    // In a real app, we would implement actual speech recognition here
    // For demo purposes, we'll simulate it
  }, [isOpen]);
  
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      
      // In a real app, this would come from the speech recognition API
      if (!transcript) {
        const mockTranscripts = [
          "Remind me to pick up groceries tomorrow at 5pm",
          "Set a meeting with the team on Friday at 10am",
          "Call mom this evening around 7",
          "Pay the electricity bill by the end of the week",
        ];
        
        // Randomly select one of the mock transcripts
        setTranscript(mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]);
      }
    } else {
      // Start recording
      setIsRecording(true);
      setTranscript('');
    }
  };
  
  const processVoiceInput = () => {
    if (!transcript) return;
    
    setProcessingText(true);
    
    // In a real app, we would send the transcript to an NLP service
    // to extract the reminder details (title, date, time, etc.)
    
    // For demo purposes, we'll simulate the processing
    setTimeout(() => {
      // Extract a simple title from the transcript
      const title = transcript;
      
      // Extract a potential date from common phrases
      let dueDate: Date | undefined = undefined;
      
      if (transcript.includes('tomorrow')) {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 1);
      } else if (transcript.includes('today')) {
        dueDate = new Date();
      } else if (transcript.includes('friday')) {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + ((5 - dueDate.getDay() + 7) % 7));
      }
      
      // Extract a potential time
      if (dueDate && transcript.includes('5pm')) {
        dueDate.setHours(17, 0, 0);
      } else if (dueDate && transcript.includes('10am')) {
        dueDate.setHours(10, 0, 0);
      } else if (dueDate && transcript.includes('7')) {
        dueDate.setHours(19, 0, 0);
      }
      
      // Determine priority based on content
      let priority: 'low' | 'medium' | 'high' | undefined = undefined;
      
      if (transcript.includes('important') || transcript.includes('urgent')) {
        priority = 'high';
      }
      
      // Add the reminder
      addReminder({
        title,
        dueDate,
        priority,
        source: 'voice',
      });
      
      toast.success("Voice reminder added successfully");
      
      // Reset and close
      setTranscript('');
      setProcessingText(false);
      onClose();
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-medium mb-2">Voice Input</h2>
            <p className="text-muted-foreground text-sm">
              Speak clearly to create a new reminder
            </p>
          </div>
          
          <div className={cn(
            "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6",
            isRecording 
              ? "bg-red-500/10 animate-pulse" 
              : "bg-primary/10"
          )}>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-16 w-16 rounded-full transition-all",
                isRecording 
                  ? "bg-red-500 text-white hover:bg-red-600 hover:text-white" 
                  : "bg-primary text-primary-foreground"
              )}
              onClick={toggleRecording}
            >
              {isRecording ? (
                <PauseIcon className="h-8 w-8" />
              ) : (
                <MicIcon className="h-8 w-8" />
              )}
            </Button>
          </div>
          
          {isRecording && (
            <div className="mb-6 text-center">
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-primary rounded-full animate-float"
                    style={{ 
                      height: `${Math.random() * 20 + 15}px`, 
                      animationDelay: `${i * 0.1}s` 
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Listening...</p>
            </div>
          )}
          
          {transcript && !isRecording && (
            <div className="mb-6">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-foreground">{transcript}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {transcript && !isRecording && !processingText && (
              <Button onClick={processVoiceInput}>
                Create Reminder
              </Button>
            )}
            
            {processingText && (
              <Button disabled className="gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                Processing
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceInput;
