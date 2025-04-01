
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SettingsIcon, BellIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AnimatedTransition from './AnimatedTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface MobileHeaderProps {
  className?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isNativeAndroid, setIsNativeAndroid] = useState(false);

  React.useEffect(() => {
    // Check if running in Capacitor native container
    setIsNativeAndroid(
      window.navigator.userAgent.includes('capacitor') || 
      window.navigator.userAgent.includes('android')
    );
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user!.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Handle avatar click to navigate to profile settings
  const handleAvatarClick = () => {
    navigate('/profile');
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-40 py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300',
        scrolled ? 'glass py-2 shadow-sm' : 'bg-transparent',
        isNativeAndroid ? 'pt-6' : '', // Add extra padding for Android status bar
        className
      )}
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <AnimatedTransition animation="fade" delay={100}>
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <h1 className="text-lg sm:text-xl font-medium">Arlo Alert</h1>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition animation="fade" delay={200}>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                onClick={() => navigate('/settings')} 
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-colors-smooth",
                  location.pathname.includes('/settings') 
                    ? "bg-primary/15" 
                    : "bg-primary/5 hover:bg-primary/10"
                )}
              >
                <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </button>
              
              <button onClick={handleAvatarClick} className="outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded-full">
                <Avatar className="w-9 h-9 border border-border cursor-pointer hover:border-primary/30 transition-colors">
                  <AvatarImage src={avatarUrl || ''} alt="User" />
                  <AvatarFallback className="bg-primary/10">
                    {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
