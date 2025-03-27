
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  MapPinIcon, 
  ClockIcon, 
  BrainCircuitIcon, 
  LayoutDashboardIcon, 
  BellIcon 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import AnimatedTransition from './AnimatedTransition';

interface ContextAwareSettingsProps {
  className?: string;
}

const ContextAwareSettings: React.FC<ContextAwareSettingsProps> = ({ className }) => {
  const [locationBasedEnabled, setLocationBasedEnabled] = React.useState(true);
  const [timeBasedEnabled, setTimeBasedEnabled] = React.useState(true);
  const [patternLearningEnabled, setPatternLearningEnabled] = React.useState(true);
  const [contextAwarenessLevel, setContextAwarenessLevel] = React.useState([70]);
  const [notificationIntensity, setNotificationIntensity] = React.useState([50]);

  return (
    <div className={cn("space-y-6", className)}>
      <AnimatedTransition animation="slide-up" delay={100}>
        <div className="glass-card rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BrainCircuitIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Smart Features</h3>
                <p className="text-sm text-muted-foreground">Configure how the app learns your patterns</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="location-based" className="font-normal">Location-based reminders</Label>
              </div>
              <Switch
                id="location-based"
                checked={locationBasedEnabled}
                onCheckedChange={setLocationBasedEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="time-based" className="font-normal">Time-based optimization</Label>
              </div>
              <Switch
                id="time-based"
                checked={timeBasedEnabled}
                onCheckedChange={setTimeBasedEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <LayoutDashboardIcon className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="pattern-learning" className="font-normal">Pattern learning</Label>
              </div>
              <Switch
                id="pattern-learning"
                checked={patternLearningEnabled}
                onCheckedChange={setPatternLearningEnabled}
              />
            </div>
          </div>
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="slide-up" delay={200}>
        <div className="glass-card rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Notification Settings</h3>
                <p className="text-sm text-muted-foreground">Configure how and when you get notified</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="context-awareness" className="text-sm">Context awareness level</Label>
                <span className="text-sm text-muted-foreground">{contextAwarenessLevel}%</span>
              </div>
              <Slider
                id="context-awareness"
                min={0}
                max={100}
                step={1}
                value={contextAwarenessLevel}
                onValueChange={setContextAwarenessLevel}
              />
              <p className="text-xs text-muted-foreground">
                Higher values mean the app will be more proactive in suggesting context-aware reminders
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="notification-intensity" className="text-sm">Notification intensity</Label>
                <span className="text-sm text-muted-foreground">{notificationIntensity}%</span>
              </div>
              <Slider
                id="notification-intensity"
                min={0}
                max={100}
                step={1}
                value={notificationIntensity}
                onValueChange={setNotificationIntensity}
              />
              <p className="text-xs text-muted-foreground">
                Controls how frequently you'll receive notifications about your reminders
              </p>
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default ContextAwareSettings;
