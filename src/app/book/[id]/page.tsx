'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SERVICES } from '@/data/mock-services';
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, ChevronRight, CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const service = MOCK_SERVICES.find(s => s.id === resolvedParams.id);

  const [[step, direction], setStep] = useState([1, 0]);
  const [pkg, setPkg] = useState('standard');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('10:00 AM');
  const [address, setAddress] = useState('123 Banani Road 11, Dhaka');

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Service Not Found</h2>
          <Button onClick={() => router.push('/services')} className="bg-[#2286BE] font-bold rounded-xl">Back to Services</Button>
        </div>
      </div>
    );
  }

  const basePrice = service.startingPrice;
  const price = pkg === 'basic' ? basePrice : pkg === 'standard' ? basePrice * 2 : basePrice * 3.5;
  const platformFee = 50;
  const total = price + platformFee;

  const handleNext = () => setStep([Math.min(4, step + 1), 1]);
  const handleBack = () => setStep([Math.max(1, step - 1), -1]);

  const handleConfirmPay = () => {
    toast.success('Payment Successful! Order is now Pending.');
    router.push('/client/orders');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Minimal Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
           <button onClick={() => router.back()} className="flex items-center text-slate-400 hover:text-slate-900 font-black uppercase tracking-tighter text-xs transition-colors group">
             <div className="p-2 bg-slate-50 rounded-xl mr-3 group-hover:bg-slate-100 transition-colors">
               <ChevronLeft size={18} />
             </div>
             Back
           </button>
           <div className="flex items-center gap-2">
             <div className="h-2 w-2 bg-[#2286BE] rounded-full animate-pulse" />
             <div className="font-black text-slate-900 uppercase tracking-widest text-xs">Secure Checkout</div>
           </div>
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
             Step <span className="text-slate-900">0{step}</span> / 04
           </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left: Main Booking Steps */}
        <div className="flex-1">
           {/* Progress Line */}
           <div className="flex items-center mb-12 gap-3 px-2">
              {[1, 2, 3, 4].map(i => (
                 <div key={i} className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden relative">
                    {step >= i && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute inset-0 bg-[#2286BE]"
                      />
                    )}
                 </div>
              ))}
           </div>

           <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-[600px] relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="w-full"
                >
                  {/* STEP 1: Package */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Choose your package</h2>
                      <p className="text-slate-400 font-medium mb-10">Select the plan that best fits your requirements.</p>
                      
                      <RadioGroup value={pkg} onValueChange={setPkg} className="space-y-4">
                        {['basic', 'standard', 'premium'].map(p => (
                          <motion.div 
                            key={p} 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`relative border-2 rounded-3xl p-6 sm:p-8 transition-all cursor-pointer overflow-hidden ${pkg === p ? 'border-[#2286BE] bg-primary-soft/20 shadow-lg shadow-primary/5' : 'border-slate-100 hover:border-slate-200'}`} 
                            onClick={() => setPkg(p)}
                          >
                             <div className="flex justify-between items-start">
                               <div className="flex items-center gap-4">
                                 <RadioGroupItem value={p} id={`pkg-${p}`} className="mt-0.5 text-[#2286BE] focus:ring-[#2286BE] border-2" />
                                 <div>
                                   <label htmlFor={`pkg-${p}`} className="font-black text-xl text-slate-900 capitalize cursor-pointer">{p} Package</label>
                                   <div className="flex items-center gap-3 mt-1.5">
                                      <span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px] flex items-center gap-1">
                                        <Clock size={12} className="text-[#2286BE]" /> {p === 'basic' ? '24 Hours' : '48 Hours'} Delivery
                                      </span>
                                   </div>
                                 </div>
                               </div>
                               <div className="text-right">
                                  <span className="font-black text-2xl text-slate-900">৳{p === 'basic' ? basePrice : p === 'standard' ? basePrice * 2 : basePrice * 3.5}</span>
                                  {p === 'standard' && <div className="text-[9px] font-black text-white bg-[#2286BE] px-2 py-0.5 rounded-full uppercase mt-1">Popluar</div>}
                               </div>
                             </div>
                             
                             <div className="ml-9 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {['Professional labor', 'Post-service cleanup', p !== 'basic' && 'Premium equipment', p === 'premium' && '2 team members'].filter(Boolean).map((feat, idx) => (
                                   <div key={idx} className="flex items-center text-sm text-slate-500 font-bold font-medium">
                                     <CheckCircle2 size={16} className="text-[#2286BE] mr-2.5" /> {feat}
                                   </div>
                                 ))}
                             </div>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* STEP 2: Date & Time */}
                  {step === 2 && (
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Select date & time</h2>
                      <p className="text-slate-400 font-medium mb-10">When should the professional arrive at your location?</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                              <CalendarIcon size={14} className="mr-2 text-[#2286BE]"/> Pick a Date
                           </h3>
                           <div className="border border-slate-100 rounded-3xl p-4 bg-white shadow-xl shadow-slate-200/50">
                             <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="bg-white"
                                classNames={{
                                   day_selected: "bg-[#2286BE] text-white hover:bg-[#2286BE] hover:text-white rounded-xl",
                                   day_today: "bg-slate-50 text-[#2286BE] font-black rounded-xl",
                                }}
                             />
                           </div>
                         </motion.div>
                         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                              <Clock size={14} className="mr-2 text-[#2286BE]"/> Available Times
                           </h3>
                           <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 gap-4">
                             {['09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'].map(t => (
                               <motion.button 
                                 variants={staggerItem}
                                 key={t}
                                 whileHover={{ y: -2 }}
                                 whileTap={{ scale: 0.98 }}
                                 onClick={() => setTime(t)}
                                 className={`py-4 px-4 rounded-2xl text-sm font-black transition-all border-2 ${time === t ? 'border-[#2286BE] bg-primary-soft text-[#2286BE] shadow-lg shadow-primary/10' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}
                               >
                                 {t}
                               </motion.button>
                             ))}
                           </motion.div>
                           <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-[11px] font-bold text-slate-400 leading-relaxed">
                              * Arrival might vary by 30 mins depending on local traffic conditions in your area.
                           </div>
                         </motion.div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Address */}
                  {step === 3 && (
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Confirm location</h2>
                      <p className="text-slate-400 font-medium mb-10">Where should we deliver this professional service?</p>
                      
                      <div className="bg-primary-soft/30 border-2 border-[#2286BE] rounded-[2rem] p-8 mb-10 flex items-start gap-5 shadow-lg shadow-primary/5">
                         <div className="p-4 bg-white rounded-2xl shadow-sm text-[#2286BE]">
                            <MapPin size={24} />
                         </div>
                         <div className="flex-1">
                           <h4 className="font-black text-slate-900 text-lg mb-1 italic">Current Home Address</h4>
                           <p className="text-slate-500 font-bold opacity-70 leading-relaxed">123 Banani Road 11, Bloc B, Dhaka, Bangladesh</p>
                         </div>
                         <Button variant="outline" className="h-12 px-6 rounded-xl bg-white border-slate-200 font-black text-[#2286BE] group hover:bg-[#2286BE] hover:text-white transition-all">Change</Button>
                      </div>
                      
                      <div className="relative mb-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <span className="relative bg-white px-6 text-[10px] font-black uppercase tracking-widest text-slate-300 mx-auto block w-fit">Or provide a new one</span>
                      </div>

                      <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                               <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="House #, Road #" className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Area</label>
                               <Input value="Dhaka (Selected)" disabled className="h-14 rounded-2xl border-slate-100 bg-slate-100 font-black text-slate-400" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Instructions for Provider</label>
                            <Input placeholder="E.g. Call before arrival, Gate code is 1234..." className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                         </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Checkout */}
                  {step === 4 && (
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Secure checkout</h2>
                      <p className="text-slate-400 font-medium mb-10">Choose your preferred payment method to proceed.</p>
                      
                      <RadioGroup defaultValue="card" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                         <motion.div whileHover={{ scale: 1.02 }} className="border-2 border-[#2286BE] bg-primary-soft/20 rounded-3xl p-6 flex items-center gap-4 cursor-pointer shadow-lg shadow-primary/5">
                           <RadioGroupItem value="card" id="card" className="text-[#2286BE] focus:ring-[#2286BE] border-2" />
                           <div className="p-3 bg-white rounded-2xl text-[#2286BE] shadow-sm"><CreditCard size={20} /></div>
                           <label htmlFor="card" className="font-black text-slate-900 italic text-lg cursor-pointer">Credit Card</label>
                         </motion.div>
                         <motion.div className="border-2 border-slate-50 rounded-3xl p-6 flex items-center gap-4 opacity-50 cursor-not-allowed">
                           <RadioGroupItem value="bkash" id="bkash" disabled />
                           <div className="p-3 bg-white rounded-2xl text-pink-500 shadow-sm font-black text-xs">bKash</div>
                           <label htmlFor="bkash" className="font-black text-slate-400 text-lg">Mobile Wallet</label>
                         </motion.div>
                      </RadioGroup>

                      <div className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                          <div className="relative">
                            <Input placeholder="4242 4242 4242 4242" className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                            <div className="absolute right-4 top-4 text-[#2286BE]"><Lock size={18} /></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiration</label>
                              <Input placeholder="MM/YY" className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVC / CVV</label>
                              <Input placeholder="***" type="password" className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                           </div>
                        </div>
                        <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                           <ShieldCheck size={16} className="text-[#2286BE] shrink-0" />
                           Encrypted with 256-bit SSL security. We never store your full card details.
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
           </div>

           {/* Control Buttons */}
           <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 1} 
                className="w-full sm:w-40 h-16 transition-all font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 disabled:opacity-0"
              >
                Previous Step
              </Button>
              {step < 4 ? (
                <Button onClick={handleNext} className="w-full sm:w-56 h-16 rounded-[1.25rem] bg-[#2286BE] hover:bg-[#059669] text-white font-black text-base shadow-2xl shadow-primary/20 active:scale-95 transition-all">
                  Continue Process <ChevronRight size={20} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={handleConfirmPay} className="w-full sm:w-64 h-16 rounded-[1.25rem] bg-slate-900 hover:bg-black text-white font-black text-lg shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <ShieldCheck size={20} className="text-[#2286BE]" /> Finalize & Pay
                </Button>
              )}
           </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full lg:w-[400px] flex-shrink-0"
        >
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 sticky top-[120px]">
             <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Booking Summary</h3>
             
             <div className="flex gap-4 mb-8 pb-8 border-b border-slate-50">
               <div className="relative h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                 <Image src={service.images[0] || '/hero1.png'} fill alt="Gig" className="object-cover" />
               </div>
               <div>
                 <h4 className="font-black text-slate-900 line-clamp-2 leading-snug text-base mb-1 italic">{service.title}</h4>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{service.provider.name}</p>
                 <div className="mt-3">
                   <Badge className="bg-slate-900 text-white border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">{pkg} Plan</Badge>
                 </div>
               </div>
             </div>

             <div className="space-y-4 mb-10 text-[13px] font-bold uppercase tracking-widest">
                <div className="flex justify-between text-slate-400">
                   <span>Service Fee</span>
                   <span className="text-slate-900">৳{price}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                   <span>Platform Fee</span>
                   <span className="text-slate-900">৳{platformFee}</span>
                </div>
                <div className="flex justify-between items-center py-4 px-4 bg-slate-50 rounded-2xl mt-4">
                   <span className="text-slate-900">Grand Total</span>
                   <span className="text-2xl font-black text-[#2286BE]">৳{total}</span>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                   <div className="h-px bg-slate-100 flex-1" />
                   Support Quality
                   <div className="h-px bg-slate-100 flex-1" />
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary-soft/50 rounded-2xl">
                   <ShieldCheck className="text-[#2286BE]" size={20} />
                   <div className="text-[11px] font-black text-emerald-700 leading-tight">LocallyServe Guarantee: Escrow protection included.</div>
                </div>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
