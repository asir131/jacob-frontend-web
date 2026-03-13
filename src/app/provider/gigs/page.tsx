'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_SERVICES } from '@/data/mock-services';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, PauseCircle, Play, Trash2, Eye, MoreHorizontal, Star, TrendingUp, BarChart3, Clock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function ProviderGigsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  
  // Fake filtering since the mock is static
  const myGigs = MOCK_SERVICES.slice(0, 5).map((s, i) => ({
    ...s,
    status: i === 0 || i === 2 ? 'Active' : i === 1 ? 'Paused' : 'Draft',
    impressions: Math.floor(Math.random() * 5000 + 2000),
    clicks: Math.floor(Math.random() * 500 + 100),
    orders: Math.floor(Math.random() * 50 + 5),
    conversion: (Math.random() * 5 + 1).toFixed(1),
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
           <div>
             <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Service Management</h1>
             <p className="text-slate-500 mt-2 text-lg">Create, edit, and track the performance of your service offerings.</p>
           </div>
           <Link href="/provider/gigs/create">
              <Button className="bg-[#2286BE] hover:bg-[#059669] font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#2286BE]/20 group">
                <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> Create New Gig
              </Button>
           </Link>
        </motion.div>

        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 mb-8 inline-flex w-full md:w-auto">
           <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-transparent h-12 w-full md:w-auto justify-start gap-1">
                 <TabsTrigger value="active" className="px-8 rounded-xl data-[state=active]:bg-[#2286BE] data-[state=active]:text-white data-[state=active]:shadow-md font-bold transition-all">
                   Active <span className="ml-2 text-[10px] opacity-70 px-1.5 py-0.5 bg-black/10 rounded-full">2</span>
                 </TabsTrigger>
                 <TabsTrigger value="paused" className="px-8 rounded-xl data-[state=active]:bg-[#2286BE] data-[state=active]:text-white data-[state=active]:shadow-md font-bold transition-all">
                   Paused <span className="ml-2 text-[10px] opacity-70 px-1.5 py-0.5 bg-black/10 rounded-full">1</span>
                 </TabsTrigger>
                 <TabsTrigger value="draft" className="px-8 rounded-xl data-[state=active]:bg-[#2286BE] data-[state=active]:text-white data-[state=active]:shadow-md font-bold transition-all">
                   Drafts <span className="ml-2 text-[10px] opacity-70 px-1.5 py-0.5 bg-black/10 rounded-full">2</span>
                 </TabsTrigger>
              </TabsList>
           </Tabs>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
             {myGigs.filter(g => g.status.toLowerCase().includes(activeTab === 'active' ? 'act' : activeTab === 'paused' ? 'paus' : 'draft')).map(gig => (
               <motion.div key={gig.id} variants={itemVariants}>
                 <Card className="overflow-hidden border-slate-200 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full rounded-2xl">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image 
                        src={gig.images[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?q=80&w=800&auto=format&fit=crop'} 
                        alt={gig.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-4 left-4">
                         <Badge className={`
                           font-black uppercase tracking-widest text-[10px] px-3 py-1 shadow-lg
                           ${gig.status === 'Active' ? 'bg-[#2286BE] text-white' : gig.status === 'Paused' ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'}
                         `}>
                           {gig.status}
                         </Badge>
                      </div>
                      
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button variant="secondary" size="icon" className="h-9 w-9 bg-white/90 backdrop-blur shadow-xl hover:bg-white active:scale-90 transition-all">
                          <Edit2 size={16} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-9 w-9 bg-white/90 backdrop-blur shadow-xl hover:bg-white active:scale-90 transition-all">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                            <DropdownMenuItem className="cursor-pointer py-3 rounded-lg"><Eye size={16} className="mr-3 text-slate-400" /> Preview Service</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer py-3 rounded-lg"><TrendingUp size={16} className="mr-3 text-slate-400" /> View Analytics</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {gig.status === 'Active' ? (
                              <DropdownMenuItem className="cursor-pointer py-3 rounded-lg text-amber-600 focus:text-amber-600 focus:bg-amber-50">
                                <PauseCircle size={16} className="mr-3" /> Pause Listing
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="cursor-pointer py-3 rounded-lg text-[#2286BE] focus:text-[#2286BE] focus:bg-primary-soft">
                                <Play size={16} className="mr-3" /> Activate Listing
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="cursor-pointer py-3 rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50">
                              <Trash2 size={16} className="mr-3" /> Permanent Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                         <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-xl">
                            Fast Edit Details
                         </Button>
                      </div>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                       <h3 className="font-bold text-slate-900 text-lg line-clamp-2 leading-tight mb-4 min-h-[3.5rem] group-hover:text-primary transition-colors">
                         {gig.title}
                       </h3>
                       
                       <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-1.5">
                             <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                               <Star size={14} className="text-amber-500 mr-1 fill-amber-500" />
                               <span className="text-sm font-black text-amber-700">{gig.provider.rating}</span>
                             </div>
                             <span className="text-xs font-bold text-slate-400">({gig.provider.completedOrders} orders)</span>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting at</p>
                             <p className="text-2xl font-black text-slate-900 tracking-tight">৳{gig.startingPrice.toLocaleString()}</p>
                          </div>
                       </div>

                       {gig.status !== 'Draft' && (
                         <div className="mt-auto grid grid-cols-3 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                            <div className="text-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Views</p>
                              <div className="flex items-center justify-center text-slate-900 gap-1">
                                <BarChart3 size={12} className="text-slate-400" />
                                <p className="font-extrabold text-xs">{(gig.impressions / 1000).toFixed(1)}k</p>
                              </div>
                            </div>
                            <div className="text-center border-x border-slate-200">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Clicks</p>
                              <div className="flex items-center justify-center text-slate-900 gap-1">
                                <Zap size={12} className="text-[#2286BE]" />
                                <p className="font-extrabold text-xs">{gig.clicks}</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Conv.</p>
                              <div className="flex items-center justify-center text-[#2286BE] gap-1">
                                <TrendingUp size={12} />
                                <p className="font-extrabold text-xs">{gig.conversion}%</p>
                              </div>
                            </div>
                         </div>
                       )}
                    </CardContent>
                 </Card>
               </motion.div>
             ))}
          </motion.div>
        </AnimatePresence>

        {myGigs.filter(g => g.status.toLowerCase().includes(activeTab === 'active' ? 'act' : activeTab === 'paused' ? 'paus' : 'draft')).length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200"
          >
            <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <Plus size={48} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Gigs Found</h3>
            <p className="text-slate-500 max-w-xs text-center mb-8 font-medium">
              You haven't created any services in this category yet. Start growing your business today!
            </p>
            <Link href="/provider/gigs/create">
              <Button className="bg-[#2286BE] hover:bg-[#059669] font-black h-14 px-10 rounded-2xl shadow-xl shadow-primary/20">
                Create Your First Gig
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
