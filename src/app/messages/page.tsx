'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { Search, MoreVertical, Send, Paperclip, Phone, Video, Info, ArrowLeft, CheckCheck, Smile, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import {
  useEnsureConversationByOrderMutation,
  useGetConversationMessagesQuery,
  useGetConversationsQuery,
  useSendConversationMessageMutation,
} from '@/store/services/apiSlice';

type Conversation = {
  id: string;
  orderId?: string;
  orderNumber?: string;
  orderName?: string;
  packageTitle?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  otherUser?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
};

type ApiMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export default function MessagesPage() {
  const { role: userRole, user } = useAuth();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId') || '';
  const conversationIdParam = searchParams.get('conversationId') || '';

  const [search, setSearch] = useState('');
  const [manualConversationId, setManualConversationId] = useState('');
  const [ensuredConversationId, setEnsuredConversationId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<'voice' | 'video' | null>(null);
  const [liveMessages, setLiveMessages] = useState<ApiMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);

  const { data: conversationResponse, refetch: refetchConversations } = useGetConversationsQuery();
  const [ensureConversationByOrder] = useEnsureConversationByOrderMutation();
  const [sendConversationMessage, { isLoading: isSending }] = useSendConversationMessageMutation();

  const conversations = useMemo(
    () => ((conversationResponse?.data || []) as Conversation[]).filter((item) => item?.id),
    [conversationResponse]
  );

  const selectedConversationId = useMemo(() => {
    if (manualConversationId) return manualConversationId;
    if (conversationIdParam) return conversationIdParam;
    if (ensuredConversationId) return ensuredConversationId;
    return conversations[0]?.id || '';
  }, [manualConversationId, conversationIdParam, ensuredConversationId, conversations]);

  const { data: messagesResponse, refetch: refetchMessages } = useGetConversationMessagesQuery(
    { conversationId: selectedConversationId, page: 1, limit: 200 },
    { skip: !selectedConversationId }
  );

  const apiMessages = useMemo(
    () => ((messagesResponse?.data?.items || []) as ApiMessage[]).filter(Boolean),
    [messagesResponse]
  );

  const mergedMessages = useMemo(() => {
    const map = new Map<string, ApiMessage>();
    [...apiMessages, ...liveMessages]
      .filter((item) => item.conversationId === selectedConversationId)
      .forEach((item) => map.set(item.id, item));
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [apiMessages, liveMessages, selectedConversationId]);

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = conversations.map((conv) => ({
      id: conv.id,
      name: conv.otherUser?.name || 'User',
      avatar: conv.otherUser?.avatar || '',
      lastMessage: conv.lastMessage || 'No messages yet',
      time: conv.lastMessageAt
        ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
      unread: 0,
      online: true,
      packageLabel: conv.packageTitle || conv.orderName || 'Package',
      orderLabel: conv.orderNumber || '',
    }));

    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q) || c.orderLabel.toLowerCase().includes(q));
  }, [conversations, search]);

  const selectedContact = useMemo(
    () => filteredContacts.find((c) => c.id === selectedConversationId) || filteredContacts[0] || null,
    [filteredContacts, selectedConversationId]
  );

  useEffect(() => {
    if (!orderIdParam) return;
    let active = true;
    ensureConversationByOrder(orderIdParam)
      .unwrap()
      .then((res) => {
        if (!active) return;
        const cid = String((res?.data as any)?.id || '');
        if (cid) {
          setEnsuredConversationId(cid);
          refetchConversations();
          refetchMessages();
        }
      })
      .catch(() => {
        toast.error('Could not initialize conversation for this order.');
      });

    return () => {
      active = false;
    };
  }, [orderIdParam, ensureConversationByOrder, refetchConversations, refetchMessages]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('auth_token');
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!token || !socketUrl) return;

    const socket = io(socketUrl, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: `Bearer ${token}`,
      },
    });
    socketRef.current = socket;

    socket.on('chat:created', (payload: { conversationId?: string }) => {
      if (payload?.conversationId) {
        setManualConversationId(payload.conversationId);
      }
      refetchConversations();
    });

    socket.on('chat:message:new', (payload: ApiMessage) => {
      setLiveMessages((prev) => (prev.some((item) => item.id === payload.id) ? prev : [...prev, payload]));
      if (payload.conversationId === selectedConversationId) {
        refetchMessages();
      } else if (String(payload.senderId) !== String(user?.id)) {
        toast.info('New message received');
      }
      refetchConversations();
    });

    socket.on('chat:conversation:updated', () => {
      refetchConversations();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [refetchConversations, refetchMessages, selectedConversationId, user?.id]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;

    try {
      const result = await sendConversationMessage({
        conversationId: selectedConversationId,
        text: newMessage.trim(),
      }).unwrap();
      const message = (result?.data || null) as ApiMessage | null;
      if (message) {
        setLiveMessages((prev) => (prev.some((item) => item.id === message.id) ? prev : [...prev, message]));
      }
      setNewMessage('');
      refetchMessages();
      refetchConversations();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send message.');
    }
  };

  const handleAction = (action: string) => {
    toast.success(`Action: ${action} processed.`);
  };

  const startCall = (type: 'voice' | 'video') => {
    setActiveCall(type);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-100 flex-col transition-all duration-300`}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
              <MoreVertical size={20} />
            </Button>
          </div>
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2286BE] transition-colors" />
            <Input placeholder="Search conversations..." className="h-12 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-medium" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  setManualConversationId(contact.id);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${selectedConversationId === contact.id ? 'bg-primary-soft shadow-sm' : 'hover:bg-slate-50'}`}
              >
                <div className="relative group">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                      {contact.avatar ? <AvatarImage src={contact.avatar} /> : null}
                      <AvatarFallback className="bg-slate-100 text-slate-500">
                        <User size={14} />
                      </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold truncate ${selectedConversationId === contact.id ? 'text-[#2286BE]' : 'text-slate-900'}`}>{contact.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{contact.time}</span>
                  </div>
                  <p className="text-[11px] truncate font-black uppercase tracking-wider text-[#2286BE]/80 mb-0.5">
                    {contact.packageLabel || 'Package'}
                  </p>
                  <p className="text-sm truncate text-slate-400 font-medium">{contact.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col bg-slate-50/30 relative">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(true)}>
              <ArrowLeft size={20} />
            </Button>
            <div className="relative">
              <Avatar className="h-10 w-10 border border-slate-100">
                {selectedContact?.avatar ? <AvatarImage src={selectedContact.avatar} /> : null}
                <AvatarFallback className="bg-slate-100 text-slate-500">
                  <User size={14} />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-none">{selectedContact?.name || 'Conversation'}</h3>
              <p className="text-[10px] font-bold text-[#2286BE] uppercase tracking-widest mt-1">
                {selectedContact?.orderLabel || (userRole === 'provider' ? 'Client chat' : 'Provider chat')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-slate-400 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl" onClick={() => startCall('voice')}>
              <Phone size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-slate-400 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl" onClick={() => startCall('video')}>
              <Video size={20} />
            </Button>
            <Button variant="ghost" size="icon" className={`text-slate-400 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl transition-colors ${isInfoPanelOpen ? 'text-[#2286BE] bg-primary-soft' : ''}`} onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}>
              <Info size={20} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl">
                  <MoreVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                <DropdownMenuItem onClick={() => handleAction('History Cleared')} className="py-2.5 rounded-lg cursor-pointer">
                  Clear History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('User Blocked')} className="py-2.5 rounded-lg cursor-pointer">
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center my-4">
              <span className="bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Today</span>
            </div>

            <AnimatePresence initial={false}>
              {mergedMessages.map((message) => {
                const mine = String(message.senderId) === String(user?.id || '');
                const senderName = mine
                  ? user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'You'
                  : selectedContact?.name || 'User';
                const senderAvatar = mine ? (user?.avatar || '') : (selectedContact?.avatar || '');
                return (
                  <motion.div key={message.id} initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-2 max-w-[90%] md:max-w-[75%] ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className="h-8 w-8 border border-slate-100 shrink-0">
                        {senderAvatar ? <AvatarImage src={senderAvatar} /> : null}
                        <AvatarFallback className="bg-slate-100 text-slate-500">
                          <User size={12} />
                        </AvatarFallback>
                      </Avatar>
                      <div className={`px-5 py-3.5 rounded-[2rem] shadow-sm relative group ${mine ? 'bg-[#2286BE] text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                        <p className={`text-[11px] font-black mb-1 ${mine ? 'text-white/80 text-right' : 'text-slate-500'}`}>{senderName}</p>
                        <p className="text-sm md:text-base font-medium leading-relaxed">{message.text}</p>
                        <div className={`flex items-center gap-1.5 mt-1.5 ${mine ? 'justify-end text-white/70' : 'text-slate-400'}`}>
                          <span className="text-[10px] font-bold">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {mine ? <CheckCheck size={14} className="text-white" /> : null}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <footer className="p-6 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3 bg-slate-50 h-16 px-4 rounded-[2rem] border border-slate-100 focus-within:border-[#2286BE] focus-within:ring-4 focus-within:ring-[#2286BE]/5 transition-all">
            <Button type="button" variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-[#2286BE] hover:bg-white shrink-0">
              <Paperclip size={20} />
            </Button>
            <Input
              ref={messageInputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onFocus={() => setIsInfoPanelOpen(false)}
              onClick={() => messageInputRef.current?.focus()}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none font-medium text-slate-700 h-full cursor-text"
            />
            <Button type="button" variant="ghost" size="icon" className="hidden sm:inline-flex rounded-full text-slate-400 hover:text-[#2286BE] hover:bg-white shrink-0">
              <Smile size={20} />
            </Button>
            <Button type="submit" disabled={!newMessage.trim() || isSending} className={`rounded-full flex items-center justify-center p-0 h-10 w-10 shrink-0 transition-all ${newMessage.trim() ? 'bg-[#2286BE] text-white shadow-lg shadow-primary/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
              <Send size={18} />
            </Button>
          </form>
        </footer>
      </main>
    </div>
  );
}
