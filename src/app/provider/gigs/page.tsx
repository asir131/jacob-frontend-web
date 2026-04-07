'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, PauseCircle, Play, Trash2, Eye, MoreHorizontal, Star, TrendingUp, BarChart3, Zap, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type GigPackage = {
  name: string;
  title: string;
  description: string;
  deliveryTime: string;
  price: number;
};

type MyGig = {
  _id: string;
  title: string;
  categoryName: string;
  categorySlug: string;
  images?: string[];
  packages?: GigPackage[];
  status: 'draft' | 'pending_approval' | 'published' | 'rejected';
  baseCity?: string;
  travelRadiusKm?: number | null;
  description?: string;
  createdAt?: string;
  approvedAt?: string;
};

type PendingRequest = {
  _id: string;
  title: string;
  categoryName: string;
  customCategoryName?: string;
  status: string;
  createdAt?: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProviderGigsPage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('published');
  const [publishedGigs, setPublishedGigs] = useState<MyGig[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyGigs = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('auth_token');

      if (!apiBase || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBase}/api/gigs/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json();
        if (response.ok && payload?.success) {
          setPublishedGigs(Array.isArray(payload?.data?.publishedGigs) ? payload.data.publishedGigs : []);
          setPendingRequests(Array.isArray(payload?.data?.pendingRequests) ? payload.data.pendingRequests : []);
        }
      } catch {
        // keep empty state
      } finally {
        setLoading(false);
      }
    };

    void loadMyGigs();
  }, []);

  const activeItems = useMemo(() => {
    if (activeTab === 'published') return publishedGigs.filter((gig) => gig.status === 'published');
    if (activeTab === 'pending') return pendingRequests.filter((gig) => gig.status === 'pending_approval');
    return publishedGigs.filter((gig) => gig.status === 'rejected' || gig.status === 'draft');
  }, [activeTab, pendingRequests, publishedGigs]);

  const tabCounts = {
    published: publishedGigs.filter((gig) => gig.status === 'published').length,
    pending: pendingRequests.filter((gig) => gig.status === 'pending_approval').length,
    rejected: publishedGigs.filter((gig) => gig.status === 'rejected' || gig.status === 'draft').length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#2286BE] mb-2">My Gig</p>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manage Your Gigs</h1>
            <p className="text-slate-500 mt-2 text-lg">View published gigs and track anything waiting for admin review.</p>
          </div>
          {role === 'provider' ? (
            <Link href="/provider/gigs/create">
              <Button className="bg-[#2286BE] hover:bg-[#059669] font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#2286BE]/20 group">
                <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> Create New Gig
              </Button>
            </Link>
          ) : null}
        </motion.div>

        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 mb-8 inline-flex w-full md:w-auto">
          <Tabs defaultValue="published" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-12 w-full md:w-auto justify-start gap-1">
              <TabsTrigger value="published" className="px-8 rounded-xl data-[state=active]:bg-[#2286BE] data-[state=active]:text-white data-[state=active]:shadow-md font-bold transition-all">
                Published <span className="ml-2 text-[10px] opacity-70 px-1.5 py-0.5 bg-black/10 rounded-full">{tabCounts.published}</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="px-8 rounded-xl data-[state=active]:bg-[#2286BE] data-[state=active]:text-white data-[state=active]:shadow-md font-bold transition-all">
                Review <span className="ml-2 text-[10px] opacity-70 px-1.5 py-0.5 bg-black/10 rounded-full">{tabCounts.pending}</span>
              </TabsTrigger>
              <TabsTrigger value="other" className="px-8 rounded-xl data-[state=active]:bg-[#2286BE] data-[state=active]:text-white data-[state=active]:shadow-md font-bold transition-all">
                Other <span className="ml-2 text-[10px] opacity-70 px-1.5 py-0.5 bg-black/10 rounded-full">{tabCounts.rejected}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white border border-slate-200 p-10 text-slate-500 font-medium">Loading your gigs...</div>
        ) : null}

        <AnimatePresence mode="wait">
          {!loading ? (
            <motion.div key={activeTab} variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeItems.map((gig) => {
                const cover = gig.images?.[0] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?q=80&w=800&auto=format&fit=crop';
                const isPending = gig.status === 'pending_approval';
                return (
                  <motion.div key={gig._id} variants={itemVariants}>
                    <Card className="overflow-hidden border-slate-200 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full rounded-2xl">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image src={cover} alt={gig.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 left-4">
                          <Badge
                            className={`font-black uppercase tracking-widest text-[10px] px-3 py-1 shadow-lg ${
                              isPending ? 'bg-amber-500 text-white' : gig.status === 'published' ? 'bg-[#2286BE] text-white' : 'bg-slate-500 text-white'
                            }`}
                          >
                            {isPending ? 'Under Review' : gig.status}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button variant="secondary" size="icon" className="h-9 w-9 bg-white/90 backdrop-blur shadow-xl hover:bg-white active:scale-90 transition-all">
                            <Edit2 size={16} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="icon" className="h-9 w-9 bg-white/90 backdrop-blur shadow-xl hover:bg-white active:scale-90 transition-all">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl">
                              <DropdownMenuItem className="cursor-pointer py-3 rounded-lg">
                                <Eye size={16} className="mr-3 text-slate-400" /> Preview Service
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer py-3 rounded-lg">
                                <TrendingUp size={16} className="mr-3 text-slate-400" /> View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {isPending ? (
                                <DropdownMenuItem className="cursor-pointer py-3 rounded-lg text-amber-600 focus:text-amber-600 focus:bg-amber-50">
                                  <Clock size={16} className="mr-3" /> Waiting Review
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="cursor-pointer py-3 rounded-lg text-[#2286BE] focus:text-[#2286BE] focus:bg-primary-soft">
                                  <Play size={16} className="mr-3" /> Activate Listing
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="cursor-pointer py-3 rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 size={16} className="mr-3" /> Permanent Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-xl">Fast Edit Details</Button>
                        </div>
                      </div>

                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-slate-100 text-slate-700 border-none font-black text-[9px] uppercase px-2 py-0.5 rounded-md">
                            {gig.categoryName}
                          </Badge>
                          {isPending ? (
                            <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px] uppercase px-2 py-0.5 rounded-md">
                              Admin Review
                            </Badge>
                          ) : null}
                        </div>

                        <h3 className="font-bold text-slate-900 text-lg line-clamp-2 leading-tight mb-4 min-h-[3.5rem] group-hover:text-primary transition-colors">
                          {gig.title}
                        </h3>

                        <div className="space-y-2 text-sm text-slate-500 mb-5">
                          {gig.baseCity ? <p className="font-medium">{gig.baseCity}</p> : null}
                          {gig.travelRadiusKm ? <p className="font-medium">Service radius: {gig.travelRadiusKm} km</p> : null}
                          {gig.description ? <p className="line-clamp-2">{gig.description}</p> : null}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                              <Star size={14} className="text-amber-500 mr-1 fill-amber-500" />
                              <span className="text-sm font-black text-amber-700">4.9</span>
                            </div>
                            <span className="text-xs font-bold text-slate-400">(demo)</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Packages</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{gig.packages?.length || 0}</p>
                          </div>
                        </div>

                        <div className="mt-auto grid grid-cols-3 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Status</p>
                            <div className="flex items-center justify-center text-slate-900 gap-1">
                              <ShieldCheck size={12} className="text-slate-400" />
                              <p className="font-extrabold text-xs">{isPending ? 'Review' : 'Live'}</p>
                            </div>
                          </div>
                          <div className="text-center border-x border-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Images</p>
                            <div className="flex items-center justify-center text-slate-900 gap-1">
                              <Sparkles size={12} className="text-[#2286BE]" />
                              <p className="font-extrabold text-xs">{gig.images?.length || 0}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Radius</p>
                            <div className="flex items-center justify-center text-[#2286BE] gap-1">
                              <TrendingUp size={12} />
                              <p className="font-extrabold text-xs">{gig.travelRadiusKm || 0}km</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!loading && activeItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200"
          >
            <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <Plus size={48} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Gigs Found</h3>
            <p className="text-slate-500 max-w-xs text-center mb-8 font-medium">
              You haven&apos;t created any services yet. Start growing your business today!
            </p>
            <Link href="/provider/gigs/create">
              <Button className="bg-[#2286BE] hover:bg-[#059669] font-black h-14 px-10 rounded-2xl shadow-xl shadow-primary/20">
                Create Your First Gig
              </Button>
            </Link>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
