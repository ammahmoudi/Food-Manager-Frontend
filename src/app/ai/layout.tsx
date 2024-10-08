'use client';

import { useTheme } from '@/context/ThemeContext';
import useFcmToken from '@/hooks/useFcmToken';
import { useEffect } from 'react';

const AILayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { switchTheme } = useTheme();
  const { notificationPermissionStatus } = useFcmToken();
  console.log('notification status:', notificationPermissionStatus);

  useEffect(() => {
    switchTheme('ai'); // Switch to the AI theme when this layout is used
  }, []);

  return (
    <div className="relative h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/maani_bg_2.png')", // Update with your image path
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          opacity: 0.5, // Adjust this value for desired transparency
          filter: 'blur(10px)', // Apply blur effect
        }}
      ></div>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />

      {/* Container for children */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
};

export default AILayout;
