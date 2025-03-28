
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || '');
      setLastName(user.user_metadata?.last_name || '');
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

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      });

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      if (data?.user) {
        updateUser(data.user);
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const filePath = `${user!.id}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading avatar:', error);
        return;
      }

      // Get the public URL using the correct method
      const { data: publicUrlData } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setAvatarUrl(publicUrl);

      // Update the profile with the new avatar URL
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user!.id,
          avatar_url: publicUrl,
        });

      if (profileError) {
        console.error('Error updating profile with avatar URL:', profileError);
        return;
      }

      // Optionally, update the user's metadata as well
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
        },
      });

      if (userError) {
        console.error('Error updating user with avatar URL:', userError);
        return;
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Header />
      
      <main className="pt-20 sm:pt-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="glass-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-20 h-20 border border-border">
                <AvatarImage src={avatarUrl || ''} alt="Avatar" />
                <AvatarFallback className="bg-primary/10">
                  {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer hover:text-primary">
                  {loading ? 'Uploading...' : 'Change Avatar'}
                </Label>
                <Input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  Upload a new avatar image
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  type="text"
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  type="text"
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              className="w-full mt-4"
              onClick={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-6">
          <div className="glass-card rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Advanced Features</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Calendar & Message Integration</p>
                  <p className="text-sm text-muted-foreground">Enable scanning of calendars and messages</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/settings')}
                >
                  Manage
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Permissions Guide</p>
                  <p className="text-sm text-muted-foreground">Learn about permissions Arlo Alert needs</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/permissions')}
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
