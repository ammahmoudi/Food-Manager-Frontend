// app/logout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear tokens from localStorage and sessionStorage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');

    // Redirect the user to the login page after logging out
    router.push('/login');
  }, [router]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
