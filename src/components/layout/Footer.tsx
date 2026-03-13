'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaYoutube, 
  FaInstagram, 
  FaFacebookF, 
  FaTwitter,
  FaLinkedinIn
} from 'react-icons/fa';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const { city, setCity } = useLocation();

  const handleCityChange = (value: string) => {
    setCity(value);
  };

  return (
    <footer className="w-full bg-slate-900 pt-20 pb-10 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#2286BE] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="bg-slate-800/50 rounded-3xl p-8 md:p-12 mb-20 border border-slate-700/50 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Stay in the loop</h3>
            <p className="text-slate-400 font-medium">Get exclusive offers and top provider recommendations delivered to your inbox.</p>
          </div>
          <div className="flex w-full lg:w-auto gap-3">
            <Input 
              placeholder="Enter your email" 
              className="bg-slate-900/50 border-slate-700 h-14 rounded-2xl text-white placeholder:text-slate-500 min-w-0 md:min-w-[300px]"
            />
            <Button className="bg-[#2286BE] hover:bg-[#059669] h-14 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20">Subscribe</Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black text-white tracking-tight flex items-center">
                Locally<span className="text-[#2286BE]">Serve</span>
              </span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-sm">
              Connecting you with the most skilled professionals in your neighborhood. 
              Quality service, guaranteed locally.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg"><MapPin size={16} className="text-[#2286BE]" /></div>
                <span className="text-sm font-bold">{city}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg"><Phone size={16} className="text-[#2286BE]" /></div>
                <span className="text-sm font-bold">+880 1700 000000</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {[
                { icon: <FaFacebookF />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaLinkedinIn />, href: "#" },
                { icon: <FaYoutube />, href: "#" }
              ].map((social, idx) => (
                <Link 
                  key={idx} 
                  href={social.href} 
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#2286BE] hover:text-white transition-all duration-300 shadow-sm"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[12px] mb-6">Services</h4>
            <ul className="space-y-4">
              {['Cleaning', 'Plumbing', 'Electrical', 'Appliances', 'Shifting'].map(item => (
                <li key={item}>
                  <Link href={`/services?category=${item}`} className="text-slate-400 hover:text-[#2286BE] font-bold text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[12px] mb-6">For Partners</h4>
            <ul className="space-y-4">
              {[
                { label: 'Join as Provider', href: '/join-provider' },
                { label: 'Provider Help', href: '/provider-help' },
                { label: 'Success Stories', href: '/success-stories' },
                { label: 'Affiliate Program', href: '/affiliate' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-[#2286BE] font-bold text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-[12px] mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-slate-400 hover:text-[#2286BE] font-bold text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
              <li className="pt-2">
                <Select value={city} onValueChange={handleCityChange}>
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white text-xs h-10 font-bold rounded-xl">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="Dhaka, Bangladesh">Dhaka</SelectItem>
                    <SelectItem value="Chattogram, Bangladesh">Chattogram</SelectItem>
                    <SelectItem value="Sylhet, Bangladesh">Sylhet</SelectItem>
                    <SelectItem value="Rajshahi, Bangladesh">Rajshahi</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
            © 2026 LocallyServe. Made with ❤️ for your neighborhood.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <Globe size={14} /> English (US)
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
              ৳ BDT
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
