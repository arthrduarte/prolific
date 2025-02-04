'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

const PUBLIC_PATHS = ['/auth', '/auth/confirm'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
      
      if (!session && !isPublicPath) {
        router.replace('/auth');
      } else if (session && pathname === '/auth') {
        router.replace('/');
      }

    };

    // Check auth on initial load
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
      
      if (!session && !isPublicPath) {
        router.replace('/auth');
      }

    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  return <>{children}</>;
} 