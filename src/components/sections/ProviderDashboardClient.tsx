'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { DollarSign, CheckSquare, Clock, TrendingUp, PlusCircle, Share2, Star } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import { toast } from 'sonner';
import {
  useAcceptProviderOrderMutation,
  useDeclineProviderOrderMutation,
  useGetProviderDashboardQuery,
} from '@/store/services/apiSlice';
import { useSocketNotifications } from '@/contexts/SocketContext';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const formatRelativeTime = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function ProviderDashboardClient() {
  const { data, isLoading, refetch } = useGetProviderDashboardQuery();
  const [acceptOrder] = useAcceptProviderOrderMutation();
  const [declineOrder] = useDeclineProviderOrderMutation();
  const { notifications } = useSocketNotifications();
  const refetchMarkerRef = useRef<string>('');
  const latestNotification = notifications[0];

  const summary = data?.data;
  const revenue = Number(summary?.revenue?.totalEarnings || 0);
  const activeOrders = Number(summary?.orders?.activeOrders || 0);
  const pendingOrders = Number(summary?.orders?.pendingOrders || 0);
  const completedOrders = Number(summary?.orders?.completedOrders || 0);
  const completionRate = Number(summary?.orders?.completionRate || 0);
  const averageRating = Number(summary?.ratings?.averageRating || 0);
  const reviewCount = Number(summary?.ratings?.reviewCount || 0);

  const chartData = summary?.earningsAnalytics?.length
    ? summary.earningsAnalytics.map((entry) => ({
        name: String(entry.name || ''),
        earnings: Number(entry.earnings || 0),
      }))
    : [
        { name: 'Jan', earnings: 0 },
        { name: 'Feb', earnings: 0 },
        { name: 'Mar', earnings: 0 },
        { name: 'Apr', earnings: 0 },
        { name: 'May', earnings: 0 },
        { name: 'Jun', earnings: 0 },
        { name: 'Jul', earnings: 0 },
        { name: 'Aug', earnings: 0 },
        { name: 'Sep', earnings: 0 },
        { name: 'Oct', earnings: 0 },
        { name: 'Nov', earnings: 0 },
        { name: 'Dec', earnings: 0 },
      ];

  const requests = (summary?.pendingRequests || []).slice(0, 2).map((request) => {
    const client = (request.client as Record<string, unknown>) || {};
    return {
      id: String(request.id || request.orderId || request.orderNumber || ''),
      title: String(request.title || request.orderName || 'Service order'),
      category: String(request.category || request.categoryName || 'General'),
      customer: String(request.customer || client.name || 'Client'),
      address: String(request.address || request.serviceAddress || request.location || 'Location not set'),
      time: String(request.time || request.createdAt || ''),
      avatar: String(request.avatar || client.avatar || ''),
    };
  });

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    try {
      if (action === 'accept') {
        await acceptOrder(id).unwrap();
      } else {
        await declineOrder(id).unwrap();
      }
      toast.success(`Order ${action === 'accept' ? 'accepted' : 'declined'} successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${action} order.`);
    }
  };

  useEffect(() => {
    if (!latestNotification) return;
    const notificationType = String((latestNotification.data || {})?.notificationType || '');
    if (notificationType !== 'order_created') return;
    if (refetchMarkerRef.current === latestNotification.id) return;
    refetchMarkerRef.current = latestNotification.id;
    refetch();
  }, [latestNotification, refetch]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#2286BE]/5 text-[#2286BE] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Provider Hub</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Provider Dashboard</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your business, track growth, and serve your neighborhood on {BRAND.name}.</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + '/provider/profile');
                toast.success('Profile link copied to clipboard!');
              }}
              className="border-slate-200 text-slate-600 hover:text-[#2286BE] hover:border-[#2286BE] bg-white h-12 px-6 font-bold rounded-xl shadow-sm transition-all"
            >
              <Share2 size={18} className="mr-2" /> Share Profile
            </Button>
            <Link href="/provider/gigs/create">
              <Button className="bg-[#2286BE] hover:bg-[#1b6da0] px-6 h-12 font-bold shadow-lg shadow-[#2286BE]/20 rounded-xl transition-all">
                <PlusCircle size={18} className="mr-2" /> Create New Gig
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={item}>
            <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
              <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
                <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Revenue</CardTitle>
                <div className="p-2 bg-[#2286BE]/5 rounded-lg" aria-hidden="true">
                  <DollarSign size={16} className="text-[#2286BE]" />
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black text-slate-900">${revenue.toFixed(2)}</div>
                    <div className="flex items-center text-xs text-[#2286BE] font-bold mt-2">
                      <TrendingUp size={14} className="mr-1" /> Total earnings
                    </div>
                  </div>
                  <Link href="/provider/withdrawals">
                    <Button size="sm" className="h-9 px-4 rounded-lg bg-[#2286BE]/10 text-[#2286BE] hover:bg-[#2286BE] hover:text-white font-bold transition-all border-none">
                      Withdraw
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
              <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
                <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Active Orders</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg" aria-hidden="true">
                  <Clock size={16} className="text-blue-500" />
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="text-3xl font-black text-slate-900">{isLoading ? '0' : activeOrders}</div>
                <p className="text-xs text-slate-400 font-bold mt-2">{pendingOrders} waiting confirmation</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
              <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
                <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Completed</CardTitle>
                <div className="p-2 bg-indigo-50 rounded-lg" aria-hidden="true">
                  <CheckSquare size={16} className="text-indigo-500" />
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="text-3xl font-black text-slate-900">{isLoading ? '0' : completedOrders}</div>
                <p className="text-xs text-slate-400 font-bold mt-2">{completionRate.toFixed(1)}% Completion Rate</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
              <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
                <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Avg. Rating</CardTitle>
                <div className="p-2 bg-amber-50 rounded-lg" aria-hidden="true">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="text-3xl font-black text-slate-900">{averageRating.toFixed(1)}</div>
                <p className="text-xs text-slate-400 font-bold mt-2">Based on {reviewCount} reviews</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Earnings Analytics</CardTitle>
                <CardDescription className="font-medium">Total income generated across all services on {BRAND.name}.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2286BE" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2286BE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} tickFormatter={(val) => `$${Number(val).toLocaleString()}`} dx={-10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                      itemStyle={{ color: '#2286BE', fontWeight: 900 }}
                    />
                    <Area type="monotone" dataKey="earnings" stroke="#2286BE" strokeWidth={5} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-none shadow-sm bg-white rounded-2xl h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">New Requests</CardTitle>
                <CardDescription className="font-medium">Pending orders for your approval</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                      <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Clock size={28} />
                      </div>
                      <p className="text-base font-black text-slate-400">No new requests</p>
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Check back later</p>
                    </div>
                  ) : (
                    requests.map((req) => (
                      <motion.div
                        key={req.id}
                        whileHover={{ y: -4 }}
                        className="p-5 border border-slate-100 rounded-2xl hover:border-[#2286BE]/30 hover:shadow-xl transition-all cursor-pointer group bg-white shadow-sm"
                      >
                        <Link href={`/provider/orders/${req.id}`}>
                          <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-wider">
                            <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg">Incoming Order</span>
                            <span className="text-slate-400">{formatRelativeTime(req.time)}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-3 leading-snug group-hover:text-[#2286BE] transition-colors line-clamp-2">
                            {req.title}
                          </h4>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                            Category: {req.category}
                          </p>
                          <div className="flex items-center gap-2 mb-5">
                            <Avatar className="h-8 w-8 border-2 border-white ring-2 ring-slate-50 shadow-sm">
                              <AvatarImage src={req.avatar} alt="Customer" />
                              <AvatarFallback className="text-[10px] font-bold bg-slate-100">{req.customer?.[0] || 'C'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-800 tracking-tight">{req.customer}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.address}</span>
                            </div>
                          </div>
                        </Link>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAction(req.id, 'decline');
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 border-slate-200 transition-all hover:bg-slate-50"
                          >
                            Decline
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAction(req.id, 'accept');
                            }}
                            size="sm"
                            className="w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest bg-[#2286BE] hover:bg-[#1b6da0] transition-all shadow-lg shadow-[#2286BE]/20"
                          >
                            Accept
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <Link href="/provider/orders" className="w-full block">
                    <Button variant="ghost" className="w-full h-12 text-sm font-black uppercase tracking-widest text-[#2286BE] hover:bg-[#2286BE]/5 rounded-xl mt-2 transition-colors">
                      All Orders History →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
