
import React from 'react';
import { cn } from '@/lib/utils';
import { SettingsIcon, BellIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AnimatedTransition from './AnimatedTransition';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  className?: string;
  onVoiceClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ className, onVoiceClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-40 py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300',
        scrolled ? 'glass py-2 shadow-sm' : 'bg-transparent',
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
              
              <Avatar className="w-9 h-9 border border-border">
                <AvatarImage src="https://i.pravatar.cc/300" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </header>
  );
};

export default Header;
