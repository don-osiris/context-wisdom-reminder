import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export class CalendarClient {
  private auth: any;
  private calendar: any;

  constructor() {
    this.auth = null;
    this.calendar = null;
  }

  async initialize() {
    try {
      this.auth = await authenticate({
        keyfilePath: path.join(__dirname, 'credentials.json'),
        scopes: SCOPES,
      });
      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    } catch (error) {
      console.error('Error initializing calendar client:', error);
      throw error;
    }
  }

  async createEvent(event: {
    summary: string;
    description: string;
    startTime: string;
    endTime: string;
    attendees?: string[];
  }) {
    if (!this.calendar) {
      await this.initialize();
    }

    const calendarEvent = {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: event.endTime,
        timeZone: 'UTC',
      },
      attendees: event.attendees?.map(email => ({ email })),
    };

    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: calendarEvent,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async listEvents(timeMin: string, timeMax: string) {
    if (!this.calendar) {
      await this.initialize();
    }

    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items;
    } catch (error) {
      console.error('Error listing calendar events:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string) {
    if (!this.calendar) {
      await this.initialize();
    }

    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }
}

export const calendarClient = new CalendarClient(); 