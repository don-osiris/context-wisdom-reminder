
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { PlusIcon, XIcon, CalendarIcon, ClockIcon, ArrowUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useReminders } from '@/context/ReminderContext';

interface ReminderInputProps {
  className?: string;
  onVoiceInputStart?: () => void;
}

const ReminderInput: React.FC<ReminderInputProps> = ({ 
  className,
  onVoiceInputStart
}) => {
  const { addReminder } = useReminders();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const [contextType, setContextType] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    let dueDate: Date | undefined = undefined;
    
    if (date) {
      dueDate = new Date(date);
      
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        dueDate.setHours(hours, minutes);
      }
    }
    
    addReminder({
      title,
      description: description || undefined,
      dueDate,
      priority,
      source: 'text',
      contextType,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setDate(undefined);
    setTime('');
    setPriority(undefined);
    setContextType(undefined);
    setIsExpanded(false);
  };

  return (
    <div 
      className={cn(
        'w-full max-w-3xl mx-auto transition-all duration-300 ease-out',
        isExpanded ? 'glass-card p-4 rounded-xl' : '',
        className
      )}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-2">
          <div 
            className={cn(
              "flex-1 flex items-center overflow-hidden",
              !isExpanded && "glass-card py-3 px-4 rounded-xl"
            )}
          >
            {!isExpanded && (
              <Button
                size="icon"
                variant="ghost"
                type="button"
                className="h-8 w-8 mr-2 flex-shrink-0"
                onClick={() => setIsExpanded(true)}
              >
                <PlusIcon className="h-5 w-5" />
              </Button>
            )}
            
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new reminder..."
              className={cn(
                "flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8 bg-transparent",
                isExpanded ? "text-base" : "text-sm"
              )}
              onFocus={() => setIsExpanded(true)}
            />
            
            {isExpanded && (
              <Button
                size="icon"
                variant="ghost"
                type="button"
                className="h-8 w-8 ml-2 flex-shrink-0"
                onClick={() => setIsExpanded(false)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="space-y-4 animate-fade-in">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)"
              className="min-h-[100px] resize-none"
            />
            
            <div className="flex flex-wrap items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "gap-1.5",
                      date && "text-primary border-primary/30 bg-primary/5"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {date ? date.toLocaleDateString() : "Set date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-32"
                />
              </div>
              
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as any)}
              >
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={contextType}
                onValueChange={setContextType}
              >
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="errands">Errands</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={onVoiceInputStart}
                className="gap-2"
              >
                Use Voice
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
              
              <Button type="submit" className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Reminder
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReminderInput;
