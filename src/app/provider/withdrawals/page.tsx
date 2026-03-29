'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Wallet,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const MOCK_WITHDRAWALS = [
  { id: 'WIT-782', date: 'Oct 24, 2025', amount: 450, status: 'Completed', method: 'Bank Transfer (**** 4291)' },
  { id: 'WIT-901', date: 'Oct 12, 2025', amount: 120, status: 'Completed', method: 'Stripe Payout' },
  { id: 'WIT-112', date: 'Nov 02, 2025', amount: 300, status: 'Pending', method: 'Bank Transfer (**** 4291)' },
];

export default function ProviderWithdrawalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawals, setWithdrawals] = useState(MOCK_WITHDRAWALS);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    if (amount > 154.00) {
      toast.error('Insufficient balance.');
      return;
    }

    const newWithdrawal = {
      id: `WIT-${Math.floor(Math.random() * 900) + 100}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: amount,
      status: 'Pending',
      method: 'Bank Transfer (Default)'
    };

    setWithdrawals([newWithdrawal, ...withdrawals]);
    setIsModalOpen(false);
    setWithdrawAmount('');
    toast.success('Withdrawal request submitted! Admin will review it shortly.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link href="/provider/dashboard" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-[#2286BE] mb-8 transition-colors group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
           <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Earnings & Withdrawals</h1>
             <p className="text-slate-500 mt-2 text-lg font-medium">Manage your payouts and financial history.</p>
           </div>
           <Button 
             onClick={() => setIsModalOpen(true)}
             className="h-14 px-8 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black rounded-2xl shadow-xl shadow-[#2286BE]/20 transition-all hover:scale-105"
           >
             <Wallet size={20} className="mr-2" /> Request Withdrawal
           </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
             <CardContent className="p-8">
                <div className="h-12 w-12 bg-[#2286BE]/10 rounded-2xl flex items-center justify-center text-[#2286BE] mb-6">
                   <DollarSign size={24} />
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">$154.00</h3>
                <div className="mt-4 flex items-center text-xs font-bold text-green-500">
                   <TrendingUp size={14} className="mr-1" /> Ready for checkout
                </div>
             </CardContent>
           </Card>

           <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
             <CardContent className="p-8">
                <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                   <Clock size={24} />
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Pending Payouts</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">$300.00</h3>
                <div className="mt-4 flex items-center text-xs font-bold text-slate-400">
                   1 active request
                </div>
             </CardContent>
           </Card>

           <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
             <CardContent className="p-8">
                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                   <CheckCircle2 size={24} />
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total Withdrawn</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">$570.00</h3>
                <div className="mt-4 flex items-center text-xs font-bold text-slate-400">
                   Across 2 previous payouts
                </div>
             </CardContent>
           </Card>
        </div>

        {/* History Table */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-10 pb-6 border-b border-slate-50">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                   <History size={20} />
                </div>
                <div>
                   <CardTitle className="text-2xl font-black text-slate-900">Withdrawal History</CardTitle>
                   <CardDescription className="font-bold">Last 30 days of transactions</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead>
                      <tr className="bg-slate-50/50">
                         <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                         <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                         <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Destination</th>
                         <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                         <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {withdrawals.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-10 py-6">
                              <span className="font-black text-slate-900">{tx.id}</span>
                           </td>
                           <td className="px-10 py-6">
                              <span className="font-bold text-slate-500">{tx.date}</span>
                           </td>
                           <td className="px-10 py-6">
                              <span className="text-sm font-bold text-slate-600">{tx.method}</span>
                           </td>
                           <td className="px-10 py-6">
                              <span className="text-lg font-black text-slate-900">${tx.amount}</span>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <Badge className={`rounded-xl px-4 py-1.5 font-black text-[10px] uppercase border-none tracking-widest ${
                                tx.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                 {tx.status}
                              </Badge>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </CardContent>
        </Card>

        {/* Withdrawal Modal */}
        <AnimatePresence>
           {isModalOpen && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-10 overflow-hidden"
                >
                   <div className="text-center mb-8">
                      <div className="h-20 w-20 bg-[#2286BE]/10 rounded-[2rem] flex items-center justify-center text-[#2286BE] mx-auto mb-6">
                         <ArrowUpRight size={32} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">Withdraw Funds</h2>
                      <p className="text-slate-500 font-bold">Initiate a transfer to your bank account.</p>
                   </div>

                   <form onSubmit={handleRequest} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Amount to Withdraw</label>
                         <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400 group-focus-within:text-[#2286BE] transition-colors">$</span>
                            <Input 
                              type="number"
                              step="0.01"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="0.00"
                              className="h-20 pl-14 pr-8 rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus-visible:ring-[#2286BE] font-black text-3xl placeholder:text-slate-200"
                              autoFocus
                            />
                         </div>
                         <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-bold text-slate-400">Available: $154.00</span>
                            <button 
                              type="button"
                              onClick={() => setWithdrawAmount('154.00')}
                              className="text-xs font-black text-[#2286BE] hover:underline"
                            >
                               Withdraw Max
                            </button>
                         </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 flex gap-4">
                         <div className="h-10 w-10 border border-slate-200 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                            <AlertCircle size={18} />
                         </div>
                         <p className="text-xs font-bold text-slate-500 leading-relaxed">
                            Withdrawals are processed within 3-5 business days. You will be notified once the transfer is complete.
                         </p>
                      </div>

                      <div className="flex flex-col gap-3 pt-4">
                         <Button 
                           type="submit"
                           className="h-16 rounded-2xl bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-lg shadow-xl shadow-[#2286BE]/20 transition-all active:scale-95"
                         >
                            Confirm Withdrawal
                         </Button>
                         <Button 
                           type="button"
                           variant="ghost" 
                           onClick={() => setIsModalOpen(false)}
                           className="h-14 rounded-2xl text-slate-400 hover:text-slate-600 font-black"
                         >
                            Cancel
                         </Button>
                      </div>
                   </form>

                   {/* Background Decor */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#2286BE]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />
                   <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />
                </motion.div>
             </div>
           )}
        </AnimatePresence>

      </div>
    </div>
  );
}
