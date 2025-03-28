
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileImageUploader from '@/components/ProfileImageUploader';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-40 py-4 px-6 glass shadow-sm">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/settings')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-medium">Profile Settings</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-24 px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <AnimatedTransition animation="slide-down" delay={100}>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ProfileImageUploader />
                
                <div className="w-full mt-8">
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="text-base">{user?.email}</p>
                    </div>
                    
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                      <p className="text-base">
                        {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>
          
          <AnimatedTransition animation="slide-up" delay={200}>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Permissions Walkthrough</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Why Arlo Alert Needs Permissions</h3>
                  <p className="text-muted-foreground">
                    To provide you with the best reminder experience, Arlo Alert requires access to several device features. 
                    Here's a detailed explanation of each permission and how it enhances your experience:
                  </p>
                  
                  <div className="grid gap-4 mt-4">
                    <div className="space-y-2 border-l-4 border-primary/70 pl-4 py-1">
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        We use notifications to alert you about upcoming reminders, ensuring you never miss important events or tasks.
                      </p>
                    </div>
                    
                    <div className="space-y-2 border-l-4 border-primary/70 pl-4 py-1">
                      <h4 className="font-medium">Calendar Access</h4>
                      <p className="text-sm text-muted-foreground">
                        By accessing your calendar, we can suggest reminders based on your existing events and help you avoid scheduling conflicts.
                      </p>
                    </div>
                    
                    <div className="space-y-2 border-l-4 border-primary/70 pl-4 py-1">
                      <h4 className="font-medium">Microphone</h4>
                      <p className="text-sm text-muted-foreground">
                        Voice input allows you to create reminders hands-free, making it easier to capture thoughts on the go.
                      </p>
                    </div>
                    
                    <div className="space-y-2 border-l-4 border-primary/70 pl-4 py-1">
                      <h4 className="font-medium">Location</h4>
                      <p className="text-sm text-muted-foreground">
                        With location access, we can send reminders based on where you are, like grocery lists when you're near the store.
                      </p>
                    </div>
                    
                    <div className="space-y-2 border-l-4 border-primary/70 pl-4 py-1">
                      <h4 className="font-medium">Camera</h4>
                      <p className="text-sm text-muted-foreground">
                        Camera access allows you to personalize your profile with a photo and attach images to reminders for visual context.
                      </p>
                    </div>
                    
                    <div className="space-y-2 border-l-4 border-primary/70 pl-4 py-1">
                      <h4 className="font-medium">Background Processing</h4>
                      <p className="text-sm text-muted-foreground">
                        This ensures time-sensitive reminders are delivered even when the app isn't actively open on your screen.
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm mt-4 text-muted-foreground">
                    Your data privacy is important to us. All permissions are optional, but enabling them provides the most seamless and powerful reminder experience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedTransition>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
