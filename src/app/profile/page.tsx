// app/profile/page.tsx
'use client';

import withAuth from '../../components/withAuth';
import UserProfile from '../../components/UserProfile';

const Profile = () => {
  return (
    <div>
      <UserProfile />

    </div>
  );
};

export default withAuth(Profile);
