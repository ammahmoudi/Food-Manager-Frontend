// app/logout/page.tsx
'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';

export const getServerSideProps = async () => {
  return { props: {} };  // Prevent static generation
};

const LogoutPage = () => {
  const { handleLogout } = useUser();

  useEffect(() => {
    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default LogoutPage;
