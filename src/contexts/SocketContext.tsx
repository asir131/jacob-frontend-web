'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Phone, User, Video } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addNotification,
  clearNotifications as clearNotificationsAction,
  hydrateNotifications,
  LiveNotification,
  markAllNotificationsAsRead as markAllNotificationsAsReadAction,
  setSocketConnectedState,
} from '@/store/slices/notificationSlice';
import { getAccessToken, getActiveAuthStorageKind } from '@/lib/authStorage';

type SocketContextValue = {
  socketConnected: boolean;
  notifications: LiveNotification[];
  unreadCount: number;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
};

const SocketContext = createContext<SocketContextValue | undefined>(undefined);
const LEGACY_NOTIFICATIONS_STORAGE_KEY = 'live_notifications';
const PENDING_INCOMING_CALL_STORAGE_KEY = 'pending_incoming_call';

type CallInvite = {
  conversationId: string;
  targetUserId?: string;
  callType: 'voice' | 'video';
  offer?: RTCSessionDescriptionInit;
  senderId?: string;
  senderRole?: string;
  senderName?: string;
  senderAvatar?: string;
};

const getNotificationsStorageKey = (userId?: string) =>
  userId ? `live_notifications:${userId}` : null;

const getNotificationStorage = () => {
  if (typeof window === 'undefined') return null;
  return getActiveAuthStorageKind() === 'local' ? window.localStorage : window.sessionStorage;
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, updateProfile, user } = useAuth();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notifications.items);
  const socketConnected = useAppSelector((state) => state.notifications.socketConnected);
  const walletBalanceRef = useRef(0);
  const totalEarningsRef = useRef(0);
  const socketRef = useRef<Socket | null>(null);
  const incomingCallRef = useRef<CallInvite | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallInvite | null>(null);

  useEffect(() => {
    walletBalanceRef.current = Number(user?.walletBalance || 0);
    totalEarningsRef.current = Number(user?.totalEarnings || 0);
  }, [user?.totalEarnings, user?.walletBalance]);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = getNotificationsStorageKey(user?.id);
    const storage = getNotificationStorage();

    if (!isAuthenticated || !storageKey) {
      dispatch(clearNotificationsAction());
      window.localStorage.removeItem(LEGACY_NOTIFICATIONS_STORAGE_KEY);
      window.sessionStorage.removeItem(LEGACY_NOTIFICATIONS_STORAGE_KEY);
      return;
    }

    try {
      dispatch(clearNotificationsAction());
      window.localStorage.removeItem(LEGACY_NOTIFICATIONS_STORAGE_KEY);
      window.sessionStorage.removeItem(LEGACY_NOTIFICATIONS_STORAGE_KEY);
      const raw = storage?.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as LiveNotification[];
      if (!Array.isArray(parsed)) return;
      dispatch(hydrateNotifications(parsed));
    } catch {
      storage?.removeItem(storageKey);
    }
  }, [dispatch, isAuthenticated, user?.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = getNotificationsStorageKey(user?.id);
    const storage = getNotificationStorage();
    if (!isAuthenticated || !storageKey || !storage) return;
    storage.setItem(storageKey, JSON.stringify(notifications));
  }, [isAuthenticated, notifications, user?.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isAuthenticated) return;

    const token = getAccessToken();
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!token || !socketUrl) return;

    const socket: Socket = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: `Bearer ${token}`,
      },
    });
    socketRef.current = socket;

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

    socket.on('call:invite', (payload: CallInvite) => {
      if (!payload?.conversationId || payload.senderRole === 'superAdmin') return;

      if (window.location.pathname.startsWith('/messages')) {
        return;
      }

      setIncomingCall(payload);
      toast.info(`${payload.senderName || 'Someone'} is calling you`, {
        description: payload.callType === 'video' ? 'Video call incoming.' : 'Voice call incoming.',
      });
    });

    socket.on('call:end', (payload: { conversationId?: string }) => {
      if (payload?.conversationId && payload.conversationId === incomingCallRef.current?.conversationId) {
        setIncomingCall(null);
        toast.info('Call ended');
      }
    });

    socket.on('call:blocked', (payload: { reason?: string }) => {
      setIncomingCall(null);
      toast.info(payload?.reason || 'Audio and video calls are not available with admin support.');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      dispatch(setSocketConnectedState(false));
    };
  }, [dispatch, isAuthenticated, updateProfile]);

  const acceptIncomingCall = useCallback(() => {
    if (!incomingCall || typeof window === 'undefined') return;
    window.sessionStorage.setItem(PENDING_INCOMING_CALL_STORAGE_KEY, JSON.stringify(incomingCall));
    setIncomingCall(null);
    window.location.href = `/messages?conversationId=${encodeURIComponent(incomingCall.conversationId)}&incomingCall=1`;
  }, [incomingCall]);

  const declineIncomingCall = useCallback(() => {
    if (incomingCall?.senderId && socketRef.current) {
      socketRef.current.emit('call:end', {
        conversationId: incomingCall.conversationId,
        targetUserId: incomingCall.senderId,
        callType: incomingCall.callType,
        reason: 'declined',
      });
    }
    setIncomingCall(null);
  }, [incomingCall]);

  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  const markAllNotificationsAsRead = useCallback(() => {
    dispatch(markAllNotificationsAsReadAction());
  }, [dispatch]);

  const clearNotifications = useCallback(() => {
    dispatch(clearNotificationsAction());
    const storageKey = getNotificationsStorageKey(user?.id);
    const storage = getNotificationStorage();
    if (storageKey && storage) {
      storage.removeItem(storageKey);
    }
  }, [dispatch, user?.id]);

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
      {incomingCall ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
            <div className="bg-[#2286BE] px-6 py-5 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  {incomingCall.callType === 'video' ? <Video size={26} /> : <Phone size={26} />}
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/75">
                    Incoming {incomingCall.callType === 'video' ? 'Video' : 'Voice'} Call
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{incomingCall.senderName || 'Someone'} is calling</h2>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                  <User size={20} />
                </div>
                <p className="text-sm font-bold text-slate-600">
                  Accept to open the conversation and connect the call.
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-2xl border-slate-200 font-black text-slate-600"
                  onClick={declineIncomingCall}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="h-12 rounded-2xl bg-emerald-500 font-black text-white hover:bg-emerald-600"
                  onClick={acceptIncomingCall}
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
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
