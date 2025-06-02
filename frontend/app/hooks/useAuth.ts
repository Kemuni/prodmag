'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ['/auth/login', '/auth/register', '/'];
    
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/auth/login');
    }
    
    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  return { isAuthenticated, user };
}
