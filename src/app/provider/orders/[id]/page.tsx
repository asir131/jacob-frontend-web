'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Clock, 
  MessageSquare, 
  User, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  Video,
  Send,
  MoreVertical,
  ChevronRight,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DEMO_ORDER = {
  id: 'ORD-101',
  service: 'Deep House Cleaning - Premium Package',
  status: 'In Progress',
  price: 154.00,
  date: 'Oct 28, 2025',
  time: '10:00 AM',
  client: {
    id: 'USR-001',
    name: 'Ahmed Rashid',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2',
    location: 'Gulshan 2, Dhaka',
    orders: 12,
    rating: 4.9
  },
  requirements: "Please focus on the kitchen exhaust fan and the balcony glass. We have two cats, so cat hair removal is priority. Also, avoid using strong chemical smells in the bedroom.",
  timeline: [
    { status: 'Order Placed', time: 'Oct 23, 10:00 AM', completed: true },
    { status: 'Requirements Provided', time: 'Oct 23, 10:15 AM', completed: true },
    { status: 'Order Started', time: 'Oct 24, 09:00 AM', completed: true },
    { status: 'Delivery Pending', time: 'Expected by Oct 28', completed: false },
  ]
};

export default function ProviderOrderDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'details' | 'requirements' | 'delivery'>('details');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [files, setFiles] = useState<{name: string, type: string}[]>([]);
  const [isDelivering, setIsDelivering] = useState(false);
  const [orderStatus, setOrderStatus] = useState(DEMO_ORDER.status);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, type: f.type }));
      setFiles([...files, ...newFiles]);
      toast.success('Files attached to delivery.');
    }
  };

  const handleDeliver = () => {
    if (deliveryNote.length < 10) {
      toast.error('Please provide more details in your delivery note.');
      return;
    }
    setIsDelivering(true);
    setTimeout(() => {
      setOrderStatus('Delivered');
      setIsDelivering(false);
      toast.success('Work delivered! Waiting for client review.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
           <Link href="/provider/dashboard" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-[#2286BE] transition-colors group">
             <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
           </Link>
           <div className="flex gap-2">
              <Link href={`/messages?user=${DEMO_ORDER.client.id}`}>
                <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 hover:text-[#2286BE] hover:border-[#2286BE] bg-white transition-all shadow-sm">
                   <MessageSquare size={18} className="mr-2" /> Messenger
                </Button>
              </Link>
              <Link href={`/client/${DEMO_ORDER.client.id}`}>
                <Button variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600 hover:text-[#2286BE] hover:border-[#2286BE] bg-white transition-all shadow-sm">
                   <User size={18} className="mr-2" /> Client Profile
                </Button>
              </Link>
           </div>
        </div>

        {/* Order Header Card */}
        <Card className="border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2.5rem] mb-10 overflow-hidden">
           <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-8">
              <div className="flex gap-6">
                 <div className="h-20 w-20 bg-[#2286BE]/10 rounded-[2rem] flex items-center justify-center text-[#2286BE] shrink-0">
                    <FileText size={32} />
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <Badge className="bg-slate-900 border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">{DEMO_ORDER.id}</Badge>
                       <Badge className={`px-3 py-1 font-black text-[10px] uppercase border-none tracking-widest ${
                         orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-[#2286BE]/10 text-[#2286BE]'
                       }`}>
                          {orderStatus}
                       </Badge>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{DEMO_ORDER.service}</h1>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                       <div className="flex items-center gap-1.5"><Calendar size={14} /> {DEMO_ORDER.date}</div>
                       <div className="flex items-center gap-1.5"><Clock size={14} /> {DEMO_ORDER.time}</div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 md:px-10 flex flex-col justify-center items-center md:items-end">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Earnings</p>
                 <div className="text-4xl font-black text-slate-900 tracking-tighter flex items-center">
                    <span className="text-xl mr-1">$</span>{DEMO_ORDER.price.toFixed(2)}
                 </div>
              </div>
           </div>

           {/* Tabs */}
           <div className="px-12 flex gap-10">
              {['details', 'requirements', 'delivery'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-6 font-black text-[11px] uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab ? 'text-[#2286BE]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="orderTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#2286BE] rounded-t-full" />
                  )}
                </button>
              ))}
           </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           <div className="lg:col-span-2 space-y-10">
              <AnimatePresence mode="wait">
                 {activeTab === 'details' && (
                   <motion.div 
                     key="details" 
                     initial={{ opacity: 0, x: -20 }} 
                     animate={{ opacity: 1, x: 0 }} 
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-8"
                   >
                     {/* Timeline */}
                     <Card className="border-none shadow-sm bg-white rounded-[2rem] p-10">
                        <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Project Timeline</h3>
                        <div className="space-y-8 relative">
                           <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100" />
                           {DEMO_ORDER.timeline.map((item, i) => (
                             <div key={i} className="flex gap-6 relative z-10">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${
                                  item.completed ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
                                }`}>
                                   {item.completed && <CheckCircle2 size={10} />}
                                </div>
                                <div className="flex-1">
                                   <div className="flex justify-between items-start">
                                      <p className={`font-black text-sm tracking-tight ${item.completed ? 'text-slate-900' : 'text-slate-400'}`}>{item.status}</p>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </Card>

                     <div className="bg-[#2286BE]/5 rounded-[2rem] p-10 border border-[#2286BE]/20 flex items-center justify-between">
                        <div>
                           <h4 className="text-lg font-black text-slate-900 mb-1">Standard Delivery Time</h4>
                           <p className="text-sm font-medium text-slate-500">The delivery is expected in <span className="text-[#2286BE] font-black">2 days, 4 hours</span>.</p>
                        </div>
                        <AlertCircle size={32} className="text-[#2286BE]/30" />
                     </div>
                   </motion.div>
                 )}

                 {activeTab === 'requirements' && (
                    <motion.div 
                      key="reqs" 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 20 }}
                    >
                       <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-12">
                          <div className="flex items-center gap-4 mb-8">
                             <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                                <FileText size={24} />
                             </div>
                             <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Client Requirements</h3>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Provided on Oct 23</p>
                             </div>
                          </div>
                          <div className="bg-slate-50 rounded-3xl p-8 text-slate-700 font-medium leading-relaxed italic border-l-4 border-amber-400">
                             &ldquo;{DEMO_ORDER.requirements}&rdquo;
                          </div>
                       </Card>
                    </motion.div>
                 )}

                 {activeTab === 'delivery' && (
                    <motion.div 
                      key="delivery" 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                       <Card className="border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2.5rem] p-10 overflow-hidden relative">
                          <div className="relative z-10">
                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Submit Your Work</h3>
                            <p className="text-slate-500 font-medium mb-10">Deliver your finished service and provide instructions for the client.</p>

                            <div className="space-y-8">
                               <div className="space-y-3">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Delivery Note</label>
                                  <textarea 
                                    className="w-full h-48 rounded-[2rem] bg-slate-50 border-none p-8 text-slate-700 font-medium focus:ring-2 focus:ring-[#2286BE] transition-all"
                                    placeholder="Explain the work you've done, provide any links, and share important details for the client..."
                                    value={deliveryNote}
                                    onChange={(e) => setDeliveryNote(e.target.value)}
                                  />
                               </div>

                               <div className="space-y-4">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Project Files & Proof</label>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     {files.map((file, i) => (
                                       <div key={i} className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-4 text-center group relative overflow-hidden">
                                          {file.type.includes('image') ? <ImageIcon size={24} className="text-slate-300 mb-2" /> : <Video size={24} className="text-slate-300 mb-2" />}
                                          <p className="text-[10px] font-bold text-slate-400 truncate w-full">{file.name}</p>
                                          <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 h-6 w-6 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                             <FileText size={12} className="rotate-45" /> 
                                          </button>
                                       </div>
                                     ))}
                                     <label className="aspect-square bg-[#2286BE]/5 hover:bg-[#2286BE]/10 rounded-3xl border-2 border-dashed border-[#2286BE]/20 flex flex-col items-center justify-center p-6 text-center group cursor-pointer transition-all active:scale-95">
                                        <Upload size={24} className="text-[#2286BE] mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="text-[10px] font-black text-[#2286BE] uppercase tracking-[0.1em]">Upload Content</p>
                                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                                     </label>
                                  </div>
                               </div>

                               <div className="pt-6 border-t border-slate-50">
                                  <Button 
                                    onClick={handleDeliver}
                                    disabled={isDelivering || orderStatus === 'Delivered'}
                                    className="w-full h-16 rounded-2xl bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg shadow-xl shadow-[#2286BE]/20 transition-all flex items-center justify-center gap-3"
                                  >
                                     {isDelivering ? 'Delivering...' : orderStatus === 'Delivered' ? 'Delivered successfully' : 'Deliver and Submit Work'}
                                     <ChevronRight size={20} />
                                  </Button>
                                  <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                                     Clients have 3 days to approve or request revisions.
                                  </p>
                               </div>
                            </div>
                          </div>
                       </Card>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Sidebar: Client and Summary */}
           <div className="space-y-10">
              {/* Client Info */}
              <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-10 text-center relative overflow-hidden">
                 <div className="relative z-10">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-2 ring-slate-100 mx-auto mb-6">
                       <AvatarImage src={DEMO_ORDER.client.avatar} />
                       <AvatarFallback className="text-2xl font-black bg-slate-50 font-black">C</AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{DEMO_ORDER.client.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-8 text-xs font-bold text-slate-400">
                       <MapPin size={12} /> {DEMO_ORDER.client.location}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Previous Jobs</p>
                          <p className="text-xl font-black text-slate-900">{DEMO_ORDER.client.orders}</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                          <p className="text-xl font-black text-slate-900 flex items-center justify-center gap-1.5">{DEMO_ORDER.client.rating} <CheckCircle2 size={14} className="text-[#2286BE]" /></p>
                       </div>
                    </div>

                    <Link href={`/messages?user=${DEMO_ORDER.client.id}`} className="block">
                       <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-700 hover:bg-[#2286BE]/5 hover:text-[#2286BE] hover:border-[#2286BE]/20 font-black transition-all">
                          Contact Client
                       </Button>
                    </Link>
                 </div>
                 {/* BGs */}
                 <div className="absolute top-0 right-0 w-24 h-24 bg-[#2286BE]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
              </Card>

              {/* Order Summary */}
              <Card className="border-none shadow-sm bg-white rounded-[2.5rem] p-10">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Order Information</h4>
                 <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-bold text-slate-400">Amount</span>
                       <span className="font-black text-slate-900">$154.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-bold text-slate-400">Service Fee</span>
                       <span className="font-black text-slate-900">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="font-bold text-slate-400">Delivery Method</span>
                       <span className="font-black text-slate-700">In-person Service</span>
                    </div>
                    <div className="pt-5 border-t border-slate-50 flex justify-between items-center">
                       <span className="font-bold text-slate-900">Total Earnings</span>
                       <span className="text-2xl font-black text-[#2286BE]">$154.00</span>
                    </div>
                 </div>
              </Card>
           </div>

        </div>

      </div>
    </div>
  );
}
