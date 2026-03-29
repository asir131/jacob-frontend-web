'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, MessageSquare, AlertTriangle, 
  CheckCircle2, Clock, MapPin, UploadCloud, 
  X, HelpCircle, FileText, Image as ImageIcon,
  ChevronDown, Settings
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
    <div className="min-h-screen bg-[#F8FAFC] py-12 relative overflow-hidden">
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
                   <p className="text-4xl font-black text-slate-900 tracking-tight">৳{DEMO_ORDER.total}</p>
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
                               initial={{ opacity: 0, y: 10, scale: 0.95 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, y: 10, scale: 0.95 }}
                               className="absolute top-full right-0 mt-3 w-full md:w-72 bg-white rounded-3xl p-3 shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col gap-1 origin-top-right"
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
             <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-slate-400 shadow-inner">
                  {DEMO_ORDER.provider.avatar}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{DEMO_ORDER.provider.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-6 text-sm">
                   <Star size={14} className="text-amber-400 fill-amber-400" />
                   <span className="font-bold text-slate-900">{DEMO_ORDER.provider.rating}</span>
                   <span className="text-slate-400 font-medium">({DEMO_ORDER.provider.jobs} orders)</span>
                </div>
                <Link href="/messages" className="block">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-slate-700 hover:bg-[#2286BE]/5 hover:text-[#2286BE] hover:border-[#2286BE]/20 font-bold text-base transition-all">
                     <MessageSquare size={18} className="mr-2" /> Message Provider
                  </Button>
                </Link>
             </div>

             {/* Danger Zone */}
             {orderStatus === 'In Progress' && (
               <div className="bg-red-50/50 rounded-[2.5rem] p-8 border border-red-100">
                  <h4 className="text-sm font-black text-red-900 mb-2 uppercase tracking-widest flex items-center">
                     <AlertTriangle size={14} className="mr-2 text-red-500" /> Danger Zone
                  </h4>
                  <p className="text-xs font-medium text-red-700/80 leading-relaxed mb-6">
                     Having irreconcilable issues? You can request to cancel this booking before the service is marked complete.
                  </p>
                  <Button 
                    onClick={() => setActiveModal('cancel')}
                    variant="ghost" 
                    className="w-full h-12 bg-white text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-100 hover:border-red-600 rounded-xl font-bold transition-all shadow-sm"
                  >
                     Request Cancellation
                  </Button>
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

               {/* Modal Body / Scrollable */}
               <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                 
                 {/* COMPLETE MODAL */}
                 {activeModal === 'complete' && (
                    <div className="space-y-8">
                       <p className="text-slate-500 font-medium text-sm leading-relaxed text-center">
                         By completing this order, you confirm the service was delivered satisfactorily. You cannot request a cancellation or revision after this step.
                       </p>
                       <div className="text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#2286BE] mb-4">Rate the Provider</p>
                          <div className="flex justify-center gap-2">
                             {[1,2,3,4,5].map(star => (
                               <button 
                                 key={star} 
                                 onClick={() => setRating(star)}
                                 onMouseEnter={() => setHoveredRating(star)}
                                 onMouseLeave={() => setHoveredRating(0)}
                                 className="transition-transform hover:scale-110 active:scale-90 p-1"
                               >
                                  <Star size={36} className={`${(hoveredRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} transition-colors`} />
                               </button>
                             ))}
                          </div>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Public Review (Optional)</label>
                          <textarea 
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-[#2286BE] outline-none min-h-[120px] resize-none"
                            placeholder="Describe your experience working with this provider..."
                          />
                       </div>
                    </div>
                 )}

                 {/* REVISION MODAL */}
                 {activeModal === 'revision' && (
                    <div className="space-y-6">
                       <p className="text-amber-700 bg-amber-50 p-4 rounded-2xl text-sm font-medium leading-relaxed border border-amber-100">
                         If the service delivered does not match the original scope, you can request a revision. Please be as detailed as possible to help the provider fix the issue.
                       </p>
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">What needs fixing?</label>
                          <textarea 
                            value={revisionText}
                            onChange={(e) => setRevisionText(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-[#2286BE] outline-none min-h-[120px] resize-none"
                            placeholder="List exactly what was promised but not delivered or what must be altered..."
                          />
                       </div>
                       
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Attach Proof (Photos/Videos)</label>
                          <div className="border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/50 transition-colors rounded-2xl p-8 text-center relative group">
                             <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                             <div className="h-14 w-14 bg-white rounded-2xl shadow-sm mx-auto flex items-center justify-center text-[#2286BE] mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud size={24} />
                             </div>
                             <p className="text-sm font-bold text-slate-900 mb-1">Click to upload media</p>
                             <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">JPG, PNG, MP4 up to 50MB</p>
                          </div>
                          {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                               {files.map((file, idx) => (
                                 <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-bold text-slate-600">
                                    <ImageIcon size={14} className="text-[#2286BE]" /> {file.name}
                                 </div>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>
                 )}

                 {/* CANCEL MODAL */}
                 {activeModal === 'cancel' && (
                    <div className="space-y-6">
                       <p className="text-red-700 bg-red-50 p-4 rounded-2xl text-sm font-medium leading-relaxed border border-red-100">
                         Cancellations affect provider metrics. Please communicate with your provider before cancelling. You must provide a valid reason to proceed.
                       </p>
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Reason for Cancellation</label>
                          <select 
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-sm font-bold focus:ring-red-500 outline-none text-slate-900 appearance-none"
                          >
                            <option value="">Select a reason...</option>
                            <option value="provider_no_show">Provider did not show up</option>
                            <option value="provider_unprofessional">Provider was unprofessional</option>
                            <option value="incorrect_service">Incorrect service delivered</option>
                            <option value="client_schedule">My schedule changed</option>
                            <option value="other">Other</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Detailed Explanation</label>
                          <textarea 
                            value={cancelText}
                            onChange={(e) => setCancelText(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-red-500 outline-none min-h-[120px] resize-none"
                            placeholder="Please provide specific details to help us review this cancellation..."
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Attach Documents/Screenshots</label>
                          <div className="border-2 border-dashed border-red-100 bg-red-50/30 hover:bg-red-50 transition-colors rounded-2xl p-6 text-center relative group">
                             <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                             <div className="h-10 w-10 bg-white rounded-xl shadow-sm mx-auto flex items-center justify-center text-red-500 mb-3 group-hover:scale-110 transition-transform">
                                <FileText size={18} />
                             </div>
                             <p className="text-xs font-bold text-red-900">Upload chat logs or proofs</p>
                          </div>
                          {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                               {files.map((file, idx) => (
                                 <div key={idx} className="flex items-center gap-3 bg-red-50 border border-red-100 p-2.5 rounded-xl text-xs font-bold text-red-700">
                                    <FileText size={14} className="text-red-500" /> {file.name}
                                 </div>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>
                 )}

               </div>

               {/* Modal Footer */}
               <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-4 mt-auto">
                 <Button onClick={closeModal} variant="ghost" className="h-14 rounded-xl font-bold text-slate-500 hover:bg-slate-50 text-base">
                    Go Back
                 </Button>
                 
                 {activeModal === 'complete' && (
                   <Button onClick={handleCompleteOrder} className="h-14 rounded-xl bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black shadow-lg shadow-[#2286BE]/20 text-base">
                      Submit Review
                   </Button>
                 )}
                 {activeModal === 'revision' && (
                   <Button onClick={handleRequestRevision} disabled={!revisionText} className="h-14 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-lg shadow-amber-500/20 disabled:opacity-50 text-base">
                      Send Request
                   </Button>
                 )}
                 {activeModal === 'cancel' && (
                   <Button onClick={handleCancelOrder} disabled={!cancelReason || !cancelText} className="h-14 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg shadow-red-600/20 disabled:opacity-50 text-base">
                      Confirm Cancellation
                   </Button>
                 )}
               </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
