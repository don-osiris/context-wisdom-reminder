
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircleIcon, 
  MailIcon, 
  MessageSquareIcon, 
  MapPinIcon, 
  BellIcon, 
  CalendarIcon, 
  TrashIcon 
} from 'lucide-react';
import { formatRelative } from 'date-fns';
import { format } from 'date-fns';
import { Reminder } from '@/context/ReminderContext';

interface ReminderItemProps {
  reminder: Reminder;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onComplete,
  onDelete,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const getReminderSourceIcon = () => {
    switch (reminder.source) {
      case 'email':
        return <MailIcon className="w-4 h-4 text-blue-500" />;
      case 'message':
        return <MessageSquareIcon className="w-4 h-4 text-green-500" />;
      case 'voice':
        return <BellIcon className="w-4 h-4 text-amber-500" />;
      case 'location':
        return <MapPinIcon className="w-4 h-4 text-rose-500" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else {
      return formatRelative(date, new Date());
    }
  };

  const priorityClasses = {
    high: 'border-l-4 border-rose-500',
    medium: 'border-l-4 border-amber-500',
    low: 'border-l-4 border-emerald-500',
    none: '',
  };

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg glass-card mb-3 transition-all-smooth',
        priorityClasses[reminder.priority || 'none'],
        reminder.completed ? 'opacity-70' : 'opacity-100',
        isHovered ? 'translate-x-2' : 'translate-x-0',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onComplete(reminder.id)}
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border transition-colors-smooth',
            reminder.completed 
              ? 'bg-primary border-primary' 
              : 'bg-transparent border-gray-300 hover:border-primary'
          )}
        >
          {reminder.completed && (
            <CheckCircleIcon className="w-5 h-5 text-white" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 
            className={cn(
              "font-medium text-base mb-1 truncate pr-8",
              reminder.completed && "line-through text-muted-foreground"
            )}
          >
            {reminder.title}
          </h3>
          
          {reminder.description && (
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
              {reminder.description}
            </p>
          )}
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              {getReminderSourceIcon()}
              <span className="capitalize">{reminder.source}</span>
            </div>
            
            {reminder.dueDate && (
              <div className="flex items-center space-x-1">
                <span>•</span>
                <span>{formatDate(reminder.dueDate)}</span>
              </div>
            )}
            
            {reminder.contextType && (
              <div className="flex items-center space-x-1">
                <span>•</span>
                <span className="capitalize">{reminder.contextType}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onDelete(reminder.id)}
        className={cn(
          'absolute top-4 right-4 p-1 rounded-full transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      >
        <TrashIcon className="w-4 h-4 text-muted-foreground hover:text-destructive" />
      </button>
    </div>
  );
};

export default ReminderItem;
