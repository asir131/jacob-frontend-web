'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, MapPin, ShieldCheck, ChevronRight, ArrowLeft,
  Search, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CATEGORY_MAP, getIconByName } from '@/data/categories';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function CategoryClient({ slug }: { slug: string }) {
  const cat = CATEGORY_MAP[slug];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<'all' | 'top'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const SORT_LABELS: Record<string, string> = {
    recommended: 'Recommended',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
  };

  const filteredServices = useMemo(() => {
    if (!cat) return [];
    let result = [...cat.services];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.title.toLowerCase().includes(q) || s.tags.some(tag => tag.toLowerCase().includes(q)));
    }

    if (filterRating === 'top') result = result.filter(s => s.rating >= 4.8 || s.badge === 'Top Rated');
    
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);

    return result;
  }, [cat, searchQuery, filterRating, sortBy]);

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
          <span aria-hidden="true"><ChevronRight size={14} /></span>
          <span className="text-slate-700">{cat.name}</span>
        </motion.div>

        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className={`h-24 w-24 shrink-0 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center ${cat.color} border border-slate-100`}>
              {getIconByName(cat.iconName, { size: 36 })}
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
                <Button className="bg-[#2286BE] hover:bg-[#1b6da0] font-black rounded-2xl h-14 px-8 shadow-xl shadow-[#2286BE]/20 transition-all">
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

        {/* Functional Filters & Search Toolbar */}
        <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             <Input 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={`Search ${cat.name.toLowerCase()} services...`} 
               className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 focus-visible:ring-[#2286BE] font-bold text-slate-900 w-full placeholder:font-medium placeholder:text-slate-400" 
             />
           </div>
           
           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Rating toggle */}
              <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setFilterRating('all')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                    filterRating === 'all' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterRating('top')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                    filterRating === 'top' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Star size={11} className={filterRating === 'top' ? 'text-amber-400 fill-amber-400' : ''} />
                  Top Rated
                </button>
              </div>

              {/* Premium custom sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="h-14 bg-slate-50 border border-slate-100 hover:border-[#2286BE]/30 rounded-2xl px-5 flex items-center gap-3 font-bold text-sm text-slate-700 transition-all min-w-[190px] justify-between"
                >
                  <span>{SORT_LABELS[sortBy]}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 origin-top-right"
                    >
                      {Object.entries(SORT_LABELS).map(([val, label]) => (
                        <button
                          key={val}
                          onClick={() => { setSortBy(val as any); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                            sortBy === val 
                              ? 'bg-[#2286BE]/10 text-[#2286BE]' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm mb-16">
             <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={32} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">No services found</h3>
             <p className="text-slate-500 font-medium max-w-md mx-auto">Try adjusting your search or filters.</p>
             <Button onClick={() => { setSearchQuery(''); setFilterRating('all'); }} variant="outline" className="mt-8 h-12 rounded-xl text-[#2286BE] hover:bg-[#2286BE]/5 hover:text-[#2286BE] border-slate-200">
                Clear all filters
             </Button>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {filteredServices.map(service => (
              <motion.div key={service.id} variants={item}>
                <Link href={`/services?category=${cat.slug}`} className="group block h-full">
                  <article className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-[#2286BE]/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Real photo header */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/95 backdrop-blur-md text-slate-900 border-none font-black text-[10px] uppercase px-3 py-1 shadow-sm">৳{service.price.toLocaleString()}</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className={`${service.badge === 'Top Rated' ? 'bg-amber-400 text-white' : 'bg-[#2286BE] text-white'} border-none font-black text-[10px] uppercase px-3 py-1 shadow-sm`}>
                          {service.badge === 'Top Rated' ? '★ Top Rated' : '✓ Verified'}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {service.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">{tag}</span>
                        ))}
                      </div>

                      <h3 className="font-black text-slate-900 text-lg leading-snug mb-3 group-hover:text-[#2286BE] transition-colors line-clamp-2">
                        {service.title}
                      </h3>

                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star size={15} className="text-amber-400 fill-amber-400" />
                          <span className="font-black text-slate-900 text-sm">{service.rating}</span>
                          <span className="text-slate-400 text-[10px] font-bold">({service.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-[#2286BE] uppercase tracking-widest bg-[#2286BE]/5 px-3 py-1.5 rounded-full">
                          <MapPin size={10} /> {service.location}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

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
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2286BE]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px] pointer-events-none" aria-hidden="true" />
        </motion.div>

      </div>
    </div>
  );
}
