'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, MapPin, Bell, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BRAND } from '@/lib/constants';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ClientDashboardClient() {
  const { user } = useAuth();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
    user?.name ||
    'Member';
  const firstName = displayName.split(' ')[0] || 'Member';

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
           <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back, {firstName} 👋</h1>
             <p className="text-slate-500 mt-2 text-lg">Manage your ongoing services and explore new opportunities on {BRAND.name}.</p>
           </div>
           <div className="flex gap-4">
             <Link href="/services">
                <Button className="bg-[#2286BE] hover:bg-[#1b6da0] px-6 h-12 font-bold shadow-lg shadow-[#2286BE]/20 rounded-xl transition-all">Find a Service</Button>
             </Link>
             <Link href="/post-request">
                <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-[#2286BE] hover:border-[#2286BE] bg-white h-12 px-6 font-bold rounded-xl shadow-sm transition-all">Post Request</Button>
             </Link>
           </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
           <motion.div variants={item}>
             <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
               <CardHeader className="py-5 pb-2">
                 <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Active Orders</CardTitle>
               </CardHeader>
               <CardContent className="pb-6">
                 <div className="text-4xl font-black text-slate-900">2</div>
                 <div className="flex items-center text-xs text-amber-500 font-bold mt-2 bg-amber-50 w-fit px-2 py-1 rounded-full">
                    <Clock size={12} className="mr-1" /> 1 scheduled
                 </div>
               </CardContent>
             </Card>
           </motion.div>

           <motion.div variants={item}>
             <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
               <CardHeader className="py-5 pb-2">
                 <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Completed</CardTitle>
               </CardHeader>
               <CardContent className="pb-6">
                 <div className="text-4xl font-black text-slate-900">14</div>
                 <div className="flex items-center text-xs text-[#2286BE] font-bold mt-2 bg-[#2286BE]/5 w-fit px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} className="mr-1" /> Always on time
                 </div>
               </CardContent>
             </Card>
           </motion.div>

           <motion.div variants={item}>
             <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
               <CardHeader className="py-5 pb-2">
                 <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Saved Services</CardTitle>
               </CardHeader>
               <CardContent className="pb-6">
                 <div className="text-4xl font-black text-slate-900">5</div>
                 <p className="text-xs text-[#2286BE] font-bold mt-2 hover:underline cursor-pointer"><Link href="/client/saved-services">View Favorites →</Link></p>
               </CardContent>
             </Card>
           </motion.div>

           <motion.div variants={item}>
             <Card className="border-none shadow-lg shadow-[#2286BE]/10 bg-gradient-to-br from-[#2286BE] to-[#1b6da0] text-white group hover:scale-[1.02] transition-transform duration-300">
               <CardHeader className="py-5 pb-2">
                 <CardTitle className="text-[12px] font-bold text-blue-100 uppercase tracking-widest flex items-center">
                    <Bell size={14} className="mr-2 animate-bounce"/> Inbox
                 </CardTitle>
               </CardHeader>
               <CardContent className="pb-6">
                 <div className="text-4xl font-black">3</div>
                 <p className="text-xs text-blue-100 font-medium mt-2">New messages from providers</p>
               </CardContent>
             </Card>
           </motion.div>
        </motion.div>

        {/* Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* Left: Recent Orders */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="lg:col-span-2"
           >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Orders</h2>
                <Link href="/client/orders" className="text-[13px] font-bold text-[#2286BE] hover:underline bg-[#2286BE]/5 px-3 py-1.5 rounded-full transition-all uppercase tracking-wider">All History</Link>
              </div>
              
              <div className="space-y-4">
                  {[{ id: 'ORD-2026-001', title: 'Expert Plumbing & Pipe Repair', category: 'Plumbing', status: 'In Progress', amount: '1,100', provider: 'QuickFix Team', time: 'Tomorrow, 10:00 AM', icon: 0 }, { id: 'ORD-2026-002', title: 'Professional Deep House Cleaning', category: 'Cleaning', status: 'Delivered', amount: '1,550', provider: 'Rahim Uddin', time: 'Oct 24, 2025', icon: 1 }].map((order, idx) => (
                   <motion.div 
                    key={idx}
                    whileHover={{ x: 8 }}
                    className="p-1 px-1"
                   >
                    <Link href={`/client/orders/${order.id}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col sm:flex-row gap-6 group hover:shadow-md hover:border-[#2286BE]/30 transition-all duration-300 cursor-pointer">
                       <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center ${idx === 0 ? 'bg-amber-50 text-amber-500' : 'bg-[#2286BE]/5 text-[#2286BE]'}`}>
                          {idx === 0 ? <Clock size={28} /> : <CheckCircle2 size={28} />}
                       </div>
                       <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-3">
                             <div>
                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#2286BE] transition-colors">{order.title}</h3>
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
                                  Category: {order.category}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-bold text-slate-400">#{order.id}</span>
                                  <Badge variant="secondary" className={`text-[10px] font-bold uppercase border-none px-2 rounded-md ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-[#2286BE]/5 text-[#2286BE]'}`}>
                                    {order.status}
                                  </Badge>
                                </div>
                             </div>
                             <div className="mt-3 sm:mt-0 text-right">
                                <p className="font-black text-xl text-slate-900 leading-none">${order.amount}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Paid via Stripe</p>
                             </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-5 text-sm pt-4 border-t border-slate-50">
                             <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7 border-2 border-white ring-2 ring-slate-50">
                                  <AvatarImage src={`https://images.unsplash.com/photo-${idx === 0 ? '1500648767791-00dcc994a43e' : '1507003211169-0a1dd7228f2d'}?q=80&w=64&h=64&auto=format&fit=crop`} />
                                  <AvatarFallback className="bg-slate-100 text-[10px] font-bold">U</AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-slate-700">{order.provider}</span>
                             </div>
                             <div className="flex items-center text-slate-500 font-medium">
                                <Clock size={14} className="mr-1.5" />
                                {order.time}
                             </div>
                          </div>
                       </div>
                    </div>
                    </Link>
                   </motion.div>
                 ))}
              </div>
           </motion.div>

           {/* Right: Recommendations */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
           >
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center">
                <MapPin size={22} className="mr-2 text-[#2286BE]" /> Near Your Location
              </h2>
              <div className="space-y-4">
                 {[{ id: 's1', title: 'AC Servicing & Master Cleaning', img: 'photo-1581578731548-c64695ce6958', price: '800' }, { id: 's2', title: 'At-home Bridal Makeup', img: 'photo-1522335789203-aabd1fc54bc9', price: '2500' }, { id: 's3', title: 'Pest Control for Apartments', img: 'photo-1613214150384-633182883395', price: '1400' }].map((svc, idx) => (
                   <Link href={`/services/${svc.id}`} key={svc.id}>
                   <motion.div 
                    whileHover={{ scale: 1.03 }}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex gap-4 group cursor-pointer hover:border-[#2286BE]/50 transition-all duration-300"
                   >
                      <div className="h-16 w-16 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden relative shadow-inner">
                         <Image src={`https://images.unsplash.com/${svc.img}?q=80&w=150&h=150&auto=format&fit=crop`} alt="Service thumbnail" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-[#2286BE] transition-colors">{svc.title}</h4>
                        <div className="flex items-center mt-1.5">
                           <Star size={12} className="text-amber-400 fill-amber-400 mr-1" />
                           <span className="text-[12px] font-bold text-slate-700">4.9</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center">
                              <MapPin size={10} className="mr-1" /> {(1.2 + idx * 0.5).toFixed(1)} km away
                           </p>
                           <p className="text-xs font-black text-slate-900">${svc.price}</p>
                        </div>
                      </div>
                   </motion.div>
                   </Link>
                 ))}
                 
                 <Link href="/services" className="w-full block">
                   <Button variant="ghost" className="w-full text-[#2286BE] font-bold text-sm hover:bg-[#2286BE]/5 rounded-xl h-11 py-0 transition-colors">
                      Discover More Services
                   </Button>
                 </Link>
              </div>
           </motion.div>

        </div>
      </div>
    </div>
  );
}
