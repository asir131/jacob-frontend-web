'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addNotification,
  clearNotifications as clearNotificationsAction,
  LiveNotification,
  markAllNotificationsAsRead as markAllNotificationsAsReadAction,
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
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);
  const [socketConnected, setSocketConnected] = useState(false);

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
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
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
      toast.info(normalized.title, { description: normalized.description });
    });

    return () => {
      socket.disconnect();
      setSocketConnected(false);
    };
  }, [dispatch, isAuthenticated]);

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
