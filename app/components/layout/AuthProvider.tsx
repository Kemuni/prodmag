'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ['/auth/login', '/auth/register', '/'];
    
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/auth/login');
    }
    
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
