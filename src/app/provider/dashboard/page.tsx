'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { DollarSign, CheckSquare, Clock, TrendingUp, Users, PlusCircle, Share2, Star } from 'lucide-react';

const mockData = [
  { name: 'Jan', earnings: 4000 },
  { name: 'Feb', earnings: 6000 },
  { name: 'Mar', earnings: 5500 },
  { name: 'Apr', earnings: 9000 },
  { name: 'May', earnings: 12000 },
  { name: 'Jun', earnings: 15400 },
];

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

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
           <div>
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary-soft text-[#2286BE] text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Provider Hub</span>
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Provider Dashboard</h1>
             <p className="text-slate-500 mt-2 text-lg">Manage your business, track growth, and serve your neighborhood.</p>
           </div>
           <div className="flex gap-4">
             <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-[#2286BE] hover:border-[#2286BE] bg-white h-12 px-6 font-bold rounded-xl shadow-sm">
                <Share2 size={18} className="mr-2" /> Share Profile
             </Button>
             <Button className="bg-[#2286BE] hover:bg-[#059669] px-6 h-12 font-bold shadow-lg shadow-primary/20 rounded-xl">
                <PlusCircle size={18} className="mr-2" /> Create New Gig
             </Button>
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
               <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
                 <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Revenue</CardTitle>
                 <div className="p-2 bg-primary-soft rounded-lg"><DollarSign size={16} className="text-[#2286BE]" /></div>
               </CardHeader>
               <CardContent className="pb-6">
                 <div className="text-3xl font-black text-slate-900">৳ 15,400</div>
                 <div className="flex items-center text-xs text-[#2286BE] font-bold mt-2">
                    <TrendingUp size={14} className="mr-1" /> +20.5% growth
                 </div>
               </CardContent>
             </Card>
           </motion.div>

           <motion.div variants={item}>
             <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
               <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
                 <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Active Orders</CardTitle>
                 <div className="p-2 bg-blue-50 rounded-lg"><Clock size={16} className="text-blue-500" /></div>
               </CardHeader>
               <CardContent className="pb-6">
                 <div className="text-3xl font-black text-slate-900">5</div>
                 <p className="text-xs text-slate-400 font-bold mt-2">3 awaiting confirmation</p>
               </CardContent>
             </Card>
           </motion.div>

           <motion.div variants={item}>
             <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
               <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
                 <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Completed</CardTitle>
                 <div className="p-2 bg-indigo-50 rounded-lg"><CheckSquare size={16} className="text-indigo-500" /></div>
               </CardHeader>
               <CardContent className="pb-6">
                 <div className="text-3xl font-black text-slate-900">102</div>
                 <p className="text-xs text-slate-400 font-bold mt-2">98.5% Completion Rate</p>
               </CardContent>
             </Card>
           </motion.div>

           <motion.div variants={item}>
             <Card className="border-none shadow-md shadow-slate-200/50 bg-white group hover:scale-[1.02] transition-transform duration-300">
               <CardHeader className="flex flex-row items-center justify-between py-5 pb-2">
                 <CardTitle className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Avg. Rating</CardTitle>
                 <div className="p-2 bg-amber-50 rounded-lg"><Star size={16} className="text-amber-500 fill-amber-500" /></div>
               </CardHeader>
               <CardContent className="pb-6">
                 <div className="text-3xl font-black text-slate-900">4.92</div>
                 <p className="text-xs text-slate-400 font-bold mt-2">Based on 84 reviews</p>
               </CardContent>
             </Card>
           </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
           {/* Chart */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="lg:col-span-2"
           >
             <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
               <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-black text-slate-900">Earnings Analytics</CardTitle>
                  <CardDescription className="font-medium">Total income generated across all services.</CardDescription>
               </CardHeader>
               <CardContent className="h-[350px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2286BE" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#2286BE" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} tickFormatter={(val) => `৳${val/1000}k`} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        itemStyle={{ color: '#2286BE', fontWeight: 800 }}
                      />
                      <Area type="monotone" dataKey="earnings" stroke="#2286BE" strokeWidth={4} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </CardContent>
             </Card>
           </motion.div>

           {/* Quick Actions & Recent */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
           >
             <Card className="border-none shadow-sm bg-white rounded-2xl h-full">
               <CardHeader>
                  <CardTitle className="text-xl font-black text-slate-900">New Requests</CardTitle>
                  <CardDescription className="font-medium">Pending orders for your approval</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {[1, 2].map(req => (
                       <motion.div 
                        key={req} 
                        whileHover={{ y: -4 }}
                        className="p-5 border border-slate-100 rounded-2xl hover:border-[#2286BE]/30 hover:shadow-lg transition-all cursor-pointer group"
                       >
                          <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-wider">
                             <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md">Incoming</span>
                             <span className="text-slate-400">2 hrs ago</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-3 leading-snug group-hover:text-[#2286BE] transition-colors line-clamp-2">Deep House Cleaning - Premium Package</h4>
                          <div className="flex items-center gap-2 mb-5">
                             <Avatar className="h-6 w-6 border-2 border-white ring-1 ring-slate-100">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=a042581f4e2902670${req === 1 ? '45' : '46'}`} />
                                <AvatarFallback className="text-[10px] font-bold">U</AvatarFallback>
                             </Avatar>
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700">Ahmed Rashid</span>
                                <span className="text-[10px] font-bold text-slate-400">Dhaka, Bangladesh</span>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                             <Button variant="outline" size="sm" className="w-full h-10 rounded-xl text-xs font-bold text-slate-600 border-slate-200 hover:bg-slate-50">Decline</Button>
                             <Button size="sm" className="w-full h-10 rounded-xl text-xs font-bold bg-[#2286BE] hover:bg-[#059669]">Accept Order</Button>
                          </div>
                       </motion.div>
                     ))}
                     <Button variant="ghost" className="w-full h-12 text-sm font-bold text-[#2286BE] hover:bg-primary-soft rounded-xl mt-2">
                        View All Orders →
                     </Button>
                  </div>
               </CardContent>
             </Card>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
