'use client';

import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

const AILayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { switchTheme } = useTheme();

  useEffect(() => {
    switchTheme('ai'); // Switch to the AI theme when this layout is used
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-md z-0 bg-[url('/images/maani_bg_2.png')]"
      ></div>

      {/* Overlay for better text visibility */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-10"></div>

      {/* Container for children */}
      <div className="relative z-20 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AILayout;
