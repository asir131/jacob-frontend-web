'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MessageSquare, Check, X, MapPin, Calendar as CalendarIcon, Clock, AlertCircle, User, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Link from 'next/link';

const INCOMING_ORDERS = [
  { id: 'ORD-101', client: 'Farhan Ahmed', service: 'Deep House Cleaning', date: 'Oct 23, 2025', time: '10:00 AM', status: 'Pending', price: 154, location: 'Gulshan 2, Dhaka' },
  { id: 'ORD-102', client: 'Sadia Rahman', service: 'AC Master Servicing', date: 'Oct 24, 2025', time: '02:00 PM', status: 'Pending', price: 80, location: 'Banani, Dhaka' },
  { id: 'ORD-103', client: 'Tahsan Khan', service: 'Premium Furniture Polish', date: 'Oct 25, 2025', time: '09:00 AM', status: 'In Progress', price: 120, location: 'Dhanmondi, Dhaka' },
  { id: 'ORD-104', client: 'Rafa Islam', service: 'Full Kitchen Deep Cleaning', date: 'Oct 20, 2025', time: '11:00 AM', status: 'Completed', price: 200, location: 'Mirpur 10, Dhaka' },
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
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 }
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState(INCOMING_ORDERS);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.client.toLowerCase().includes(search.toLowerCase()) || 
                         o.id.toLowerCase().includes(search.toLowerCase()) ||
                         o.service.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase().replace(' ', '') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAccept = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'In Progress' } : o));
    toast.success('Order accepted! Client has been notified.');
  };

  const handleReject = (id: string) => {
    if (!rejectReason) {
      toast.error('Please select a reason for rejection.');
      return;
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
    toast.success('Order declined.');
    setRejectReason('');
    setRejectNote('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
           <div>
             <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight text-center md:text-left">Order Management</h1>
             <p className="text-slate-500 mt-2 text-lg text-center md:text-left">Manage incoming job requests and track your active tasks.</p>
           </div>
           
           <div className="flex flex-wrap items-center gap-3">
             <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search orders..." 
                  className="pl-12 h-14 bg-white border-none shadow-sm rounded-2xl font-medium"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
             </div>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-full sm:w-[180px] h-14 bg-white border-none shadow-sm rounded-2xl font-bold">
                 <SelectValue placeholder="All Status" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-none shadow-2xl">
                 <SelectItem value="all">All Status</SelectItem>
                 <SelectItem value="pending">Pending</SelectItem>
                 <SelectItem value="inprogress">In Progress</SelectItem>
                 <SelectItem value="completed">Completed</SelectItem>
                 <SelectItem value="cancelled">Cancelled</SelectItem>
               </SelectContent>
             </Select>
           </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredOrders.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredOrders.map((order) => (
                <Link href={`/provider/orders/${order.id}`} key={order.id} className="group block">
                  <motion.div variants={itemVariants} className="h-full">
                    <Card className="border-none shadow-sm hover:shadow-xl hover:shadow-[#2286BE]/10 transition-all duration-500 rounded-[2.5rem] bg-white h-full flex flex-col overflow-hidden border border-slate-50">
                      <div className="p-8 border-b border-slate-50 flex justify-between items-start">
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&h=64&auto=format&fit=crop`} alt={order.client} />
                            <AvatarFallback>{order.client[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-black text-slate-900 text-sm tracking-tight">{order.client}</p>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{order.id}</p>
                          </div>
                        </div>
                        <Badge 
                          className={`
                            px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border-none
                            ${order.status === 'Completed' ? 'bg-green-50 text-green-600' : 
                              order.status === 'In Progress' ? 'bg-[#2286BE]/10 text-[#2286BE]' : 
                              order.status === 'Pending' ? 'bg-blue-50 text-blue-600' : 
                              'bg-red-50 text-red-600'}
                          `}
                        >
                          {order.status}
                        </Badge>
                      </div>

                      <CardContent className="p-8 flex-1 flex flex-col">
                        <div className="mb-8 flex-1">
                          <h3 className="font-black text-xl text-slate-900 leading-tight mb-4 group-hover:text-[#2286BE] transition-colors">{order.service}</h3>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 text-slate-500">
                              <MapPin size={16} className="mt-0.5 text-slate-300 flex-shrink-0" />
                              <p className="text-sm font-bold text-slate-500">{order.location}</p>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                              <CalendarIcon size={16} className="text-slate-300 flex-shrink-0" />
                              <p className="text-sm font-bold text-slate-500">{order.date} • {order.time}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Earning</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">${order.price.toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                             <Link href={`/messages?user=USR-123`} onClick={(e) => e.stopPropagation()}>
                               <Button variant="ghost" size="icon" className="h-12 w-12 text-slate-400 hover:text-[#2286BE] hover:bg-[#2286BE]/5 rounded-[1.2rem] transition-all">
                                 <MessageSquare size={20} />
                               </Button>
                             </Link>
                             <Link href={`/client/USR-123`} onClick={(e) => e.stopPropagation()}>
                               <Button variant="ghost" size="icon" className="h-12 w-12 text-slate-400 hover:text-[#2286BE] hover:bg-[#2286BE]/5 rounded-[1.2rem] transition-all">
                                 <User size={20} />
                               </Button>
                             </Link>
                          </div>
                        </div>

                        <div className="mt-8">
                          {order.status === 'Pending' && (
                             <div className="grid grid-cols-2 gap-4">
                               <Button variant="outline" className="h-14 font-black uppercase tracking-widest text-[11px] border-slate-100 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all" onClick={(e) => { e.preventDefault(); handleReject(order.id); }}>Decline</Button>
                               <Button className="h-14 font-black uppercase tracking-widest text-[11px] bg-[#2286BE] hover:bg-[#1b6da0] text-white shadow-xl shadow-[#2286BE]/20 rounded-2xl transition-all" onClick={(e) => { e.preventDefault(); handleAccept(order.id); }}>Accept Job</Button>
                             </div>
                          )}

                          {order.status === 'In Progress' && (
                             <Button className="w-full h-14 font-black uppercase tracking-widest text-[11px] bg-[#2286BE] hover:bg-[#1b6da0] shadow-xl shadow-[#2286BE]/30 text-white rounded-2xl transition-all">
                               <CheckCircle2 size={18} className="mr-2" /> Deliver Work
                             </Button>
                          )}

                          {order.status === 'Completed' && (
                            <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-[11px] border-slate-50 text-slate-300 cursor-default hover:bg-white rounded-2xl">
                               Order Finalized
                            </Button>
                          )}
                          
                          {order.status === 'Cancelled' && (
                            <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-[11px] border-red-50 text-red-200 cursor-default hover:bg-white rounded-2xl">
                               Booking Cancelled
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sm border border-dashed border-slate-200"
            >
              <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 text-slate-200">
                <AlertCircle size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No orders found</h3>
              <p className="text-slate-400 font-bold max-w-xs text-center leading-relaxed">
                Adjust your search or filters to find specific bookings.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
