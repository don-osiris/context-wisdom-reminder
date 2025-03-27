
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  const [reminders, setReminders] = useState<Reminder[]>(generateExampleReminders());

  useEffect(() => {
    // In a real app, we would load reminders from storage here
    // For example:
    // const savedReminders = localStorage.getItem('reminders');
    // if (savedReminders) {
    //   try {
    //     const parsedReminders = JSON.parse(savedReminders);
    //     // Need to convert string dates back to Date objects
    //     const processedReminders = parsedReminders.map((r: any) => ({
    //       ...r,
    //       createdAt: new Date(r.createdAt),
    //       dueDate: r.dueDate ? new Date(r.dueDate) : undefined,
    //     }));
    //     setReminders(processedReminders);
    //   } catch (error) {
    //     console.error('Failed to parse saved reminders', error);
    //   }
    // }
  }, []);

  useEffect(() => {
    // In a real app, we would save reminders to storage here
    // localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

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
