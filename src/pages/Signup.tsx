
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BellIcon, ArrowLeft, AlertTriangle } from 'lucide-react';
import GoogleIcon from '@/components/icons/GoogleIcon';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, isLoading, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signUp(email, password, firstName, lastName);
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error('Failed to sign in with Google. Please try again.');
      console.error('Google signup error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="pt-6 px-4 flex">
        <Button variant="ghost" size="icon" onClick={() => navigate('/login')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <AnimatedTransition animation="fade" className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <BellIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign up for Arlo Alert</p>
          </div>
          
          {!isConfigured && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Not Configured</AlertTitle>
              <AlertDescription>
                Supabase environment variables are missing. Please connect to Supabase and set up your environment variables.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John" 
                  required 
                  disabled={!isConfigured}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe" 
                  required 
                  disabled={!isConfigured}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com" 
                required 
                disabled={!isConfigured}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                disabled={!isConfigured}
              />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading || !isConfigured}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto">
                Sign in
              </Button>
            </p>
          </div>
          
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={handleGoogleSignup}
              disabled={!isConfigured || isLoading}
            >
              <GoogleIcon className="h-4 w-4" />
              Google
            </Button>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default Signup;
