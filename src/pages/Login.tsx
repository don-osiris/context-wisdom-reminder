
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, isLoading, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="pt-6 px-4 flex">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <AnimatedTransition animation="fade" className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <BellIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your Arlo Alert account</p>
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" type="button" className="text-xs h-auto p-0">
                  Forgot password?
                </Button>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                disabled={!isConfigured}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading || !isConfigured}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" onClick={() => navigate('/signup')} className="p-0 h-auto">
                Sign up
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
              onClick={handleGoogleSignIn}
              disabled={!isConfigured || isLoading}
            >
              <GoogleIcon className="h-4 w-4" />
              Google
            </Button>
            <Button 
              variant="link" 
              size="sm" 
              type="button" 
              className="w-full mt-2 text-sm text-muted-foreground"
              onClick={() => setShowHelp(true)}
            >
              Having trouble signing in?
            </Button>
          </div>
        </AnimatedTransition>
      </main>

      <Sheet open={showHelp} onOpenChange={setShowHelp}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sign In Help</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Google Sign In</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>For Google Sign In to work correctly:</p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Make sure you've enabled the Google provider in your Supabase project.</li>
                <li>Ensure you've configured the correct redirect URL in Google Cloud Console.</li>
                <li>Check that the Site URL and Redirect URLs are properly set in Supabase Authentication settings.</li>
              </ol>
            </div>
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowHelp(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Login;
