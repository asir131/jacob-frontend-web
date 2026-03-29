'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, MessageSquare, MapPin, MoreVertical, Calendar as CalendarIcon, Package, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const MOCK_ORDERS = [
  {
    id: 'ORD-2026-001',
    status: 'In Progress',
    provider: 'QuickFix Team',
    service: 'Expert Plumbing & Pipe Repair',
    date: 'Oct 25, 2025',
    total: 1100,
    startTime: '10:00 AM'
  },
  {
    id: 'ORD-2026-002',
    status: 'Completed',
    provider: 'Rahim Uddin',
    service: 'Professional Deep House Cleaning',
    date: 'Oct 14, 2025',
    total: 1550,
    startTime: '02:30 PM'
  },
  {
    id: 'ORD-2026-003',
    status: 'Pending',
    provider: 'CoolBreeze Agency',
    service: 'AC Servicing & Master Cleaning',
    date: 'Oct 28, 2025',
    total: 850,
    startTime: '09:00 AM'
  },
  {
    id: 'ORD-2026-004',
    status: 'Cancelled',
    provider: 'Sadia Islam',
    service: 'At-home Bridal Makeup',
    date: 'Sep 30, 2025',
    total: 5050,
    startTime: '11:00 AM'
  }
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ClientOrdersPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesSearch = order.service.toLowerCase().includes(search.toLowerCase()) || 
                         order.id.toLowerCase().includes(search.toLowerCase()) ||
                         order.provider.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && order.status === 'Pending';
    if (activeTab === 'inprogress') return matchesSearch && order.status === 'In Progress';
    if (activeTab === 'completed') return matchesSearch && order.status === 'Completed';
    if (activeTab === 'cancelled') return matchesSearch && order.status === 'Cancelled';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
           <div>
             <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Orders</h1>
             <p className="text-slate-500 mt-2 text-lg">Manage your service bookings and track their progress.</p>
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search by order ID, service, or provider..." 
                  className="pl-10 h-12 w-full bg-white border-slate-200 focus:ring-primary/20" 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                />
             </div>
             <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 bg-white border-slate-200">
               <Filter size={20} className="text-slate-600" />
             </Button>
           </div>
        </motion.div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
           <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-8 inline-flex w-full md:w-auto overflow-x-auto hide-scrollbar">
              <TabsList className="bg-transparent h-10 w-full md:w-auto justify-start">
                 <TabsTrigger value="all" className="px-6 rounded-lg data-[state=active]:bg-[#2286BE] data-[state=active]:text-white">All</TabsTrigger>
                 <TabsTrigger value="pending" className="px-6 rounded-lg data-[state=active]:bg-[#2286BE] data-[state=active]:text-white">Pending</TabsTrigger>
                 <TabsTrigger value="inprogress" className="px-6 rounded-lg data-[state=active]:bg-[#2286BE] data-[state=active]:text-white">In Progress</TabsTrigger>
                 <TabsTrigger value="completed" className="px-6 rounded-lg data-[state=active]:bg-[#2286BE] data-[state=active]:text-white">Completed</TabsTrigger>
                 <TabsTrigger value="cancelled" className="px-6 rounded-lg data-[state=active]:bg-[#2286BE] data-[state=active]:text-white">Cancelled</TabsTrigger>
              </TabsList>
           </div>

           <TabsContent value={activeTab} className="mt-0 outline-none">
              <AnimatePresence mode="wait">
                {filteredOrders.length > 0 ? (
                  <motion.div 
                    key={activeTab + search}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                     {filteredOrders.map((order) => (
                       <motion.div key={order.id} variants={itemVariants}>
                         <Card className="overflow-hidden border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30 group-hover:bg-slate-50 transition-colors">
                               <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Order ID</span>
                                    <p className="text-xs font-bold text-slate-500">{order.id}</p>
                                  </div>
                                  <h3 className="font-bold text-xl text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{order.service}</h3>
                               </div>
                               <Badge 
                                 className={`
                                   px-3 py-1 rounded-full text-xs font-bold
                                   ${order.status === 'Completed' ? 'bg-[#2286BE]/10 text-[#2286BE] border-[#2286BE]/20' : 
                                     order.status === 'In Progress' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                     order.status === 'Pending' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                                     'bg-red-100 text-red-700 border-red-200'}
                                 `}
                               >
                                 {order.status}
                               </Badge>
                            </div>
                            <CardContent className="p-6">
                               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                                  <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex flex-shrink-0 items-center justify-center text-slate-600 font-black text-xl shadow-inner group-hover:from-primary/10 group-hover:to-primary/20 transition-all">
                                      {order.provider.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-slate-900 text-base">{order.provider}</p>
                                      <div className="flex flex-col gap-1 mt-1">
                                        <p className="text-xs text-slate-500 flex items-center font-medium">
                                          <MapPin size={12} className="mr-1.5 text-slate-400" /> Dhaka, Bangladesh
                                        </p>
                                        <p className="text-xs text-slate-500 flex items-center font-medium">
                                          <CalendarIcon size={12} className="mr-1.5 text-slate-400" /> {order.date} • {order.startTime}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:block justify-between items-center">
                                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 block sm:hidden">Total Amount</p>
                                     <div className="text-right">
                                       <p className="text-2xl font-black text-slate-900 tracking-tight">৳{order.total.toLocaleString()}</p>
                                       <p className="text-[10px] font-bold text-[#2286BE] bg-[#2286BE]/10 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-widest">Paid via App</p>
                                     </div>
                                  </div>
                               </div>
                               
                               <div className="grid grid-cols-2 gap-4">
                                 <Link href="/messages" className="w-full">
                                   <Button variant="outline" className="w-full h-12 font-bold text-slate-600 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all">
                                     <MessageSquare size={18} className="mr-2" /> Message
                                   </Button>
                                 </Link>
                                 <Link href={`/client/orders/${order.id}`} className="w-full">
                                   <Button className="w-full h-12 font-bold bg-[#2286BE] hover:bg-[#059669] shadow-lg shadow-[#2286BE]/20 active:scale-95 transition-all">
                                     {order.status === 'Completed' ? 'Leave Review' : 'Track Order'}
                                   </Button>
                                 </Link>
                               </div>
                            </CardContent>
                         </Card>
                       </motion.div>
                     ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300"
                  >
                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                      <Package size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders found</h3>
                    <p className="text-slate-500 max-w-xs text-center mb-8">
                      We couldn't find any orders matching your current filters or search criteria.
                    </p>
                    <Button 
                      onClick={() => {setSearch(''); setActiveTab('all');}}
                      variant="outline" 
                      className="border-slate-200"
                    >
                      Clear all filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
           </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
