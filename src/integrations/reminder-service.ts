import { calendarClient } from './calendar/client';
import { emailClient } from './email/client';

export class ReminderService {
  async createReminder(options: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    attendees: string[];
    location?: string;
  }) {
    try {
      // Create calendar event
      const calendarEvent = await calendarClient.createEvent({
        summary: options.title,
        description: options.description,
        startTime: options.startTime,
        endTime: options.endTime,
        attendees: options.attendees,
      });

      // Send calendar invite email
      await emailClient.sendCalendarInvite({
        to: options.attendees,
        subject: `Calendar Invite: ${options.title}`,
        text: options.description,
        html: `
          <h1>${options.title}</h1>
          <p>${options.description}</p>
          <p><strong>Start Time:</strong> ${new Date(options.startTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> ${new Date(options.endTime).toLocaleString()}</p>
          ${options.location ? `<p><strong>Location:</strong> ${options.location}</p>` : ''}
        `,
        eventDetails: {
          startTime: options.startTime,
          endTime: options.endTime,
          location: options.location,
          description: options.description,
        },
      });

      return calendarEvent;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  async listReminders(startTime: string, endTime: string) {
    try {
      return await calendarClient.listEvents(startTime, endTime);
    } catch (error) {
      console.error('Error listing reminders:', error);
      throw error;
    }
  }

  async deleteReminder(eventId: string) {
    try {
      await calendarClient.deleteEvent(eventId);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  async sendEmailReminder(options: {
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
  }) {
    try {
      return await emailClient.sendEmail(options);
    } catch (error) {
      console.error('Error sending email reminder:', error);
      throw error;
    }
  }
}

export const reminderService = new ReminderService(); 