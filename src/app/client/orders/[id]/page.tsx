'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, MessageSquare, AlertTriangle, 
  CheckCircle2, Clock, MapPin, UploadCloud, 
  X, HelpCircle, FileText, Image as ImageIcon,
  ChevronDown, Settings, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// MOCK DATA - Since we don't have a backend fetch yet
const DEMO_ORDER = {
  id: 'ORD-2026-001',
  status: 'In Progress',
  provider: {
    id: 'PRO-123',
    name: 'QuickFix Team',
    avatar: 'Q',
    rating: 4.9,
    jobs: 124
  },
  service: 'Expert Plumbing & Pipe Repair',
  package: 'Standard Package',
  date: 'Oct 25, 2025',
  time: '10:00 AM',
  total: 1100,
  address: '123 Manhattan Ave, Apt 4B, New York, NY',
  orderNotes: 'Please ensure to bring a prolonged pipe wrench. The leak is directly under the primary bathroom sink.'
};

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [orderStatus, setOrderStatus] = useState(DEMO_ORDER.status);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<null | 'complete' | 'revision' | 'cancel'>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  
  // Form States
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  
  const [revisionText, setRevisionText] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCompleteOrder = () => {
    if (rating === 0) return toast.error('Please select a rating.');
    setOrderStatus('Completed');
    setActiveModal(null);
    toast.success('Order marked as complete. Thank you for your review!');
  };

  const handleRequestRevision = () => {
    if (!revisionText) return toast.error('Please provide details for the revision.');
    setOrderStatus('Revision Requested');
    setActiveModal(null);
    toast.success('Revision request sent to the provider.');
  };

  const handleCancelOrder = () => {
    if (!cancelReason || !cancelText) return toast.error('Please complete all fields to request a cancellation.');
    setOrderStatus('Cancellation Requested');
    setActiveModal(null);
    toast.success('Cancellation request submitted for review.');
  };

  const closeModal = () => {
    setActiveModal(null);
    setFiles([]); // Reset files on close
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation Bar */}
        <Link href="/client/orders" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[#2286BE] transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back to My Orders
        </Link>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Order Details */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#2286BE] bg-[#2286BE]/10 px-3 py-1 rounded-full">{resolvedParams.id}</span>
                      <Badge 
                        className={`
                          px-3 py-1 text-[10px] rounded-full uppercase tracking-widest font-black border-none
                          ${orderStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                            (orderStatus === 'Revision Requested' || orderStatus === 'Cancellation Requested') ? 'bg-amber-100 text-amber-700' :
                            'bg-[#2286BE]/10 text-[#2286BE]'}
                        `}
                      >
                        {orderStatus}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{DEMO_ORDER.service}</h1>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">${DEMO_ORDER.total}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 mb-8">
                   <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[#2286BE] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                         <Clock size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</p>
                         <p className="font-bold text-slate-900">{DEMO_ORDER.date} at {DEMO_ORDER.time}</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[#2286BE] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                         <MapPin size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Location</p>
                         <p className="font-bold text-slate-900 line-clamp-2 pr-4">{DEMO_ORDER.address}</p>
                      </div>
                   </div>
                </div>
                
                <div>
                   <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-widest">Order Notes</h3>
                   <div className="bg-slate-50 p-6 rounded-3xl text-sm font-medium text-slate-600 leading-relaxed border border-slate-100">
                      {DEMO_ORDER.orderNotes}
                   </div>
                </div>

                {/* Delivery Review Section */}
                <div className="bg-[#2286BE]/5 border border-[#2286BE]/10 rounded-[2.5rem] p-10 mt-10 relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#2286BE]">
                               <UploadCloud size={24} />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Provider Delivery</h3>
                               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Submitted on Oct 27, 2025</p>
                            </div>
                         </div>
                         <Badge className="bg-amber-500 text-white border-none px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest">Awaiting Approval</Badge>
                      </div>

                      <div className="bg-white border border-[#2286BE]/10 rounded-3xl p-8 mb-8">
                         <p className="text-slate-700 font-medium leading-relaxed italic mb-6">
                            &ldquo;Hi! I have completed the expert plumbing repair. The leak was caused by a worn out washer which I have replaced. I also checked the secondary pipes to ensure no future leaks. Please let me know if everything is to your satisfaction!&rdquo;
                         </p>
                         <div className="grid grid-cols-3 gap-4">
                            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:bg-slate-100 transition-all transition-colors">
                               <ImageIcon size={20} className="text-slate-300 mb-2" />
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Repair.jpg</span>
                            </div>
                            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:bg-slate-100 transition-all transition-colors">
                               <FileText size={20} className="text-slate-300 mb-2" />
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Receipt.pdf</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                         <Button 
                           onClick={() => setActiveModal('revision')}
                           variant="outline" 
                           className="flex-1 h-16 rounded-2xl border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 font-black transition-all"
                         >
                            Request Revision
                         </Button>
                         <Button 
                           onClick={() => setActiveModal('complete')}
                           className="flex-1 h-16 bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-900/20 transition-all"
                         >
                            Approve & Mark Complete
                         </Button>
                      </div>
                   </div>
                   {/* Background Decor */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#2286BE]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
                </div>
             </div>

             {/* Dynamic Status Action Box */}
             <div className="bg-[#2286BE]/5 border border-[#2286BE]/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                   <h3 className="text-xl font-black text-slate-900 mb-2">Order Action Center</h3>
                   <p className="text-sm font-medium text-slate-600">Need help with your current order? Make a selection on how to proceed.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto relative">
                   {orderStatus === 'In Progress' ? (
                     <div className="relative w-full md:w-auto">
                        <Button 
                          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)} 
                          className="h-14 w-full md:w-64 rounded-2xl bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-between px-6"
                        >
                          <span className="flex items-center gap-2"><Settings size={18} className="text-[#2286BE]" /> Manage Order</span>
                          <ChevronDown size={18} className={`transition-transform duration-300 ${isActionMenuOpen ? 'rotate-180' : ''}`} />
                        </Button>
                        
                        <AnimatePresence>
                          {isActionMenuOpen && (
                            <motion.div 
                               initial={{ opacity: 0, y: -10, scale: 0.95 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, y: -10, scale: 0.95 }}
                               className="absolute bottom-full right-0 mb-3 w-full md:w-72 bg-white rounded-3xl p-3 shadow-2xl border border-slate-100 z-[110] overflow-hidden flex flex-col gap-1 origin-bottom-right"
                            >
                               <button 
                                 onClick={() => { setActiveModal('complete'); setIsActionMenuOpen(false); }}
                                 className="flex items-center gap-3 w-full text-left p-4 rounded-2xl hover:bg-[#2286BE]/5 hover:text-[#2286BE] transition-colors group"
                               >
                                 <div className="h-10 w-10 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#2286BE] transition-colors shrink-0">
                                   <CheckCircle2 size={18} />
                                 </div>
                                 <div>
                                   <div className="font-black text-slate-900 group-hover:text-[#2286BE]">Mark as Complete</div>
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Finalize your order</div>
                                 </div>
                               </button>
                               
                               <button 
                                 onClick={() => { setActiveModal('revision'); setIsActionMenuOpen(false); }}
                                 className="flex items-center gap-3 w-full text-left p-4 rounded-2xl hover:bg-amber-50 hover:text-amber-600 transition-colors group"
                               >
                                 <div className="h-10 w-10 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors shrink-0">
                                   <HelpCircle size={18} />
                                 </div>
                                 <div>
                                   <div className="font-black text-slate-900 group-hover:text-amber-600">Request Revision</div>
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ask for changes</div>
                                 </div>
                               </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                   ) : (
                     <p className="text-sm font-bold text-slate-400 italic bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
                        No further actions available for this order.
                     </p>
                   )}
                </div>
             </div>
          </div>
          
          {/* Right Column: Provider & Danger Actions */}
          <div className="space-y-8">
             {/* Provider Card */}
             <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#2286BE]/5 to-[#2286BE]/20 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-[#2286BE] shadow-inner ring-4 ring-white">
                     {DEMO_ORDER.provider.avatar}
                   </div>
                   <h3 className="text-xl font-black text-slate-900 mb-1">{DEMO_ORDER.provider.name}</h3>
                   <div className="flex items-center justify-center gap-2 mb-8 text-sm font-bold text-slate-400">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-slate-900">{DEMO_ORDER.provider.rating}</span>
                      <span>({DEMO_ORDER.provider.jobs} orders)</span>
                   </div>
                   <div className="grid grid-cols-1 gap-3">
                      <Link href="/messages" className="block">
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-700 hover:bg-[#2286BE]/5 hover:text-[#2286BE] hover:border-[#2286BE]/20 font-black transition-all">
                           <MessageSquare size={18} className="mr-2" /> Message Pro
                        </Button>
                      </Link>
                      <Link href={`/provider/${DEMO_ORDER.provider.id}`} className="block">
                        <Button variant="ghost" className="w-full h-12 rounded-xl text-slate-400 hover:text-[#2286BE] hover:bg-[#2286BE]/5 font-black text-sm transition-all">
                           View Portfolio
                        </Button>
                      </Link>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2286BE]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-[#2286BE]/10 transition-colors" />
             </div>

             {/* Danger Zone */}
             {orderStatus === 'In Progress' && (
               <div className="bg-red-50/50 rounded-[2.5rem] p-8 border border-red-100 relative overflow-hidden">
                  <div className="relative z-10">
                     <h4 className="text-sm font-black text-red-900 mb-2 uppercase tracking-widest flex items-center">
                        <AlertTriangle size={14} className="mr-2 text-red-500" /> Resolution Center
                     </h4>
                     <p className="text-xs font-medium text-red-700/80 leading-relaxed mb-6">
                        Having issues with this order? Our dispute system can help you resolve conflicts or request a refund.
                     </p>
                     <div className="space-y-3">
                        <Button 
                          onClick={() => setActiveModal('cancel')}
                          className="w-full h-12 bg-white text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-100 hover:border-red-600 rounded-xl font-black transition-all shadow-sm"
                        >
                           Request Cancellation
                        </Button>
                        <Link href="/resolution-center" className="block">
                          <Button 
                            variant="ghost" 
                            className="w-full h-12 bg-transparent text-slate-400 hover:text-[#2286BE] hover:bg-[#2286BE]/5 font-black rounded-xl transition-all"
                          >
                            Open Resolution Hub
                          </Button>
                        </Link>
                     </div>
                  </div>
               </div>
             )}

          </div>

        </div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={closeModal}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 10 }} 
               className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
               {/* Modal Header */}
               <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                     {activeModal === 'complete' && <><CheckCircle2 size={24} className="text-[#2286BE]"/> Complete Order</>}
                     {activeModal === 'revision' && <><HelpCircle size={24} className="text-amber-500"/> Request Revision</>}
                     {activeModal === 'cancel' && <><AlertTriangle size={24} className="text-red-500"/> Cancel Order</>}
                  </h2>
                  <button onClick={closeModal} className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-colors">
                     <X size={20} />
                  </button>
               </div>

               {/* Modal Body */}
               <div className="p-8 overflow-y-auto">
                  {activeModal === 'complete' && (
                    <div className="space-y-6">
                       <div className="text-center mb-8">
                          <div className="flex justify-center gap-2 mb-4">
                             {[1, 2, 3, 4, 5].map((s) => (
                               <button 
                                 key={s}
                                 onMouseEnter={() => setHoveredRating(s)}
                                 onMouseLeave={() => setHoveredRating(0)}
                                 onClick={() => setRating(s)}
                                 className="transition-transform active:scale-90"
                               >
                                  <Star 
                                    size={40} 
                                    className={`transition-colors ${
                                      s <= (hoveredRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                    }`} 
                                  />
                               </button>
                             ))}
                          </div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Rate your experience</p>
                       </div>
                       <textarea 
                         placeholder="Share your feedback with the community..." 
                         className="w-full h-32 p-6 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-[#2286BE] font-medium resize-none shadow-inner"
                         value={reviewText}
                         onChange={(e) => setReviewText(e.target.value)}
                       />
                       <Button onClick={handleCompleteOrder} className="w-full h-16 rounded-2xl bg-[#2286BE] hover:bg-[#1b6da0] font-black text-lg shadow-xl shadow-[#2286BE]/20">
                          Submit & Release Funds
                       </Button>
                    </div>
                  )}

                  {activeModal === 'revision' && (
                    <div className="space-y-6">
                       <p className="text-sm font-medium text-slate-500 leading-relaxed bg-amber-50 p-4 rounded-2xl border border-amber-100">
                          Describe what you&apos;d like to change. Be as specific as possible to help the provider meet your expectations.
                       </p>
                       <textarea 
                         placeholder="e.g., I need the kitchen tiles to be cleaned again, there are still some stains..." 
                         className="w-full h-40 p-6 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-amber-500 font-medium resize-none shadow-inner"
                         value={revisionText}
                         onChange={(e) => setRevisionText(e.target.value)}
                       />
                       <Button onClick={handleRequestRevision} className="w-full h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 font-black text-lg shadow-xl shadow-amber-500/20">
                          Send Revision Request
                       </Button>
                    </div>
                  )}

                  {activeModal === 'cancel' && (
                    <div className="space-y-6">
                       <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-4">
                          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                          <p className="text-xs font-bold text-red-700 leading-relaxed">
                             Cancellation requests go to the Resolution Center. If the provider disagrees, the support team will mediate.
                          </p>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Reason for cancellation</label>
                          <select 
                            className="w-full h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-red-500 font-bold px-4"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          >
                             <option value="">Select a reason</option>
                             <option value="unresponsive">Provider is unresponsive</option>
                             <option value="poor-quality">Poor quality work</option>
                             <option value="late">Service is late / missed</option>
                             <option value="other">Other</option>
                          </select>
                       </div>
                       <textarea 
                         placeholder="Provide detailed context for your cancellation request..." 
                         className="w-full h-32 p-6 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-red-500 font-medium resize-none shadow-inner"
                         value={cancelText}
                         onChange={(e) => setCancelText(e.target.value)}
                       />
                       <Button onClick={handleCancelOrder} className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 font-black text-lg shadow-xl shadow-red-600/20">
                          Submit Request
                       </Button>
                    </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
