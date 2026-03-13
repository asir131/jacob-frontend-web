'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SERVICES } from '@/data/mock-services';
import { MapPin, Star, ShieldCheck, Clock, MessageSquare, CheckCircle2, ChevronRight, Play, Heart, Share2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const service = MOCK_SERVICES.find(s => s.id === resolvedParams.id);

  if (!service) {
    notFound();
  }

  const handleBooking = () => {
    router.push(`/book/${service.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Breadcrumbs */}
      <div className="border-b border-slate-100 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <Link href="/" className="hover:text-[#2286BE] transition-colors">Home</Link>
           <ChevronRight size={12} className="mx-2 text-slate-300" />
           <Link href="/services" className="hover:text-[#2286BE] transition-colors">Services</Link>
           <ChevronRight size={12} className="mx-2 text-slate-300" />
           <Link href={`/services?category=${service.category}`} className="hover:text-[#2286BE] transition-colors">{service.category}</Link>
           <ChevronRight size={12} className="mx-2 text-slate-300" />
           <span className="text-slate-900 truncate">{service.subCategory}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
        
          {/* Left Column: Details (Main Content) */}
          <div className="flex-1 w-full lg:max-w-[760px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-6">
                 <Badge className="bg-[#2286BE]/10 text-[#2286BE] border-none font-black text-[10px] px-3 py-1 uppercase tracking-widest">{service.category}</Badge>
                 <div className="flex items-center">
                    <Star size={14} className="text-amber-400 fill-amber-400 mr-1.5" />
                    <span className="font-black text-slate-900 text-sm">{service.provider.rating}</span>
                 </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
                {service.title}
              </h1>
            </motion.div>

            {/* Hero Gallery */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
               <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-slate-100 group mb-6 shadow-3xl shadow-slate-300/10 border-8 border-white">
                   <Image src={service.images[0] || '/hero1.png'} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" priority />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-center justify-center cursor-pointer">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="h-20 w-20 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-[#2286BE] shadow-2xl"
                      >
                        <Play fill="currentColor" size={32} className="ml-1.5" />
                      </motion.div>
                   </div>
                   <div className="absolute top-6 right-6 flex gap-3">
                      <button className="h-12 w-12 bg-white/95 backdrop-blur-md rounded-2xl text-slate-900 hover:text-red-500 transition-colors shadow-xl flex items-center justify-center"><Heart size={20} /></button>
                      <button className="h-12 w-12 bg-white/95 backdrop-blur-md rounded-2xl text-slate-900 hover:text-[#2286BE] transition-colors shadow-xl flex items-center justify-center"><Share2 size={20} /></button>
                   </div>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {[1, 2, 3, 4].map(i => (
                     <motion.div 
                      key={i} 
                      whileHover={{ y: -4 }}
                      className={`relative h-20 w-32 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${i === 1 ? 'border-[#2286BE] shadow-lg shadow-[#2286BE]/20' : 'border-white shadow-sm opacity-60 hover:opacity-100'}`}
                     >
                       <Image src={service.images[0] || '/hero1.png'} alt="gallery" fill className="object-cover" />
                    </motion.div>
                  ))}
               </div>
            </motion.div>

            {/* Content Tabs */}
            <div className="mb-16">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="bg-transparent border-b border-slate-100 rounded-none w-full justify-start gap-10 p-0 h-14 mb-10">
                   <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:text-[#2286BE] px-0 h-14 font-black uppercase text-xs tracking-widest text-slate-400">About Service</TabsTrigger>
                   <TabsTrigger value="faq" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:text-[#2286BE] px-0 h-14 font-black uppercase text-xs tracking-widest text-slate-400">FAQs</TabsTrigger>
                   <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:text-[#2286BE] px-0 h-14 font-black uppercase text-xs tracking-widest text-slate-400">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="mt-0">
                   <motion.div variants={item} initial="hidden" animate="show" className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                      <p className="font-medium text-slate-500 text-xl leading-relaxed mb-10">Find the perfect professional for every house task from our wide range of service categories.</p>
                      <div className="grid md:grid-cols-2 gap-6 not-prose">
                        {[
                          { title: 'Verified Expert', subtitle: 'Individually Screened', icon: <ShieldCheck className="text-[#2286BE]" size={24}/> },
                          { title: 'Materials Included', subtitle: 'Standard consumables', icon: <CheckCircle2 className="text-[#2286BE]" size={24}/> },
                          { title: 'Home Service', subtitle: 'At your doorstep', icon: <MapPin className="text-[#2286BE]" size={24}/> },
                          { title: 'Service Warranty', subtitle: '30-day satisfaction', icon: <CheckCircle2 className="text-[#2286BE]" size={24}/> }
                        ].map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">{feat.icon}</div>
                            <div>
                              <h4 className="font-black text-slate-900 leading-none mb-1">{feat.title}</h4>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{feat.subtitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden">
                         <div className="relative z-10 flex items-center gap-6">
                            <div className="h-20 w-20 bg-[#2286BE] rounded-3xl flex items-center justify-center text-white flex-shrink-0 shadow-2xl">
                               <Star size={40} fill="currentColor" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black text-white mb-2 tracking-tight">LocallyServe Guarantee</h3>
                               <p className="text-slate-400 font-medium text-base">Your satisfaction is our top priority. If you're not happy, we'll make it right.</p>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                </TabsContent>

                <TabsContent value="faq">
                   <Accordion type="single" collapsible className="w-full space-y-4">
                      {[
                        { q: "Do you bring your own supplies?", a: "Yes! We bring all necessary high-end supplies and tools. You don't need to provide anything unless specifically requested." },
                        { q: "How long does the service take?", a: "It depends on the scope. A basic package takes 1-2 hours, while standard and premium can take up to 4-6 hours." },
                        { q: "What if I'm outside your standard area?", a: "We cover a 25km radius from our base location. Additional travel charges may apply if you're slightly outside." }
                      ].map((faq, i) => (
                        <AccordionItem key={i} value={`faq-${i}`} className="border-none bg-white rounded-3xl px-8 shadow-sm">
                          <AccordionTrigger className="text-left font-black text-slate-900 hover:no-underline py-6 text-lg">{faq.q}</AccordionTrigger>
                          <AccordionContent className="text-slate-500 leading-relaxed pb-8 text-base font-medium">{faq.a}</AccordionContent>
                        </AccordionItem>
                      ))}
                   </Accordion>
                </TabsContent>

                <TabsContent value="reviews">
                   <div className="space-y-6">
                     {[1, 2].map((r) => (
                       <div key={r} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                             <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                  <AvatarFallback className="bg-slate-100 text-[10px] font-black">C{r}</AvatarFallback>
                                </Avatar>
                                <div>
                                   <p className="font-black text-slate-900">Premium Customer</p>
                                   <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                       Dhaka • 2 days ago
                                   </div>
                                </div>
                             </div>
                             <div className="flex text-amber-400 gap-0.5"><Star fill="currentColor" size={14}/><Star fill="currentColor" size={14}/><Star fill="currentColor" size={14}/><Star fill="currentColor" size={14}/><Star fill="currentColor" size={14}/></div>
                          </div>
                          <p className="text-slate-600 leading-relaxed text-lg font-medium italic">"Exceptional service! Arrived right on time and provided high-quality work. Will definitely book again for my next project."</p>
                       </div>
                     ))}
                   </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column: Packages & Profile Sidebar */}
          <div className="w-full lg:w-[420px] space-y-8">
             <div className="sticky top-24 space-y-8">
                
                {/* Pricing Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden"
                >
                   <Tabs defaultValue="standard" className="w-full">
                      <TabsList className="w-full grid grid-cols-3 bg-slate-50/80 h-16 p-1.5 rounded-none border-b border-slate-100">
                        <TabsTrigger value="basic" className="text-[11px] uppercase tracking-widest font-black data-[state=active]:text-[#2286BE] data-[state=active]:bg-white rounded-xl">Basic</TabsTrigger>
                        <TabsTrigger value="standard" className="text-[11px] uppercase tracking-widest font-black data-[state=active]:text-[#2286BE] data-[state=active]:bg-white rounded-xl">Standard</TabsTrigger>
                        <TabsTrigger value="premium" className="text-[11px] uppercase tracking-widest font-black data-[state=active]:text-[#2286BE] data-[state=active]:bg-white rounded-xl">Premium</TabsTrigger>
                      </TabsList>
                      
                      {['basic', 'standard', 'premium'].map((pkg) => (
                        <TabsContent key={pkg} value={pkg} className="m-0 p-8">
                           <div className="flex justify-between items-start mb-6">
                              <h3 className="font-black text-slate-900 text-2xl capitalize">{pkg} Plan</h3>
                              <span className="text-3xl font-black text-[#2286BE] tracking-tighter">৳{pkg === 'basic' ? service.startingPrice : pkg === 'standard' ? Math.round(service.startingPrice * 1.8) : Math.round(service.startingPrice * 3.2)}</span>
                           </div>
                           <p className="text-slate-500 font-medium leading-relaxed mb-10">
                              {pkg === 'basic' && 'Standard on-site service with essentials covered.'}
                              {pkg === 'standard' && 'Comprehensive service with premium materials and double duration.'}
                              {pkg === 'premium' && 'VIP priority service, team of experts, and full cleanup guarantee.'}
                           </p>
                           
                           <div className="space-y-4 mb-10">
                              {[
                                { label: 'Service Duration', value: pkg === 'basic' ? '1 hr' : pkg === 'standard' ? '3 hrs' : 'Full Day' },
                                { label: 'Team Size', value: pkg === 'premium' ? '2 Experts' : '1 Expert' }
                              ].map((spec, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                   <span className="text-slate-400 font-bold uppercase tracking-wider">{spec.label}</span>
                                   <span className="text-slate-900 font-black">{spec.value}</span>
                                </div>
                              ))}
                           </div>

                           <Button onClick={handleBooking} className="w-full bg-[#2286BE] hover:bg-[#1b6da0] text-white h-16 text-lg font-black rounded-2xl flex items-center justify-center shadow-xl shadow-[#2286BE]/20 mb-6 group">
                             Order Now <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                           </Button>
                           
                           <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                              <ShieldCheck size={14} className="text-[#2286BE]" /> Money Back Guarantee
                           </div>
                        </TabsContent>
                      ))}
                   </Tabs>
                </motion.div>

                {/* Profile Widget */}
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                   <div className="flex items-center gap-5 mb-8">
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-xl">
                          <AvatarImage src={service.provider.avatar} />
                          <AvatarFallback className="bg-[#2286BE]/10 text-[#2286BE] font-black text-2xl">{service.provider.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-[#2286BE] border-4 border-white rounded-full flex items-center justify-center text-white">
                           <ShieldCheck size={12} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-xl leading-none mb-1.5">{service.provider.name}</h4>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest py-0.5 border-slate-100 text-slate-400">Level 2</Badge>
                           <div className="flex items-center text-amber-400"><Star fill="currentColor" size={14}/> <span className="text-slate-900 font-black ml-1 text-xs">{service.provider.rating}</span></div>
                        </div>
                      </div>
                   </div>
                   
                   <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                      Professional service provider with over 150+ successful local projects. Specializing in high-end domestic tasks.
                   </p>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                         <div className="text-xl font-black text-slate-900 leading-none mb-1">1h</div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Reply</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                         <div className="text-xl font-black text-slate-900 leading-none mb-1">158</div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Done</div>
                      </div>
                   </div>

                   <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-900 hover:text-[#2286BE] hover:border-[#2286BE] transition-all font-black text-sm uppercase tracking-widest">
                      Contact Professional
                   </Button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
