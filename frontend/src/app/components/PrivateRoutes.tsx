"use client"

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!auth?.isAuthenticated) {
      router.push('/login');
    }
  }, [auth?.isAuthenticated, router]);

  if (!auth?.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
