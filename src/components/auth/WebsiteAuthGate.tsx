'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthSession, getAccessToken, refreshAccessToken } from '@/lib/authStorage';

const PUBLIC_PATHS = ['/login', '/signup', '/signup/verify-otp'];
const PROTECTED_PATH_PREFIXES = ['/book', '/client', '/provider', '/messages', '/notifications'];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function WebsiteAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = React.useState(false);
  const [hasToken, setHasToken] = React.useState(false);

  const isPublicPath = React.useMemo(() => {
    if (!pathname) return false;
    return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  }, [pathname]);

  const isProtectedPath = React.useMemo(() => {
    if (!pathname) return false;
    return PROTECTED_PATH_PREFIXES.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
  }, [pathname]);

  React.useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      let token = getAccessToken();
      if (!token && API_BASE_URL) {
        token = await refreshAccessToken(API_BASE_URL);
      }
      const tokenExists = Boolean(token);

      if (!tokenExists) {
        if (!isMounted) return;
        setHasToken(false);
        setChecked(true);
        if (isProtectedPath) router.replace('/login');
        return;
      }

      if (!API_BASE_URL) {
        if (!isMounted) return;
        setHasToken(true);
        setChecked(true);
        return;
      }

      try {
        let response = await fetch(`${API_BASE_URL}/api/profile/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          const refreshedToken = await refreshAccessToken(API_BASE_URL);
          if (!refreshedToken) {
            throw new Error('Invalid or expired token');
          }

          response = await fetch(`${API_BASE_URL}/api/profile/me`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${refreshedToken}`,
            },
          });
        }

        if (!response.ok) {
          throw new Error('Invalid or expired token');
        }

        if (!isMounted) return;
        setHasToken(true);
        setChecked(true);
      } catch {
        clearAuthSession();

        if (!isMounted) return;
        setHasToken(false);
        setChecked(true);
        if (isProtectedPath) {
          router.replace('/login');
        }
      }
    };

    verifyToken();
    return () => {
      isMounted = false;
    };
  }, [isProtectedPath, router, pathname]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-[#2286BE]">Checking access...</div>
      </div>
    );
  }

  if (!hasToken && isProtectedPath) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-[#2286BE]">Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}
