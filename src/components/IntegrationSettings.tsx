
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  MailIcon, 
  MessageSquareIcon, 
  LinkIcon, 
  RefreshCcwIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ className }) => {
  const [personalMailEnabled, setPersonalMailEnabled] = React.useState(false);
  const [workMailEnabled, setWorkMailEnabled] = React.useState(false);
  const [smsEnabled, setSmsEnabled] = React.useState(false);
  
  // Mock connect/disconnect functions
  const handleConnect = (service: string) => {
    console.log(`Connecting to ${service}...`);
    // In a real app, this would open OAuth flow or similar
    
    // For demo, just toggle the state after a delay
    setTimeout(() => {
      if (service === 'personal-mail') setPersonalMailEnabled(true);
      if (service === 'work-mail') setWorkMailEnabled(true);
      if (service === 'sms') setSmsEnabled(true);
    }, 1000);
  };
  
  const handleDisconnect = (service: string) => {
    console.log(`Disconnecting from ${service}...`);
    
    // For demo, just toggle the state
    if (service === 'personal-mail') setPersonalMailEnabled(false);
    if (service === 'work-mail') setWorkMailEnabled(false);
    if (service === 'sms') setSmsEnabled(false);
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      <AnimatedTransition animation="slide-up" delay={100}>
        <div className="glass-card rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Integrations</h3>
              <p className="text-sm text-muted-foreground">Connect your services for smart reminders</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-6">
            <IntegrationItem
              title="Personal Email"
              description="Connect your personal email account"
              icon={<MailIcon className="w-5 h-5" />}
              isConnected={personalMailEnabled}
              onConnect={() => handleConnect('personal-mail')}
              onDisconnect={() => handleDisconnect('personal-mail')}
            />
            
            <IntegrationItem
              title="Work Email"
              description="Connect your work email account"
              icon={<MailIcon className="w-5 h-5" />}
              isConnected={workMailEnabled}
              onConnect={() => handleConnect('work-mail')}
              onDisconnect={() => handleDisconnect('work-mail')}
            />
            
            <IntegrationItem
              title="SMS Messages"
              description="Connect your phone's SMS messages"
              icon={<MessageSquareIcon className="w-5 h-5" />}
              isConnected={smsEnabled}
              onConnect={() => handleConnect('sms')}
              onDisconnect={() => handleDisconnect('sms')}
            />
          </div>
        </div>
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
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync" className="font-medium">Auto Sync</Label>
                <p className="text-sm text-muted-foreground">Automatically sync data every 15 minutes</p>
              </div>
              <Switch id="auto-sync" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="background-sync" className="font-medium">Background Sync</Label>
                <p className="text-sm text-muted-foreground">Allow syncing in background (uses more battery)</p>
              </div>
              <Switch id="background-sync" defaultChecked />
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full justify-center gap-2">
                <RefreshCcwIcon className="w-4 h-4" />
                Sync Now
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
  onDisconnect
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
        >
          Connect
        </Button>
      )}
    </div>
  );
};

export default IntegrationSettings;
