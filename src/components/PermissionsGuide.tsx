
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  BellIcon, 
  CalendarIcon, 
  MessageSquareIcon, 
  MicIcon, 
  MapPinIcon, 
  CameraIcon, 
  ClockIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AnimatedTransition from './AnimatedTransition';

interface PermissionsGuideProps {
  className?: string;
  onClose?: () => void;
}

interface PermissionItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

const PermissionsGuide: React.FC<PermissionsGuideProps> = ({ className, onClose }) => {
  const permissionItems: PermissionItemProps[] = [
    {
      title: "Notification Access",
      description: "Allows Arlo Alert to read notification content",
      icon: <BellIcon className="w-6 h-6" />,
      benefits: [
        "Creates reminders from appointment notifications",
        "Extracts dates and times from alerts",
        "Detects cancellations or rescheduling"
      ]
    },
    {
      title: "Calendar Access",
      description: "Allows Arlo Alert to read and create calendar events",
      icon: <CalendarIcon className="w-6 h-6" />,
      benefits: [
        "Syncs with multiple calendars (Google, Outlook)",
        "Prevents scheduling conflicts",
        "Creates calendar events from reminders"
      ]
    },
    {
      title: "Messages Access",
      description: "Allows Arlo Alert to scan SMS and messaging apps",
      icon: <MessageSquareIcon className="w-6 h-6" />,
      benefits: [
        "Creates reminders from SMS appointment confirmations",
        "Extracts event details from messaging apps",
        "Identifies important deadlines in messages"
      ]
    },
    {
      title: "Microphone Access",
      description: "Allows voice input for creating reminders",
      icon: <MicIcon className="w-6 h-6" />,
      benefits: [
        "Create reminders hands-free with voice",
        "Transcribes voice notes into reminders",
        "Identifies key information from speech"
      ]
    },
    {
      title: "Location Access",
      description: "Enables location-based reminders",
      icon: <MapPinIcon className="w-6 h-6" />,
      benefits: [
        "Reminds you when near specific locations",
        "Suggests reminders based on regular locations",
        "Estimates travel time to appointments"
      ]
    },
    {
      title: "Camera Access",
      description: "Allows scanning documents and QR codes",
      icon: <CameraIcon className="w-6 h-6" />,
      benefits: [
        "Scan physical appointment cards",
        "Extract information from documents",
        "Scan QR codes for event details"
      ]
    },
    {
      title: "Background Processing",
      description: "Allows Arlo Alert to work when app is closed",
      icon: <ClockIcon className="w-6 h-6" />,
      benefits: [
        "Updates reminders even when app is closed",
        "Syncs data in the background",
        "Sends timely notifications"
      ]
    }
  ];

  return (
    <div className={cn("space-y-6 max-w-3xl mx-auto", className)}>
      <AnimatedTransition animation="slide-up" delay={100}>
        <div className="glass-card rounded-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Permissions Guide</h2>
            <p className="text-muted-foreground">
              Arlo Alert needs certain permissions to provide smart reminder features.
              Here's why each permission matters:
            </p>
          </div>
          
          <div className="space-y-6">
            {permissionItems.map((item, index) => (
              <React.Fragment key={item.title}>
                {index > 0 && <Separator className="my-6" />}
                <PermissionItem {...item} />
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              All permissions can be managed in your device settings at any time.
              We respect your privacy and only use these permissions for the features described.
            </p>
            
            {onClose && (
              <Button onClick={onClose} className="px-8">
                Got It
              </Button>
            )}
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

const PermissionItem: React.FC<PermissionItemProps> = ({
  title,
  description,
  icon,
  benefits
}) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {React.cloneElement(icon as React.ReactElement, {
          className: "text-primary"
        })}
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        
        <ul className="mt-2 space-y-1">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PermissionsGuide;
