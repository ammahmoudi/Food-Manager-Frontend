// components/LogoutButton.tsx
'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';

const LogoutButton = () => {
  return (
    <Link href="/logout">
      <Button>Logout</Button>
    </Link>
  );
};

export default LogoutButton;
