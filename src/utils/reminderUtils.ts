
import { Reminder } from '@/context/ReminderContext';

// Extract text that appears to be a reminder
export const extractReminder = (text: string): {
  title: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  contextType?: string;
} => {
  let title = text;
  let dueDate: Date | undefined = undefined;
  let priority: 'low' | 'medium' | 'high' | undefined = undefined;
  let contextType: string | undefined = undefined;

  // Extract date patterns (very simplified)
  if (text.includes('tomorrow')) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    title = title.replace(/tomorrow/i, '').trim();
  } else if (text.includes('today')) {
    dueDate = new Date();
    title = title.replace(/today/i, '').trim();
  } else if (text.includes('next week')) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    title = title.replace(/next week/i, '').trim();
  }

  // Extract time patterns (very simplified)
  const timeMatch = text.match(/(at|by)\s+(\d{1,2})(:\d{2})?\s*(am|pm)?/i);
  if (timeMatch && dueDate) {
    const hours = parseInt(timeMatch[2]);
    const minutes = timeMatch[3] ? parseInt(timeMatch[3].replace(':', '')) : 0;
    const meridiem = timeMatch[4]?.toLowerCase();

    // Convert to 24-hour format
    let hour24 = hours;
    if (meridiem === 'pm' && hours < 12) {
      hour24 = hours + 12;
    } else if (meridiem === 'am' && hours === 12) {
      hour24 = 0;
    }

    dueDate.setHours(hour24, minutes, 0, 0);
    title = title.replace(timeMatch[0], '').trim();
  }

  // Extract priority patterns
  if (text.includes('urgent') || text.includes('important')) {
    priority = 'high';
    title = title.replace(/(urgent|important)/i, '').trim();
  } else if (text.includes('medium')) {
    priority = 'medium';
    title = title.replace(/medium/i, '').trim();
  } else if (text.includes('low')) {
    priority = 'low';
    title = title.replace(/low/i, '').trim();
  }

  // Extract context patterns
  const contextMatches = [
    { pattern: /work|office|job/i, type: 'work' },
    { pattern: /home|house/i, type: 'home' },
    { pattern: /shop|buy|purchase/i, type: 'shopping' },
    { pattern: /meet|meeting|appointment/i, type: 'meeting' },
    { pattern: /call|phone/i, type: 'call' },
    { pattern: /email|mail/i, type: 'email' },
  ];

  for (const match of contextMatches) {
    if (match.pattern.test(text)) {
      contextType = match.type;
      break;
    }
  }

  return {
    title,
    dueDate,
    priority,
    contextType,
  };
};

// Check if a reminder is overdue
export const isOverdue = (reminder: Reminder): boolean => {
  if (!reminder.dueDate || reminder.completed) return false;
  return new Date() > reminder.dueDate;
};

// Sort reminders by due date and priority
export const sortReminders = (reminders: Reminder[]): Reminder[] => {
  return [...reminders].sort((a, b) => {
    // First, sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by due date (if exists)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }

    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
    const aPriority = a.priority ? priorityOrder[a.priority] : priorityOrder.undefined;
    const bPriority = b.priority ? priorityOrder[b.priority] : priorityOrder.undefined;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Finally by creation date
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

// Group reminders by date
export const groupRemindersByDate = (reminders: Reminder[]): Record<string, Reminder[]> => {
  const groups: Record<string, Reminder[]> = {};

  reminders.forEach((reminder) => {
    if (!reminder.dueDate) {
      const noDateKey = 'No Date';
      if (!groups[noDateKey]) groups[noDateKey] = [];
      groups[noDateKey].push(reminder);
      return;
    }

    const dateKey = reminder.dueDate.toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(reminder);
  });

  return groups;
};

// Filter reminders by various criteria
export const filterReminders = (
  reminders: Reminder[],
  filters: {
    searchText?: string;
    priority?: 'low' | 'medium' | 'high';
    source?: 'text' | 'voice' | 'email' | 'message' | 'location';
    contextType?: string;
    includeCompleted?: boolean;
  }
): Reminder[] => {
  return reminders.filter((reminder) => {
    // Filter by completion status
    if (!filters.includeCompleted && reminder.completed) {
      return false;
    }

    // Filter by search text
    if (
      filters.searchText &&
      !reminder.title.toLowerCase().includes(filters.searchText.toLowerCase()) &&
      !(
        reminder.description &&
        reminder.description.toLowerCase().includes(filters.searchText.toLowerCase())
      )
    ) {
      return false;
    }

    // Filter by priority
    if (filters.priority && reminder.priority !== filters.priority) {
      return false;
    }

    // Filter by source
    if (filters.source && reminder.source !== filters.source) {
      return false;
    }

    // Filter by context type
    if (filters.contextType && reminder.contextType !== filters.contextType) {
      return false;
    }

    return true;
  });
};
