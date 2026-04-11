'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addNotification,
  clearNotifications as clearNotificationsAction,
  LiveNotification,
  markAllNotificationsAsRead as markAllNotificationsAsReadAction,
  setSocketConnectedState,
} from '@/store/slices/notificationSlice';

type SocketContextValue = {
  socketConnected: boolean;
  notifications: LiveNotification[];
  unreadCount: number;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
};

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, updateProfile, user } = useAuth();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);
  const socketConnected = useAppSelector((state) => state.notifications.socketConnected);
  const walletBalanceRef = useRef(0);
  const totalEarningsRef = useRef(0);

  useEffect(() => {
    walletBalanceRef.current = Number(user?.walletBalance || 0);
    totalEarningsRef.current = Number(user?.totalEarnings || 0);
  }, [user?.totalEarnings, user?.walletBalance]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isAuthenticated) return;

    const token = localStorage.getItem('auth_token');
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!token || !socketUrl) return;

    const socket: Socket = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      dispatch(setSocketConnectedState(true));
    });

    socket.on('disconnect', () => {
      dispatch(setSocketConnectedState(false));
    });

    socket.on('notification:new', (notification: LiveNotification) => {
      const normalized: LiveNotification = {
        ...notification,
        id: notification.id || `NTF-${Date.now()}`,
        type: notification.type || 'system',
        unread: true,
        createdAt: notification.createdAt || new Date().toISOString(),
      };
      dispatch(addNotification(normalized));
      const notificationData = (normalized.data || {}) as {
        notificationType?: string;
        targetPath?: string;
      };
      if (notificationData.notificationType === 'provider_verification_approved') {
        updateProfile({
          payoutVerificationStatus: 'verified',
          payoutInfo: {
            rejectionReason: '',
            reviewedAt: normalized.createdAt,
          },
        });
      }
      if (notificationData.notificationType === 'provider_verification_rejected') {
        updateProfile({
          payoutVerificationStatus: 'rejected',
          payoutInfo: {
            rejectionReason: normalized.description || '',
            reviewedAt: normalized.createdAt,
          },
        });
      }
      if (notificationData.notificationType === 'order_paid') {
        const earnings = Number((notificationData as { providerEarningsAmount?: number }).providerEarningsAmount || 0);
        if (earnings > 0) {
          updateProfile({
            walletBalance: walletBalanceRef.current + earnings,
            totalEarnings: totalEarningsRef.current + earnings,
          });
        }
      }
      toast.info(normalized.title, {
        description: normalized.description,
        action:
          typeof notificationData.targetPath === 'string' && notificationData.targetPath
            ? {
                label: 'Open',
                onClick: () => {
                  if (typeof window !== 'undefined') {
                    window.location.href = notificationData.targetPath as string;
                  }
                },
              }
            : undefined,
      });
    });

    return () => {
      socket.disconnect();
      dispatch(setSocketConnectedState(false));
    };
  }, [dispatch, isAuthenticated, updateProfile]);

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  const markAllNotificationsAsRead = useCallback(() => {
    dispatch(markAllNotificationsAsReadAction());
  }, [dispatch]);

  const clearNotifications = useCallback(() => {
    dispatch(clearNotificationsAction());
  }, [dispatch]);

  return (
    <SocketContext.Provider
      value={{
        socketConnected,
        notifications,
        unreadCount,
        markAllNotificationsAsRead,
        clearNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketNotifications() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketNotifications must be used within SocketProvider');
  }
  return context;
}
