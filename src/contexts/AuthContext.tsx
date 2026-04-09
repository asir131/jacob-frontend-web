'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  AuthUser,
  Role,
  hydrateAuthState,
  loginSuccess,
  logoutSuccess,
  setAuthRole,
  updateAuthProfile,
} from '@/store/slices/authSlice';
import { store } from '@/store';
import { apiSlice } from '@/store/services/apiSlice';

interface LoginPayload {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  avatar?: string;
  phone?: string;
  address?: string;
  preferredLanguage?: string;
  locationLat?: number | null;
  locationLng?: number | null;
  businessBio?: string;
  experienceLevel?: string;
  serviceCity?: string;
  serviceLocationLat?: number | null;
  serviceLocationLng?: number | null;
  payoutVerificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  payoutInfo?: {
    accountHolderName?: string;
    bankAccountNumber?: string;
    routingNumber?: string;
    bankName?: string;
    accountType?: 'checking' | 'savings' | '';
    nidFrontImageUrl?: string;
    nidBackImageUrl?: string;
    submittedAt?: string | null;
    reviewedAt?: string | null;
    rejectionReason?: string;
  };
}

interface AuthState {
  user: AuthUser | null;
  role: Role;
  setRole: (role: Role) => Promise<void>;
  isAuthenticated: boolean;
  login: (payload?: LoginPayload) => void;
  updateProfile: (payload: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const AUTH_USER_KEY = 'auth_user';
const LEGACY_DUMMY_AVATARS = [
  'https://i.pravatar.cc/150?u=default-client',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
];

const normalizeAvatar = (avatar?: string) => {
  if (!avatar) return '';
  if (LEGACY_DUMMY_AVATARS.includes(avatar)) return '';
  return avatar;
};

const readStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.email) return null;
    return { ...parsed, avatar: normalizeAvatar(parsed.avatar) };
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, role, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = readStoredUser();
    dispatch(hydrateAuthState(storedUser));
  }, [dispatch]);

  const setRole = async (nextRole: Role) => {
    dispatch(setAuthRole(nextRole));

    if (typeof window !== 'undefined' && user) {
      const nextUser = { ...user, role: nextRole };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));

      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          await store.dispatch(
            apiSlice.endpoints.updateProfile.initiate({ role: nextRole })
          ).unwrap();
        } catch {
          // keep local switch even if backend sync fails
        }
      }
    }
  };

  const login = (payload?: LoginPayload) => {
    const resolvedRole = payload?.role || 'client';
    const resolvedFirstName = payload?.firstName?.trim() || 'User';
    const resolvedLastName = payload?.lastName?.trim() || '';
    const resolvedName = `${resolvedFirstName} ${resolvedLastName}`.trim();
    const resolvedEmail = payload?.email?.trim() || 'unknown@example.com';

    const nextUser: AuthUser = {
      id: payload?.id || 'USR-LOCAL',
      firstName: resolvedFirstName,
      lastName: resolvedLastName,
      name: resolvedName || 'User',
      email: resolvedEmail,
      avatar: normalizeAvatar(payload?.avatar),
      role: resolvedRole,
      phone: payload?.phone || '',
      address: payload?.address || '',
      preferredLanguage: payload?.preferredLanguage || 'English (US)',
      locationLat: typeof payload?.locationLat === 'number' ? payload.locationLat : undefined,
      locationLng: typeof payload?.locationLng === 'number' ? payload.locationLng : undefined,
      businessBio: payload?.businessBio || '',
      experienceLevel: payload?.experienceLevel || '',
      serviceCity: payload?.serviceCity || '',
      serviceLocationLat:
        typeof payload?.serviceLocationLat === 'number' ? payload.serviceLocationLat : undefined,
      serviceLocationLng:
        typeof payload?.serviceLocationLng === 'number' ? payload.serviceLocationLng : undefined,
      payoutVerificationStatus: payload?.payoutVerificationStatus || 'unverified',
      payoutInfo: payload?.payoutInfo || {
        accountHolderName: '',
        bankAccountNumber: '',
        routingNumber: '',
        bankName: '',
        accountType: '',
        nidFrontImageUrl: '',
        nidBackImageUrl: '',
        submittedAt: null,
        reviewedAt: null,
        rejectionReason: '',
      },
    };

    dispatch(loginSuccess(nextUser));

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.removeItem('pending_signup_auth');
    }

    dispatch(logoutSuccess());
  };

  const updateProfile = (payload: Partial<AuthUser>) => {
    if (!user) return;
    const nextUser: AuthUser = {
      ...user,
      ...payload,
      payoutInfo:
        payload.payoutInfo === undefined
          ? user.payoutInfo
          : { ...(user.payoutInfo || {}), ...payload.payoutInfo },
    };
    dispatch(updateAuthProfile(payload));
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    }
  };

  return <AuthContext.Provider value={{ user, role, setRole, isAuthenticated, login, updateProfile, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
