
import React, { useState, useRef } from 'react';
import { Camera, Upload, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileImageUploader = () => {
  const { user, session } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
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
        
      if (error) throw error;
      if (data) setAvatarUrl(data.avatar_url);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const uploadAvatar = async (file: File) => {
    if (!user) return;
    
    try {
      setUploading(true);
      
      // Create a unique file path for the user's avatar
      const filePath = `${user.id}/${new Date().getTime()}.${file.name.split('.').pop()}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);
        
      const publicUrl = data.publicUrl;
      
      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date() })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      toast.success('Profile image updated successfully');
    } catch (error: any) {
      toast.error(`Error uploading image: ${error.message}`);
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      uploadAvatar(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        capture="environment"
      />
      
      <div className="mb-4 relative">
        <Avatar className={cn(
          "w-24 h-24 border-4 border-background shadow-lg",
          uploading && "opacity-50"
        )}>
          <AvatarImage src={avatarUrl || ''} alt="Profile" />
          <AvatarFallback className="bg-primary/10">
            <User className="w-10 h-10 text-primary" />
          </AvatarFallback>
        </Avatar>
        
        <Button 
          size="icon"
          variant="secondary"
          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 shadow-md"
          onClick={handleUploadClick}
          disabled={uploading}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleUploadClick}
          disabled={uploading}
          className="text-xs"
        >
          <Upload className="w-3 h-3 mr-1" />
          {uploading ? 'Uploading...' : 'Change Picture'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileImageUploader;
