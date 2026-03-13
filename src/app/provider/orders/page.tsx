'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, MessageSquare, Check, X, MapPin, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const INCOMING_ORDERS = [
  { id: 'ORD-101', client: 'Farhan Ahmed', service: 'Deep House Cleaning', date: 'Oct 23, 2025', time: '10:00 AM', status: 'Pending', price: 1500, location: 'Gulshan 2, Dhaka' },
  { id: 'ORD-102', client: 'Sadia Rahman', service: 'AC Master Servicing', date: 'Oct 24, 2025', time: '02:00 PM', status: 'Pending', price: 3000, location: 'Banani, Dhaka' },
  { id: 'ORD-103', client: 'Tahsan Khan', service: 'Premium Furniture Polish', date: 'Oct 25, 2025', time: '09:00 AM', status: 'In Progress', price: 4500, location: 'Dhanmondi, Dhaka' },
  { id: 'ORD-104', client: 'Rafa Islam', service: 'Full Kitchen Deep Cleaning', date: 'Oct 20, 2025', time: '11:00 AM', status: 'Completed', price: 1500, location: 'Mirpur 10, Dhaka' },
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

  const handleComplete = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Completed' } : o));
    toast.success('Awesome! Order marked as completed.');
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
             <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Order Management</h1>
             <p className="text-slate-500 mt-2 text-lg">Manage incoming job requests and track your active tasks.</p>
           </div>
           
           <div className="flex flex-wrap items-center gap-3">
             <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search by client, ID, or service..." 
                  className="pl-10 h-12 bg-white border-slate-200"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
             </div>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-full sm:w-[160px] h-12 bg-white">
                 <SelectValue placeholder="All Status" />
               </SelectTrigger>
               <SelectContent>
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
              key={statusFilter + search}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredOrders.map((order) => (
                <motion.div key={order.id} variants={itemVariants}>
                  <Card className="overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start group-hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.client}`} />
                          <AvatarFallback>{order.client.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{order.client}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.id}</p>
                        </div>
                      </div>
                      <Badge 
                        className={`
                          px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${order.status === 'Completed' ? 'bg-[#2286BE]/10 text-[#2286BE] border-[#2286BE]/20' : 
                            order.status === 'In Progress' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                            order.status === 'Pending' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                            'bg-red-100 text-red-700 border-red-200'}
                        `}
                      >
                        {order.status}
                      </Badge>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="mb-6">
                        <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2 group-hover:text-primary transition-colors">{order.service}</h3>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-slate-500">
                            <MapPin size={14} className="mt-0.5 text-slate-400 flex-shrink-0" />
                            <p className="text-xs font-medium">{order.location}</p>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <CalendarIcon size={14} className="text-slate-400 flex-shrink-0" />
                            <p className="text-xs font-medium">{order.date} • {order.time}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Earnings</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tight">৳{order.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-primary/5">
                            <MessageSquare size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50">
                            <AlertCircle size={18} />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        {order.status === 'Pending' && (
                          <>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="flex-1 h-11 font-bold border-red-200 text-red-600 hover:bg-red-50">Decline</Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-4" align="end">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-red-600">
                                    <X size={18} />
                                    <h4 className="font-bold">Decline Order</h4>
                                  </div>
                                  <p className="text-xs text-slate-500">Declining won't affect your rating if you provide a valid reason.</p>
                                  <Select value={rejectReason} onValueChange={setRejectReason}>
                                    <SelectTrigger className="w-full h-10">
                                      <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="distance">Too far from location</SelectItem>
                                      <SelectItem value="schedule">Schedule conflict</SelectItem>
                                      <SelectItem value="scope">Tool/Equipment unavailable</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input placeholder="Optional note..." value={rejectNote} onChange={e => setRejectNote(e.target.value)} />
                                  <Button onClick={() => handleReject(order.id)} className="w-full bg-red-600 hover:bg-red-700" size="sm">Confirm Decline</Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <Button className="flex-1 h-11 font-bold bg-[#2286BE] hover:bg-[#059669] shadow-lg shadow-[#2286BE]/20" onClick={() => handleAccept(order.id)}>Accept Job</Button>
                          </>
                        )}

                        {order.status === 'In Progress' && (
                          <Button className="w-full h-11 font-bold bg-slate-900 hover:bg-black shadow-lg shadow-black/10" onClick={() => handleComplete(order.id)}>
                            <Check size={18} className="mr-2" /> Mark as Completed
                          </Button>
                        )}

                        {order.status === 'Completed' && (
                          <Button variant="outline" className="w-full h-11 font-bold border-slate-200 text-slate-500 cursor-default hover:bg-white">
                            Job Completed
                          </Button>
                        )}
                        
                        {order.status === 'Cancelled' && (
                          <Button variant="outline" className="w-full h-11 font-bold border-red-100 text-red-400 cursor-default hover:bg-white">
                            Order Cancelled
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300"
            >
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500 max-w-xs text-center">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
