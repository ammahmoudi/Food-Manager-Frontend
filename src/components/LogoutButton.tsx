// components/LogoutButton.tsx
'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
    router.push('/login');
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
