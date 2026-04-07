'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_SERVICES } from '@/data/mock-services';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  ThumbsUp,
  Award,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewFilter from '@/components/ui/ReviewFilter';

export default function ProviderPublicProfile() {
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState(0);
  
  const decodedName = typeof id === 'string' ? decodeURIComponent(id).replace(/-/g, ' ') : '';

  // Find provider info from mock services (in a real app, this would be a separate API call)
  const providerServices = useMemo(() => {
    return MOCK_SERVICES.filter(s => 
      s.provider.id === id || 
      s.provider.name.toLowerCase() === decodedName.toLowerCase()
    );
  }, [id, decodedName]);

  const provider = providerServices[0]?.provider || {
    id: id as string,
    name: decodedName || 'Expert Provider',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(decodedName)}&background=2286BE&color=fff`,
    level: 'Top Rated',
    rating: 4.8,
    reviews: 120,
    memberSince: '2023',
    hourlyRate: 25,
    bio: `Hi, I am ${decodedName}, an experienced professional dedicated to providing high-quality service. I ensure every job is done with precision and care.`
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Left: Avatar & Quick Actions */}
            <div className="flex flex-col items-center text-center w-full md:w-auto">
              <div className="relative mb-6">
                <Avatar className="h-40 w-40 border-8 border-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
                  <AvatarImage src={provider.avatar} />
                  <AvatarFallback className="text-4xl font-black">{provider.name[0]}</AvatarFallback>
                </Avatar>
                {provider.level !== 'New' && (
                  <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                    <Award size={24} fill="currentColor" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3 w-full">
                <Link href={`/messages?user=${provider.id}`} className="w-full">
                   <Button className="w-full h-12 bg-[#2286BE] hover:bg-[#1b6da0] rounded-xl font-bold shadow-lg shadow-[#2286BE]/20 gap-2">
                      <MessageSquare size={18} /> Contact Me
                   </Button>
                </Link>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setIsShareModalOpen(true);
                    }}
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold gap-2 hover:bg-slate-50 transition-all"
                  >
                    <Share2 size={16} /> Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Info & Stats */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{provider.name}</h1>
                    {provider.badge === 'Verified' && (
                      <Badge className="bg-blue-50 text-[#2286BE] border-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={14} fill="currentColor" className="text-[#2286BE]" />
                        <span className="text-[10px] uppercase font-black tracking-widest leading-none mt-0.5">Verified Pro</span>
                      </Badge>
                    )}
                    <Badge className={`border-none font-black text-[10px] px-3 py-1 rounded-full ${
                      (providerServices[0]?.provider.type || 'Solo') === 'Agency' ? 'bg-purple-50 text-purple-600' :
                      (providerServices[0]?.provider.type || 'Solo') === 'Team' ? 'bg-blue-50 text-blue-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {(providerServices[0]?.provider.type || 'Solo') === 'Agency' ? '🏢' : (providerServices[0]?.provider.type || 'Solo') === 'Team' ? '👥' : '👤'} {providerServices[0]?.provider.type || 'Solo'}
                    </Badge>
                  </div>
                  <p className="text-slate-500 font-medium text-lg mb-4 italic">&quot;Professional {providerServices[0]?.category} Expert delivering top-tier results.&quot;</p>
                  
                  <div className="flex flex-wrap gap-6 items-center text-sm font-bold text-slate-600">
                    <div className="flex items-center gap-1.5"><Star size={18} className="text-amber-400 fill-amber-400" /> {provider.rating} <span className="text-slate-400 font-medium">({provider.completedOrders} orders)</span></div>
                    <div className="flex items-center gap-1.5"><MapPin size={18} className="text-slate-400" /> New York, NY</div>
                    <div className="flex items-center gap-1.5"><Clock size={18} className="text-slate-400" /> Avg. response 1hr</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`
                    border-none font-black text-xs uppercase px-4 py-2 rounded-xl shadow-sm
                    ${provider.level === 'Top Rated' ? 'bg-amber-400 text-white shadow-amber-200' : 
                      provider.level === 'Level 3' ? 'bg-purple-500 text-white shadow-purple-200' :
                      provider.level === 'Level 2' ? 'bg-green-500 text-white shadow-green-200' :
                      provider.level === 'Level 1' ? 'bg-blue-500 text-white shadow-blue-200' :
                      'bg-slate-400 text-white'}
                  `}>
                    {provider.level} Professional
                  </Badge>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Since 2023</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {[
                  { label: 'Completed', value: provider.completedOrders, icon: <CheckCircle2 size={16} className="text-green-500" /> },
                  { label: 'Rating', value: `${provider.rating}/5.0`, icon: <Star size={16} className="text-amber-400" /> },
                  { label: 'Level', value: `#${provider.level.split(' ')[1] || '1'}`, icon: <Award size={16} className="text-purple-500" /> },
                  { label: 'Recommends', value: '98%', icon: <ThumbsUp size={16} className="text-blue-500" /> },
                ].map((stat, i) => (
                  <Card key={i} className="border-none bg-slate-50 shadow-none rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        {stat.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                      </div>
                      <p className="text-lg font-black text-slate-900">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Tabs defaultValue="gigs" className="w-full">
          <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 mb-8 overflow-x-auto">
            <TabsTrigger value="gigs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4 font-black text-slate-500 data-[state=active]:text-[#2286BE]">Active Gigs ({providerServices.length})</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4 font-black text-slate-500 data-[state=active]:text-[#2286BE]">Reviews</TabsTrigger>
            <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-8 py-4 font-black text-slate-500 data-[state=active]:text-[#2286BE]">About</TabsTrigger>
          </TabsList>

          <TabsContent value="gigs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {providerServices.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Link href={`/services/${service.id}`} className="group block h-full bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-[#2286BE]/10 transition-all duration-500">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image 
                        src={service.images[0] || '/service1.png'} 
                        alt={service.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/95 backdrop-blur-md text-slate-900 border-none font-black text-[10px] uppercase px-3 py-1 shadow-sm">${service.startingPrice}</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-slate-900 group-hover:text-[#2286BE] transition-colors line-clamp-2 leading-snug mb-4">{service.title}</h3>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" /> <span className="font-black text-slate-900 text-xs">{service.provider.rating}</span></div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{service.category}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
              <h2 className="text-xl font-black text-slate-900 mb-6">What Clients Are Saying</h2>
              {(() => {
                const allReviews = [
                  { name: 'Michael Chen', rating: 5, date: '2 weeks ago', text: 'Hands down the best expert I have ever hired. Punctual and very thorough!' },
                  { name: 'Sarah J.', rating: 4, date: '1 month ago', text: 'Great service, very professional. Would hire again for deep cleaning.' },
                  { name: 'Robert P.', rating: 5, date: '2 months ago', text: 'Exceptional quality of work. My home is sparkling!' },
                ];
                const counts = allReviews.reduce((acc, r) => { acc[r.rating] = (acc[r.rating] || 0) + 1; return acc; }, {} as Record<number, number>);
                const filtered = reviewFilter === 0 ? allReviews : allReviews.filter(r => r.rating === reviewFilter);
                return (
                  <>
                    <ReviewFilter selected={reviewFilter} onChange={setReviewFilter} counts={counts} total={allReviews.length} />
                    {filtered.length === 0 ? (
                      <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                        <Star size={28} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold">No reviews for this rating.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {filtered.map((review, i) => (
                          <div key={i} className="border-b border-slate-50 last:border-0 pb-8 last:pb-0">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                                  <AvatarFallback className="font-bold">{review.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-black text-slate-900">{review.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                              </div>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h2 className="text-xl font-black text-slate-900 mb-6">About the Expert</h2>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6">
                    With over 5 years of experience in specialized home services, I provide high-quality solutions tailored to your needs. My commitment to excellence and attention to detail has earned me a reputation as a trusted professional in the local community.
                  </p>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Whether you need a quick fix or a major overhaul, I bring the right tools and expertise to every job. I pride myself on punctuality, clear communication, and customer satisfaction.
                  </p>
                </div>
                
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Skills & Specializations</h2>
                  <div className="flex flex-wrap gap-2">
                    {['Deep Cleaning', 'Sanitization', 'Eco-friendly Products', 'Organization', 'Office Cleaning'].map(skill => (
                      <Badge key={skill} className="bg-slate-50 text-slate-600 border-none px-4 py-2 rounded-xl font-bold">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm text-center">
                  <Award size={48} className="text-amber-400 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-slate-900 mb-2">Platform Performance</h3>
                  <div className="space-y-4 text-left mt-6">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px]">Response Rate</span>
                      <span className="text-slate-900">100%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[100%]" />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm font-bold mt-4">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px]">Delivered on time</span>
                      <span className="text-slate-900">96%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[96%]" />
                    </div>

                    <div className="flex justify-between items-center text-sm font-bold mt-4">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px]">Order Completion</span>
                      <span className="text-slate-900">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[92%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Share Modal Overlay */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setIsShareModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
             />
             <motion.div 
               initial={{ opacity: 0, y: 20, scale: 0.95 }} 
               animate={{ opacity: 1, y: 0, scale: 1 }} 
               exit={{ opacity: 0, y: 20, scale: 0.95 }} 
               className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-3xl overflow-hidden border-8 border-white/20"
             >
                <div className="absolute top-6 right-6">
                   <button onClick={() => setIsShareModalOpen(false)} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                      <X size={20} />
                   </button>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Share this Profile</h3>
                <p className="text-slate-500 font-medium mb-8">Spread the word about {provider.name}&apos;s expertise.</p>

                <div className="space-y-6">
                   {/* Copy Link */}
                   <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <div className="flex-1 px-4 text-sm font-bold text-slate-400 truncate tracking-tight">
                         {typeof window !== 'undefined' ? window.location.href : 'locallyserve.com/provider/001'}
                      </div>
                      <Button 
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('Link copied to clipboard!');
                          }
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-100 h-12 px-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm"
                      >
                         <Copy size={16} className="mr-2 text-[#2286BE]" /> Copy
                      </Button>
                   </div>

                   {/* Social Grid */}
                   <div className="grid grid-cols-3 gap-4">
                      {[
                        { name: 'Facebook', icon: <Facebook size={20} />, color: 'hover:bg-blue-600 hover:text-white' },
                        { name: 'X', icon: <Twitter size={20} />, color: 'hover:bg-black hover:text-white' },
                        { name: 'LinkedIn', icon: <Linkedin size={20} />, color: 'hover:bg-blue-700 hover:text-white' }
                      ].map((social) => (
                        <button key={social.name} onClick={() => toast.success(`Sharing on ${social.name}...`)} className={`flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all ${social.color} group`}>
                           <div className="transition-transform group-hover:scale-110">{social.icon}</div>
                           <span className="text-[10px] font-black uppercase tracking-widest">{social.name}</span>
                        </button>
                      ))}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
