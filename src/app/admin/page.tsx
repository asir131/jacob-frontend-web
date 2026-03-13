'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, TicketCheck, Wallet, MoreVertical, Search, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
           <div>
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Master Control</h1>
             <p className="text-slate-500 mt-1">Supervise LocallyServe operations, moderate activity, and manage unassigned Custom Requests.</p>
           </div>
           <div className="flex items-center gap-3">
             <Button variant="outline" className="bg-white"><Settings size={18} className="mr-2" /> Global Settings</Button>
           </div>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <Card className="border-indigo-100 shadow-sm bg-indigo-50/30">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-bold text-indigo-700">Total Platform Users</CardTitle>
               <Users size={16} className="text-indigo-500" />
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-extrabold text-slate-900">4,231</div>
               <p className="text-xs text-indigo-600 font-semibold mt-1">1,200 Providers • 3,031 Clients</p>
             </CardContent>
           </Card>
           <Card className="shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Active Custom Requests</CardTitle>
               <Building2 size={16} className="text-amber-500" />
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-extrabold text-slate-900">54</div>
               <p className="text-xs text-slate-500 mt-1">Awaiting provider assignment</p>
             </CardContent>
           </Card>
           <Card className="shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Platform Gigs Active</CardTitle>
               <TicketCheck size={16} className="text-[#2286BE]" />
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-extrabold text-slate-900">892</div>
               <p className="text-xs text-slate-500 mt-1">Across 14 categories</p>
             </CardContent>
           </Card>
           <Card className="shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-slate-500">Escrow Total Volume</CardTitle>
               <Wallet size={16} className="text-primary-hover" />
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-extrabold text-slate-900">৳240K</div>
               <p className="text-xs text-[#2286BE] mt-1 font-semibold">+12% vs last week</p>
             </CardContent>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Custom Request Queue */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                   <h2 className="text-lg font-bold text-slate-900">Unassigned Custom Requests</h2>
                   <p className="text-xs text-slate-500">Requests posted via /post-request</p>
                 </div>
                 <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">54 Queue</Badge>
              </div>
              <div className="p-0 overflow-y-auto max-h-[400px]">
                 <Table>
                   <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
                     <TableRow>
                       <TableHead>Client</TableHead>
                       <TableHead>Category & Budget</TableHead>
                       <TableHead className="text-right">Action</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {[1, 2, 3, 4, 5].map(req => (
                       <TableRow key={req}>
                         <TableCell>
                           <p className="font-semibold text-slate-800 text-sm">John D.</p>
                           <p className="text-xs text-slate-400">Dhaka</p>
                         </TableCell>
                         <TableCell>
                           <p className="font-semibold text-slate-700 text-sm line-clamp-1">Deep cleaning for empty 3BHK</p>
                           <p className="text-xs text-[#2286BE] font-bold">~ ৳4000 Budget</p>
                         </TableCell>
                         <TableCell className="text-right">
                           <Button size="sm" className="bg-[#2286BE] hover:bg-[#059669] h-8 text-xs">Dispatch</Button>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center mt-auto">
                 <button className="text-sm font-semibold text-indigo-600 hover:underline">View Entire Queue →</button>
              </div>
           </div>

           {/* Platform Moderation Table */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                   <h2 className="text-lg font-bold text-slate-900">Recent Platform Transactions</h2>
                   <p className="text-xs text-slate-500">Global order oversight</p>
                 </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><Search size={16}/></Button>
              </div>
              <div className="p-0 overflow-y-auto max-h-[400px]">
                 <Table>
                   <TableBody>
                     {[1, 2, 3, 4, 5, 6].map(tx => (
                       <TableRow key={tx} className="hover:bg-slate-50/50">
                         <TableCell className="pl-6 w-[100px]">
                           <span className="text-xs font-mono text-slate-500">TX-00{tx}</span>
                         </TableCell>
                         <TableCell>
                           <p className="font-semibold text-slate-800 text-sm">৳{tx * 1200}</p>
                           <p className="text-xs text-slate-400">Escrow Held</p>
                         </TableCell>
                         <TableCell>
                           {tx % 2 === 0 ? <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Pending</Badge> : <Badge className="bg-primary-soft text-emerald-700 hover:bg-primary-soft">Completed</Badge>}
                         </TableCell>
                         <TableCell className="text-right pr-6">
                           <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={16}/></Button>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
