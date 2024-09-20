// app/logout/page.tsx
'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';

const LogoutPage = () => {
    const {handleLogout}= useUser();

  useEffect(() => {
    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default LogoutPage;
