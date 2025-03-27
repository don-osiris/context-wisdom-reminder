
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CalendarIcon, 
  MailIcon, 
  MessageSquareIcon, 
  ArrowUpCircleIcon, 
  BellIcon 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReminderItem from './ReminderItem';
import AnimatedTransition from './AnimatedTransition';
import { useReminders } from '@/context/ReminderContext';

interface ReminderListProps {
  className?: string;
}

const ReminderList: React.FC<ReminderListProps> = ({ className }) => {
  const { reminders, completeReminder, deleteReminder } = useReminders();
  
  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);
  
  const todayReminders = activeReminders.filter(r => {
    if (!r.dueDate) return false;
    const today = new Date();
    return r.dueDate.toDateString() === today.toDateString();
  });
  
  const upcomingReminders = activeReminders.filter(r => {
    if (!r.dueDate) return true; // No date set
    const today = new Date();
    return r.dueDate.toDateString() !== today.toDateString();
  });

  return (
    <div className={cn('w-full max-w-3xl mx-auto', className)}>
      <Tabs defaultValue="today" className="w-full">
        <AnimatedTransition animation="slide-down" delay={100}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="today" className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Today</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center space-x-2">
              <ArrowUpCircleIcon className="w-4 h-4" />
              <span>Upcoming</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2">
              <BellIcon className="w-4 h-4" />
              <span>Completed</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <div className="flex space-x-0.5">
                <MailIcon className="w-4 h-4" />
                <MessageSquareIcon className="w-4 h-4 -ml-2" />
              </div>
              <span>All</span>
            </TabsTrigger>
          </TabsList>
        </AnimatedTransition>

        <TabsContent value="today" className="mt-0 space-y-1">
          {todayReminders.length === 0 ? (
            <EmptyState message="No reminders for today" />
          ) : (
            todayReminders.map((reminder, index) => (
              <AnimatedTransition key={reminder.id} animation="slide-up" delay={index * 50}>
                <ReminderItem
                  reminder={reminder}
                  onComplete={completeReminder}
                  onDelete={deleteReminder}
                />
              </AnimatedTransition>
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0 space-y-1">
          {upcomingReminders.length === 0 ? (
            <EmptyState message="No upcoming reminders" />
          ) : (
            upcomingReminders.map((reminder, index) => (
              <AnimatedTransition key={reminder.id} animation="slide-up" delay={index * 50}>
                <ReminderItem
                  reminder={reminder}
                  onComplete={completeReminder}
                  onDelete={deleteReminder}
                />
              </AnimatedTransition>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0 space-y-1">
          {completedReminders.length === 0 ? (
            <EmptyState message="No completed reminders" />
          ) : (
            completedReminders.map((reminder, index) => (
              <AnimatedTransition key={reminder.id} animation="slide-up" delay={index * 50}>
                <ReminderItem
                  reminder={reminder}
                  onComplete={completeReminder}
                  onDelete={deleteReminder}
                />
              </AnimatedTransition>
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-0 space-y-1">
          {reminders.length === 0 ? (
            <EmptyState message="No reminders found" />
          ) : (
            reminders.map((reminder, index) => (
              <AnimatedTransition key={reminder.id} animation="slide-up" delay={index * 50}>
                <ReminderItem
                  reminder={reminder}
                  onComplete={completeReminder}
                  onDelete={deleteReminder}
                />
              </AnimatedTransition>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <AnimatedTransition animation="fade" delay={100}>
    <div className="text-center py-10">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <CalendarIcon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-muted-foreground">{message}</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Add a new reminder using the input below
      </p>
    </div>
  </AnimatedTransition>
);

export default ReminderList;
