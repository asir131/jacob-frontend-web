'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, Bell, CreditCard, LogOut, Camera, MapPin,
  Phone, Mail, ChevronRight, Save, Eye, EyeOff, Briefcase,
  Banknote, Building2, Plus, X, Lock, Smartphone, Monitor,
  Trash2, Check, Tag, Clock, DollarSign, ImagePlus, AlertTriangle,
  CheckCircle2, ShieldCheck, Info
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const notificationGroups = [
  {
    label: 'Order Alerts',
    items: [
      { id: 'new_order', icon: <Briefcase size={18} />, title: 'New Order', desc: 'Get notified when a client places a new booking', defaultOn: true },
      { id: 'order_accepted', icon: <CheckCircle2 size={18} />, title: 'Order Accepted', desc: 'Confirmation when your acceptance is registered', defaultOn: true },
      { id: 'order_cancelled', icon: <X size={18} />, title: 'Order Cancelled', desc: 'Alert when a client cancels their booking', defaultOn: true },
    ],
  },
  {
    label: 'Earnings',
    items: [
      { id: 'payout', icon: <Banknote size={18} />, title: 'Payout Processed', desc: 'Notified when your earnings are transferred', defaultOn: true },
      { id: 'weekly', icon: <Clock size={18} />, title: 'Weekly Summary', desc: 'A digest of your weekly performance and earnings', defaultOn: false },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { id: 'promos', icon: <Tag size={18} />, title: 'Tips & Promotions', desc: 'Helpful tips and promotional opportunities', defaultOn: false },
      { id: 'features', icon: <Info size={18} />, title: 'New Features', desc: 'Be the first to hear about platform updates', defaultOn: true },
    ],
  },
];

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 4 : 3;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'];
  if (password.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= strength ? colors[strength] : 'bg-slate-100'}`} />
        ))}
      </div>
      <p className={`text-xs font-bold ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-500' : strength === 3 ? 'text-blue-500' : 'text-emerald-500'}`}>
        {labels[strength]}
      </p>
    </div>
  );
}

export default function ProviderProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [skills, setSkills] = useState(['Deep Cleaning', 'Eco-Friendly', 'Carpet Cleaning']);
  const [skillInput, setSkillInput] = useState('');
  const [notifChannel, setNotifChannel] = useState('email');
  const [notifStates, setNotifStates] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationGroups.flatMap(g => g.items.map(i => [i.id, i.defaultOn])))
  );

  const handleSave = (section: string) => {
    toast.success(`${section} updated successfully!`);
  };

  const toggleDay = (day: string) => {
    setActiveDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => setSkills(prev => prev.filter(s => s !== skill));

  const sectionAnim = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.25 },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}
          <div className="lg:w-80 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 text-center sticky top-24"
            >
              <div className="relative inline-block mb-6 group">
                <Avatar className="h-32 w-32 border-4 border-primary-soft ring-2 ring-white">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e290267046" />
                  <AvatarFallback className="text-3xl font-black text-slate-300">SK</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-1 right-1 h-10 w-10 bg-[#2286BE] text-white rounded-full border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all">
                  <Camera size={18} />
                </button>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sarah Khan</h2>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <div className="h-2 w-2 bg-[#2286BE] rounded-full animate-pulse" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Master Cleaner • Pro</p>
              </div>

              <div className="mt-10 space-y-2">
                {[
                  { id: 'profile', icon: <User size={18} />, label: 'Business Profile' },
                  { id: 'business', icon: <Briefcase size={18} />, label: 'Service Details' },
                  { id: 'payouts', icon: <Banknote size={18} />, label: 'Payout Info' },
                  { id: 'security', icon: <Shield size={18} />, label: 'Security' },
                  { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
              <div className="p-8 md:p-12 lg:p-16">
                <AnimatePresence mode="wait">

                  {/* ── Business Profile ────────────────────────────────── */}
                  {activeTab === 'profile' && (
                    <motion.div key="profile" {...sectionAnim} className="space-y-12">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Business Profile</h3>
                          <p className="text-slate-500 font-medium">Manage how your service business appears to clients.</p>
                        </div>
                        <Badge className="bg-primary-soft text-[#2286BE] px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border-none">Top Rated Plus</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Contact Name</label>
                          <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input defaultValue="Sarah Khan" className="h-16 pl-12 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-bold text-lg" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Business Email</label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input defaultValue="sarah.services@pro.com" className="h-16 pl-12 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-bold text-lg" />
                          </div>
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Bio / Business Motto</label>
                          <textarea
                            defaultValue="Professional deep cleaning expert with over 8 years of experience in Dhaka. Committed to using eco-friendly materials and providing pixel-perfect hygiene for your home."
                            className="w-full border border-slate-200 rounded-[1.25rem] p-6 focus:ring-2 focus:ring-[#2286BE] focus:border-transparent outline-none transition-all resize-none text-base font-medium h-32 leading-relaxed"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Service City</label>
                          <div className="relative">
                            <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input defaultValue="Dhaka, Bangladesh" className="h-16 pl-12 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Experience Level</label>
                          <div className="relative">
                            <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input defaultValue="Expert (8+ Years)" className="h-16 pl-12 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-slate-100 flex justify-end gap-5">
                        <Button variant="ghost" className="font-bold rounded-2xl px-10 h-16">Discard changes</Button>
                        <Button onClick={() => handleSave('Business Profile')} className="bg-[#2286BE] hover:bg-[#059669] font-black rounded-2xl px-14 h-16 shadow-2xl shadow-primary/20 active:scale-95 transition-all text-lg">
                          <Save size={20} className="mr-3" /> Save Business Profile
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Service Details ──────────────────────────────────── */}
                  {activeTab === 'business' && (
                    <motion.div key="business" {...sectionAnim} className="space-y-12">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Service Details</h3>
                        <p className="text-slate-500 font-medium">Configure what you offer, when you're available, and how much you charge.</p>
                      </div>

                      {/* Category & Pricing */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Service Category</label>
                          <div className="relative">
                            <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                            <select className="w-full h-16 pl-12 pr-6 rounded-[1.25rem] border border-slate-200 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#2286BE] focus:border-transparent outline-none appearance-none cursor-pointer">
                              <option>Home Cleaning</option>
                              <option>Plumbing</option>
                              <option>Electrical Work</option>
                              <option>AC Repair</option>
                              <option>Painting</option>
                              <option>Pest Control</option>
                            </select>
                            <ChevronRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Base Hourly Rate</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg select-none">৳</span>
                            <Input type="number" defaultValue="850" className="h-16 pl-10 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-black text-xl" />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase tracking-wider">/ hr</span>
                          </div>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Available Days</label>
                        <div className="flex flex-wrap gap-3">
                          {DAYS.map(day => (
                            <button
                              key={day}
                              onClick={() => toggleDay(day)}
                              className={`h-12 w-16 rounded-2xl font-black text-sm transition-all duration-200 active:scale-95 ${
                                activeDays.includes(day)
                                  ? 'bg-[#2286BE] text-white shadow-lg shadow-[#2286BE]/25'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Start Time</label>
                          <div className="relative">
                            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input type="time" defaultValue="08:00" className="h-16 pl-12 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">End Time</label>
                          <div className="relative">
                            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input type="time" defaultValue="20:00" className="h-16 pl-12 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-bold" />
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Skills & Specializations</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {skills.map(skill => (
                            <span key={skill} className="flex items-center gap-2 bg-primary-soft text-[#2286BE] px-4 py-2 rounded-full font-bold text-sm">
                              {skill}
                              <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <Input
                            placeholder="Add a skill (e.g. Window Washing)"
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addSkill()}
                            className="h-14 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-medium"
                          />
                          <Button onClick={addSkill} className="h-14 px-6 rounded-[1.25rem] bg-[#2286BE] hover:bg-[#059669] font-bold">
                            <Plus size={18} />
                          </Button>
                        </div>
                      </div>

                      {/* Portfolio */}
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Portfolio / Work Samples</label>
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3].map(i => (
                            <div
                              key={i}
                              className="aspect-square border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#2286BE]/40 hover:bg-primary-soft/30 transition-all group"
                            >
                              <div className="h-12 w-12 rounded-2xl bg-slate-100 group-hover:bg-primary-soft flex items-center justify-center text-slate-300 group-hover:text-[#2286BE] transition-all">
                                <ImagePlus size={22} />
                              </div>
                              <span className="text-xs font-bold text-slate-400 group-hover:text-[#2286BE] transition-colors">Upload Photo</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-10 border-t border-slate-100 flex justify-end gap-5">
                        <Button variant="ghost" className="font-bold rounded-2xl px-10 h-16">Discard changes</Button>
                        <Button onClick={() => handleSave('Service Details')} className="bg-[#2286BE] hover:bg-[#059669] font-black rounded-2xl px-14 h-16 shadow-2xl shadow-primary/20 active:scale-95 transition-all text-lg">
                          <Save size={20} className="mr-3" /> Save Service Details
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Payout Info ────────────────────────────────────── */}
                  {activeTab === 'payouts' && (
                    <motion.div key="payouts" {...sectionAnim} className="space-y-10">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Payout Methods</h3>
                        <p className="text-slate-500 font-medium">Manage how you receive your earnings.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-2 border-[#2286BE] bg-primary-soft/30 rounded-[2rem] relative overflow-hidden p-8">
                          <div className="absolute top-4 right-4 h-6 w-6 bg-[#2286BE] rounded-full flex items-center justify-center text-white">
                            <ChevronRight size={14} className="rotate-90" />
                          </div>
                          <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#2286BE] shadow-md mb-6">
                            <Building2 size={24} />
                          </div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Primary Method</p>
                          <h4 className="text-xl font-black text-slate-900 mb-6">Bank Alfalah Ltd.</h4>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-slate-500 tracking-widest">**** **** 4242</p>
                            <Button variant="ghost" className="text-xs font-black text-[#2286BE] hover:bg-primary-soft uppercase tracking-widest h-8 rounded-lg px-3">Edit</Button>
                          </div>
                        </Card>
                        <div className="border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-8 hover:bg-slate-50 hover:border-[#2286BE]/10 cursor-pointer transition-all duration-300 group">
                          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 group-hover:text-[#2286BE] transition-all">
                            <CreditCard size={24} />
                          </div>
                          <span className="font-bold text-slate-400 group-hover:text-slate-600 transition-colors">Add New Payout Method</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Security ───────────────────────────────────────── */}
                  {activeTab === 'security' && (
                    <motion.div key="security" {...sectionAnim} className="space-y-12">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Security</h3>
                        <p className="text-slate-500 font-medium">Keep your account and business protected at all times.</p>
                      </div>

                      {/* Change Password */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center text-[#2286BE]">
                            <Lock size={16} />
                          </div>
                          <h4 className="text-lg font-black text-slate-900">Change Password</h4>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Current Password</label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter current password"
                              className="h-16 pl-12 pr-14 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-medium"
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">New Password</label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder="Enter new password"
                              value={newPassword}
                              onChange={e => setNewPassword(e.target.value)}
                              className="h-16 pl-12 pr-14 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-medium"
                            />
                            <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                          <PasswordStrength password={newPassword} />
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Confirm New Password</label>
                          <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                              type="password"
                              placeholder="Re-enter new password"
                              className="h-16 pl-12 rounded-[1.25rem] border-slate-200 focus-visible:ring-[#2286BE] font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Two-Factor Auth */}
                      <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-6 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                            <ShieldCheck size={22} />
                          </div>
                          <div>
                            <h5 className="font-black text-slate-900">Two-Factor Authentication</h5>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">Add an extra layer of security via SMS verification code</p>
                          </div>
                        </div>
                        <Switch
                          checked={twoFactor}
                          onCheckedChange={setTwoFactor}
                          className="data-[state=checked]:bg-[#2286BE]"
                        />
                      </div>

                      {/* Active Sessions */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center text-[#2286BE]">
                            <Monitor size={16} />
                          </div>
                          <h4 className="text-lg font-black text-slate-900">Active Sessions</h4>
                        </div>

                        {[
                          { icon: <Monitor size={18} />, device: 'Chrome on Windows', location: 'Dhaka, Bangladesh', time: 'Active now', current: true },
                          { icon: <Smartphone size={18} />, device: 'Safari on iPhone 15', location: 'Dhaka, Bangladesh', time: '2 hours ago', current: false },
                        ].map((session, i) => (
                          <div key={i} className="flex items-center justify-between gap-4 p-5 rounded-[1.5rem] border border-slate-100 hover:border-slate-200 transition-all">
                            <div className="flex items-center gap-4">
                              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${session.current ? 'bg-primary-soft text-[#2286BE]' : 'bg-slate-100 text-slate-400'}`}>
                                {session.icon}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-sm">{session.device}</p>
                                <p className="text-xs font-medium text-slate-400">{session.location} · {session.time}</p>
                              </div>
                            </div>
                            {session.current ? (
                              <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-xs px-3 py-1.5 rounded-lg">Current</Badge>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-50 hover:text-red-600 font-black rounded-xl h-9 px-4 text-xs">
                                Revoke
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                        {/* Danger Zone */}
                        <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-700 font-black rounded-2xl h-14 px-6">
                          <Trash2 size={18} className="mr-2" /> Delete Account
                        </Button>
                        <Button onClick={() => handleSave('Security settings')} className="bg-[#2286BE] hover:bg-[#059669] font-black rounded-2xl px-14 h-14 shadow-2xl shadow-primary/20 active:scale-95 transition-all text-lg">
                          <Save size={20} className="mr-3" /> Save Changes
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Notifications ─────────────────────────────────── */}
                  {activeTab === 'notifications' && (
                    <motion.div key="notifications" {...sectionAnim} className="space-y-12">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Notifications</h3>
                        <p className="text-slate-500 font-medium">Choose what alerts you receive and how you receive them.</p>
                      </div>

                      {/* Delivery Channel */}
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Delivery Channel</label>
                        <div className="flex gap-3 flex-wrap">
                          {[
                            { id: 'email', label: 'Email', icon: <Mail size={16} /> },
                            { id: 'sms', label: 'SMS', icon: <Phone size={16} /> },
                            { id: 'push', label: 'Push', icon: <Bell size={16} /> },
                          ].map(ch => (
                            <button
                              key={ch.id}
                              onClick={() => setNotifChannel(ch.id)}
                              className={`flex items-center gap-2.5 px-6 h-12 rounded-2xl font-black text-sm transition-all duration-200 ${
                                notifChannel === ch.id
                                  ? 'bg-[#2286BE] text-white shadow-lg shadow-[#2286BE]/25'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {ch.icon} {ch.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notification Groups */}
                      <div className="space-y-10">
                        {notificationGroups.map(group => (
                          <div key={group.label}>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{group.label}</p>
                            <div className="space-y-2">
                              {group.items.map(item => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between gap-4 p-5 rounded-[1.5rem] border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                      notifStates[item.id] ? 'bg-primary-soft text-[#2286BE]' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                      {item.icon}
                                    </div>
                                    <div>
                                      <p className="font-black text-slate-900 text-sm">{item.title}</p>
                                      <p className="text-xs font-medium text-slate-400 mt-0.5">{item.desc}</p>
                                    </div>
                                  </div>
                                  <Switch
                                    checked={notifStates[item.id]}
                                    onCheckedChange={val => setNotifStates(prev => ({ ...prev, [item.id]: val }))}
                                    className="data-[state=checked]:bg-[#2286BE] shrink-0"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-10 border-t border-slate-100 flex justify-end gap-5">
                        <Button variant="ghost" className="font-bold rounded-2xl px-10 h-16">Reset to Default</Button>
                        <Button onClick={() => handleSave('Notification preferences')} className="bg-[#2286BE] hover:bg-[#059669] font-black rounded-2xl px-14 h-16 shadow-2xl shadow-primary/20 active:scale-95 transition-all text-lg">
                          <Save size={20} className="mr-3" /> Save Preferences
                        </Button>
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
