'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Bell, 
  MessageSquare, 
  User, 
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Settings,
  Briefcase,
  ArrowLeftRight,
  Heart
} from 'lucide-react';
import { BRAND, CONTACT } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { user, role, setRole, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Categories', href: '/categories' },
    { name: 'Join as Pro', href: '/join-provider' },
    { name: 'Success Stories', href: '/success-stories' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm' 
        : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${isScrolled ? 'bg-[#2286BE] shadow-lg shadow-primary/20 scale-95' : 'bg-white shadow-xl shadow-slate-200/50'}`}>
               <Image src={BRAND.logo} alt={BRAND.name} width={24} height={24} className={isScrolled ? 'invert' : ''} />
            </div>
            <span className={`text-[22px] font-black tracking-tight transition-colors ${isScrolled ? 'text-slate-900' : 'text-slate-950'}`}>
               {BRAND.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[15px] font-bold transition-all relative py-2 ${
                  isActive(link.href) 
                  ? 'text-[#2286BE]' 
                  : (isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-500 hover:text-slate-950')
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2286BE] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Notification + Chat icons - only when logged in */}
                <div className="flex items-center gap-1 pr-4 border-r border-slate-200">
                  <Link href="/notifications" aria-label="Notifications">
                    <button className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors relative ${isScrolled ? 'hover:bg-slate-100 text-slate-500 hover:text-[#2286BE]' : 'bg-white/50 hover:bg-white text-slate-500 hover:text-[#2286BE]'}`}>
                      <Bell size={20} strokeWidth={2.5} />
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                    </button>
                  </Link>
                  <Link href="/messages" aria-label="Messages">
                    <button className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors relative ${isScrolled ? 'hover:bg-slate-100 text-slate-500 hover:text-[#2286BE]' : 'bg-white/50 hover:bg-white text-slate-500 hover:text-[#2286BE]'}`}>
                      <MessageSquare size={20} strokeWidth={2.5} />
                    </button>
                  </Link>
                </div>

                {/* User profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 group outline-none">
                       <div className="h-10 w-10 rounded-xl bg-[#2286BE]/10 border border-[#2286BE]/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                          <User size={20} className="text-[#2286BE]" strokeWidth={2.5} />
                       </div>
                       <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[240px] rounded-2xl p-2 shadow-2xl border-slate-100">
                    <div className="px-4 py-3">
                       <p className="text-sm font-black text-slate-900">{user?.name}</p>
                       <p className="text-[11px] font-medium text-slate-400 capitalize">{role} account</p>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    
                    <div className="px-2 pb-2">
                      <Button
                        onClick={() => setRole(role === 'client' ? 'provider' : 'client')}
                        className="w-full h-10 bg-[#2286BE]/5 hover:bg-[#2286BE]/10 text-[#2286BE] font-black text-xs uppercase tracking-widest rounded-xl transition-all border border-[#2286BE]/10"
                      >
                        <ArrowLeftRight size={14} className="mr-2" />
                        Switch to {role === 'client' ? 'Selling' : 'Buying'}
                      </Button>
                    </div>
                    
                    <Link href={role === 'provider' ? '/provider/dashboard' : '/client/dashboard'}>
                      <DropdownMenuItem className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] font-bold py-2.5 cursor-pointer">
                        <LayoutDashboard className="mr-3 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                    </Link>
                    
                    <Link href={role === 'provider' ? '/provider/orders' : '/client/orders'}>
                      <DropdownMenuItem className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] font-bold py-2.5 cursor-pointer">
                        <Briefcase className="mr-3 h-4 w-4" /> My Orders
                      </DropdownMenuItem>
                    </Link>

                    {role === 'client' && (
                      <Link href="/client/saved-services">
                        <DropdownMenuItem className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] font-bold py-2.5 cursor-pointer">
                          <Heart className="mr-3 h-4 w-4" /> Saved Services
                        </DropdownMenuItem>
                      </Link>
                    )}

                    <Link href={role === 'provider' ? '/provider/profile' : '/client/profile'}>
                      <DropdownMenuItem className="rounded-xl focus:bg-[#2286BE]/5 focus:text-[#2286BE] font-bold py-2.5 cursor-pointer">
                        <Settings className="mr-3 h-4 w-4" /> Settings
                      </DropdownMenuItem>
                    </Link>
                    
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem onClick={() => logout()} className="rounded-xl focus:bg-red-50 focus:text-red-500 font-bold py-2.5 text-red-500 cursor-pointer">
                      <LogOut className="mr-3 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Logged-out: only Login + Signup */
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="outline" className="h-11 px-6 font-black rounded-xl border-slate-200 hover:border-[#2286BE]/40 hover:text-[#2286BE] transition-all">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="h-11 px-8 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-[#2286BE]/20">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
               aria-label="Toggle Mobile Menu"
               aria-expanded={isMobileMenuOpen}
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className={`h-11 w-11 rounded-xl flex items-center justify-center transition-colors ${isScrolled ? 'bg-slate-100 text-slate-900' : 'bg-white text-slate-900 shadow-xl'}`}
            >
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </nav>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
           className="fixed inset-0 top-[72px] z-50 bg-white md:hidden animate-in fade-in slide-in-from-top-4 duration-300"
           role="dialog"
           aria-modal="true"
        >
          <div className="p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full p-4 rounded-2xl text-lg font-black transition-colors ${
                  isActive(link.href) 
                  ? 'bg-[#2286BE]/10 text-[#2286BE]' 
                  : 'text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
               {isAuthenticated && (
                 <div className="flex gap-4 px-2 mb-2">
                   <Link href="/notifications" aria-label="Notifications">
                     <button className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 relative">
                       <Bell size={24} />
                       <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
                     </button>
                   </Link>
                   <Link href="/messages" aria-label="Messages">
                     <button className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500"><MessageSquare size={24} /></button>
                   </Link>
                   <Link href={role === 'provider' ? '/provider/profile' : '/client/profile'} className="flex-1 h-12 rounded-2xl bg-slate-100 flex items-center px-4 gap-3 text-slate-900 font-bold">
                      <User size={20} /> My Account
                   </Link>
                 </div>
               )}
               {!isAuthenticated && (
                 <div className="flex flex-col gap-3">
                   <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                     <Button variant="outline" className="w-full h-14 font-black rounded-2xl border-slate-200">
                       Login
                     </Button>
                   </Link>
                   <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                     <Button className="w-full h-14 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black rounded-2xl">
                       Sign Up — It's Free
                     </Button>
                   </Link>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
