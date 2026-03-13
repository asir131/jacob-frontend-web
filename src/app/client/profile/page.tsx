'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell, CreditCard, LogOut, Camera, MapPin, Phone, Mail, ChevronRight, Save, Globe, Eye, EyeOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';

export default function ClientProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    toast.success('Your changes have been saved successfully.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-10">
           
           {/* Left Sidebar Layout */}
           <div className="lg:w-80 shrink-0">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 text-center sticky top-24"
              >
                  <div className="relative inline-block mb-6 group">
                     <Avatar className="h-32 w-32 border-4 border-primary-soft ring-2 ring-white">
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e290267045" />
                        <AvatarFallback className="text-3xl font-black text-slate-300">JD</AvatarFallback>
                     </Avatar>
                     <button className="absolute bottom-1 right-1 h-10 w-10 bg-[#2286BE] text-white rounded-full border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all">
                        <Camera size={18} />
                     </button>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ahmed Rashid</h2>
                  <p className="text-sm font-bold text-[#2286BE] uppercase tracking-widest mt-1">Verified Client</p>
                  
                  <div className="mt-10 space-y-2">
                     {[
                       { id: 'profile', icon: <User size={18} />, label: 'Profile Info' },
                       { id: 'security', icon: <Shield size={18} />, label: 'Security' },
                       { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
                       { id: 'billing', icon: <CreditCard size={18} />, label: 'Billing' },
                     ].map(item => (
                       <button
                         key={item.id}
                         onClick={() => setActiveTab(item.id)}
                         className={`
                           w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all duration-300
                           ${activeTab === item.id 
                             ? 'bg-primary-soft text-[#2286BE] shadow-sm' 
                             : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                         `}
                       >
                          <div className="flex items-center gap-4">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
                       </button>
                     ))}
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-100">
                     <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-700 font-bold rounded-2xl h-12">
                        <LogOut size={18} className="mr-3" /> Sign Out
                     </Button>
                  </div>
              </motion.div>
           </div>

           {/* Main Content Area */}
           <div className="flex-1 min-w-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
              >
                 <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                       
                       {activeTab === 'profile' && (
                         <motion.div 
                           key="profile"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -20 }}
                           className="space-y-10"
                         >
                            <div>
                               <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Profile</h3>
                               <p className="text-slate-500 font-medium">Manage your personal information and how others see you.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="space-y-3">
                                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Full Name</label>
                                  <div className="relative">
                                     <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                     <Input defaultValue="Ahmed Rashid" className="h-14 pl-12 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                                  </div>
                               </div>
                               <div className="space-y-3">
                                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Phone Number</label>
                                  <div className="relative">
                                     <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                     <Input defaultValue="+880 1711-223344" className="h-14 pl-12 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                                  </div>
                               </div>
                               <div className="space-y-3">
                                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Email Address</label>
                                  <div className="relative">
                                     <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                     <Input defaultValue="ahmed.rashid@email.com" readOnly className="h-14 pl-12 rounded-xl border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed font-bold" />
                                  </div>
                               </div>
                               <div className="space-y-3">
                                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Preferred Language</label>
                                  <div className="relative">
                                     <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                     <Input defaultValue="English (US)" className="h-14 pl-12 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                                  </div>
                               </div>
                               <div className="md:col-span-2 space-y-3">
                                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Current Address</label>
                                  <div className="relative">
                                     <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                     <Input defaultValue="Banani, Dhaka, Bangladesh" className="h-14 pl-12 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                                  </div>
                               </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                               <Button variant="ghost" className="font-bold rounded-xl px-10 h-14">Cancel</Button>
                               <Button onClick={handleSave} className="bg-[#2286BE] hover:bg-[#059669] font-black rounded-xl px-12 h-14 shadow-xl shadow-primary/20">
                                  <Save size={18} className="mr-2" /> Save Changes
                               </Button>
                            </div>
                         </motion.div>
                       )}

                       {activeTab === 'security' && (
                         <motion.div 
                           key="security"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="space-y-10"
                         >
                            <div>
                               <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Password & Security</h3>
                               <p className="text-slate-500 font-medium">Update your password and manage security settings.</p>
                            </div>

                            <div className="space-y-8 max-w-xl">
                               <div className="space-y-3">
                                  <Label className="text-sm font-black text-slate-900 uppercase tracking-widest">Current Password</Label>
                                  <div className="relative">
                                     <Input type={showPassword ? "text" : "password"} className="h-14 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                                     <button 
                                       type="button" 
                                       onClick={() => setShowPassword(!showPassword)}
                                       className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                     >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                     </button>
                                  </div>
                               </div>
                               <div className="space-y-3">
                                  <Label className="text-sm font-black text-slate-900 uppercase tracking-widest">New Password</Label>
                                  <Input type="password" placeholder="Min. 8 characters" className="h-14 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                               </div>
                               <div className="space-y-3">
                                  <Label className="text-sm font-black text-slate-900 uppercase tracking-widest">Confirm New Password</Label>
                                  <Input type="password" placeholder="Min. 8 characters" className="h-14 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                               </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                               <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Two-Factor Authentication</h4>
                               <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                  <div className="flex items-center gap-6">
                                     <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#2286BE] shadow-sm">
                                        <Shield size={24} />
                                     </div>
                                     <div>
                                        <p className="font-bold text-slate-900">SMS Authentication</p>
                                        <p className="text-xs text-slate-500 font-medium tracking-tight">Protect your account with codes sent via SMS.</p>
                                     </div>
                                  </div>
                                  <Switch />
                               </div>
                            </div>

                            <div className="flex justify-end pt-6">
                               <Button onClick={handleSave} className="bg-[#2286BE] hover:bg-[#059669] font-black rounded-xl px-12 h-14 shadow-xl shadow-primary/20">
                                  Update Password
                               </Button>
                            </div>
                         </motion.div>
                       )}

                       {activeTab === 'notifications' && (
                         <motion.div 
                           key="notifications"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="space-y-10"
                         >
                            <div>
                               <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Notifications</h3>
                               <p className="text-slate-500 font-medium">Control which alerts you receive and where you see them.</p>
                            </div>

                            <div className="space-y-4">
                               {[
                                 { title: 'Email Notifications', desc: 'Get updates on your orders and account activity via email.', default: true },
                                 { title: 'Push Notifications', desc: 'Real-time alerts on your phone or browser.', default: true },
                                 { title: 'Order Updates', desc: 'Receive status changes for your service requests.', default: true },
                                 { title: 'Promotional Offers', desc: 'Updates on new features and local service discounts.', default: false },
                                 { title: 'Messages', desc: 'Alerts when a provider sends you a direct message.', default: true },
                               ].map((item, i) => (
                                 <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
                                    <div className="max-w-md">
                                       <p className="font-bold text-slate-900 transition-colors group-hover:text-[#2286BE]">{item.title}</p>
                                       <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked={item.default} />
                                 </div>
                               ))}
                            </div>
                         </motion.div>
                       )}

                    </AnimatePresence>
                 </div>
              </motion.div>
           </div>
        </div>

      </div>
    </div>
  );
}
