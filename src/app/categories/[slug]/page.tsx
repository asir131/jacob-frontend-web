'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Paintbrush, Wrench, Zap, Trash2, Heart,
  Cpu, Hammer, Truck, Droplets, Scissors,
  Star, MapPin, ShieldCheck, ChevronRight, ArrowLeft, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categoryData: Record<string, {
  name: string;
  icon: React.ReactElement;
  description: string;
  color: string;
  bgGradient: string;
  services: { id: number; title: string; rating: number; reviews: number; price: number; location: string; badge: string; tags: string[] }[];
}> = {
  'cleaning': {
    name: 'Cleaning',
    icon: <Droplets size={36} />,
    description: 'Professional home & office cleaning services from verified experts in your neighborhood.',
    color: 'text-blue-500',
    bgGradient: 'from-blue-50 to-white',
    services: [
      { id: 1, title: 'Deep Home Cleaning – Full Package', rating: 4.95, reviews: 312, price: 1200, location: 'Dhaka', badge: 'Top Rated', tags: ['Eco-Friendly', 'Same Day'] },
      { id: 2, title: 'Office Sanitization & Cleaning', rating: 4.87, reviews: 184, price: 2500, location: 'Dhaka', badge: 'Verified', tags: ['Commercial', 'Weekly Plans'] },
      { id: 3, title: 'Bathroom & Kitchen Deep Clean', rating: 4.92, reviews: 227, price: 800, location: 'Uttara', badge: 'Top Rated', tags: ['Eco-Friendly'] },
      { id: 4, title: 'Sofa & Carpet Steam Cleaning', rating: 4.80, reviews: 96, price: 600, location: 'Gulshan', badge: 'Verified', tags: ['Steam Clean'] },
      { id: 5, title: 'Post-Construction Cleanup', rating: 4.73, reviews: 61, price: 3500, location: 'Dhanmondi', badge: 'Verified', tags: ['Heavy Duty'] },
      { id: 6, title: 'Window & Glass Cleaning – High Rise', rating: 4.88, reviews: 143, price: 1500, location: 'Banani', badge: 'Top Rated', tags: ['High Rise'] },
    ],
  },
  'plumbing': {
    name: 'Plumbing',
    icon: <Wrench size={36} />,
    description: 'Fast and reliable plumbing repairs, installations, and maintenance from certified professionals.',
    color: 'text-orange-500',
    bgGradient: 'from-orange-50 to-white',
    services: [
      { id: 1, title: 'Emergency Pipe Leak Repair', rating: 4.90, reviews: 204, price: 500, location: 'Dhaka', badge: 'Top Rated', tags: ['Emergency', '24/7'] },
      { id: 2, title: 'Bathroom Fixture Installation', rating: 4.82, reviews: 137, price: 900, location: 'Gulshan', badge: 'Verified', tags: ['Installation'] },
      { id: 3, title: 'Drain Unclogging Service', rating: 4.78, reviews: 89, price: 400, location: 'Uttara', badge: 'Verified', tags: ['Same Day'] },
      { id: 4, title: 'Water Heater Repair & Install', rating: 4.85, reviews: 112, price: 1200, location: 'Dhanmondi', badge: 'Top Rated', tags: ['Heater', 'Install'] },
      { id: 5, title: 'Full Bathroom Plumbing Remodel', rating: 4.95, reviews: 47, price: 8000, location: 'Banani', badge: 'Top Rated', tags: ['Remodel'] },
      { id: 6, title: 'Kitchen Sink & Faucet Repair', rating: 4.70, reviews: 158, price: 350, location: 'Mirpur', badge: 'Verified', tags: ['Faucet'] },
    ],
  },
  'electrical': {
    name: 'Electrical',
    icon: <Zap size={36} />,
    description: 'Certified electricians for safe wiring, installations, repairs, and panel upgrades.',
    color: 'text-yellow-500',
    bgGradient: 'from-yellow-50 to-white',
    services: [
      { id: 1, title: 'Electrical Wiring & Rewiring', rating: 4.93, reviews: 178, price: 2000, location: 'Dhaka', badge: 'Top Rated', tags: ['Certified', 'Safe'] },
      { id: 2, title: 'Fan & Light Installation', rating: 4.85, reviews: 301, price: 300, location: 'Gulshan', badge: 'Verified', tags: ['Quick Fix'] },
      { id: 3, title: 'Circuit Breaker & Panel Upgrade', rating: 4.90, reviews: 94, price: 3500, location: 'Dhanmondi', badge: 'Top Rated', tags: ['Panel'] },
      { id: 4, title: 'CCTV Camera Installation', rating: 4.88, reviews: 212, price: 1800, location: 'Banani', badge: 'Verified', tags: ['Security', 'CCTV'] },
      { id: 5, title: 'Generator Repair & Maintenance', rating: 4.76, reviews: 65, price: 1500, location: 'Uttara', badge: 'Verified', tags: ['Generator'] },
      { id: 6, title: 'Emergency Power Outage Fix', rating: 4.94, reviews: 88, price: 700, location: 'Mirpur', badge: 'Top Rated', tags: ['Emergency', '24/7'] },
    ],
  },
  'painting': {
    name: 'Painting',
    icon: <Paintbrush size={36} />,
    description: 'Interior and exterior painting services to transform your home with expert brush strokes.',
    color: 'text-pink-500',
    bgGradient: 'from-pink-50 to-white',
    services: [
      { id: 1, title: 'Interior Wall Painting – Full Home', rating: 4.91, reviews: 145, price: 5000, location: 'Dhaka', badge: 'Top Rated', tags: ['Interior', 'Full Home'] },
      { id: 2, title: 'Exterior House Painting', rating: 4.82, reviews: 87, price: 8000, location: 'Gulshan', badge: 'Verified', tags: ['Exterior'] },
      { id: 3, title: 'Room Accent Wall Design', rating: 4.95, reviews: 63, price: 1800, location: 'Dhanmondi', badge: 'Top Rated', tags: ['Accent', 'Design'] },
      { id: 4, title: 'Office & Commercial Painting', rating: 4.79, reviews: 54, price: 12000, location: 'Banani', badge: 'Verified', tags: ['Commercial'] },
      { id: 5, title: 'Ceiling & Trim Painting', rating: 4.86, reviews: 92, price: 2500, location: 'Uttara', badge: 'Verified', tags: ['Ceiling'] },
      { id: 6, title: 'Texture & Stencil Wall Art', rating: 4.97, reviews: 38, price: 3500, location: 'Mirpur', badge: 'Top Rated', tags: ['Texture', 'Art'] },
    ],
  },
  'pest-control': {
    name: 'Pest Control',
    icon: <Trash2 size={36} />,
    description: 'Safe, effective pest elimination and prevention treatments by certified pest control experts.',
    color: 'text-green-500',
    bgGradient: 'from-green-50 to-white',
    services: [
      { id: 1, title: 'Full Home Pest Treatment', rating: 4.88, reviews: 203, price: 2500, location: 'Dhaka', badge: 'Top Rated', tags: ['Safe', 'Full Home'] },
      { id: 2, title: 'Termite Inspection & Control', rating: 4.92, reviews: 117, price: 3500, location: 'Gulshan', badge: 'Verified', tags: ['Termite'] },
      { id: 3, title: 'Cockroach Elimination Service', rating: 4.84, reviews: 289, price: 900, location: 'Dhanmondi', badge: 'Top Rated', tags: ['Cockroach'] },
      { id: 4, title: 'Mosquito Fogging & Spray', rating: 4.80, reviews: 154, price: 1200, location: 'Banani', badge: 'Verified', tags: ['Mosquito'] },
      { id: 5, title: 'Rodent Trap & Control', rating: 4.75, reviews: 76, price: 1500, location: 'Uttara', badge: 'Verified', tags: ['Rodent'] },
      { id: 6, title: 'Bedbug Treatment – Full Room', rating: 4.90, reviews: 91, price: 2000, location: 'Mirpur', badge: 'Top Rated', tags: ['Bedbug'] },
    ],
  },
  'appliance-repair': {
    name: 'Appliance Repair',
    icon: <Cpu size={36} />,
    description: 'Expert repair and maintenance of all home appliances — from ACs to washing machines.',
    color: 'text-indigo-500',
    bgGradient: 'from-indigo-50 to-white',
    services: [
      { id: 1, title: 'AC Repair & Gas Refill', rating: 4.94, reviews: 387, price: 1200, location: 'Dhaka', badge: 'Top Rated', tags: ['AC', 'Gas Refill'] },
      { id: 2, title: 'Washing Machine Repair', rating: 4.86, reviews: 212, price: 800, location: 'Gulshan', badge: 'Verified', tags: ['Washing Machine'] },
      { id: 3, title: 'Refrigerator Repair Service', rating: 4.89, reviews: 176, price: 900, location: 'Dhanmondi', badge: 'Top Rated', tags: ['Fridge'] },
      { id: 4, title: 'Microwave & Oven Repair', rating: 4.78, reviews: 98, price: 600, location: 'Banani', badge: 'Verified', tags: ['Oven'] },
      { id: 5, title: 'Water Purifier Service', rating: 4.83, reviews: 143, price: 500, location: 'Uttara', badge: 'Verified', tags: ['Purifier'] },
      { id: 6, title: 'TV & Electronics Repair', rating: 4.91, reviews: 204, price: 700, location: 'Mirpur', badge: 'Top Rated', tags: ['TV', 'Electronics'] },
    ],
  },
  'carpentry': {
    name: 'Carpentry',
    icon: <Hammer size={36} />,
    description: 'Skilled carpenters for furniture repair, custom builds, and home woodwork projects.',
    color: 'text-amber-500',
    bgGradient: 'from-amber-50 to-white',
    services: [
      { id: 1, title: 'Custom Furniture Design & Build', rating: 4.96, reviews: 89, price: 8000, location: 'Dhaka', badge: 'Top Rated', tags: ['Custom', 'Furniture'] },
      { id: 2, title: 'Door & Window Repair', rating: 4.85, reviews: 234, price: 600, location: 'Gulshan', badge: 'Verified', tags: ['Door', 'Window'] },
      { id: 3, title: 'Wardrobe & Cabinet Installation', rating: 4.90, reviews: 127, price: 3000, location: 'Dhanmondi', badge: 'Top Rated', tags: ['Cabinet'] },
      { id: 4, title: 'Flooring Installation', rating: 4.88, reviews: 76, price: 5000, location: 'Banani', badge: 'Verified', tags: ['Flooring'] },
      { id: 5, title: 'Bed Frame Assembly & Repair', rating: 4.80, reviews: 112, price: 1200, location: 'Uttara', badge: 'Verified', tags: ['Assembly'] },
      { id: 6, title: 'Office Desk & Shelf Build', rating: 4.92, reviews: 53, price: 4500, location: 'Mirpur', badge: 'Top Rated', tags: ['Office'] },
    ],
  },
  'shifting': {
    name: 'Shifting',
    icon: <Truck size={36} />,
    description: 'Safe and efficient home and office moving services with professional movers.',
    color: 'text-purple-500',
    bgGradient: 'from-purple-50 to-white',
    services: [
      { id: 1, title: 'Full Home Shifting Package', rating: 4.91, reviews: 178, price: 6000, location: 'Dhaka', badge: 'Top Rated', tags: ['Full Home', 'Insured'] },
      { id: 2, title: 'Office Relocation Service', rating: 4.87, reviews: 94, price: 12000, location: 'Gulshan', badge: 'Verified', tags: ['Office', 'Commercial'] },
      { id: 3, title: 'Small Item & Single Room Move', rating: 4.82, reviews: 213, price: 2000, location: 'Dhanmondi', badge: 'Verified', tags: ['Small Move'] },
      { id: 4, title: 'Furniture Loading & Unloading', rating: 4.78, reviews: 156, price: 1500, location: 'Banani', badge: 'Verified', tags: ['Loading'] },
      { id: 5, title: 'Vehicle Rental with Driver', rating: 4.85, reviews: 88, price: 3000, location: 'Uttara', badge: 'Verified', tags: ['Vehicle'] },
      { id: 6, title: 'Packing & Moving Full Service', rating: 4.93, reviews: 67, price: 8000, location: 'Mirpur', badge: 'Top Rated', tags: ['Packing', 'Full Service'] },
    ],
  },
  'beauty': {
    name: 'Beauty',
    icon: <Scissors size={36} />,
    description: 'On-demand beauty and grooming professionals who come straight to your door.',
    color: 'text-rose-500',
    bgGradient: 'from-rose-50 to-white',
    services: [
      { id: 1, title: 'Bridal Makeup & Hair Package', rating: 4.97, reviews: 312, price: 5000, location: 'Dhaka', badge: 'Top Rated', tags: ['Bridal', 'Premium'] },
      { id: 2, title: 'Haircut & Styling – Home Visit', rating: 4.88, reviews: 427, price: 400, location: 'Gulshan', badge: 'Verified', tags: ['Haircut', 'Home Visit'] },
      { id: 3, title: 'Facial & Skincare Treatment', rating: 4.91, reviews: 189, price: 800, location: 'Dhanmondi', badge: 'Top Rated', tags: ['Skincare'] },
      { id: 4, title: 'Mehndi / Henna Design', rating: 4.94, reviews: 274, price: 600, location: 'Banani', badge: 'Top Rated', tags: ['Mehndi'] },
      { id: 5, title: 'Full Body Massage – Home', rating: 4.86, reviews: 143, price: 1500, location: 'Uttara', badge: 'Verified', tags: ['Massage', 'Relaxation'] },
      { id: 6, title: 'Eyebrow Threading & Waxing', rating: 4.83, reviews: 318, price: 250, location: 'Mirpur', badge: 'Verified', tags: ['Threading'] },
    ],
  },
  'personal-care': {
    name: 'Personal Care',
    icon: <Heart size={36} />,
    description: 'Compassionate caregivers and personal care assistants for all ages and needs.',
    color: 'text-red-500',
    bgGradient: 'from-red-50 to-white',
    services: [
      { id: 1, title: 'Elderly Care & Companionship', rating: 4.96, reviews: 127, price: 2500, location: 'Dhaka', badge: 'Top Rated', tags: ['Elderly', 'Compassionate'] },
      { id: 2, title: 'Baby & Newborn Care Service', rating: 4.93, reviews: 89, price: 2000, location: 'Gulshan', badge: 'Top Rated', tags: ['Baby', 'Newborn'] },
      { id: 3, title: 'Post-Surgery Home Nursing', rating: 4.90, reviews: 64, price: 3500, location: 'Dhanmondi', badge: 'Verified', tags: ['Nursing', 'Medical'] },
      { id: 4, title: 'Physiotherapy – Home Visits', rating: 4.88, reviews: 112, price: 1800, location: 'Banani', badge: 'Verified', tags: ['Physio'] },
      { id: 5, title: 'Child Daycare & Tutoring', rating: 4.85, reviews: 93, price: 1500, location: 'Uttara', badge: 'Verified', tags: ['Daycare', 'Education'] },
      { id: 6, title: 'Personal Fitness Trainer – Home', rating: 4.91, reviews: 178, price: 1200, location: 'Mirpur', badge: 'Top Rated', tags: ['Fitness'] },
    ],
  },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const cat = categoryData[slug];

  if (!cat) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Category Not Found</h1>
          <p className="text-slate-500 mb-8 font-medium">The category you're looking for doesn't exist.</p>
          <Link href="/categories">
            <Button className="bg-[#2286BE] hover:bg-[#1b6da0] font-black rounded-2xl h-14 px-10">
              Browse All Categories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${cat.bgGradient} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-10 text-sm font-bold text-slate-400">
          <Link href="/categories" className="hover:text-[#2286BE] transition-colors flex items-center gap-1.5">
            <ArrowLeft size={16} /> All Categories
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-700">{cat.name}</span>
        </motion.div>

        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className={`h-24 w-24 shrink-0 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center ${cat.color} border border-slate-100`}>
              {cat.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#2286BE]/10 text-[#2286BE] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {cat.services.length} Services Available
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">{cat.name} Services</h1>
              <p className="text-slate-500 text-lg font-medium max-w-2xl">{cat.description}</p>
            </div>
            <div className="shrink-0">
              <Link href="/post-request">
                <Button className="bg-[#2286BE] hover:bg-[#059669] font-black rounded-2xl h-14 px-8 shadow-xl shadow-[#2286BE]/20 transition-all">
                  Post a Request
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-4 mb-14"
        >
          {[
            { label: 'Verified Providers', value: `${cat.services.length * 14}+` },
            { label: 'Avg. Response Time', value: '< 2 hrs' },
            { label: 'Satisfaction Rate', value: '98.2%' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 text-center">
              <p className="text-2xl font-black text-slate-900 mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {cat.services.map(service => (
            <motion.div key={service.id} variants={item}>
              <Link href={`/services?category=${cat.name}`} className="group block h-full">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-7 hover:shadow-2xl hover:shadow-[#2286BE]/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className={`h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center ${cat.color} shrink-0 group-hover:scale-110 transition-transform`}>
                      {React.cloneElement(cat.icon, { size: 22 })}
                    </div>
                    <Badge className={`${service.badge === 'Top Rated' ? 'bg-amber-50 text-amber-600' : 'bg-primary-soft text-[#2286BE]'} border-none font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl`}>
                      {service.badge === 'Top Rated' ? '★ ' : <ShieldCheck size={10} className="inline mr-1" />}{service.badge}
                    </Badge>
                  </div>

                  <h3 className="font-black text-slate-900 text-lg leading-snug mb-4 group-hover:text-[#2286BE] transition-colors">{service.title}</h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star size={15} className="text-amber-400 fill-amber-400" />
                      <span className="font-black text-slate-900 text-sm">{service.rating}</span>
                      <span className="text-slate-400 text-[10px] font-bold">({service.reviews})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <MapPin size={10} /> {service.location}
                      </div>
                      <span className="font-black text-slate-900 text-sm">৳{service.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-6">Can't find the right {cat.name.toLowerCase()} service?</h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto mb-10">
              Post a custom request and our best {cat.name.toLowerCase()} professionals will reach out to you within hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/post-request" className="inline-flex items-center justify-center px-10 h-16 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-[#2286BE]/20 hover:scale-105">
                Post a Custom Request
              </Link>
              <Link href="/categories" className="inline-flex items-center justify-center px-10 h-16 bg-white/10 hover:bg-white/20 text-white font-black text-lg rounded-2xl transition-all border border-white/10">
                Browse All Categories
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2286BE]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px] pointer-events-none" />
        </motion.div>

      </div>
    </div>
  );
}
