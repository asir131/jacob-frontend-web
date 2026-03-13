'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_SERVICES, calculateDistance } from '@/data/mock-services';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '@/contexts/LocationContext';
import { MapPin, Star, Filter, ShieldCheck, Map, Grid, List as ListIcon, Heart } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BrowseServicesPage() {
  const { city, coordinates, radius, setRadius } = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('relevance');

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [providerTypes, setProviderTypes] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Computed Services with distances
  const availableServices = useMemo(() => {
    let filtered = MOCK_SERVICES.map(service => {
      let distance = 0;
      if (coordinates) {
        distance = calculateDistance(coordinates.lat, coordinates.lng, service.location.lat, service.location.lng);
      }
      return { ...service, distance };
    });

    // Apply distance filter
    filtered = filtered.filter(s => s.distance !== undefined && s.distance <= radius);

    // Apply Categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(s => selectedCategories.includes(s.category));
    }

    // Apply Rating
    if (minRating > 0) {
      filtered = filtered.filter(s => s.provider.rating >= minRating);
    }

    // Apply Provider Type
    if (providerTypes.length > 0) {
      filtered = filtered.filter(s => providerTypes.includes(s.provider.type));
    }

    // Apply Sort
    if (sortBy === 'distance') {
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.provider.rating - a.provider.rating);
    }

    return filtered;
  }, [coordinates, radius, selectedCategories, minRating, providerTypes, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleProviderType = (type: string) => {
    setProviderTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Services in {city}</h1>
            <p className="text-slate-500 font-medium">Found {availableServices.length} verified professionals near you</p>
          </motion.div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="md:hidden h-12 rounded-xl border-slate-200" onClick={() => setIsMobileFiltersOpen(true)}>
               <Filter size={18} className="mr-2" /> Filters
             </Button>

             <div className="flex bg-white rounded-xl border border-slate-100 p-1.5 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#2286BE]/10 text-[#2286BE]' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#2286BE]/10 text-[#2286BE]' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon size={18} /></button>
                <button onClick={() => setViewMode('map')} className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-[#2286BE]/10 text-[#2286BE]' : 'text-slate-400 hover:text-slate-600'}`}><Map size={18} /></button>
             </div>

             <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] bg-white h-12 rounded-xl border-slate-200 font-bold">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1">
                <SelectItem value="relevance" className="rounded-lg py-2.5">Relevance</SelectItem>
                <SelectItem value="distance" className="rounded-lg py-2.5">Distance</SelectItem>
                <SelectItem value="price-low" className="rounded-lg py-2.5">Price: Low to High</SelectItem>
                <SelectItem value="rating" className="rounded-lg py-2.5">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters Desktop */}
          <aside className={`w-full lg:w-72 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 sticky top-28">
              <div className="flex justify-between items-center mb-8 lg:hidden">
                <h2 className="text-xl font-black">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsMobileFiltersOpen(false)}>Close</Button>
              </div>

              {/* Distance Slider */}
              <div className="mb-10">
                <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center justify-between uppercase tracking-widest">
                  Distance <span className="text-[#2286BE]">{radius}km</span>
                </h3>
                <Slider 
                  defaultValue={[radius]} 
                  max={100} 
                  min={5} 
                  step={5} 
                  onValueChange={(val) => setRadius(val[0])} 
                  className="[&_[role=slider]]:bg-[#2286BE] [&_[role=slider]]:border-[#2286BE] [&_[role=slider]]:scale-125"
                />
              </div>

              {/* Categories */}
              <div className="mb-10">
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Categories</h3>
                <div className="space-y-4">
                  {['Cleaning', 'Plumbing', 'Electrical', 'Beauty', 'Pest Control', 'Appliance Repair'].map(cat => (
                    <div key={cat} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`cat-${cat}`} 
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => toggleCategory(cat)}
                        className="h-5 w-5 rounded-md data-[state=checked]:bg-[#2286BE] data-[state=checked]:border-[#2286BE]"
                      />
                      <label htmlFor={`cat-${cat}`} className="text-sm font-bold text-slate-600 cursor-pointer">
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provider Type */}
              <div className="mb-10">
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Expert Type</h3>
                <div className="space-y-4">
                  {['Solo', 'Team', 'Agency', 'Company'].map(type => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={providerTypes.includes(type)}
                        onCheckedChange={() => toggleProviderType(type)}
                        className="h-5 w-5 rounded-md data-[state=checked]:bg-[#2286BE] data-[state=checked]:border-[#2286BE]"
                      />
                      <label htmlFor={`type-${type}`} className="text-sm font-bold text-slate-600 cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Rating</h3>
                <RadioGroup value={minRating.toString()} onValueChange={(val) => setMinRating(Number(val))} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="4" id="r4" className="text-[#2286BE] border-[#2286BE]/30" />
                    <label htmlFor="r4" className="text-sm font-bold text-slate-600 cursor-pointer">4.0 & up</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="4.5" id="r45" className="text-[#2286BE] border-[#2286BE]/30" />
                    <label htmlFor="r45" className="text-sm font-bold text-slate-600 cursor-pointer">4.5 & up</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="0" id="r0" className="text-[#2286BE] border-[#2286BE]/30" />
                    <label htmlFor="r0" className="text-sm font-bold text-slate-600 cursor-pointer">Any rating</label>
                  </div>
                </RadioGroup>
              </div>

            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {availableServices.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-16 rounded-[3rem] border border-slate-100 text-center shadow-2xl shadow-slate-200/50"
                >
                  <div className="mx-auto w-32 h-32 bg-[#2286BE]/5 rounded-full flex items-center justify-center mb-10">
                    <MapPin size={48} className="text-[#2286BE]" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4">No Services Found</h2>
                  <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium text-lg leading-relaxed">We couldn't find any experts matching your filters within {radius}km of {city}.</p>
                  <Link href="/post-request">
                    <Button className="bg-[#2286BE] hover:bg-[#1b6da0] px-10 h-16 text-lg font-black rounded-2xl shadow-xl shadow-[#2286BE]/20">Post a Custom Request</Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div 
                  key={viewMode}
                  className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                >
                  {availableServices.map((service, idx) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, type: 'spring', stiffness: 100 }}
                    >
                      <Link href={`/services/${service.id}`} className="group block h-full">
                        <div className={`bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-[#2286BE]/10 transition-all duration-500 ${viewMode === 'list' ? 'flex flex-row h-52' : 'flex flex-col h-full'}`}>
                          
                          {/* Image Thumbnail */}
                          <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'w-full aspect-[4/3]'} overflow-hidden bg-slate-100`}>
                            {service.images[0] ? (
                              <Image 
                                src={service.images[0]} 
                                alt={service.title} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-slate-400">Premium Service</div>
                            )}
                            <div className="absolute top-4 left-4">
                               <Badge className="bg-white/95 backdrop-blur-md text-slate-900 border-none font-black text-[10px] uppercase px-3 py-1 shadow-sm">৳{service.startingPrice}</Badge>
                            </div>
                            <button className="absolute top-4 right-4 h-10 w-10 bg-white/95 backdrop-blur-md rounded-xl text-slate-400 hover:text-red-500 hover:scale-110 transition-all shadow-sm flex items-center justify-center">
                               <Heart size={18} />
                            </button>
                          </div>

                          {/* Content */}
                          <div className={`p-6 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-center' : ''}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Avatar className="h-6 w-6 border border-slate-100 shadow-sm">
                                  <AvatarImage src={service.provider.avatar} />
                                  <AvatarFallback className="bg-[#2286BE]/10 text-[#2286BE] text-[8px] font-black">PRO</AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-black text-slate-900 tracking-tight">{service.provider.name}</span>
                                {service.provider.badge === 'Verified' && <ShieldCheck size={14} className="text-[#2286BE]" />}
                            </div>
                            
                            <h3 className="font-black text-slate-900 group-hover:text-[#2286BE] transition-colors line-clamp-2 leading-snug text-lg mb-4">
                              {service.title}
                            </h3>

                            <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Star size={16} className="text-amber-400 fill-amber-400" />
                                <span className="font-black text-slate-900 text-sm">{service.provider.rating}</span>
                                <span className="text-slate-400 font-bold text-[10px] ml-1 uppercase">({service.provider.completedOrders})</span>
                              </div>
                              <div className="flex items-center text-[10px] font-black text-[#2286BE] uppercase tracking-widest bg-[#2286BE]/5 px-3 py-1.5 rounded-full">
                                <MapPin size={10} className="mr-1" /> {service.distance}km
                              </div>
                            </div>
                          </div>

                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
}
