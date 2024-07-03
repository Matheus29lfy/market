"use client"

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
   const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Ou você pode retornar um spinner/carregando
  }

  return <>{children}</>;
};

export default PrivateRoute;
