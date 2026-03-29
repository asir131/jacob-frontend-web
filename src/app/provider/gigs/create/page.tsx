'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, UploadCloud, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function CreateGigPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const handleNext = () => setStep(s => Math.min(totalSteps, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handlePublish = () => {
    toast.success('Gig successfully published! It is now live in your active gigs.');
    router.push('/provider/gigs');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
           <button onClick={() => router.back()} className="flex items-center text-slate-600 hover:text-slate-900 font-medium">
             <ChevronLeft size={20} className="mr-1" /> My Gigs
           </button>
           <div className="font-bold text-slate-800 hidden sm:block">Create New Gig</div>
           <Button variant="ghost" onClick={() => router.push('/provider/gigs')} className="text-slate-500 hover:text-red-500 px-2">Cancel</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Progress Tracker */}
        <div className="flex items-center mb-8 bg-white border border-slate-200 rounded-xl p-4 shadow-sm overflow-x-auto hide-scrollbar">
           {[
             { num: 1, title: 'Basics' },
             { num: 2, title: 'Pricing' },
             { num: 3, title: 'Gallery' },
             { num: 4, title: 'Details' },
             { num: 5, title: 'Location' },
             { num: 6, title: 'Publish' },
           ].map((s, idx) => (
             <React.Fragment key={s.num}>
               <div className={`flex flex-col items-center flex-shrink-0 w-20 cursor-pointer ${step >= s.num ? 'opacity-100' : 'opacity-40'}`} onClick={() => step > s.num && setStep(s.num)}>
                 <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 transition-colors ${step === s.num ? 'bg-[#2286BE] text-white ring-4 ring-primary-soft' : step > s.num ? 'bg-primary-soft text-[#2286BE]' : 'bg-slate-100 text-slate-400'}`}>
                   {step > s.num ? <Check size={16} /> : s.num}
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>{s.title}</span>
               </div>
               {idx < 5 && <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${step > s.num ? 'bg-[#2286BE]' : 'bg-slate-100'}`} />}
             </React.Fragment>
           ))}
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
           
           {/* Step 1: Basics */}
           {step === 1 && (
             <div className="animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Gig Basics</h2>
               <div className="space-y-6">
                 <div>
                   <label className="text-sm font-bold text-slate-800 mb-2 block">Gig Title</label>
                   <Input placeholder="I will do professional deep house cleaning..." className="h-14 lg:text-lg focus-visible:ring-[#2286BE]" />
                   <p className="text-xs text-slate-500 mt-2 text-right">0/80 max</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-800 mb-2 block">Category</label>
                      <Select defaultValue="cleaning">
                        <SelectTrigger className="h-12"><SelectValue placeholder="Select Category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electric">Electrical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-800 mb-2 block">Sub-Category</label>
                      <Select defaultValue="house">
                        <SelectTrigger className="h-12"><SelectValue placeholder="Select Sub-Category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">House Cleaning</SelectItem>
                          <SelectItem value="office">Office Cleaning</SelectItem>
                          <SelectItem value="deep">Deep Cleaning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                 </div>
               </div>
             </div>
           )}

           {/* Step 2: Pricing */}
           {step === 2 && (
             <div className="animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Scope & Pricing</h2>
               <p className="text-slate-500 text-sm mb-6">Offer 3 tiers of packages (Basic, Standard, Premium) to capture more clients.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Basic', 'Standard', 'Premium'].map((pkg, idx) => (
                    <div key={pkg} className="border border-slate-200 rounded-xl p-4 sm:p-6 bg-slate-50/50">
                      <h3 className="font-bold text-slate-900 text-lg mb-4">{pkg}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Title</label>
                          <Input className="h-10 text-sm focus-visible:ring-[#2286BE]" placeholder={`Short Title`} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
                          <textarea className="w-full text-sm border border-slate-300 rounded-md p-2 h-20 resize-none focus:ring-2 focus:ring-[#2286BE] outline-none" placeholder={`Detail what is included...`}></textarea>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Delivery Time</label>
                          <Select defaultValue={String(idx + 1)}>
                            <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Day</SelectItem>
                              <SelectItem value="2">2 Days</SelectItem>
                              <SelectItem value="3">3 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 mb-1 block">Price (USD)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <Input className="h-10 pl-8 text-sm font-bold text-slate-900 focus-visible:ring-[#2286BE]" defaultValue={(idx + 1) * 15} type="number" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
           )}

           {/* Step 3: Gallery */}
           {step === 3 && (
             <div className="animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Showcase your Service</h2>
               <p className="text-slate-500 text-sm mb-6">Upload photos that describe your work. Gigs with high-quality images receive 40% more orders.</p>
               
               <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer mb-6">
                 <UploadCloud size={48} className="mx-auto text-[#2286BE] mb-4" />
                 <h3 className="text-lg font-bold text-slate-900">Drag & Drop Photos Here</h3>
                 <p className="text-sm text-slate-500 mt-2 line-clamp-2 max-w-sm mx-auto">Upload up to 8 images (JPG, PNG) and 1 video (MP4). Maximum size 5MB per file.</p>
                 <Button className="mt-6 bg-[#2286BE] hover:bg-[#059669]">Browse Files</Button>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="aspect-[4/3] bg-primary-soft border-2 border-[#2286BE] rounded-xl flex items-center justify-center relative overflow-hidden">
                     <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">COVER</span>
                     <p className="text-sm font-medium text-emerald-700">Image 1.jpg</p>
                  </div>
                  <div className="aspect-[4/3] bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 border-dashed">Empty slot</div>
                  <div className="aspect-[4/3] bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 border-dashed">Empty slot</div>
                  <div className="aspect-[4/3] bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 border-dashed">Empty slot</div>
               </div>
             </div>
           )}

           {/* Step 4: Description */}
           {step === 4 && (
             <div className="animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Description & Requirements</h2>
               
               <div className="mb-6">
                 <label className="text-sm font-bold text-slate-800 mb-2 block">Briefly Describe your Gig</label>
                 <textarea className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-[#2286BE] outline-none min-h-[150px] text-sm" placeholder="Hi, I am an expert with 5 years of experience..."></textarea>
               </div>

               <div>
                 <label className="text-sm font-bold text-slate-800 mb-2 block">Requirements from the Client</label>
                 <p className="text-xs text-slate-500 mb-2">Tell your buyer what you need in order to begin work (e.g. access to water, specific address details, etc).</p>
                 <textarea className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-[#2286BE] outline-none min-h-[100px] text-sm" placeholder="I need clear access to the premises and..."></textarea>
               </div>
             </div>
           )}

           {/* Step 5: Location */}
           {step === 5 && (
             <div className="animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Coverage Area</h2>
               <p className="text-slate-500 text-sm mb-6">Define the exact area where you are willing to securely travel to provide this physical service.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="text-sm font-bold text-slate-800 mb-2 block">Base City/Area</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input defaultValue="Dhaka, Bangladesh" className="h-12 pl-10 focus-visible:ring-[#2286BE]" />
                    </div>

                    <label className="text-sm font-bold text-slate-800 mb-2 block mt-6">Maximum Travel Radius</label>
                    <RadioGroup defaultValue="25" className="grid grid-cols-2 gap-3">
                      {['5', '10', '25', '50'].map(rad => (
                        <div key={rad} className="relative">
                          <RadioGroupItem value={rad} id={`rad-${rad}`} className="peer sr-only" />
                          <label htmlFor={`rad-${rad}`} className="flex items-center justify-center p-3 font-semibold text-slate-600 border border-slate-200 rounded-lg cursor-pointer peer-data-[state=checked]:border-[#2286BE] peer-data-[state=checked]:bg-primary-soft peer-data-[state=checked]:text-[#2286BE] hover:bg-slate-50 transition-colors">
                            Within {rad} km
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="bg-slate-100 rounded-2xl border border-slate-200 h-full min-h-[250px] relative overflow-hidden flex items-center justify-center">
                    {/* Placeholder Map */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Dhaka&zoom=11&size=600x400&sensor=false')] bg-cover bg-center"></div>
                    <div className="relative z-10 w-32 h-32 rounded-full border-4 border-[#2286BE] bg-[#2286BE]/20 flex items-center justify-center animate-pulse">
                      <div className="h-4 w-4 rounded-full bg-[#2286BE]"></div>
                    </div>
                  </div>
               </div>
             </div>
           )}

           {/* Step 6: Publish */}
           {step === 6 && (
             <div className="animate-in zoom-in-95 duration-500 text-center py-10">
               <div className="mx-auto w-24 h-24 bg-primary-soft rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <Check size={48} className="text-[#2286BE]" />
               </div>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-4">You&apos;re almost there!</h2>
               <p className="text-slate-500 max-w-md mx-auto text-lg mb-8">Your gig is fully configured and ready to be shown to local clients within your specified radius.</p>
               
               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-md mx-auto mb-8 shadow-sm">
                 <h4 className="font-bold text-slate-900 mb-2">Gig Summary</h4>
                 <div className="space-y-2 text-sm text-slate-600">
                   <div className="flex justify-between"><span>Title:</span> <span className="font-semibold text-slate-900 truncate max-w-[200px]">House Cleaning...</span></div>
                   <div className="flex justify-between"><span>Starting Price:</span> <span className="font-semibold text-slate-900">$15.00</span></div>
                   <div className="flex justify-between"><span>Radius:</span> <span className="font-semibold text-slate-900">25 km</span></div>
                 </div>
               </div>
             </div>
           )}
           
        </div>

        {/* Footer Nav */}
        <div className="flex justify-between items-center mt-6">
           <Button variant="outline" onClick={handleBack} className={`w-32 py-6 font-bold text-slate-600 ${step === 1 ? 'invisible' : ''}`}>
             Back
           </Button>
           {step < 6 ? (
             <Button onClick={handleNext} className="w-32 py-6 font-bold bg-[#2286BE] hover:bg-[#059669] text-white">
               Save & Next <ChevronRight size={18} className="ml-1" />
             </Button>
           ) : (
             <Button onClick={handlePublish} className="w-48 py-6 font-bold bg-[#2286BE] hover:bg-[#059669] shadow-lg text-white text-lg animate-bounce">
               Publish Gig Now
             </Button>
           )}
        </div>

      </div>
    </div>
  );
}
