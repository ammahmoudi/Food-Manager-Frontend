// components/UserProfile.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, Image, Spacer } from '@nextui-org/react';
import api from '../services/api';
import LogoutButton from './LogoutButton';

interface User {
  id: number;
  name: string;
  phone_number: string;
  user_image: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('auth/users/me/');
        console.log(response.data)
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
          src={user.user_image || '/default-profile.png'}
          alt="Profile Picture"
          width={100}
          height={100}
        />
        <Spacer y={0.5} />
        <div>{user.user_image}</div>
        <div>{user.phone_number}</div>
        <div><LogoutButton></LogoutButton></div>
      </CardBody>
    </Card>
  );
};

export default UserProfile;
