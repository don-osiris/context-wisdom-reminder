
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  delay?: number;
  duration?: number;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className,
  animation = 'fade',
  delay = 0,
  duration = 300,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide-up':
        return 'animate-slide-up';
      case 'slide-down':
        return 'animate-slide-down';
      case 'scale':
        return 'animate-scale-in';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      className={cn(
        'opacity-0',
        mounted && getAnimationClass(),
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
