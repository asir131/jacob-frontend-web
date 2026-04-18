'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Search, Star, Filter } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetCategoriesQuery, useGetPublicServicesQuery } from '@/store/services/apiSlice';
import { DEFAULT_CATEGORIES } from '@/data/categories';
import { formatRating } from '@/lib/formatters';

type ServiceCard = {
  id: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  image: string;
  avgPackagePrice: number;
  distanceKm: number | null;
  provider: {
    id: string;
    name: string;
    avatar: string;
    rating?: number;
    level?: 'Top Rated' | 'Level 3' | 'Level 2' | 'Level 1' | 'New';
    sellerLevel?: 'Top Rated' | 'Level 3' | 'Level 2' | 'Level 1' | 'New';
  };
};

type StaticServiceMeta = {
  expertType: 'Solo' | 'Team' | 'Agency';
  sellerLevel: 'Top Rated' | 'Level 3' | 'Level 2' | 'Level 1' | 'New';
  rating: number;
};

const EXPERT_TYPES: StaticServiceMeta['expertType'][] = ['Solo', 'Team', 'Agency'];
const SELLER_LEVELS: StaticServiceMeta['sellerLevel'][] = ['Top Rated', 'Level 3', 'Level 2', 'Level 1', 'New'];

const getStaticMetaById = (id: string): StaticServiceMeta => {
  const value = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    expertType: EXPERT_TYPES[value % EXPERT_TYPES.length],
    sellerLevel: SELLER_LEVELS[value % SELLER_LEVELS.length],
    rating: 4 + ((value % 10) / 10),
  };
};

const getLocationParts = (rawAddress: string, fallbackCity: string) => {
  const parts = String(rawAddress || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    area: parts[0] || fallbackCity || 'Area unavailable',
    district: parts[1] || 'District unavailable',
    country: parts[2] || 'Country unavailable',
  };
};

export default function BrowseServicesPage() {
  const router = useRouter();
  const { city, coordinates, radius, setRadius } = useLocation();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [providerTypes, setProviderTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 9;
  const lat = typeof user?.locationLat === 'number' ? user.locationLat : coordinates?.lat ?? null;
  const lng = typeof user?.locationLng === 'number' ? user.locationLng : coordinates?.lng ?? null;

  const { data: categoriesPayload } = useGetCategoriesQuery();
  const categories = useMemo(() => {
    const list = Array.isArray(categoriesPayload?.data) ? categoriesPayload.data : [];
    const apiCategories = list.map((item: { slug?: string; name?: string }) => ({
      slug: item?.slug || '',
      name: item?.name || 'Category',
    }));
    const defaultCategories = DEFAULT_CATEGORIES.map((item) => ({
      slug: item.slug,
      name: item.name,
    }));
    const defaultSlugs = new Set(defaultCategories.map((item) => item.slug));
    const customCategories = apiCategories.filter((item) => item.slug && !defaultSlugs.has(item.slug));

    return [...defaultCategories, ...customCategories];
  }, [categoriesPayload]);

  const { data: servicesPayload, isFetching } = useGetPublicServicesQuery({
    page,
    limit,
    radiusKm: radius,
    requireCoverage: true,
    categorySlug: selectedCategory,
    search: searchQuery,
    lat,
    lng,
  });

  const rawItems = useMemo(() => {
    const items = servicesPayload?.data?.items;
    return Array.isArray(items) ? (items as ServiceCard[]) : [];
  }, [servicesPayload?.data?.items]);

  const availableServices = useMemo(() => {
    return rawItems.filter((service) => {
      const staticMeta = getStaticMetaById(service.id);
      if (providerTypes.length > 0 && !providerTypes.includes(staticMeta.expertType)) return false;
      const providerLevel = service.provider?.level || service.provider?.sellerLevel || 'New';
      if (selectedLevels.length > 0 && !selectedLevels.includes(providerLevel)) return false;
      const providerRating = Number(service.provider?.rating) || staticMeta.rating;
      if (minRating > 0 && providerRating < minRating) return false;
      return true;
    });
  }, [minRating, providerTypes, rawItems, selectedLevels]);

  const pagination = servicesPayload?.data?.pagination || {
    page: 1,
    totalPages: 1,
    totalItems: 0,
    hasPrevPage: false,
    hasNextPage: false,
  };

  const toggleProviderType = (type: string) => {
    setPage(1);
    setProviderTypes((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]));
  };

  const toggleLevel = (level: string) => {
    setPage(1);
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((item) => item !== level) : [...prev, level]));
  };

  const locationParts = getLocationParts(user?.address || '', city);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-slate-900 tracking-tight mb-2"
          >
            Services near you
          </motion.h1>
          <p className="text-slate-500 font-medium">
            {locationParts.area}, {locationParts.district}, {locationParts.country}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search by service, provider or category..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2286BE]/40 transition-all shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            className="md:hidden h-12 rounded-xl border-slate-200"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside
            className={`w-full lg:w-72 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 sticky top-28">
              <div className="flex justify-between items-center mb-8 lg:hidden">
                <h2 className="text-xl font-black">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsMobileFiltersOpen(false)}>
                  Close
                </Button>
              </div>

              <div className="mb-10">
                <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center justify-between uppercase tracking-widest">
                  Distance <span className="text-[#2286BE]">{radius}km</span>
                </h3>
                <Slider
                  value={[radius]}
                  max={100}
                  min={5}
                  step={5}
                  onValueChange={(val: number[]) => {
                    setRadius(val[0] ?? radius);
                    setPage(1);
                  }}
                  className="[&_[role=slider]]:bg-[#2286BE] [&_[role=slider]]:border-[#2286BE] [&_[role=slider]]:scale-125"
                />
              </div>

              <div className="mb-10">
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Categories</h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setPage(1);
                    }}
                    className={`w-full text-left rounded-xl px-3 py-2 text-sm font-bold transition ${selectedCategory === 'all' ? 'bg-[#2286BE]/10 text-[#2286BE]' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setPage(1);
                      }}
                      className={`w-full text-left rounded-xl px-3 py-2 text-sm font-bold transition ${selectedCategory === cat.slug ? 'bg-[#2286BE]/10 text-[#2286BE]' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Expert Type</h3>
                <div className="space-y-4">
                  {['Solo', 'Team', 'Agency'].map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox
                        id={`type-${type}`}
                        checked={providerTypes.includes(type)}
                        onCheckedChange={() => toggleProviderType(type)}
                        className="h-5 w-5 rounded-md data-[state=checked]:bg-[#2286BE] data-[state=checked]:border-[#2286BE]"
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm font-bold text-slate-600 cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Seller Level</h3>
                <div className="space-y-4">
                  {['Top Rated', 'Level 3', 'Level 2', 'Level 1', 'New'].map((level) => (
                    <div key={level} className="flex items-center space-x-3">
                      <Checkbox
                        id={`lvl-${level}`}
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                        className="h-5 w-5 rounded-md data-[state=checked]:bg-[#2286BE] data-[state=checked]:border-[#2286BE]"
                      />
                      <label
                        htmlFor={`lvl-${level}`}
                        className="text-sm font-bold text-slate-600 cursor-pointer"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Rating</h3>
                <div className="space-y-3">
                  {[4, 4.5, 0].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setMinRating(value);
                        setPage(1);
                      }}
                      className={`w-full text-left rounded-xl px-3 py-2 text-sm font-bold transition ${minRating === value ? 'bg-[#2286BE]/10 text-[#2286BE]' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {value === 0 ? 'Any rating' : `${value}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 pb-24">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">Showing {availableServices.length} services</p>
              <p className="text-sm font-bold text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            </div>

            {isFetching ? (
              <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center text-slate-500 font-bold">
                Loading services...
              </div>
            ) : availableServices.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center">
                <h2 className="text-2xl font-black text-slate-900">No services found</h2>
                <p className="mt-2 text-slate-500 font-medium">Try changing radius or category filters.</p>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {availableServices.map((service) => {
                  const staticMeta = getStaticMetaById(service.id);
                  const providerRating = Number(service.provider?.rating) || staticMeta.rating;
                  const providerLevel = service.provider?.level || service.provider?.sellerLevel || 'New';
                  return (
                    <Link key={service.id} href={`/services/${service.id}`} className="group block h-full">
                      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-[#2286BE]/10 transition-all duration-500 h-full flex flex-col">
                        <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                          {service.image ? (
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                              Service
                            </div>
                          )}
                          <div className="absolute top-4 left-4 rounded-md bg-white/95 px-3 py-1 text-[10px] font-black uppercase text-slate-900">
                            ${service.avgPackagePrice || 0}
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-4">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                router.push(`/provider/${service.provider.id}`);
                              }}
                              className="flex items-center gap-2 hover:underline accent-[#2286BE]"
                            >
                              <Avatar className="h-6 w-6 border border-slate-100 shadow-sm">
                                <AvatarImage src={service.provider.avatar} />
                                <AvatarFallback className="bg-[#2286BE]/10 text-[#2286BE] text-[8px] font-black">
                                  PRO
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-black text-slate-900 tracking-tight">
                                {service.provider.name}
                              </span>
                            </button>
                            <span className="ml-auto text-[9px] font-black uppercase rounded-md bg-slate-100 px-2 py-1 text-slate-500">
                              {providerLevel}
                            </span>
                          </div>

                          <h3 className="font-black text-slate-900 group-hover:text-[#2286BE] transition-colors line-clamp-2 leading-snug text-lg mb-4">
                            {service.title}
                          </h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                            {service.categoryName} | {staticMeta.expertType}
                          </p>

                          <div className="mt-auto pt-5 border-t border-slate-50 flex items-end justify-between">
                            <div className="flex items-center text-[10px] font-black text-[#2286BE] uppercase tracking-widest bg-[#2286BE]/5 px-3 py-1.5 rounded-full">
                              <MapPin size={10} className="mr-1" />
                              {service.distanceKm ?? 'N/A'}km
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Star size={16} className="text-amber-400 fill-amber-400" />
                              <span className="font-black text-slate-900 text-sm">
                                {formatRating(providerRating)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

          </main>
        </div>
      </div>

      <div className="fixed bottom-10 left-[58%] -translate-x-1/2 z-40">
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
          <Button
            variant="outline"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-xl"
          >
            Previous
          </Button>
          <div className="rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-700 border border-slate-200">
            {pagination.page}/{pagination.totalPages}
          </div>
          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
