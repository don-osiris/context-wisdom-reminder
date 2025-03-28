
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PermissionsGuide from '@/components/PermissionsGuide';

const PermissionsGuidePage = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Header />
      
      <main className="pt-20 sm:pt-24 px-4 sm:px-6">
        <PermissionsGuide onClose={handleClose} />
      </main>
    </div>
  );
};

export default PermissionsGuidePage;
