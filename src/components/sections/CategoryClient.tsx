'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, ShieldCheck, ChevronRight, ArrowLeft, Search, ChevronDown, Filter, Map, Grid, List as ListIcon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { CATEGORY_MAP, getIconByName } from '@/data/categories';
import { MOCK_SERVICES, calculateDistance } from '@/data/mock-services';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/ui/AuthModal';
import { useGetCategoriesQuery } from '@/store/services/apiSlice';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function CategoryClient({ slug }: { slug: string }) {
  const { city, coordinates, radius } = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: categoriesPayload, isFetching: isCategoriesLoading } = useGetCategoriesQuery();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [providerTypes, setProviderTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const cat = useMemo(() => {
    if (CATEGORY_MAP[slug]) return CATEGORY_MAP[slug];

    const categoryList = Array.isArray(categoriesPayload?.data) ? categoriesPayload.data : [];
    const resolvedCategory = categoryList.find((entry: { slug?: string }) => entry.slug === slug) as
      | {
          name: string;
          slug: string;
          iconName?: string;
          description?: string;
          color?: string;
          bgGradient?: string;
        }
      | undefined;

    if (!resolvedCategory) return null;

    return {
      name: resolvedCategory.name,
      slug: resolvedCategory.slug,
      iconName: resolvedCategory.iconName || 'ShieldCheck',
      description:
        resolvedCategory.description ||
        `Explore ${resolvedCategory.name} services from verified professionals.`,
      color: resolvedCategory.color || 'text-slate-600',
      bgGradient: resolvedCategory.bgGradient || 'from-slate-100 to-white',
      services: [],
    };
  }, [categoriesPayload, slug]);

  const isLoadingCategory = !CATEGORY_MAP[slug] && isCategoriesLoading;

  const SORT_LABELS: Record<string, string> = {
    relevance: 'Relevance',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
    rating: 'Highest Rated',
  };

  const filteredServices = useMemo(() => {
    if (!cat) return [];
    
    // Filter MOCK_SERVICES instead of the small cat.services array
    let result = MOCK_SERVICES.filter(s => s.category.toLowerCase() === cat.name.toLowerCase())
      .map(service => {
        let distance = 0;
        if (coordinates) {
          distance = calculateDistance(coordinates.lat, coordinates.lng, service.location.lat, service.location.lng);
        }
        return { ...service, distance };
      });

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }

    if (minRating > 0) {
      result = result.filter(s => s.provider.rating >= minRating);
    }

    if (selectedLevels.length > 0) {
      result = result.filter(s => selectedLevels.includes(s.provider.level));
    }

    if (providerTypes.length > 0) {
      result = result.filter(s => providerTypes.includes(s.provider.type));
    }
    
    // Apply Sort
    if (sortBy === 'price-low') result.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sortBy === 'price-high') result.sort((a, b) => b.startingPrice - a.startingPrice);
    if (sortBy === 'rating') result.sort((a, b) => b.provider.rating - a.provider.rating);

    return result;
  }, [cat, searchQuery, minRating, selectedLevels, providerTypes, sortBy, coordinates]);

  if (isLoadingCategory) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2286BE]/20 border-t-[#2286BE]" />
          <p className="text-slate-500 font-medium">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Category Not Found</h1>
          <p className="text-slate-500 mb-8 font-medium">The category you&apos;re looking for doesn&apos;t exist.</p>
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
                  {filteredServices.length} Services in {city}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">{cat.name} Services</h1>
              <p className="text-slate-500 text-lg font-medium max-w-2xl">{cat.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 sticky top-28">
              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Search</h3>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services..." 
                    className="h-12 pl-12 rounded-xl border-slate-100 focus-visible:ring-[#2286BE] font-bold" 
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Seller Level</h3>
                <div className="space-y-4">
                  {['Top Rated', 'Level 3', 'Level 2', 'Level 1', 'New'].map(lvl => (
                    <div key={lvl} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`lvl-${lvl}`} 
                        checked={selectedLevels.includes(lvl)}
                        onCheckedChange={() => {
                          setSelectedLevels(prev => prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]);
                        }}
                        className="h-5 w-5 rounded-md data-[state=checked]:bg-[#2286BE]"
                      />
                      <label htmlFor={`lvl-${lvl}`} className="text-sm font-bold text-slate-600 cursor-pointer">{lvl}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Expert Type</h3>
                <div className="space-y-4">
                  {['Solo', 'Team', 'Agency'].map(type => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={providerTypes.includes(type)}
                        onCheckedChange={() => {
                          setProviderTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
                        }}
                        className="h-5 w-5 rounded-md data-[state=checked]:bg-[#2286BE]"
                      />
                      <label htmlFor={`type-${type}`} className="text-sm font-bold text-slate-600 cursor-pointer">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Min. Rating</h3>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex-wrap gap-1">
                  {[0, 4, 4.5].map(r => (
                    <button 
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-2 rounded-xl font-bold text-[10px] uppercase transition-all ${minRating === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {r === 0 ? 'Any' : `${r}+ ★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Results */}
          <div className="flex-1 min-w-0">
             <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                      <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#2286BE] shadow-sm' : 'text-slate-400'}`}><Grid size={18} /></button>
                      <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#2286BE] shadow-sm' : 'text-slate-400'}`}><ListIcon size={18} /></button>
                   </div>
                   <span className="text-sm font-bold text-slate-400">{filteredServices.length} Results</span>
                </div>

                <div className="relative">
                  <button onClick={() => setIsSortOpen(!isSortOpen)} className="h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 flex items-center gap-3 font-bold text-sm text-slate-700 min-w-[180px] justify-between">
                    <span>{SORT_LABELS[sortBy as keyof typeof SORT_LABELS]}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 origin-top-right">
                        {Object.entries(SORT_LABELS).map(([val, label]) => (
                          <button key={val} onClick={() => { setSortBy(val); setIsSortOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${sortBy === val ? 'bg-[#2286BE]/10 text-[#2286BE]' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
             </div>

             {filteredServices.length === 0 ? (
               <div className="bg-white rounded-[2rem] border border-slate-100 p-20 text-center">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><Search size={32} /></div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">No services found</h3>
                  <p className="text-slate-500 font-medium">Adjust your filters to see more results.</p>
               </div>
             ) : (
               <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {filteredServices.map(service => (
                    <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Link href={`/services/${service.id}`} className="group block h-full">
                        <div className={`bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-[#2286BE]/10 transition-all duration-300 ${viewMode === 'list' ? 'flex flex-row h-52' : 'flex flex-col h-full'}`}>
                          <div className={`relative ${viewMode === 'list' ? 'w-64 shrink-0' : 'w-full aspect-[4/3]'} overflow-hidden bg-slate-100`}>
                            <Image src={service.images[0] || '/service1.png'} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 left-4"><Badge className="bg-white/95 backdrop-blur-md text-slate-900 border-none font-black text-[10px] uppercase px-3 py-1 shadow-sm">${service.startingPrice}</Badge></div>
                            <button onClick={(e) => { e.preventDefault(); if(!isAuthenticated) setIsAuthModalOpen(true); setFavorites(prev => prev.includes(service.id) ? prev.filter(id => id !== service.id) : [...prev, service.id]); }} className={`absolute top-4 right-4 h-10 w-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center ${favorites.includes(service.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}><Heart size={18} fill={favorites.includes(service.id) ? "currentColor" : "none"}/></button>
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <Link href={`/provider/${service.provider.id}`} className="hover:underline accent-[#2286BE] flex items-center gap-2">
                                <Avatar className="h-6 w-6 border border-slate-100 shadow-sm"><AvatarImage src={service.provider.avatar} /><AvatarFallback>P</AvatarFallback></Avatar>
                                <span className="text-xs font-black text-slate-900">{service.provider.name}</span>
                              </Link>
                              {service.provider.level && (
                                <Badge className={`ml-1 border-none font-black text-[9px] uppercase px-2 py-0.5 rounded-md md:inline-flex hidden ${service.provider.level === 'Top Rated' ? 'bg-amber-400 text-white' : service.provider.level === 'Level 3' ? 'bg-purple-500 text-white' : service.provider.level === 'Level 2' ? 'bg-green-500 text-white' : service.provider.level === 'Level 1' ? 'bg-blue-500 text-white' : 'bg-slate-400 text-white'}`}>
                                  {service.provider.level}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-black text-slate-900 group-hover:text-[#2286BE] transition-colors line-clamp-2 leading-snug mb-4">{service.title}</h3>
                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" /><span className="font-black text-slate-900 text-xs">{service.provider.rating}</span><span className="text-slate-400 font-bold text-[9px]">({service.provider.completedOrders})</span></div>
                              <div className="flex items-center text-[9px] font-black text-[#2286BE] uppercase tracking-widest bg-[#2286BE]/5 px-2 py-1 rounded-full"><MapPin size={10} className="mr-1" /> {service.distance}km</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
               </div>
             )}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-24 bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-6">Can&apos;t find the right {cat.name.toLowerCase()} service?</h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto mb-10">Post a custom request and our best {cat.name.toLowerCase()} professionals will reach out to you within hours.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/post-request" className="inline-flex items-center justify-center px-10 h-16 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-[#2286BE]/20 hover:scale-105">Post a Custom Request</Link>
              <Link href="/categories" className="inline-flex items-center justify-center px-10 h-16 bg-white/10 hover:bg-white/20 text-white font-black text-lg rounded-2xl transition-all border border-white/10">Browse All Categories</Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2286BE]/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px] pointer-events-none" aria-hidden="true" />
        </motion.div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} title="Love this Service?" subtitle="Sign in to save this pro to your favorites." />
    </div>
  );
}
