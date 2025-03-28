
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  source: 'text' | 'voice' | 'email' | 'message' | 'location';
  contextType?: string;
}

interface NewReminder {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  source: 'text' | 'voice' | 'email' | 'message' | 'location';
  contextType?: string;
}

interface ReminderContextType {
  reminders: Reminder[];
  addReminder: (reminderData: NewReminder) => void;
  completeReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  updateReminder: (id: string, reminderData: Partial<Reminder>) => void;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

// Generate example reminders for initial state
const generateExampleReminders = (): Reminder[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return [
    {
      id: '1',
      title: 'Review project proposal',
      description: 'Go through the project proposal and provide feedback to the team',
      completed: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
      dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 3), // Due in 3 hours
      priority: 'high',
      source: 'email',
      contextType: 'work',
    },
    {
      id: '2',
      title: 'Schedule doctor appointment',
      description: 'Call Dr. Smith to schedule annual check-up',
      completed: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
      dueDate: tomorrow,
      priority: 'medium',
      source: 'text',
      contextType: 'personal',
    },
    {
      id: '3',
      title: 'Pick up groceries',
      description: 'Get milk, eggs, bread, and vegetables',
      completed: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 48), // 2 days ago
      dueDate: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
      priority: 'low',
      source: 'location',
      contextType: 'errands',
    },
    {
      id: '4',
      title: 'Team meeting',
      description: 'Weekly sync with product team',
      completed: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      dueDate: tomorrow,
      priority: 'high',
      source: 'message',
      contextType: 'meeting',
    },
    {
      id: '5',
      title: 'Pay credit card bill',
      completed: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      dueDate: nextWeek,
      priority: 'medium',
      source: 'text',
      contextType: 'finance',
    },
  ];
};

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding
      const onboardingCompleted = user.user_metadata?.onboarding_completed || false;
      setHasCompletedOnboarding(onboardingCompleted);
      
      if (onboardingCompleted) {
        // For now, we'll simulate loading real data
        setIsLoading(true);
        fetchRemindersFromIntegrations();
      } else {
        // Use example data for users who haven't completed onboarding
        setReminders(generateExampleReminders());
        setIsLoading(false);
      }
    } else {
      // Use example data for users who aren't logged in
      setReminders(generateExampleReminders());
      setIsLoading(false);
    }
  }, [user]);

  const fetchRemindersFromIntegrations = async () => {
    try {
      // Simulate fetching real data from connected services
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demonstration purposes, we'll simulate having read real reminders
      // In a real implementation, this would make API calls to the user's connected services
      
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      // These would actually come from the user's email, calendar, etc.
      const realReminders: Reminder[] = [
        {
          id: 'email-1',
          title: 'Dentist Appointment',
          description: 'Annual check-up with Dr. Johnson at Smile Dental',
          completed: false,
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          dueDate: tomorrow,
          priority: 'medium',
          source: 'email',
          contextType: 'health',
        },
        {
          id: 'calendar-1',
          title: 'Team Standup Meeting',
          description: 'Daily standup with the engineering team',
          completed: false,
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
          dueDate: new Date(now.getTime() + 1000 * 60 * 60), // In 1 hour
          priority: 'high',
          source: 'text',
          contextType: 'work',
        },
        {
          id: 'sms-1',
          title: 'Package Delivery',
          description: 'Your package will be delivered today between 2-4 PM',
          completed: false,
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3), // 3 hours ago
          dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 3), // In 3 hours
          priority: 'medium',
          source: 'message',
          contextType: 'personal',
        },
        {
          id: 'location-1',
          title: 'Pick up dry cleaning',
          description: 'At Sparkle Cleaners on Main St',
          completed: false,
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          dueDate: tomorrow,
          priority: 'low',
          source: 'location',
          contextType: 'errands',
        },
        {
          id: 'email-2',
          title: 'Flight check-in',
          description: 'Check in for your flight to San Francisco',
          completed: false,
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12), // 12 hours ago
          dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 24), // In 24 hours
          priority: 'high',
          source: 'email',
          contextType: 'travel',
        },
      ];
      
      setReminders(realReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load your reminders');
      // Fallback to example data
      setReminders(generateExampleReminders());
    } finally {
      setIsLoading(false);
    }
  };

  const addReminder = (reminderData: NewReminder) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: reminderData.title,
      description: reminderData.description,
      completed: false,
      createdAt: new Date(),
      dueDate: reminderData.dueDate,
      priority: reminderData.priority,
      source: reminderData.source,
      contextType: reminderData.contextType,
    };

    setReminders((prevReminders) => [newReminder, ...prevReminders]);
    toast.success('Reminder added successfully');
  };

  const completeReminder = (id: string) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    );

    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      const action = reminder.completed ? 'uncompleted' : 'completed';
      toast.success(`Reminder ${action}`);
    }
  };

  const deleteReminder = (id: string) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
    toast.success('Reminder deleted');
  };

  const updateReminder = (id: string, reminderData: Partial<Reminder>) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, ...reminderData } : reminder
      )
    );
    toast.success('Reminder updated');
  };

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        addReminder,
        completeReminder,
        deleteReminder,
        updateReminder,
        isLoading,
        hasCompletedOnboarding
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
