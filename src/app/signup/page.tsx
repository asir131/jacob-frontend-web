'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, ChevronRight, UserCircle, Briefcase, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const [role, setRole] = useState<'client' | 'provider'>('client');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#2286BE]/5 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-soft/30 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-[#2286BE] mb-10 font-black text-xs uppercase tracking-widest transition-colors group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Home
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Create Account</h1>
          <p className="text-slate-500 font-medium text-lg">Join LocallyServe and start your journey today.</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10">
          <button 
            onClick={() => setRole('client')}
            className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-black transition-all ${role === 'client' ? 'bg-white text-[#2286BE] shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <UserCircle size={20} /> I'm a Client
          </button>
          <button 
            onClick={() => setRole('provider')}
            className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-black transition-all ${role === 'provider' ? 'bg-[#2286BE] text-white shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Briefcase size={20} /> I'm a Provider
          </button>
        </div>

        <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <Input placeholder="John" className="h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus-visible:ring-[#2286BE] font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <Input placeholder="Doe" className="h-14 rounded-2xl border border-slate-100 bg-slate-50/50 focus-visible:ring-[#2286BE] font-bold" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2286BE] transition-colors" />
                <Input type="email" placeholder="john@example.com" className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-[#2286BE] font-bold" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2286BE] transition-colors" />
                <Input type="password" placeholder="Min. 8 characters" className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-[#2286BE] font-bold" required />
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
               <div className="mt-1"><Info size={16} className="text-[#2286BE]" /></div>
               <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                 By creating an account, you agree to our <Link href="#" className="text-[#2286BE] font-bold">Terms of Service</Link> and <Link href="#" className="text-[#2286BE] font-bold">Privacy Policy</Link>.
               </p>
            </div>

            <Button className="w-full h-16 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#2286BE]/20 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Create Account <CheckCircle2 size={20} className="ml-2" />
            </Button>
          </form>
        </div>

        <p className="text-center mt-10 text-slate-500 font-bold">
          Already have an account? <Link href="/login" className="text-[#2286BE] hover:underline">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}
