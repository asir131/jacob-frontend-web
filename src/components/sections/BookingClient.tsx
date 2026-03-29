'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, ChevronRight, CreditCard, ShieldCheck, Lock, Navigation, Wallet, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BRAND } from '@/lib/constants';

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

interface BookingClientProps {
  service: any;
}

export default function BookingClient({ service }: BookingClientProps) {
  const router = useRouter();
  const [[step, direction], setStep] = useState([1, 0]);
  const [pkg, setPkg] = useState('standard');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('10:00 AM');
  const [address, setAddress] = useState('123 Manhattan Ave, New York, NY');
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        toast.success(`Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setIsDetectingLocation(false);
      },
      (error) => {
        toast.error('Unable to retrieve your location');
        setIsDetectingLocation(false);
      }
    );
  };

  const basePrice = service.startingPrice;
  const price = pkg === 'basic' ? basePrice : pkg === 'standard' ? Math.round(basePrice * 1.8) : Math.round(basePrice * 3.2);
  const platformFee = 5;
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
           <button onClick={() => router.back()} className="flex items-center text-slate-400 hover:text-slate-900 font-black uppercase tracking-tighter text-xs transition-colors group" aria-label="Go back">
             <div className="p-2 bg-slate-50 rounded-xl mr-3 group-hover:bg-slate-100 transition-colors">
               <ChevronLeft size={18} />
             </div>
             Back
           </button>
           <div className="flex items-center gap-2">
             <div className="h-2 w-2 bg-[#2286BE] rounded-full animate-pulse" aria-hidden="true" />
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
                            className={`relative border-2 rounded-3xl p-6 sm:p-8 transition-all cursor-pointer overflow-hidden ${pkg === p ? 'border-[#2286BE] bg-[#2286BE]/5 shadow-lg shadow-primary/5' : 'border-slate-100 hover:border-slate-200'}`} 
                            onClick={() => setPkg(p)}
                          >
                             <div className="flex justify-between items-start">
                               <div className="flex items-center gap-4">
                                 <RadioGroupItem value={p} id={`pkg-${p}`} className="mt-0.5 text-[#2286BE] focus:ring-[#2286BE] border-2" />
                                 <div>
                                   <label htmlFor={`pkg-${p}`} className="font-black text-xl text-slate-900 capitalize cursor-pointer">{p} Package</label>
                                   <div className="flex items-center gap-3 mt-1.5">
                                      <span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px] flex items-center gap-1 font-medium">
                                        <Clock size={12} className="text-[#2286BE]" /> {p === 'basic' ? '24 Hours' : '48 Hours'} Delivery
                                      </span>
                                   </div>
                                 </div>
                               </div>
                               <div className="text-right">
                                  <span className="font-black text-2xl text-slate-900">${p === 'basic' ? basePrice : p === 'standard' ? Math.round(basePrice * 1.8) : Math.round(basePrice * 3.2)}</span>
                                  {p === 'standard' && <div className="text-[9px] font-black text-white bg-[#2286BE] px-2 py-0.5 rounded-full uppercase mt-1">Popular</div>}
                               </div>
                             </div>
                             
                             <div className="ml-9 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {['Professional labor', 'Post-service cleanup', p !== 'basic' && 'Premium equipment', p === 'premium' && '2 team members'].filter(Boolean).map((feat, idx) => (
                                   <div key={idx} className="flex items-center text-sm text-slate-500 font-bold font-medium">
                                     <CheckCircle2 size={16} className="text-[#2286BE] mr-2.5" /> {feat as string}
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
                      
                      <div className="flex flex-col space-y-12 max-w-2xl">
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                              <CalendarIcon size={14} className="mr-2 text-[#2286BE]"/> Pick a Date
                           </h3>
                           <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-xl shadow-slate-200/50 flex justify-center">
                             <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="bg-white border-none shadow-none w-full"
                             />
                           </div>
                         </motion.div>
                         
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                              <Clock size={14} className="mr-2 text-[#2286BE]"/> Available Times
                           </h3>
                           <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                             {['09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'].map(t => (
                               <motion.button 
                                 variants={staggerItem}
                                 key={t}
                                 whileHover={{ y: -2 }}
                                 whileTap={{ scale: 0.98 }}
                                 onClick={() => setTime(t)}
                                 className={`py-4 px-4 rounded-2xl text-sm font-black transition-all border-2 ${time === t ? 'border-[#2286BE] bg-[#2286BE]/5 text-[#2286BE] shadow-lg shadow-[#2286BE]/10' : 'border-slate-50 text-slate-400 hover:border-slate-200 bg-white'}`}
                               >
                                 {t}
                               </motion.button>
                             ))}
                           </motion.div>
                           <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-[11px] font-bold text-slate-400 leading-relaxed text-center sm:text-left">
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
                      
                      <div className="bg-[#2286BE]/5 border-2 border-[#2286BE] rounded-[2rem] p-8 mb-10 flex items-start gap-5 shadow-lg shadow-[#2286BE]/5">
                         <div className="p-4 bg-white rounded-2xl shadow-sm text-[#2286BE]" aria-hidden="true">
                            <MapPin size={24} />
                         </div>
                         <div className="flex-1">
                           <h4 className="font-black text-slate-900 text-lg mb-1">Current Home Address</h4>
                           <p className="text-slate-500 font-bold opacity-70 leading-relaxed">{address || '123 Manhattan Ave, New York, NY'}</p>
                         </div>
                         <Button onClick={() => setIsAddrModalOpen(true)} variant="outline" className="h-12 px-6 rounded-xl bg-white border-slate-200 font-black text-[#2286BE] group hover:bg-[#2286BE] hover:text-white transition-all">Change</Button>
                      </div>
                      
                      <div className="relative mb-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <span className="relative bg-white px-6 text-[10px] font-black uppercase tracking-widest text-slate-300 mx-auto block w-fit font-bold">Or provide a new one</span>
                      </div>

                      <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label htmlFor="address" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                               <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="House #, Road #" className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                            </div>
                            <div className="space-y-2">
                               <label htmlFor="city" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / Area</label>
                               <Input id="city" value="New York (Selected)" disabled className="h-14 rounded-2xl border-slate-100 bg-slate-100 font-black text-slate-400" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label htmlFor="instructions" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Instructions for Provider</label>
                            <Input id="instructions" placeholder="E.g. Call before arrival, Gate code is 1234..." className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                         </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Checkout */}
                  {step === 4 && (
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Secure checkout</h2>
                      <p className="text-slate-400 font-medium mb-10">Choose your preferred payment method to proceed.</p>
                      
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-4 mb-10 max-w-lg">
                         <motion.div whileHover={{ scale: 1.01 }} onClick={() => setPaymentMethod('stripe')} className={`border-2 rounded-3xl p-6 flex items-center gap-5 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-[#2286BE] bg-[#2286BE]/5 shadow-lg shadow-[#2286BE]/5' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                           <RadioGroupItem value="stripe" id="stripe" className={`border-2 ${paymentMethod === 'stripe' ? 'text-[#2286BE] focus:ring-[#2286BE]' : ''}`} />
                           <div className={`p-4 rounded-2xl shadow-sm ${paymentMethod === 'stripe' ? 'bg-white text-[#2286BE]' : 'bg-slate-50 text-slate-400'}`} aria-hidden="true"><CreditCard size={20} /></div>
                           <label htmlFor="stripe" className="font-black text-slate-900 text-lg cursor-pointer">Stripe / Credit Card</label>
                           {paymentMethod === 'stripe' && <Badge className="ml-auto bg-slate-900 text-white border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-lg">Selected</Badge>}
                         </motion.div>
                      </RadioGroup>

                      <AnimatePresence mode="wait">
                         {paymentMethod === 'stripe' && (
                           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 max-w-lg overflow-hidden">
                             <div className="space-y-2">
                               <label htmlFor="card-number" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                               <div className="relative">
                                 <Input id="card-number" placeholder="4242 4242 4242 4242" className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                                 <div className="absolute right-4 top-4 text-[#2286BE]" aria-hidden="true"><Lock size={18} /></div>
                               </div>
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                   <label htmlFor="exp" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiration</label>
                                   <Input id="exp" placeholder="MM/YY" className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                                </div>
                                <div className="space-y-2">
                                   <label htmlFor="cvc" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVC / CVV</label>
                                   <Input id="cvc" placeholder="***" type="password" className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold" />
                                </div>
                             </div>
                             <div className="flex items-center gap-3 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] leading-loose">
                                <ShieldCheck size={24} className="text-[#2286BE] shrink-0" aria-hidden="true" />
                                Encrypted with 256-bit SSL security. We never store your full card details.
                             </div>
                           </motion.div>
                         )}
                      </AnimatePresence>
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
                <Button onClick={handleNext} className="w-full sm:w-56 h-16 rounded-[1.25rem] bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-base shadow-2xl shadow-[#2286BE]/20 active:scale-95 transition-all">
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
             <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight font-bold underline decoration-[#2286BE] decoration-4 underline-offset-8">Booking Summary</h3>
             
             <div className="flex gap-4 mb-8 pb-8 border-b border-slate-50">
               <div className="relative h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                 <Image src={service.images[0] || 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=200&h=200&auto=format&fit=crop'} fill alt="Gig thumbnail" className="object-cover" />
               </div>
               <div>
                 <h4 className="font-black text-slate-900 line-clamp-2 leading-snug text-base mb-1">{service.title}</h4>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{service.provider.name}</p>
                 <div className="mt-3">
                   <Badge className="bg-slate-900 text-white border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">{pkg} Plan</Badge>
                 </div>
               </div>
             </div>

             <div className="space-y-4 mb-10 text-[13px] font-bold uppercase tracking-widest font-medium">
                <div className="flex justify-between text-slate-400">
                   <span>Service Fee</span>
                   <span className="text-slate-900">${price}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                   <span>Platform Fee</span>
                   <span className="text-slate-900">${platformFee}</span>
                </div>
                <div className="flex justify-between items-center py-4 px-4 bg-slate-50 rounded-2xl mt-4 border border-slate-100">
                   <span className="text-slate-900">Grand Total</span>
                   <span className="text-2xl font-black text-[#2286BE]">${total}</span>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                   <div className="h-px bg-slate-100 flex-1" />
                   Support Quality
                   <div className="h-px bg-slate-100 flex-1" />
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#2286BE]/5 rounded-2xl border border-[#2286BE]/10">
                   <ShieldCheck className="text-[#2286BE]" size={20} />
                   <div className="text-[11px] font-black text-[#1b6da0] leading-tight">{BRAND.name} Guarantee: Escrow protection included.</div>
                </div>
             </div>
          </div>
        </motion.div>

      </div>

       {/* Location Overlay Modal */}
       <AnimatePresence>
         {isAddrModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsAddrModalOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-3xl overflow-hidden shadow-2xl"
              >
                 <div className="absolute top-0 right-0 p-8">
                    <button onClick={() => setIsAddrModalOpen(false)} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                       <ChevronLeft size={20} className="rotate-90" />
                    </button>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Update Service Location</h3>
                 <p className="text-slate-400 font-medium mb-8">Enter your new service delivery address below.</p>
                 
                 <div className="space-y-6">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                        <div className="relative group">
                           <Input 
                             value={address} 
                             onChange={(e) => setAddress(e.target.value)}
                             placeholder="123 Manhattan Ave, Apt 4B" 
                             className="h-16 pl-14 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#2286BE] font-bold text-lg" 
                           />
                           <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2286BE] transition-colors">
                              <MapPin size={22} />
                           </div>
                           <button 
                             onClick={detectLocation}
                             disabled={isDetectingLocation}
                             className={`absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-[#2286BE] hover:bg-slate-50 transition-all shadow-sm ${isDetectingLocation ? 'animate-pulse opacity-50 cursor-not-allowed' : ''}`}
                             aria-label="Detect current location"
                           >
                              <Navigation size={18} className={isDetectingLocation ? 'animate-spin-slow' : ''} />
                           </button>
                        </div>
                     </div>
                    <Button 
                      onClick={() => {
                        toast.success('Address updated successfully!');
                        setIsAddrModalOpen(false);
                      }}
                      className="w-full h-16 rounded-2xl bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg shadow-xl shadow-[#2286BE]/20"
                    >
                      Save & Continue
                    </Button>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
}
