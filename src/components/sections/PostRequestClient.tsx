'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, UploadCloud, MapPin, ArrowRight, Sparkles, CheckCircle2, DollarSign, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from "date-fns";
import { Card, CardContent } from '@/components/ui/card';
import { BRAND } from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function PostRequestClient() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(`You must be signed in to post a request on ${BRAND.name}.`);
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Your Custom Request has been submitted! We will connect you with a provider shortly.');
    router.push('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
           <div className="inline-flex items-center gap-2 bg-[#2286BE]/10 text-[#2286BE] px-4 py-1.5 rounded-full mb-6 border border-[#2286BE]/10 shadow-sm animate-bounce-subtle">
             <Sparkles size={16} />
             <span className="text-xs font-black uppercase tracking-widest">Premium Matching</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">Post a Custom Request</h1>
           <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
             Can&apos;t find exactly what you&apos;re looking for? Tell us your needs, and we&apos;ll connect you with top local experts on {BRAND.name}.
           </p>
        </motion.div>

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit} 
          className="space-y-8"
        >
           <motion.div variants={itemVariants}>
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 md:p-12">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 rounded-xl bg-[#2286BE]/10 flex items-center justify-center text-[#2286BE]">
                         <Info size={20} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">The Essentials</h2>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label htmlFor="category" className="text-sm font-bold text-slate-800 uppercase tracking-wider block">Service Category</label>
                         <Select required>
                          <SelectTrigger id="category" className="w-full h-14 rounded-xl border-slate-200 focus:ring-[#2286BE] bg-slate-50/50 font-medium text-slate-900">
                            <SelectValue placeholder="What do you need help with?" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl p-2">
                            <SelectItem value="cleaning" className="py-3 px-4 rounded-lg">House Cleaning</SelectItem>
                            <SelectItem value="plumbing" className="py-3 px-4 rounded-lg">Expert Plumbing</SelectItem>
                            <SelectItem value="electrical" className="py-3 px-4 rounded-lg">Electrical Works</SelectItem>
                            <SelectItem value="beauty" className="py-3 px-4 rounded-lg">Beauty & Salon at Home</SelectItem>
                            <SelectItem value="appliance" className="py-3 px-4 rounded-lg">Appliance Repair</SelectItem>
                            <SelectItem value="other" className="py-3 px-4 rounded-lg">Other / Custom Task</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                         <label htmlFor="location" className="text-sm font-bold text-slate-800 uppercase tracking-wider block">Service Location</label>
                         <div className="relative group">
                            <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2286BE] transition-colors" />
                            <Input id="location" type="text" placeholder="Your full address of neighborhood" required className="h-14 pl-12 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] bg-slate-50/50 font-medium" />
                         </div>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                         <label htmlFor="description" className="text-sm font-bold text-slate-800 uppercase tracking-wider block">Detailed Description</label>
                         <textarea 
                           id="description"
                           rows={5} 
                           required
                           placeholder="Describe your requirements in detail. For example: 'I need a complete deep cleaning for my 3-bedroom apartment...'" 
                           className="w-full border border-slate-200 rounded-2xl p-6 focus:ring-2 focus:ring-[#2286BE] focus:border-transparent outline-none transition-all resize-none text-base font-medium bg-slate-50/50 placeholder:text-slate-400 text-slate-800"
                         ></textarea>
                         <div className="flex items-center gap-2 text-slate-400 mt-2">
                           <CheckCircle2 size={14} className="text-[#2286BE]" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">More detail = More accurate quotes</span>
                         </div>
                      </div>
                   </div>
                </CardContent>
              </Card>
           </motion.div>

           <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem]">
                   <CardContent className="p-10">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="h-10 w-10 rounded-xl bg-[#2286BE]/5 flex items-center justify-center text-[#2286BE]">
                            <CalendarIcon size={20} />
                         </div>
                         <h3 className="text-xl font-black text-slate-900">When?</h3>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-bold h-14 rounded-xl border-slate-200 hover:bg-slate-50 px-6 ${!date && "text-slate-400"}`}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5 opacity-50" />
                            {date ? format(date, "PPP") : <span>Select your preferred date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="p-4"
                            classNames={{ 
                              day_selected: "bg-[#2286BE] text-white hover:bg-[#2286BE] rounded-lg",
                              day_today: "bg-slate-100 text-slate-900 rounded-lg" 
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-slate-400 mt-4 font-medium">Flexible dates often get more responses.</p>
                   </CardContent>
                 </Card>

                 <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem]">
                   <CardContent className="p-10">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                            <DollarSign size={20} />
                         </div>
                         <h3 className="text-xl font-black text-slate-900">Budget?</h3>
                      </div>
                      <div className="relative group">
                         <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black text-lg group-focus-within:text-[#2286BE] transition-colors">$</span>
                         <Input type="number" placeholder="Enter your estimated budget" className="h-14 pl-12 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] bg-slate-50/50 font-black text-lg" />
                      </div>
                      <p className="text-xs text-slate-400 mt-4 font-medium">Providers can negotiate if your budget is flexible.</p>
                   </CardContent>
                 </Card>
              </div>
           </motion.div>

           <motion.div variants={itemVariants}>
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem]">
                 <CardContent className="p-10">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                          <UploadCloud size={20} />
                       </div>
                       <h3 className="text-xl font-black text-slate-900">Visual Context</h3>
                    </div>
                    <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 text-center hover:bg-slate-50 hover:border-[#2286BE]/20 cursor-pointer transition-all duration-300 group">
                       <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#2286BE]/10 group-hover:text-[#2286BE] transition-all duration-300">
                         <UploadCloud size={40} className="text-slate-400 group-hover:text-[#2286BE]" />
                       </div>
                       <p className="text-lg font-black text-slate-800">Drop your photos here</p>
                       <p className="text-slate-500 mt-2 font-medium">Add images of the area or items that need attention. (Max 5MB)</p>
                       <Button variant="outline" type="button" className="mt-8 rounded-xl px-8 border-slate-200 font-bold hover:border-[#2286BE] hover:text-[#2286BE]">
                          Select From My Device
                       </Button>
                    </div>
                 </CardContent>
              </Card>
           </motion.div>

           <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full border-2 border-[#2286BE] flex items-center justify-center">
                    <CheckCircle2 className="text-[#2286BE]" size={24} />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Guaranteed Response</p>
                    <p className="text-xs font-bold text-slate-400">Average response time: &lt; 2 hours</p>
                 </div>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                 <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1 sm:flex-none font-bold text-slate-400 hover:text-slate-600 px-10 h-16 rounded-2xl">
                    Back
                 </Button>
                 <Button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="flex-[2] sm:flex-none bg-[#2286BE] hover:bg-[#1b6da0] px-12 h-16 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
                 >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Submit Request <ArrowRight size={20} className="ml-3" />
                      </div>
                    )}
                 </Button>
              </div>
           </motion.div>
        </motion.form>

      </div>
    </div>
  );
}
