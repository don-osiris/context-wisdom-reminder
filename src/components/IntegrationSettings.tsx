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
import { useAuth } from '@/context/AuthContext';

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

const detectPlatform = (): 'android' | 'ios' | 'web' => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/android/i.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
  return 'web';
};

const createAndroidIntent = (action: string, type: string, packageName?: string): string => {
  let intentUrl = `intent:#Intent;action=${action};`;
  
  if (type) {
    intentUrl += `type=${type};`;
  }
  
  if (packageName) {
    intentUrl += `package=${packageName};`;
  }
  
  intentUrl += 'end';
  return intentUrl;
};

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ className }) => {
  const [platform, setPlatform] = useState<'android' | 'ios' | 'web'>('web');
  const { user } = useAuth();
  
  const [personalMailEnabled, setPersonalMailEnabled] = React.useState(false);
  const [workMailEnabled, setWorkMailEnabled] = React.useState(false);
  const [smsEnabled, setSmsEnabled] = React.useState(false);
  
  const [googleCalendarEnabled, setGoogleCalendarEnabled] = React.useState(false);
  const [outlookCalendarEnabled, setOutlookCalendarEnabled] = React.useState(false);
  
  const [smsScanning, setSmsScanning] = React.useState(false);
  const [whatsappScanning, setWhatsappScanning] = React.useState(false);
  const [telegramScanning, setTelegramScanning] = React.useState(false);
  
  const [notificationsPermission, setNotificationsPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [backgroundSyncPermission, setBackgroundSyncPermission] = useState(false);
  
  useEffect(() => {
    if (user && user.user_metadata) {
      const integrations = user.user_metadata.integrations || {};
      
      if (integrations.gmail) setPersonalMailEnabled(true);
      if (integrations.outlook) setWorkMailEnabled(true);
      if (integrations.sms) setSmsEnabled(true);
      if (integrations.googleCalendar) setGoogleCalendarEnabled(true);
      if (integrations.outlookCalendar) setOutlookCalendarEnabled(true);
      if (integrations.notifications) setNotificationsPermission(true);
      if (integrations.location) setLocationPermission(true);
    }
    
    setPlatform(detectPlatform());
  }, [user]);
  
  const handleConnect = (service: string) => {
    console.log(`Connecting to ${service} on ${platform}...`);
    
    if (platform === 'android') {
      let intentUrl = '';
      let permissionPrompt = '';
      
      switch (service) {
        case 'personal-mail':
          intentUrl = createAndroidIntent('android.intent.action.VIEW', 'message/rfc822', 'com.google.android.gm');
          permissionPrompt = 'Opening Gmail account selection';
          break;
          
        case 'work-mail':
          intentUrl = createAndroidIntent('android.intent.action.VIEW', 'message/rfc822', 'com.microsoft.office.outlook');
          permissionPrompt = 'Opening Outlook account selection';
          break;
          
        case 'google-calendar':
          intentUrl = createAndroidIntent('android.intent.action.VIEW', 'vnd.android.cursor.item/event', 'com.google.android.calendar');
          permissionPrompt = 'Opening Google Calendar';
          break;
          
        case 'outlook-calendar':
          intentUrl = createAndroidIntent('android.intent.action.VIEW', 'vnd.android.cursor.item/event', 'com.microsoft.office.outlook');
          permissionPrompt = 'Opening Outlook Calendar';
          break;
          
        case 'sms':
          intentUrl = 'sms:';
          permissionPrompt = 'Requesting SMS permission';
          break;
          
        default:
          simulateConnection(service);
          return;
      }
      
      toast.info(permissionPrompt);
      
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = intentUrl;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          document.body.removeChild(iframe);
          updateConnectionState(service, true);
          toast.success(`Connected to ${service}`);
        }, 1000);
      } catch (error) {
        console.error('Error opening intent:', error);
        toast.error(`Could not open ${service} app. Please try installing it first.`);
      }
    } else {
      simulateConnection(service);
    }
  };
  
  const simulateConnection = (service: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)), 
      {
        loading: `Connecting to ${service}...`,
        success: () => {
          updateConnectionState(service, true);
          return `Connected to ${service} successfully!`;
        },
        error: 'Connection failed. Please try again.',
      }
    );
  };
  
  const updateConnectionState = (service: string, state: boolean) => {
    switch (service) {
      case 'personal-mail':
        setPersonalMailEnabled(state);
        break;
      case 'work-mail':
        setWorkMailEnabled(state);
        break;
      case 'sms':
        setSmsEnabled(state);
        break;
      case 'google-calendar':
        setGoogleCalendarEnabled(state);
        break;
      case 'outlook-calendar':
        setOutlookCalendarEnabled(state);
        break;
      case 'sms-scanning':
        setSmsScanning(state);
        break;
      case 'whatsapp-scanning':
        setWhatsappScanning(state);
        break;
      case 'telegram-scanning':
        setTelegramScanning(state);
        break;
      case 'notifications':
        setNotificationsPermission(state);
        break;
      case 'location':
        setLocationPermission(state);
        break;
      case 'background-sync':
        setBackgroundSyncPermission(state);
        break;
    }
  };
  
  const handleDisconnect = (service: string) => {
    console.log(`Disconnecting from ${service}...`);
    updateConnectionState(service, false);
    toast.success(`Disconnected from ${service}`);
  };
  
  const togglePermission = (permission: string) => {
    console.log(`Toggling ${permission} permission on ${platform}...`);
    
    if (platform === 'android') {
      let intentUrl = '';
      
      switch (permission) {
        case 'notifications':
          intentUrl = 'package:' + window.location.hostname;
          openAndroidSettings('android.settings.APP_NOTIFICATION_SETTINGS', intentUrl);
          break;
        case 'location':
          openAndroidSettings('android.settings.LOCATION_SOURCE_SETTINGS');
          break;
        case 'background-sync':
          openAndroidSettings('android.settings.SYNC_SETTINGS');
          break;
        default:
          simulateTogglePermission(permission);
          return;
      }
    } else {
      simulateTogglePermission(permission);
    }
  };
  
  const openAndroidSettings = (action: string, data?: string) => {
    try {
      let intentUrl = `intent:#Intent;action=${action};`;
      
      if (data) {
        intentUrl += `data=${data};`;
      }
      
      intentUrl += 'end';
      
      toast.info('Opening system settings for permission');
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = intentUrl;
      document.body.appendChild(iframe);
      
      setTimeout(() => {
        document.body.removeChild(iframe);
        switch (action) {
          case 'android.settings.APP_NOTIFICATION_SETTINGS':
            setNotificationsPermission(true);
            break;
          case 'android.settings.LOCATION_SOURCE_SETTINGS':
            setLocationPermission(true);
            break;
          case 'android.settings.SYNC_SETTINGS':
            setBackgroundSyncPermission(true);
            break;
        }
        
        toast.success('Permission granted');
      }, 1500);
    } catch (error) {
      console.error('Error opening settings:', error);
      toast.error('Could not open system settings');
    }
  };
  
  const simulateTogglePermission = (permission: string) => {
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
