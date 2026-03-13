'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Users, Award, DollarSign, Quote, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const stories = [
  {
    name: 'Rahim Uddin',
    role: 'House Cleaning Expert',
    city: 'Dhaka',
    avatar: 'https://i.pravatar.cc/150?u=rahim',
    revenue: '৳ 42,000 / month',
    rating: 4.97,
    reviews: 312,
    quote: `Before LocallyServe, I was struggling to find consistent clients. Now I have a fully booked schedule every week and even hired two helpers to keep up with demand. My earnings tripled within 6 months.`,
    badge: 'Top Rated Pro',
    color: 'from-blue-50',
  },
  {
    name: 'Fatema Begum',
    role: 'Beauty & Mehndi Artist',
    city: 'Chattogram',
    avatar: 'https://i.pravatar.cc/150?u=fatema',
    revenue: '৳ 28,500 / month',
    rating: 4.95,
    reviews: 274,
    quote: `I started part-time while still at university. Within 3 months, I was earning more than my mother's full-time salary. The platform takes care of bookings — I just focus on my art.`,
    badge: 'Rising Star',
    color: 'from-rose-50',
  },
  {
    name: 'Kamal Hossain',
    role: 'Electrician & Wiring Expert',
    city: 'Sylhet',
    avatar: 'https://i.pravatar.cc/150?u=kamal',
    revenue: '৳ 55,000 / month',
    rating: 4.93,
    reviews: 178,
    quote: `I was underpricing myself for years working through word-of-mouth. LocallyServe showed me my market value. Now I have a real business, not just a side hustle — with repeat corporate clients.`,
    badge: 'Top Earner',
    color: 'from-yellow-50',
  },
  {
    name: 'Nasrin Akter',
    role: 'AC & Appliance Technician',
    city: 'Dhaka',
    avatar: 'https://i.pravatar.cc/150?u=nasrin',
    revenue: '৳ 38,000 / month',
    rating: 4.90,
    reviews: 219,
    quote: `As a woman in a traditionally male field, I was often overlooked. LocallyServe's verified review system let my work speak for itself. 90% of my clients are repeat bookings now.`,
    badge: 'Verified Pro',
    color: 'from-green-50',
  },
  {
    name: 'Delwar Sheikh',
    role: 'Furniture Carpenter',
    city: 'Rajshahi',
    avatar: 'https://i.pravatar.cc/150?u=delwar',
    revenue: '৳ 45,000 / month',
    rating: 4.96,
    reviews: 89,
    quote: `I specialize in custom furniture builds and had no online presence before. LocallyServe gave me a professional storefront. I now have orders queued 3 weeks in advance.`,
    badge: 'Top Rated Pro',
    color: 'from-amber-50',
  },
  {
    name: 'Shiuli Chowdhury',
    role: 'Personal Care & Nursing',
    city: 'Dhaka',
    avatar: 'https://i.pravatar.cc/150?u=shiuli',
    revenue: '৳ 32,000 / month',
    rating: 4.92,
    reviews: 127,
    quote: `Helping families care for their elderly parents is deeply fulfilling. LocallyServe connected me with exactly the kind of clients I wanted to serve and gave me the freedom to choose my own hours.`,
    badge: 'Top Rated Pro',
    color: 'from-purple-50',
  },
];

const stats = [
  { icon: <DollarSign size={24} />, value: '৳ 2.4Cr+', label: 'Total Paid to Providers' },
  { icon: <Users size={24} />, value: '5,200+', label: 'Active Professionals' },
  { icon: <TrendingUp size={24} />, value: '3.2×', label: 'Avg. Income Growth in 6 Months' },
  { icon: <Award size={24} />, value: '98.2%', label: 'Provider Satisfaction Rate' },
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
      <section className="relative bg-slate-900 pt-24 pb-32 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2286BE]/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex bg-[#2286BE]/20 text-[#2286BE] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6">Real Providers, Real Results</span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 mt-4">Success Stories</h1>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
              Hear from the professionals who built thriving businesses on LocallyServe — in their own words.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 text-center">
              <div className="h-12 w-12 bg-primary-soft rounded-2xl flex items-center justify-center text-[#2286BE] mx-auto mb-4">{stat.icon}</div>
              <p className="text-2xl font-black text-slate-900 mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Stories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <motion.div key={story.name} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className={`bg-gradient-to-b ${story.color} to-white rounded-[2.5rem] border border-slate-100 p-8 h-full flex flex-col hover:shadow-2xl hover:shadow-[#2286BE]/10 transition-all hover:-translate-y-1`}>
                <Quote size={32} className="text-[#2286BE]/20 mb-4" />
                <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-1 italic">"{story.quote}"</p>
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-14 w-14 border-2 border-white ring-2 ring-slate-100">
                      <AvatarImage src={story.avatar} />
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
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="font-black text-slate-900 text-sm">{story.rating}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#2286BE] bg-primary-soft px-2.5 py-1 rounded-lg uppercase">
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
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2286BE]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">Your Success Story Starts Here</h2>
            <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto">Join thousands of providers already thriving on LocallyServe.</p>
            <Link href="/join-provider">
              <Button className="h-16 px-14 bg-[#2286BE] hover:bg-[#059669] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#2286BE]/20 active:scale-95 transition-all">
                Join as Provider — Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
