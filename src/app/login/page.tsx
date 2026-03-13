'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, LogIn, ChevronRight, Apple, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2286BE]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-[#2286BE] mb-8 font-black text-xs uppercase tracking-widest transition-colors group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-[#2286BE]/5 rounded-3xl mb-6">
            <LogIn size={40} className="text-[#2286BE]" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Log in to your LocallyServe account</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5 px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2286BE] transition-colors" />
              <Input type="email" placeholder="john@example.com" className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-[#2286BE] font-bold text-slate-900" required />
            </div>
          </div>

          <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              <Link href="#" className="text-[10px] font-black text-[#2286BE] uppercase tracking-widest hover:underline">Forgot?</Link>
            </div>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2286BE] transition-colors" />
              <Input type="password" placeholder="••••••••" className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-[#2286BE] font-bold text-slate-900" required />
            </div>
          </div>

          <Button className="w-full h-16 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#2286BE]/20 mt-4 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Sign In <ChevronRight size={20} className="ml-2" />
          </Button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-14 rounded-2xl border-slate-100 font-bold hover:bg-slate-50"><Image src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} className="mr-2" /> Google</Button>
          <Button variant="outline" className="h-14 rounded-2xl border-slate-100 font-bold hover:bg-slate-50"><Apple size={18} className="mr-2" /> Apple</Button>
        </div>

        <p className="text-center mt-10 text-slate-500 font-bold">
          Don't have an account? <Link href="/signup" className="text-[#2286BE] hover:underline">Join Now</Link>
        </p>
      </motion.div>
    </div>
  );
}
