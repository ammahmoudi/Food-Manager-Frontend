// components/UserProfile.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, Image, Spacer } from '@nextui-org/react';
import api from '../services/api';
import LogoutButton from './LogoutButton';
import { User } from '@/interfaces/User';



const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('auth/users/me/');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardBody>
        <Image
          src={user.user_image as string || '/default-profile.png'}
          alt="Profile Picture"
          width={100}
          height={100}
        />
        <Spacer y={0.5} />
        <div>{user.full_name}</div>
        <div>{user.phone_number}</div>
        <div><LogoutButton></LogoutButton></div>
      </CardBody>
    </Card>
  );
};

export default UserProfile;
