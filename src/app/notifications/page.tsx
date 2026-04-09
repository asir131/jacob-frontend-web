'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, MessageSquare, CreditCard, ChevronRight, Filter, CheckCircle2, Trash2, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocketNotifications } from '@/contexts/SocketContext';

const initialNotifications = [
  {
    id: 1,
    type: 'order',
    title: 'New Booking Request!',
    description: 'Ahmed Rashid requested a "Premium Plumbing Service" at 10:00 AM tomorrow.',
    time: '2 mins ago',
    unread: true,
    icon: <Package className="text-blue-500" />,
    color: 'bg-blue-50',
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message from Sarah',
    description: '"I have finished the deep cleaning. Please check the results and let me know."',
    time: '45 mins ago',
    unread: true,
    icon: <MessageSquare className="text-primary" />,
    color: 'bg-primary-soft',
  },
  {
    id: 3,
    type: 'payment',
    title: 'Payment Received',
    description: 'A payment of $25 for "Home Cleaning" has been credited to your wallet.',
    time: '3 hours ago',
    unread: false,
    icon: <CreditCard className="text-[#2286BE]" />,
    color: 'bg-primary-soft',
  },
  {
    id: 4,
    type: 'system',
    title: 'Level Up!',
    description: 'Congratulations! You have been promoted to "Level 2 Professional" based on your 5-star reviews.',
    time: 'Yesterday',
    unread: false,
    icon: <Sparkles className="text-amber-500" />,
    color: 'bg-amber-50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications: liveNotifications,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useSocketNotifications();
  const [notifications, setNotifications] = useState(() =>
    initialNotifications.map((item) => ({ ...item, unread: false }))
  );
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    markAllNotificationsAsRead();
  }, [markAllNotificationsAsRead]);

  const socketMappedNotifications = liveNotifications.map((item, index) => ({
    id: Number(`9${index + 1}`),
    type: item.type,
    title: item.title,
    description: item.description,
    time: new Date(item.createdAt).toLocaleString(),
    unread: item.unread,
    icon: <Bell className="text-[#2286BE]" />,
    color: 'bg-primary-soft',
    targetPath: typeof item?.data?.targetPath === 'string' ? item.data.targetPath : '',
  }));

  const allNotifications = [...socketMappedNotifications, ...notifications];

  const filteredNotifications = allNotifications.filter(n => 
    filter === 'all' ? true : n.type === filter
  );

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    markAllNotificationsAsRead();
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationClick = (targetPath?: string) => {
    if (!targetPath) return;
    router.push(targetPath);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-8 w-8 rounded-lg bg-[#2286BE] flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Bell size={18} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest text-[#2286BE]">Activity Feed</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notifications</h1>
           </div>
           <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={markAllAsRead}
                className="font-bold text-slate-500 hover:text-[#2286BE] hover:bg-primary-soft rounded-xl px-6"
              >
                 Mark all as read
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setNotifications([]);
                  clearNotifications();
                }}
                className="border-slate-200 text-slate-600 font-bold rounded-xl h-11 shadow-sm hover:border-[#2286BE] hover:text-[#2286BE]"
              >
                 Clear History
              </Button>
           </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
           {['all', 'order', 'message', 'payment', 'system'].map(f => (
             <Button
               key={f}
               variant={filter === f ? 'default' : 'ghost'}
               onClick={() => setFilter(f)}
               className={`
                 capitalize font-bold rounded-xl h-10 px-6 transition-all
                 ${filter === f ? 'bg-[#2286BE] text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
               `}
             >
               {f}
             </Button>
           ))}
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
           <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  variants={itemVariants}
                  exit={{ opacity: 0, x: 50 }}
                  layout
                >
                   <Card className={`
                     border-none shadow-sm hover:shadow-xl transition-all duration-300 group rounded-[2rem] overflow-hidden
                     ${notif.unread ? 'bg-white ring-2 ring-primary/5 shadow-primary/5' : 'bg-white/60 shadow-slate-200/50'}
                     ${'targetPath' in notif && notif.targetPath ? 'cursor-pointer' : ''}
                   `}>
                      <CardContent
                        className="p-0"
                        onClick={() => handleNotificationClick(('targetPath' in notif ? notif.targetPath : '') as string)}
                      >
                         <div className="flex items-start gap-5 p-6 md:p-8">
                            <div className={`
                              h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500
                              ${notif.color}
                            `}>
                               {notif.icon}
                            </div>
                            <div className="flex-1 overflow-hidden">
                               <div className="flex items-center justify-between gap-4 mb-2">
                                  <h3 className={`text-lg font-black tracking-tight ${notif.unread ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {notif.title}
                                  </h3>
                                  <div className="flex items-center gap-2 text-slate-400 shrink-0">
                                     <Clock size={14} />
                                     <span className="text-[10px] font-bold uppercase tracking-widest">{notif.time}</span>
                                  </div>
                               </div>
                               <p className={`text-sm leading-relaxed mb-4 ${notif.unread ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                                 {notif.description}
                               </p>
                               <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Button size="sm" className="bg-[#2286BE] hover:bg-[#059669] text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-lg">
                                     Action Needed
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notif.id);
                                    }}
                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-lg"
                                  >
                                     <Trash2 size={14} className="mr-2" /> Dismiss
                                  </Button>
                               </div>
                            </div>
                            {notif.unread && (
                              <div className="h-3 w-3 bg-[#2286BE] rounded-full shrink-0 shadow-lg shadow-primary/50 mt-1" />
                            )}
                         </div>
                      </CardContent>
                   </Card>
                </motion.div>
              ))}
           </AnimatePresence>

           {filteredNotifications.length === 0 && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100"
             >
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                   <Bell size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">All caught up!</h3>
                <p className="text-slate-400 font-medium max-w-xs mx-auto">
                  You have no notifications in this category. We&apos;ll let you know when something happens!
                </p>
             </motion.div>
           )}
        </motion.div>

        {/* Suggestion Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-[#2286BE] rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
        >
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-md text-center md:text-left">
                 <h2 className="text-3xl font-black mb-4 leading-tight">Enable Push Notifications?</h2>
                 <p className="text-white/80 font-medium leading-relaxed">
                   Never miss a booking or a message. Get real-time updates directly on your device.
                 </p>
              </div>
              <div className="flex gap-4">
                 <Button className="bg-white text-[#2286BE] hover:bg-primary-soft font-black h-14 px-8 rounded-2xl shadow-xl">
                   Enable Now
                 </Button>
                 <Button variant="ghost" className="text-white hover:bg-white/10 font-bold h-14 px-8 rounded-2xl">
                   Maybe Later
                 </Button>
              </div>
           </div>
           
           {/* Abstract Background Shapes */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        </motion.div>

      </div>
    </div>
  );
}
