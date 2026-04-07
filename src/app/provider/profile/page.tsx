'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bell,
  Banknote,
  Briefcase,
  Camera,
  ChevronRight,
  CreditCard,
  LogOut,
  Mail,
  MapPin,
  Navigation,
  Save,
  Shield,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import MapboxLocationPicker from '@/components/profile/MapboxLocationPicker';
import { resolveAddressFromCoordinates } from '@/lib/geocodeAddress';

export default function ProviderProfilePage() {
  const { user, role, logout, updateProfile } = useAuth();
  const { city, coordinates, detectLocation } = useLocation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [contactNameDraft, setContactNameDraft] = useState<string | null>(null);
  const [bioDraft, setBioDraft] = useState<string | null>(null);
  const [experienceDraft, setExperienceDraft] = useState<string | null>(null);
  const [serviceCityDraft, setServiceCityDraft] = useState<string | null>(null);
  const [avatarDraft, setAvatarDraft] = useState<string | null>(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isResolvingCity, setIsResolvingCity] = useState(false);
  const [selectedMapCoords, setSelectedMapCoords] = useState<{ lat: number; lng: number }>({
    lat: 40.7128,
    lng: -74.006,
  });

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const defaultContactName = user ? user.name || `${user.firstName} ${user.lastName}`.trim() : '';
  const defaultBusinessBio = user?.businessBio || '';
  const defaultExperience = user?.experienceLevel || '';
  const defaultServiceCity = user?.serviceCity || city;
  const defaultAvatarSrc = user?.avatar || '';

  const contactName = contactNameDraft ?? defaultContactName;
  const businessBio = bioDraft ?? defaultBusinessBio;
  const experienceLevel = experienceDraft ?? defaultExperience;
  const serviceCity = serviceCityDraft ?? defaultServiceCity;
  const avatar = avatarDraft ?? defaultAvatarSrc;

  const savedServiceLat = typeof user?.serviceLocationLat === 'number' ? user.serviceLocationLat : null;
  const savedServiceLng = typeof user?.serviceLocationLng === 'number' ? user.serviceLocationLng : null;
  const coordLat = coordinates?.lat ?? null;
  const coordLng = coordinates?.lng ?? null;

  useEffect(() => {
    if (savedServiceLat !== null && savedServiceLng !== null) {
      setSelectedMapCoords({ lat: savedServiceLat, lng: savedServiceLng });
      return;
    }

    if (coordLat !== null && coordLng !== null) {
      setSelectedMapCoords({ lat: coordLat, lng: coordLng });
    }
  }, [coordLat, coordLng, savedServiceLat, savedServiceLng]);

  const resetDrafts = () => {
    setContactNameDraft(null);
    setBioDraft(null);
    setExperienceDraft(null);
    setServiceCityDraft(null);
    setAvatarDraft(null);

    if (savedServiceLat !== null && savedServiceLng !== null) {
      setSelectedMapCoords({ lat: savedServiceLat, lng: savedServiceLng });
    }
  };

  const saveCoordinatesAsServiceCity = async (lat: number, lng: number, successMessage: string) => {
    setIsResolvingCity(true);
    const nextCity = await resolveAddressFromCoordinates(lat, lng, mapboxToken);
    setServiceCityDraft(nextCity);
    setSelectedMapCoords({ lat, lng });
    updateProfile({
      serviceCity: nextCity,
      serviceLocationLat: lat,
      serviceLocationLng: lng,
    });
    setIsResolvingCity(false);
    toast.success(successMessage);
  };

  const handleUseCurrentLocation = async () => {
    detectLocation();

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          void saveCoordinatesAsServiceCity(
            position.coords.latitude,
            position.coords.longitude,
            'Service city updated from current location.'
          );
        },
        async () => {
          if (coordinates) {
            await saveCoordinatesAsServiceCity(
              coordinates.lat,
              coordinates.lng,
              'Service city updated from current location.'
            );
            return;
          }

          setServiceCityDraft(city);
          updateProfile({ serviceCity: city });
          toast.success('Service city set from detected city.');
        }
      );
      return;
    }

    if (coordinates) {
      await saveCoordinatesAsServiceCity(coordinates.lat, coordinates.lng, 'Service city updated.');
      return;
    }

    setServiceCityDraft(city);
    updateProfile({ serviceCity: city });
    toast.success('Service city set from detected city.');
  };

  const handleSetCenterAsServiceCity = async () => {
    await saveCoordinatesAsServiceCity(
      selectedMapCoords.lat,
      selectedMapCoords.lng,
      'Map center saved as service city.'
    );
  };

  const handleUploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }

    const uploadAvatar = async () => {
      const token = localStorage.getItem('auth_token');
      const apiBase = process.env.NEXT_PUBLIC_API_URL;

      if (!apiBase || !token) {
        toast.error('Missing API configuration or auth token.');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      setIsUploadingAvatar(true);
      try {
        const response = await fetch(`${apiBase}/api/profile/avatar`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          toast.error(payload?.message || 'Failed to upload profile image.');
          return;
        }

        const nextAvatarUrl = payload?.data?.avatarUrl;
        if (!nextAvatarUrl) {
          toast.error('Upload succeeded but image URL was missing.');
          return;
        }

        setAvatarDraft(nextAvatarUrl);
        updateProfile({ avatar: nextAvatarUrl });
        toast.success('Profile image updated.');
      } catch {
        toast.error('Could not upload image right now.');
      } finally {
        setIsUploadingAvatar(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    void uploadAvatar();
  };

  const handleSaveBusinessProfile = async () => {
    const cleanContactName = contactName.trim();
    if (!cleanContactName) {
      toast.error('Contact name is required.');
      return;
    }

    const [firstName, ...rest] = cleanContactName.split(' ').filter(Boolean);
    const lastName = rest.join(' ');

    const token = localStorage.getItem('auth_token');
    const apiBase = process.env.NEXT_PUBLIC_API_URL;

    if (!token || !apiBase) {
      toast.error('Missing API configuration or auth token.');
      return;
    }

    setIsSavingProfile(true);

    try {
      const response = await fetch(`${apiBase}/api/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          businessBio: businessBio.trim(),
          experienceLevel: experienceLevel.trim(),
          serviceCity: serviceCity.trim(),
          serviceLocationLat: selectedMapCoords.lat,
          serviceLocationLng: selectedMapCoords.lng,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        toast.error(payload?.message || 'Failed to save business profile.');
        return;
      }

      const nextUser = payload?.data?.user;
      updateProfile({
        firstName: nextUser?.firstName ?? firstName,
        lastName: nextUser?.lastName ?? lastName,
        name: `${nextUser?.firstName ?? firstName} ${nextUser?.lastName ?? lastName}`.trim(),
        email: nextUser?.email ?? user?.email,
        avatar: nextUser?.avatar ?? avatar,
        businessBio: nextUser?.businessBio ?? businessBio.trim(),
        experienceLevel: nextUser?.experienceLevel ?? experienceLevel.trim(),
        serviceCity: nextUser?.serviceCity ?? serviceCity.trim(),
        serviceLocationLat:
          typeof nextUser?.serviceLocationLat === 'number'
            ? nextUser.serviceLocationLat
            : selectedMapCoords.lat,
        serviceLocationLng:
          typeof nextUser?.serviceLocationLng === 'number'
            ? nextUser.serviceLocationLng
            : selectedMapCoords.lng,
      });

      resetDrafts();
      toast.success(payload?.message || 'Business profile saved successfully.');
    } catch {
      toast.error('Could not save business profile right now.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancel = () => {
    resetDrafts();
    toast.info('Changes discarded.');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/40">
            <h2 className="text-2xl font-black text-slate-900">Please login first</h2>
            <p className="mt-3 text-slate-500 font-medium">
              You need an account session to access provider profile.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-12 items-center rounded-xl bg-[#2286BE] px-6 font-bold text-white"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (role !== 'provider') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/40">
            <h2 className="text-2xl font-black text-slate-900">This page is only for provider role.</h2>
            <p className="mt-3 text-slate-500 font-medium">You are currently using client mode.</p>
            <Link
              href="/client/profile"
              className="mt-6 inline-flex h-12 items-center rounded-xl bg-[#2286BE] px-6 font-bold text-white"
            >
              Open Client Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-80 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 text-center sticky top-24"
            >
              <div className="relative inline-block mb-6 group">
                <Avatar className="h-32 w-32 border-4 border-[#2286BE]/10 ring-2 ring-white">
                  <AvatarImage src={avatar} />
                  <AvatarFallback className="bg-slate-200 text-slate-500">
                    <User size={44} />
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  disabled={isUploadingAvatar}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 h-10 w-10 bg-[#2286BE] text-white rounded-full border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isUploadingAvatar ? <span className="text-[10px] font-black">...</span> : <Camera size={18} />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} />
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{contactName || user.name}</h2>
              <p className="text-sm font-bold text-[#2286BE] uppercase tracking-widest mt-1">Verified Provider</p>

              <div className="mt-10 space-y-2">
                {[
                  { id: 'profile', icon: <Briefcase size={18} />, label: 'Business Profile' },
                  { id: 'business', icon: <User size={18} />, label: 'Service Details' },
                  { id: 'payouts', icon: <Banknote size={18} />, label: 'Payout Info' },
                  { id: 'billing', icon: <CreditCard size={18} />, label: 'Billing & Stripe' },
                  { id: 'security', icon: <Shield size={18} />, label: 'Security' },
                  { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-[#2286BE]/10 text-[#2286BE] shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
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
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="w-full text-red-500 hover:bg-red-50 hover:text-red-700 font-bold rounded-2xl h-12"
                >
                  <LogOut size={18} className="mr-3" /> Sign Out
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
              <div className="p-8 md:p-12 space-y-8">
                {activeTab === 'profile' && (
                  <>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Business Profile</h3>
                      <p className="text-slate-500 font-medium">
                        Manage how your business appears to clients.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Contact Name</label>
                        <div className="relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <Input
                            value={contactName}
                            onChange={(e) => setContactNameDraft(e.target.value)}
                            className="h-14 pl-12 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Business Email</label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <Input
                            value={user.email}
                            readOnly
                            className="h-14 pl-12 rounded-xl border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Bio / Business Motto</label>
                        <textarea
                          value={businessBio}
                          onChange={(e) => setBioDraft(e.target.value)}
                          placeholder="Describe your business, style, and why clients should choose you."
                          className="w-full h-32 rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-[#2286BE] focus:border-transparent outline-none font-medium resize-none"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Experience Level</label>
                        <div className="relative">
                          <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <select
                            value={experienceLevel}
                            onChange={(e) => setExperienceDraft(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#2286BE] outline-none font-bold bg-white"
                          >
                            <option value="">Select experience</option>
                            <option value="Beginner (0-1 Years)">Beginner (0-1 Years)</option>
                            <option value="Intermediate (2-4 Years)">Intermediate (2-4 Years)</option>
                            <option value="Advanced (5-7 Years)">Advanced (5-7 Years)</option>
                            <option value="Expert (8+ Years)">Expert (8+ Years)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Service City</label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleUseCurrentLocation}
                            className="rounded-xl font-bold border-slate-200"
                          >
                            <Navigation size={16} className="mr-2" />
                            {isResolvingCity ? 'Locating...' : 'Use Current Location'}
                          </Button>
                        </div>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <Input
                            value={serviceCity}
                            onChange={(e) => setServiceCityDraft(e.target.value)}
                            className="h-14 pl-12 rounded-xl border-slate-200 focus-visible:ring-[#2286BE] font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Service Area Map</p>
                        {mapboxToken ? (
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isResolvingCity}
                            onClick={handleSetCenterAsServiceCity}
                            className="h-8 rounded-lg border-slate-200 px-3 text-[11px] font-black"
                          >
                            {isResolvingCity ? 'Setting...' : 'Set Center as Service City'}
                          </Button>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400">Mapbox Optional</p>
                        )}
                      </div>

                      {mapboxToken ? (
                        <MapboxLocationPicker
                          token={mapboxToken}
                          initialCenter={selectedMapCoords}
                          onCenterChange={setSelectedMapCoords}
                        />
                      ) : (
                        <div className="h-52 flex items-center justify-center text-sm text-slate-500 bg-slate-50 px-6 text-center">
                          Add `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env` to enable interactive map location picker.
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                      <Button variant="ghost" onClick={handleCancel} className="font-bold rounded-xl px-10 h-14">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveBusinessProfile}
                        disabled={isSavingProfile}
                        className="bg-[#2286BE] hover:bg-[#1b6da0] font-black rounded-xl px-12 h-14 shadow-xl shadow-[#2286BE]/20"
                      >
                        <Save size={18} className="mr-2" />
                        {isSavingProfile ? 'Saving...' : 'Save Business Profile'}
                      </Button>
                    </div>
                  </>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Security</h3>
                      <p className="text-slate-500 font-medium">Use client security tab if you need password changes.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                      <p className="text-sm text-slate-600 font-semibold">
                        Security API already available at `POST /api/profile/change-password`.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'business' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Service Details</h3>
                      <p className="text-slate-500 font-medium">Service details section is back. We can wire full service API next.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                      <p className="text-sm text-slate-700 font-semibold">Configure offered services, pricing and availability here.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'payouts' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Payout Info</h3>
                      <p className="text-slate-500 font-medium">Manage your payout account details.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                      <p className="text-sm text-slate-700 font-semibold">Payout setup UI restored placeholder.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Billing & Stripe</h3>
                      <p className="text-slate-500 font-medium">View billing methods and Stripe configuration.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                      <p className="text-sm text-slate-700 font-semibold">Billing section restored placeholder.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Notifications</h3>
                      <p className="text-slate-500 font-medium">Control provider notification preferences.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                      <p className="text-sm text-slate-700 font-semibold">Notifications section restored placeholder.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
