// components/AdminRoute.tsx
'use client';
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AdminRoute;
