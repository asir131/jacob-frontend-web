'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, MessageSquare, Menu, X, User, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, login, logout } = useAuth();
  const { city } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRoleToggle = () => {
    login(role === 'client' ? 'provider' : 'client');
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm py-2' 
        : 'bg-white border-b border-gray-100 py-3'
    }`}>
      <div className="mx-auto flex h-[56px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-shrink-0 items-center"
        >
          <Link href="/" className="flex items-center group">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#2286BE]/10 group-hover:scale-105 transition-transform duration-300">
                <Image src="/logo.png" alt="LocallyServe Logo" width={80} height={80} className="h-full w-full object-contain p-1.5" />
            </div>
            <span className="ml-3 text-2xl font-black text-slate-900 hidden sm:block tracking-tighter">
              Locally<span className="text-[#2286BE]">Serve</span>
            </span>
          </Link>
        </motion.div>

        {/* Right Side: Navigation & User (Desktop) */}
        <div className="hidden items-center gap-8 lg:flex flex-shrink-0">
          <nav className="flex items-center gap-8 text-[15px] font-bold text-slate-600">
            <Link href="/services" className="hover:text-[#2286BE] transition-colors relative group py-2">
              Services
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-[#2286BE] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/categories" className="hover:text-[#2286BE] transition-colors relative group py-2">
              Categories
              <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-[#2286BE] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {role !== 'provider' && (
              <Link href="/post-request" className="text-[#2286BE] hover:bg-[#2286BE]/5 px-4 py-2 rounded-xl border border-[#2286BE]/20 transition-all font-black">
                Post a Request
              </Link>
            )}
            
            {user && (
              <div className="flex items-center gap-4 ml-2 border-l border-slate-100 pl-6">
                <Link href="/messages" className="text-slate-400 hover:text-[#2286BE] transition-all hover:scale-110 relative p-2 rounded-xl hover:bg-slate-50">
                  <MessageSquare size={20}/>
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </Link>
                <Link href="/notifications" className="text-slate-400 hover:text-[#2286BE] transition-all hover:scale-110 p-2 rounded-xl hover:bg-slate-50">
                  <Bell size={20}/>
                </Link>
              </div>
            )}
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 outline-none group bg-slate-50 hover:bg-slate-100 p-1.5 pr-4 rounded-2xl transition-all">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-0">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-[#2286BE]/10 text-[#2286BE] font-black"><User size={16}/></AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden xl:block">
                      <p className="text-xs font-black text-slate-900 leading-none mb-0.5">{user.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</p>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-[#2286BE] transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2 rounded-2xl p-2 border-slate-100 shadow-2xl">
                  <DropdownMenuLabel className="flex flex-col space-y-1 p-3">
                    <span className="text-sm font-black leading-none text-slate-900">{user.name}</span>
                    <span className="text-xs text-slate-400 font-medium">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2 bg-slate-50" />
                  
                  <div className="p-1 space-y-1">
                    {role === 'client' && (
                      <>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] cursor-pointer py-3 px-4 font-bold"><Link href="/client/dashboard" className="w-full">Dashboard</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] cursor-pointer py-3 px-4 font-bold"><Link href="/client/orders" className="w-full">My Orders</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] cursor-pointer py-3 px-4 font-bold"><Link href="/client/profile" className="w-full">Profile Settings</Link></DropdownMenuItem>
                      </>
                    )}

                    {role === 'provider' && (
                      <>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] cursor-pointer py-3 px-4 font-bold"><Link href="/provider/dashboard" className="w-full">Provider Hub</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] cursor-pointer py-3 px-4 font-bold"><Link href="/provider/gigs" className="w-full">My Gigs</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] cursor-pointer py-3 px-4 font-bold"><Link href="/provider/orders" className="w-full">Manage Orders</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] cursor-pointer py-3 px-4 font-bold"><Link href="/provider/profile" className="w-full">Business Settings</Link></DropdownMenuItem>
                      </>
                    )}
                  </div>
                  
                  <DropdownMenuSeparator className="my-2 bg-slate-50" />
                  <DropdownMenuItem onClick={handleRoleToggle} className="text-[#2286BE] font-black cursor-pointer rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] py-3 px-4">
                    Switch to {role === 'client' ? 'Provider' : 'Client'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-slate-50" />
                  <DropdownMenuItem onClick={logout} className="text-red-500 font-black cursor-pointer rounded-xl focus:bg-red-50 focus:text-red-600 py-3 px-4">Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-black text-slate-600 hover:text-[#2286BE] hover:bg-[#2286BE]/5 px-6 h-11 rounded-xl">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#2286BE] hover:bg-[#1b6da0] font-black rounded-xl px-8 h-11 shadow-lg shadow-[#2286BE]/20">Join</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-4">
           {user && (
             <Link href="/messages" className="text-slate-400 p-2 rounded-lg bg-slate-50">
               <MessageSquare size={22}/>
             </Link>
           )}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-slate-700 bg-slate-900 p-2 rounded-xl active:scale-95 transition-all"
          >
            {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-slate-100 bg-white lg:hidden overflow-hidden shadow-2xl absolute w-full top-full left-0 z-50"
          >
            <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="space-y-4">
                <Link href="/services" className="text-lg font-black text-slate-900 flex items-center justify-between p-4 rounded-2xl bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                  Browse Services
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2286BE] shadow-sm">→</div>
                </Link>
                <Link href="/categories" className="text-lg font-black text-slate-900 flex items-center justify-between p-4 rounded-2xl bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                  Categories
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2286BE] shadow-sm">→</div>
                </Link>
                {role !== 'provider' && (
                  <Link href="/post-request" className="text-lg font-black text-white bg-[#2286BE] p-4 rounded-2xl block text-center shadow-lg shadow-[#2286BE]/20" onClick={() => setIsMenuOpen(false)}>
                    Post a Custom Request
                  </Link>
                )}
                
                <hr className="border-slate-100" />
                
                {user ? (
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-[#2286BE]/10 text-[#2286BE] font-black"><User size={24}/></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-slate-900 text-lg leading-none mb-1">{user.name}</p>
                          <span className="text-xs font-bold text-[#2286BE] uppercase tracking-[0.2em]">{role}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <Link href={role === 'client' ? '/client/dashboard' : '/provider/dashboard'} className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm text-center active:scale-95 transition-transform" onClick={() => setIsMenuOpen(false)}>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">My Portal</span>
                           <span className="font-black text-slate-900">Dashboard</span>
                         </Link>
                         <Link href={role === 'client' ? '/client/orders' : '/provider/orders'} className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-2xl shadow-sm text-center active:scale-95 transition-transform" onClick={() => setIsMenuOpen(false)}>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Track</span>
                           <span className="font-black text-slate-900">Orders</span>
                         </Link>
                      </div>

                      <div className="flex flex-col gap-3 pt-2">
                        <Button variant="outline" className="w-full rounded-2xl h-14 font-black border-[#2286BE]/20 text-[#2286BE] bg-[#2286BE]/5" onClick={() => { handleRoleToggle(); setIsMenuOpen(false); }}>
                          Switch to {role === 'client' ? 'Provider' : 'Client'} Mode
                        </Button>
                        <Button variant="ghost" className="w-full rounded-2xl h-14 text-red-500 font-black hover:bg-red-50" onClick={() => { logout(); setIsMenuOpen(false); }}>
                          Log Out
                        </Button>
                      </div>
                   </div>
                ) : (
                  <div className="flex flex-col gap-4 pt-2">
                    <Link href="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-2xl h-16 font-black border-slate-200 text-slate-900">Sign In</Button>
                    </Link>
                    <Link href="/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full rounded-2xl h-16 font-black bg-[#2286BE] hover:bg-[#1b6da0] shadow-xl shadow-[#2286BE]/20">Join LocallyServe</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
