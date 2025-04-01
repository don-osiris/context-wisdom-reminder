
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  MailIcon, 
  MessageSquareIcon, 
  LinkIcon, 
  RefreshCcwIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  BellIcon,
  SmartphoneIcon,
  MapPinIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedTransition from './AnimatedTransition';

interface IntegrationSettingsProps {
  className?: string;
}

interface IntegrationItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  platform?: 'android' | 'ios' | 'web';
}

interface PermissionItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: () => void;
}

// Detect platform (simplified version)
const detectPlatform = (): 'android' | 'ios' | 'web' => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/android/i.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
  return 'web';
};

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ className }) => {
  // Platform detection
  const [platform, setPlatform] = useState<'android' | 'ios' | 'web'>('web');
  
  // Email integrations
  const [personalMailEnabled, setPersonalMailEnabled] = React.useState(false);
  const [workMailEnabled, setWorkMailEnabled] = React.useState(false);
  const [smsEnabled, setSmsEnabled] = React.useState(false);
  
  // Calendar integrations
  const [googleCalendarEnabled, setGoogleCalendarEnabled] = React.useState(false);
  const [outlookCalendarEnabled, setOutlookCalendarEnabled] = React.useState(false);
  
  // Message scanning
  const [smsScanning, setSmsScanning] = React.useState(false);
  const [whatsappScanning, setWhatsappScanning] = React.useState(false);
  const [telegramScanning, setTelegramScanning] = React.useState(false);
  
  // Permissions
  const [notificationsPermission, setNotificationsPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [backgroundSyncPermission, setBackgroundSyncPermission] = useState(false);
  
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);
  
  // Mock connect/disconnect functions with platform-specific behavior
  const handleConnect = (service: string) => {
    console.log(`Connecting to ${service} on ${platform}...`);
    
    // Android-specific permission request simulation
    if (platform === 'android') {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)), 
        {
          loading: `Requesting Android permission for ${service}...`,
          success: () => {
            if (service === 'personal-mail') {
              toast.info('Opening Gmail account selection');
              setTimeout(() => setPersonalMailEnabled(true), 1000);
            }
            else if (service === 'work-mail') {
              toast.info('Opening Outlook account selection');
              setTimeout(() => setWorkMailEnabled(true), 1000);
            }
            else if (service === 'sms') {
              toast.info('Requesting SMS permission');
              setTimeout(() => setSmsEnabled(true), 1000);
            }
            else if (service === 'google-calendar') {
              toast.info('Opening Google Calendar selection');
              setTimeout(() => setGoogleCalendarEnabled(true), 1000);
            }
            else if (service === 'outlook-calendar') {
              toast.info('Opening Outlook Calendar selection');
              setTimeout(() => setOutlookCalendarEnabled(true), 1000);
            }
            else if (service === 'sms-scanning') setSmsScanning(true);
            else if (service === 'whatsapp-scanning') setWhatsappScanning(true);
            else if (service === 'telegram-scanning') setTelegramScanning(true);
            
            return `Permission granted for ${service}`;
          },
          error: 'Permission denied. Please try again and approve the permission request.',
        }
      );
    } else {
      // Default behavior for other platforms
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1000)), 
        {
          loading: `Connecting to ${service}...`,
          success: () => {
            if (service === 'personal-mail') setPersonalMailEnabled(true);
            else if (service === 'work-mail') setWorkMailEnabled(true);
            else if (service === 'sms') setSmsEnabled(true);
            else if (service === 'google-calendar') setGoogleCalendarEnabled(true);
            else if (service === 'outlook-calendar') setOutlookCalendarEnabled(true);
            else if (service === 'sms-scanning') setSmsScanning(true);
            else if (service === 'whatsapp-scanning') setWhatsappScanning(true);
            else if (service === 'telegram-scanning') setTelegramScanning(true);
            
            return `Connected to ${service} successfully!`;
          },
          error: 'Connection failed. Please try again.',
        }
      );
    }
  };
  
  const handleDisconnect = (service: string) => {
    console.log(`Disconnecting from ${service}...`);
    
    // For demo, just toggle the state
    if (service === 'personal-mail') setPersonalMailEnabled(false);
    else if (service === 'work-mail') setWorkMailEnabled(false);
    else if (service === 'sms') setSmsEnabled(false);
    else if (service === 'google-calendar') setGoogleCalendarEnabled(false);
    else if (service === 'outlook-calendar') setOutlookCalendarEnabled(false);
    else if (service === 'sms-scanning') setSmsScanning(false);
    else if (service === 'whatsapp-scanning') setWhatsappScanning(false);
    else if (service === 'telegram-scanning') setTelegramScanning(false);
    
    toast.success(`Disconnected from ${service}`);
  };
  
  // Toggle permission functions with Android-specific behavior
  const togglePermission = (permission: string) => {
    console.log(`Toggling ${permission} permission on ${platform}...`);
    
    if (platform === 'android') {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1200)), 
        {
          loading: `Requesting Android permission for ${permission}...`,
          success: () => {
            if (permission === 'notifications') setNotificationsPermission(prev => !prev);
            else if (permission === 'location') setLocationPermission(prev => !prev);
            else if (permission === 'background-sync') setBackgroundSyncPermission(prev => !prev);
            
            const newState = permission === 'notifications' ? !notificationsPermission : 
                          permission === 'location' ? !locationPermission : 
                          !backgroundSyncPermission;
            
            return `${permission} permission ${newState ? 'enabled' : 'disabled'}`;
          },
          error: 'Permission denied. Please approve in Android settings.',
        }
      );
    } else {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 800)), 
        {
          loading: `Updating permission...`,
          success: () => {
            if (permission === 'notifications') setNotificationsPermission(prev => !prev);
            else if (permission === 'location') setLocationPermission(prev => !prev);
            else if (permission === 'background-sync') setBackgroundSyncPermission(prev => !prev);
            
            const newState = permission === 'notifications' ? !notificationsPermission : 
                          permission === 'location' ? !locationPermission : 
                          !backgroundSyncPermission;
            
            return `${permission} permission ${newState ? 'enabled' : 'disabled'}`;
          },
          error: 'Failed to update permission. Please try again.',
        }
      );
    }
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      {platform === 'android' && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <SmartphoneIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Android device detected. Native integration features available.
            </p>
          </div>
        </div>
      )}
      
      <AnimatedTransition animation="slide-up" delay={100}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="email-integrations">
            <AccordionTrigger className="glass-card rounded-lg px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MailIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-lg">Email Integrations</h3>
                  <p className="text-sm text-muted-foreground">Connect your email accounts for reminders</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="glass-card rounded-lg p-6 mt-2 space-y-6">
              <IntegrationItem
                title="Personal Email (Gmail)"
                description="Connect your personal Gmail account"
                icon={<MailIcon className="w-5 h-5" />}
                isConnected={personalMailEnabled}
                onConnect={() => handleConnect('personal-mail')}
                onDisconnect={() => handleDisconnect('personal-mail')}
                platform={platform}
              />
              
              <IntegrationItem
                title="Work Email (Outlook)"
                description="Connect your work email account"
                icon={<MailIcon className="w-5 h-5" />}
                isConnected={workMailEnabled}
                onConnect={() => handleConnect('work-mail')}
                onDisconnect={() => handleDisconnect('work-mail')}
                platform={platform}
              />
              
              <IntegrationItem
                title="SMS Messages"
                description="Connect your phone's SMS messages"
                icon={<MessageSquareIcon className="w-5 h-5" />}
                isConnected={smsEnabled}
                onConnect={() => handleConnect('sms')}
                onDisconnect={() => handleDisconnect('sms')}
                platform={platform}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="calendar-integrations" className="mt-4">
            <AccordionTrigger className="glass-card rounded-lg px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-lg">Calendar Integrations</h3>
                  <p className="text-sm text-muted-foreground">Connect your calendars for smarter scheduling</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="glass-card rounded-lg p-6 mt-2 space-y-6">
              <IntegrationItem
                title="Google Calendar"
                description="Connect your personal Google Calendar"
                icon={<CalendarIcon className="w-5 h-5" />}
                isConnected={googleCalendarEnabled}
                onConnect={() => handleConnect('google-calendar')}
                onDisconnect={() => handleDisconnect('google-calendar')}
                platform={platform}
              />
              
              <IntegrationItem
                title="Outlook Calendar"
                description="Connect your work Outlook Calendar"
                icon={<CalendarIcon className="w-5 h-5" />}
                isConnected={outlookCalendarEnabled}
                onConnect={() => handleConnect('outlook-calendar')}
                onDisconnect={() => handleDisconnect('outlook-calendar')}
                platform={platform}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="message-scanning" className="mt-4">
            <AccordionTrigger className="glass-card rounded-lg px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <SmartphoneIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-lg">Message Scanning</h3>
                  <p className="text-sm text-muted-foreground">Allow scanning of messages for automatic reminders</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="glass-card rounded-lg p-6 mt-2 space-y-6">
              <IntegrationItem
                title="SMS Scanning"
                description="Scan SMS messages for appointment reminders"
                icon={<MessageSquareIcon className="w-5 h-5" />}
                isConnected={smsScanning}
                onConnect={() => handleConnect('sms-scanning')}
                onDisconnect={() => handleDisconnect('sms-scanning')}
                platform={platform}
              />
              
              <IntegrationItem
                title="WhatsApp Scanning"
                description="Scan WhatsApp messages for important reminders"
                icon={<MessageSquareIcon className="w-5 h-5" />}
                isConnected={whatsappScanning}
                onConnect={() => handleConnect('whatsapp-scanning')}
                onDisconnect={() => handleDisconnect('whatsapp-scanning')}
                platform={platform}
              />
              
              <IntegrationItem
                title="Telegram Scanning"
                description="Scan Telegram messages for important reminders"
                icon={<MessageSquareIcon className="w-5 h-5" />}
                isConnected={telegramScanning}
                onConnect={() => handleConnect('telegram-scanning')}
                onDisconnect={() => handleDisconnect('telegram-scanning')}
                platform={platform}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </AnimatedTransition>
      
      <AnimatedTransition animation="slide-up" delay={200}>
        <div className="glass-card rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <RefreshCcwIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Sync Settings</h3>
              <p className="text-sm text-muted-foreground">Control how your data is synchronized</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <PermissionItem
              title="Auto Sync"
              description="Automatically sync data every 15 minutes"
              icon={<RefreshCcwIcon className="w-5 h-5" />}
              enabled={notificationsPermission}
              onToggle={() => togglePermission('notifications')}
            />
            
            <PermissionItem
              title="Background Sync"
              description="Allow syncing in background (uses more battery)"
              icon={<RefreshCcwIcon className="w-5 h-5" />}
              enabled={backgroundSyncPermission}
              onToggle={() => togglePermission('background-sync')}
            />
            
            <div className="pt-2">
              <Button variant="outline" className="w-full justify-center gap-2">
                <RefreshCcwIcon className="w-4 h-4" />
                Sync Now
              </Button>
            </div>
          </div>
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="slide-up" delay={300}>
        <div className="glass-card rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BellIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Permissions Guide</h3>
              <p className="text-sm text-muted-foreground">Access needed for advanced reminder features</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <PermissionItem
              title="Calendar Access"
              description="To read and create calendar events"
              icon={<CalendarIcon className="w-5 h-5" />}
              enabled={googleCalendarEnabled || outlookCalendarEnabled}
              onToggle={() => {
                if (!googleCalendarEnabled && !outlookCalendarEnabled) {
                  handleConnect('google-calendar');
                } else {
                  handleDisconnect('google-calendar');
                  handleDisconnect('outlook-calendar');
                }
              }}
            />
            
            <PermissionItem
              title="Notification Access"
              description="To scan notifications for appointment details"
              icon={<BellIcon className="w-5 h-5" />}
              enabled={notificationsPermission}
              onToggle={() => togglePermission('notifications')}
            />
            
            <PermissionItem
              title="Location Access"
              description="To provide location-based reminders"
              icon={<MapPinIcon className="w-5 h-5" />}
              enabled={locationPermission}
              onToggle={() => togglePermission('location')}
            />
            
            <div className="pt-4">
              <Button variant="outline" className="w-full justify-center mt-2">
                Review All Permissions
              </Button>
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  title,
  description,
  icon,
  isConnected,
  onConnect,
  onDisconnect,
  platform
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isConnected ? "bg-emerald-500/10" : "bg-muted"
        )}>
          {React.cloneElement(icon as React.ReactElement, {
            className: cn(
              "w-5 h-5",
              isConnected ? "text-emerald-500" : "text-muted-foreground"
            )
          })}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-medium">{title}</h4>
            {isConnected && (
              <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {isConnected && (
            <p className="text-xs text-muted-foreground mt-1">
              Connected • Last synced 10 minutes ago
            </p>
          )}
        </div>
      </div>
      
      {isConnected ? (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onDisconnect}
          className="text-muted-foreground hover:text-destructive"
        >
          Disconnect
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onConnect}
          className={cn(
            platform === 'android' && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
          )}
        >
          {platform === 'android' ? "Allow Access" : "Connect"}
        </Button>
      )}
    </div>
  );
};

const PermissionItem: React.FC<PermissionItemProps> = ({
  title,
  description,
  icon,
  enabled,
  onToggle
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start space-x-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          enabled ? "bg-emerald-500/10" : "bg-muted"
        )}>
          {React.cloneElement(icon as React.ReactElement, {
            className: cn(
              "w-5 h-5",
              enabled ? "text-emerald-500" : "text-muted-foreground"
            )
          })}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">
          {enabled ? "Enabled" : "Disabled"}
        </span>
        <Switch 
          checked={enabled}
          onCheckedChange={onToggle}
        />
      </div>
    </div>
  );
};

export default IntegrationSettings;
