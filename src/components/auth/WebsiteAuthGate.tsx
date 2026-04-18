'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_USER_KEY = 'auth_user';
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
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
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
        const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Invalid or expired token');
        }

        if (!isMounted) return;
        setHasToken(true);
        setChecked(true);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);

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
