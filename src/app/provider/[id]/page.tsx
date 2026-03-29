'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_SERVICES } from '@/data/mock-services';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  ThumbsUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProviderPublicProfile() {
  const { id } = useParams();
  
  // Find provider info from mock services (in a real app, this would be a separate API call)
  const providerServices = useMemo(() => {
    return MOCK_SERVICES.filter(s => s.provider.id === id);
  }, [id]);

  const provider = providerServices[0]?.provider;

  if (!provider) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Expert Not Found</h1>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">The professional profile you're looking for doesn't exist or has been moved.</p>
        <Link href="/services">
          <Button className="bg-[#2286BE] hover:bg-[#1b6da0] h-12 px-8 rounded-xl font-bold">Browse All Experts</Button>
        </Link>
      </div>
    );
  }

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
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Profile link copied to clipboard!');
                    }}
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold gap-2 hover:bg-slate-50 transition-all"
                  >
                    <Share2 size={16} /> Share
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
                    <MoreHorizontal size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Info & Stats */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{provider.name}</h1>
                    {provider.badge === 'Verified' && (
                      <Badge className="bg-blue-50 text-[#2286BE] border-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={14} fill="currentColor" className="text-[#2286BE]" />
                        <span className="text-[10px] uppercase font-black tracking-widest leading-none mt-0.5">Verified Pro</span>
                      </Badge>
                    )}
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
              <h2 className="text-xl font-black text-slate-900 mb-8">What Clients Are Saying</h2>
              <div className="space-y-8">
                {[
                  { name: 'Michael Chen', rating: 5, date: '2 weeks ago', text: 'Rahim is hands down the best cleaning expert I have ever hired. Punctual and very thorough!' },
                  { name: 'Sarah J.', rating: 4, date: '1 month ago', text: 'Great service, very professional. Would hire again for deep cleaning.' },
                  { name: 'Robert P.', rating: 5, date: '2 months ago', text: 'Exceptional quality of work. My home is sparkling!' }
                ].map((review, i) => (
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
    </div>
  );
}
