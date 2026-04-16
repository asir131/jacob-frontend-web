'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Heart, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { MOCK_SERVICES } from '@/data/mock-services';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatRating } from '@/lib/formatters';

export default function SavedServicesPage() {
  // Mocking saved services (usually from a backend/state)
  const [savedServices, setSavedServices] = useState(MOCK_SERVICES.slice(0, 3));

  const removeFavorite = (id: string) => {
    setSavedServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Saved Services</h1>
             <p className="text-slate-500 font-medium">Manage the professionals you&apos;ve love and plan to hire.</p>
          </motion.div>
          <div className="flex items-center gap-3">
             <Badge className="bg-[#2286BE]/10 text-[#2286BE] border-none font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl">
               {savedServices.length} Saved
             </Badge>
          </div>
        </div>

        {savedServices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center shadow-2xl shadow-slate-200/50"
          >
             <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-10 text-red-500">
                <Heart size={48} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 mb-4">No Favorites Yet</h2>
             <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium text-lg leading-relaxed">
               Ready to find your local dream team? Browse services and click the heart icon to save them here.
             </p>
             <Link href="/services">
                <Button className="bg-[#2286BE] hover:bg-[#1b6da0] px-10 h-16 text-lg font-black rounded-2xl shadow-xl shadow-[#2286BE]/20">
                  Explore Marketplace
                </Button>
             </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {savedServices.map((service, idx) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-[#2286BE]/10 transition-all duration-500 flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image src={service.images[0]} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                       <Badge className="bg-white/95 backdrop-blur-md text-slate-900 border-none font-black text-[10px] uppercase px-3 py-1 shadow-sm">
                         ৳{service.startingPrice}
                       </Badge>
                    </div>
                    <button 
                      onClick={() => removeFavorite(service.id)}
                      className="absolute top-4 right-4 h-10 w-10 bg-white/95 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
                    >
                       <Trash2 size={18} />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-6 pt-10">
                       <Link href={`/provider/${service.provider.id}`} className="flex items-center gap-2 w-fit hover:opacity-90 transition-opacity">
                          <Avatar className="h-8 w-8 border-2 border-white/20">
                             <AvatarImage src={service.provider.avatar} />
                             <AvatarFallback className="bg-[#2286BE] text-white text-[10px] font-black">PRO</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-black text-white">{service.provider.name}</span>
                          {service.provider.badge === 'Verified' && <ShieldCheck size={14} className="text-[#2286BE]" />}
                       </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-black text-slate-900 group-hover:text-[#2286BE] transition-colors line-clamp-2 leading-snug text-xl mb-6 flex-1">
                      {service.title}
                    </h3>

                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-1.5">
                          <Star size={18} className="text-amber-400 fill-amber-400" />
                          <span className="font-black text-slate-900">{formatRating(service.provider.rating)}</span>
                       </div>
                       <div className="flex items-center gap-1 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                          <MapPin size={12} className="text-[#2286BE]" /> {service.location.city}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <Link href={`/services/${service.id}`} className="flex-1">
                          <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 font-bold hover:bg-slate-50 transition-all">Details</Button>
                       </Link>
                       <Link href={`/book/${service.id}`} className="flex-1">
                          <Button className="w-full h-12 rounded-xl bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black transition-all shadow-lg shadow-[#2286BE]/10">
                            Book <ArrowRight size={16} className="ml-2" />
                          </Button>
                       </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
