'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Users, Award, DollarSign, Quote, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/constants';

const stories = [
  {
    name: 'Mark Thompson',
    role: 'House Cleaning Expert',
    city: 'New York',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop',
    revenue: '$ 3,200 / month',
    rating: 4.97,
    reviews: 312,
    quote: `Before ${BRAND.name}, I was struggling to find consistent clients. Now I have a fully booked schedule every week and even hired two helpers to keep up with demand. My earnings tripled within 6 months.`,
    badge: 'Top Rated Pro',
    color: 'from-blue-50',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Professional Makeup Artist',
    city: 'Austin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop',
    revenue: '$ 2,500 / month',
    rating: 4.95,
    reviews: 274,
    quote: `I started part-time while still at university. Within 3 months, I was earning more than my mother's full-time salary. The platform takes care of bookings — I just focus on my art.`,
    badge: 'Rising Star',
    color: 'from-rose-50',
  },
  {
    name: 'David Miller',
    role: 'Electrician & Wiring Expert',
    city: 'Miami',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop',
    revenue: '$ 4,500 / month',
    rating: 4.93,
    reviews: 178,
    quote: `I was underpricing myself for years working through word-of-mouth. ${BRAND.name} showed me my market value. Now I have a real business, not just a side hustle — with repeat corporate clients.`,
    badge: 'Top Earner',
    color: 'from-yellow-50',
  },
  {
    name: 'Linda Rodriguez',
    role: 'HVAC & Appliance Technician',
    city: 'Houston',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&auto=format&fit=crop',
    revenue: '$ 2,800 / month',
    rating: 4.90,
    reviews: 219,
    quote: `As a woman in a traditionally male field, I was often overlooked. ${BRAND.name}'s verified review system let my work speak for itself. 90% of my clients are repeat bookings now.`,
    badge: 'Verified Pro',
    color: 'from-blue-50/50',
  },
  {
    name: 'Robert Wilson',
    role: 'Furniture Carpenter',
    city: 'Seattle',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop',
    revenue: '$ 3,500 / month',
    rating: 4.96,
    reviews: 89,
    quote: `I specialize in custom furniture builds and had no online presence before. ${BRAND.name} gave me a professional storefront. I now have orders queued 3 weeks in advance.`,
    badge: 'Top Rated Pro',
    color: 'from-amber-50',
  },
  {
    name: 'Maria Garcia',
    role: 'Personal Care & Nursing',
    city: 'Chicago',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop',
    revenue: '$ 2,200 / month',
    rating: 4.92,
    reviews: 127,
    quote: `Helping families care for their elderly parents is deeply fulfilling. ${BRAND.name} connected me with exactly the kind of clients I wanted to serve and gave me the freedom to choose my own hours.`,
    badge: 'Top Rated Pro',
    color: 'from-purple-50',
  },
];

const stats = [
  { icon: <DollarSign size={24} />, value: '$ 2.4M+', label: 'Total Paid to Providers' },
  { icon: <Users size={24} />, value: '5,200+', label: 'Active Professionals' },
  { icon: <TrendingUp size={24} />, value: '3.2×', label: 'Avg. Income Growth in 6 Months' },
  { icon: <Award size={24} />, value: '98.2%', label: 'Provider Satisfaction Rate' },
];

export default function SuccessStoriesClient() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero + Stats combined — no negative margin clip */}
      <section className="relative bg-slate-900 pt-32 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2286BE]/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex bg-[#2286BE]/20 text-[#2286BE] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6">Real Providers, Real Results</span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 mt-4">Success Stories</h1>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
              Hear from the professionals who built thriving businesses on {BRAND.name} — in their own words.
            </p>
          </motion.div>
        </div>

        {/* Stats — inside the dark hero, fully visible */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 text-center">
                <div className="h-12 w-12 bg-[#2286BE]/20 rounded-2xl flex items-center justify-center text-[#2286BE] mx-auto mb-4" aria-hidden="true">{stat.icon}</div>
                <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <motion.div key={story.name} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className={`bg-gradient-to-b ${story.color} to-white rounded-[2.5rem] border border-slate-100 p-8 h-full flex flex-col hover:shadow-2xl hover:shadow-[#2286BE]/10 transition-all hover:-translate-y-1`}>
                <Quote size={32} className="text-[#2286BE]/20 mb-4" aria-hidden="true" />
                <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-1">&quot;{story.quote}&quot;</p>
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-14 w-14 border-2 border-white ring-2 ring-slate-100">
                      <AvatarImage src={story.avatar} alt={story.name} />
                      <AvatarFallback className="font-black text-slate-400">{story.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-black text-slate-900">{story.name}</p>
                      <p className="text-sm font-bold text-slate-400">{story.role}</p>
                      <p className="text-xs font-bold text-slate-300">{story.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Earnings</p>
                      <p className="text-lg font-black text-slate-900">{story.revenue}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" aria-hidden="true" />
                        <span className="font-black text-slate-900 text-sm" aria-label={`Rating: ${story.rating}`}>{story.rating}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#2286BE] bg-[#2286BE]/5 px-2.5 py-1 rounded-lg uppercase">
                        {story.badge}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2286BE]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-[80px] pointer-events-none" aria-hidden="true" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">Your Success Story Starts Here</h2>
            <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto">Join thousands of providers already thriving on {BRAND.name}.</p>
            <Link href="/join-provider">
              <Button className="h-16 px-14 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#2286BE]/20 active:scale-95 transition-all">
                Join as Provider — Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
