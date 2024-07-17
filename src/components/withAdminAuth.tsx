// components/withAdminAuth.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { getAdminCheck } from '../services/api';

const withAdminAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAdmin = async () => {
        const token = localStorage.getItem('access') || sessionStorage.getItem('access');
        if (!token) {
          router.push('/login');
          return;
        }
        try {
          const response = await getAdminCheck();
          if (!response.is_admin) {
            router.push('/login');
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error('Admin check failed:', error);
          router.push('/login');
        }
      };

      checkAdmin();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; // Or a spinner or any loading component
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
