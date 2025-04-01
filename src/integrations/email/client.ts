import nodemailer from 'nodemailer';

export class EmailClient {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: nodemailer.Attachment[];
  }) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        ...options,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendCalendarInvite(options: {
    to: string | string[];
    subject: string;
    text: string;
    html: string;
    eventDetails: {
      startTime: string;
      endTime: string;
      location?: string;
      description?: string;
    };
  }) {
    const icalEvent = this.generateICalEvent(options.eventDetails);
    
    const attachments = [{
      filename: 'event.ics',
      content: icalEvent,
    }];

    return this.sendEmail({
      ...options,
      attachments,
    });
  }

  private generateICalEvent(eventDetails: {
    startTime: string;
    endTime: string;
    location?: string;
    description?: string;
  }): string {
    const formatDate = (date: string) => {
      return date.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(eventDetails.startTime)}`,
      `DTEND:${formatDate(eventDetails.endTime)}`,
      eventDetails.location ? `LOCATION:${eventDetails.location}` : '',
      eventDetails.description ? `DESCRIPTION:${eventDetails.description}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');
  }
}

export const emailClient = new EmailClient(); 