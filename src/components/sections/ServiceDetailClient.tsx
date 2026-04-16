'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ShieldCheck, CheckCircle2, ChevronRight, Play, Share2, Heart } from 'lucide-react';
import AuthModal from '@/components/ui/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BRAND } from '@/lib/constants';
import { formatRating } from '@/lib/formatters';
import { toast } from 'sonner';
import { Copy, Facebook, Twitter, Linkedin, X } from 'lucide-react';
import ReviewFilter from '@/components/ui/ReviewFilter';

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

interface ServiceDetailClientProps {
  service: any; // Using any for brevity in this mock context, in prod would be ServiceItem
}

export default function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const galleryImages = React.useMemo(
    () =>
      Array.isArray(service.images) && service.images.length > 0
        ? service.images
        : ['https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=1200&h=675&auto=format&fit=crop'],
    [service.images]
  );
  const [selectedImage, setSelectedImage] = React.useState(galleryImages[0] || '');
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [reviewFilter, setReviewFilter] = useState(0);

  // Fallback if images empty
  React.useEffect(() => {
    if (galleryImages.length > 0 && !selectedImage) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages, selectedImage]);

  const packageTabs = React.useMemo(() => {
    const sourcePackages = Array.isArray(service.packages) ? service.packages : [];
    const byName = new Map(
      sourcePackages
        .filter((item: any) => item && typeof item === 'object')
        .map((item: any) => [String(item.name || '').toLowerCase(), item])
    );

    return ['basic', 'standard', 'premium'].map((key) => {
      const fromApi = byName.get(key) || {};
      const fallbackPrice =
        key === 'basic'
          ? Number(service.startingPrice) || 0
          : key === 'standard'
            ? Math.round((Number(service.startingPrice) || 0) * 1.8)
            : Math.round((Number(service.startingPrice) || 0) * 3.2);

      return {
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        title: String(fromApi.title || `${key.charAt(0).toUpperCase() + key.slice(1)} package`),
        description:
          String(fromApi.description || '') ||
          (key === 'basic'
            ? 'Standard on-site service with essentials covered.'
            : key === 'standard'
              ? 'Comprehensive service with premium materials and double duration.'
              : 'VIP priority service, team of experts, and full cleanup guarantee.'),
        deliveryTime: String(fromApi.deliveryTime || '') || (key === 'basic' ? '1 Day' : key === 'standard' ? '2 Days' : '3 Days'),
        price: Number(fromApi.price) || fallbackPrice,
      };
    });
  }, [service.packages, service.startingPrice]);

  const handleBooking = () => {
    router.push(`/book/${service.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
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
        {/* Main Grid: Ends before Guarantee */}
        <div className="flex flex-col lg:flex-row gap-12 items-start relative mb-12">
        
          {/* Left Column: Details */}
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
                    <span className="font-black text-slate-900 text-sm">{formatRating(service.provider.rating)}</span>
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
                   <Image src={selectedImage || 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=1200&h=675&auto=format&fit=crop'} alt={service.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" priority />
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
                      <button 
                        onClick={() => {
                          if (!isAuthenticated) return setIsAuthModalOpen(true);
                          setIsFavorited(!isFavorited);
                        }}
                        className={`h-12 w-12 bg-white/95 backdrop-blur-md rounded-2xl transition-all shadow-xl flex items-center justify-center ${isFavorited ? 'text-red-500' : 'text-slate-900 hover:text-red-500'}`} 
                        aria-label="Add to favorites"
                      >
                        <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => setIsShareModalOpen(true)}
                        className="h-12 w-12 bg-white/95 backdrop-blur-md rounded-2xl text-slate-900 hover:text-[#2286BE] transition-colors shadow-xl flex items-center justify-center" 
                        aria-label="Share service"
                      >
                        <Share2 size={20} />
                      </button>
                   </div>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {galleryImages.map((img: string, i: number) => (
                     <motion.div 
                      key={i} 
                      onClick={() => setSelectedImage(img)}
                      whileHover={{ y: -4 }}
                      className={`relative h-20 w-32 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${selectedImage === img ? 'border-[#2286BE] shadow-lg shadow-[#2286BE]/20' : 'border-white shadow-sm opacity-60 hover:opacity-100'}`}
                     >
                       <Image src={img} alt="gallery thumbnail" fill className="object-cover" />
                    </motion.div>
                  ))}
               </div>
            </motion.div>

            {/* Content Tabs */}
            <div className="mb-16">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="bg-transparent border-b border-slate-100 rounded-none w-full justify-start gap-10 p-0 h-14 mb-10">
                   <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:text-[#2286BE] px-0 h-14 font-black uppercase text-xs tracking-widest text-slate-400 bg-transparent flex-1 shadow-none">About Service</TabsTrigger>
                   <TabsTrigger value="faq" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:text-[#2286BE] px-0 h-14 font-black uppercase text-xs tracking-widest text-slate-400 bg-transparent flex-1 shadow-none">FAQs</TabsTrigger>
                   <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2286BE] data-[state=active]:bg-transparent data-[state=active]:text-[#2286BE] px-0 h-14 font-black uppercase text-xs tracking-widest text-slate-400 bg-transparent flex-1 shadow-none">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="mt-0">
                   <motion.div variants={item} initial="hidden" animate="show" className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                      <p className="font-medium text-slate-500 text-xl leading-relaxed mb-10">{service.description}</p>
                      <div className="grid md:grid-cols-2 gap-6 not-prose mb-12">
                        {[
                          { title: 'Verified Expert', subtitle: 'Individually Screened', icon: <ShieldCheck className="text-[#2286BE]" size={24}/> },
                          { title: 'Materials Included', subtitle: 'Standard consumables', icon: <CheckCircle2 className="text-[#2286BE]" size={24}/> },
                          { title: 'Home Service', subtitle: 'At your doorstep', icon: <MapPin className="text-[#2286BE]" size={24}/> },
                          { title: `Within ${service.travelRadius || 25}km`, subtitle: 'Max Travel Radius', icon: <CheckCircle2 className="text-[#2286BE]" size={24}/> }
                        ].map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0" aria-hidden="true">{feat.icon}</div>
                            <div>
                              <h3 className="font-black text-slate-900 leading-none mb-1 text-[15px]">{feat.title}</h3>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{feat.subtitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {service.requirements && (
                        <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-8 not-prose">
                           <h2 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-xl">
                              <ShieldCheck size={20} className="text-[#1b6da0]" /> Requirements from Client
                           </h2>
                           <p className="text-slate-600 font-medium leading-relaxed">{service.requirements}</p>
                        </div>
                      )}
                   </motion.div>
                </TabsContent>

                <TabsContent value="faq">
                   <Accordion type="single" collapsible className="w-full space-y-4">
                      {[
                        { q: "Do you bring your own supplies?", a: "Yes! We bring all necessary high-end supplies and tools. You don&apos;t need to provide anything unless specifically requested." },
                        { q: "How long does the service take?", a: "It depends on the scope. A basic package takes 1-2 hours, while standard and premium can take up to 4-6 hours." },
                        { q: "What if I&apos;m outside your standard area?", a: "We cover a 25km radius from our base location. Additional travel charges may apply if you&apos;re slightly outside." }
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
                      {(() => {
                        const allReviews = [
                          { name: 'Michael Chen', rating: 5, date: '2 weeks ago', text: 'Exceptional service! Arrived right on time and provided high-quality work.' },
                          { name: 'Sarah J.', rating: 4, date: '1 month ago', text: 'Very professional experience. The quality was top-notch.' },
                          { name: 'Robert P.', rating: 5, date: '2 months ago', text: 'Will definitely book again for my next project!' }
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
                              <div className="space-y-6">
                                {filtered.map((r, idx) => (
                                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                     <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                           <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                             <AvatarFallback className="bg-slate-100 text-[10px] font-black">{r.name[0]}</AvatarFallback>
                                           </Avatar>
                                           <div>
                                              <p className="font-black text-slate-900">{r.name}</p>
                                              <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                  Dhaka • {r.date}
                                              </div>
                                           </div>
                                        </div>
                                        <div className="flex text-amber-400 gap-0.5">
                                          {[...Array(5)].map((_, i) => (
                                            <Star key={i} fill={i < r.rating ? "currentColor" : "none"} size={14}/>
                                          ))}
                                        </div>
                                     </div>
                                     <p className="text-slate-600 leading-relaxed text-lg font-medium">&quot;{r.text}&quot;</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                   </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column: Packages & Profile Sidebar */}
          <div className="w-full lg:w-[420px] space-y-8 lg:sticky lg:top-24">
             {/* Pricing Card */}
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden"
             >
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 bg-slate-50/80 h-16 p-1.5 rounded-none border-b border-slate-100">
                       <TabsTrigger value="basic" className="text-[11px] uppercase tracking-widest font-black data-[state=active]:text-[#2286BE] data-[state=active]:bg-white/80 rounded-xl transition-all duration-300 shadow-none data-[state=active]:shadow-none data-[state=active]:ring-1 data-[state=active]:ring-slate-100">Basic</TabsTrigger>
                       <TabsTrigger value="standard" className="text-[11px] uppercase tracking-widest font-black data-[state=active]:text-[#2286BE] data-[state=active]:bg-white/80 rounded-xl transition-all duration-300 shadow-none data-[state=active]:shadow-none data-[state=active]:ring-1 data-[state=active]:ring-slate-100">Standard</TabsTrigger>
                       <TabsTrigger value="premium" className="text-[11px] uppercase tracking-widest font-black data-[state=active]:text-[#2286BE] data-[state=active]:bg-white/80 rounded-xl transition-all duration-300 shadow-none data-[state=active]:shadow-none data-[state=active]:ring-1 data-[state=active]:ring-slate-100">Premium</TabsTrigger>
                    </TabsList>
                   
                   {packageTabs.map((pkg) => (
                     <TabsContent key={pkg.key} value={pkg.key} className="m-0 p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-black text-slate-900 text-2xl">{pkg.title}</h3>
                            <span className="text-3xl font-black text-[#2286BE] tracking-tighter">${pkg.price}</span>
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed mb-10">
                           {pkg.description}
                        </p>
                        
                        <div className="space-y-4 mb-10">
                           {[
                             { label: 'Delivery Time', value: pkg.deliveryTime },
                             { label: 'Service Duration', value: pkg.key === 'basic' ? '1 hr' : pkg.key === 'standard' ? '3 hrs' : 'Full Day' },
                             { label: 'Team Size', value: pkg.key === 'premium' ? '2 Experts' : '1 Expert' }
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
                   <Link href={`/provider/${service.provider.id}`} className="relative block">
                     <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-xl">
                       <AvatarImage src={service.provider.avatar} alt={service.provider.name} />
                       <AvatarFallback className="bg-[#2286BE]/10 text-[#2286BE] font-black text-2xl">{service.provider.name.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-[#2286BE] border-4 border-white rounded-full flex items-center justify-center text-white" aria-hidden="true">
                        <ShieldCheck size={12} />
                     </div>
                   </Link>
                   <div>
                     <h4 className="font-black text-slate-900 text-xl leading-none mb-1.5">
                       <Link href={`/provider/${service.provider.id}`} className="hover:text-[#2286BE] transition-colors">
                         {service.provider.name}
                       </Link>
                     </h4>
                     <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest py-0.5 border-slate-100 text-slate-400">{service.provider.level || 'Level 2'}</Badge>
                        <Badge className={`border-none font-black text-[10px] px-2 py-0.5 rounded-full ${
                          (service.provider.type || 'Solo') === 'Agency' ? 'bg-purple-100 text-purple-600' :
                          (service.provider.type || 'Solo') === 'Team' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {service.provider.type || 'Solo'}
                        </Badge>
                        <div className="flex items-center text-amber-400"><Star fill="currentColor" size={14}/> <span className="text-slate-900 font-black ml-1 text-xs">{formatRating(service.provider.rating)}</span></div>
                     </div>
                   </div>
                </div>
                
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                   Professional service provider with over {service.provider.completedOrders || 0}+ successful local projects on {BRAND.name}. Specializing in high-end domestic tasks.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <div className="text-xl font-black text-slate-900 leading-none mb-1">1h</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Reply</div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <div className="text-xl font-black text-slate-900 leading-none mb-1">{service.provider.completedOrders || 0}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Done</div>
                   </div>
                </div>

                 <Link href="/messages" className="w-full">
                   <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-900 hover:text-[#2286BE] hover:border-[#2286BE] transition-all font-black text-sm uppercase tracking-widest">
                      Contact Professional
                   </Button>
                 </Link>
             </div>
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="lg:max-w-[760px]">
            <div className="mt-4 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden">
               <div className="relative z-10 flex items-center gap-6">
                  <div className="h-20 w-20 bg-[#2286BE] rounded-3xl flex items-center justify-center text-white flex-shrink-0 shadow-2xl" aria-hidden="true">
                     <Star size={40} fill="currentColor" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{BRAND.name} Guarantee</h3>
                     <p className="text-slate-400 font-medium text-base">Your satisfaction is our top priority. If you&apos;re not happy, we&apos;ll make it right.</p>
                  </div>
               </div>
            </div>
        </div>
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
                
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Share this Service</h3>
                <p className="text-slate-500 font-medium mb-8">Spread the word about {service.provider.name}&apos;s expertise.</p>

                <div className="space-y-6">
                   {/* Copy Link */}
                   <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <div className="flex-1 px-4 text-sm font-bold text-slate-400 truncate tracking-tight">
                         {typeof window !== 'undefined' ? window.location.href : 'locallyserve.com/service/001'}
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Save this Service"
        subtitle="Join LocallyServe to save your favorite services and build your dream team."
      />

    </div>
  );
}
