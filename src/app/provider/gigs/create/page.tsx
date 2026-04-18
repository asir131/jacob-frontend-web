'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, MapPin, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MapboxLocationPicker from '@/components/profile/MapboxLocationPicker';
import { DEFAULT_CATEGORIES } from '@/data/categories';
import { resolveAddressFromCoordinates } from '@/lib/geocodeAddress';
import { calculateAdminFeeAmount, calculateClientPaymentAmount } from '@/lib/pricing';
import {
  useCreateGigMutation,
  useLazyGetMyGigsQuery,
  useUpdateGigMutation,
} from '@/store/services/apiSlice';

type PackageState = {
  name: string;
  title: string;
  description: string;
  deliveryTime: string;
  price: string;
};

const PACKAGE_NAMES = ['Basic', 'Standard', 'Premium'];
const INITIAL_PACKAGES: PackageState[] = PACKAGE_NAMES.map((name, index) => ({
  name,
  title: '',
  description: '',
  deliveryTime: String(index + 1),
  price: String((index + 1) * 15),
}));

const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 };
const MAX_IMAGE_COUNT = 4;

type LoadedGig = {
  _id: string;
  title?: string;
  categorySlug?: string;
  categoryName?: string;
  customCategoryName?: string;
  customCategoryDescription?: string;
  expertType?: 'solo' | 'team';
  description?: string;
  requirements?: string;
  packages?: PackageState[];
  images?: string[];
  baseCity?: string;
  locationLat?: number | null;
  locationLng?: number | null;
  travelRadiusKm?: number | null;
  status?: string;
};

export default function CreateGigPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState(1);
  const [gigTitle, setGigTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]?.slug || 'cleaning');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryDescription, setCustomCategoryDescription] = useState('');
  const [expertType, setExpertType] = useState<'solo' | 'team'>('solo');
  const [packages, setPackages] = useState<PackageState[]>(INITIAL_PACKAGES);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [gigDescription, setGigDescription] = useState('');
  const [gigRequirements, setGigRequirements] = useState('');
  const [baseCity, setBaseCity] = useState('Dhaka, Bangladesh');
  const [selectedRadius, setSelectedRadius] = useState('25');
  const [selectedMapCoords, setSelectedMapCoords] = useState(DEFAULT_CENTER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [isLoadingGig, setIsLoadingGig] = useState(false);
  const [getMyGigs] = useLazyGetMyGigsQuery();
  const [createGig] = useCreateGigMutation();
  const [updateGig] = useUpdateGigMutation();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const selectedCategoryName = useMemo(() => {
    if (isCustomCategory) return customCategoryName.trim() || 'Custom Category';
    return DEFAULT_CATEGORIES.find((category) => category.slug === selectedCategory)?.name || 'Selected Category';
  }, [customCategoryName, isCustomCategory, selectedCategory]);

  const displayedImagePreviews = useMemo(
    () => [...existingImageUrls, ...imagePreviews],
    [existingImageUrls, imagePreviews]
  );

  useEffect(() => {
    if (!editId) return;

    const loadGigForEdit = async () => {
      setIsLoadingGig(true);
      try {
        const payload = await getMyGigs().unwrap();
        if (!payload?.success) return;

        const allGigs: LoadedGig[] = [
          ...(Array.isArray(payload?.data?.publishedGigs) ? (payload.data.publishedGigs as LoadedGig[]) : []),
          ...(Array.isArray(payload?.data?.pendingRequests) ? (payload.data.pendingRequests as LoadedGig[]) : []),
        ];
        const gig = allGigs.find((item) => item._id === editId);
        if (!gig) return;

        setGigTitle(gig.title || '');
        const isExistingCustom = Boolean(gig.customCategoryName || gig.customCategoryDescription);
        setSelectedCategory(isExistingCustom ? 'create-your-own-category' : (gig.categorySlug || DEFAULT_CATEGORIES[0]?.slug || 'cleaning'));
        setIsCustomCategory(Boolean(gig.categorySlug === 'create-your-own-category' || gig.customCategoryName || gig.customCategoryDescription));
        setCustomCategoryName(gig.customCategoryName || '');
        setCustomCategoryDescription(gig.customCategoryDescription || '');
        setExpertType(gig.expertType === 'team' ? 'team' : 'solo');
        setPackages(
          (gig.packages?.length
            ? gig.packages.map((pkg, index) => ({
                name: pkg.name || PACKAGE_NAMES[index] || `Package ${index + 1}`,
                title: pkg.title || '',
                description: pkg.description || '',
                deliveryTime: pkg.deliveryTime || String(index + 1),
                price: String(pkg.price ?? ''),
              }))
            : INITIAL_PACKAGES) as PackageState[]
        );
        setExistingImageUrls(Array.isArray(gig.images) ? gig.images : []);
        setImagePreviews([]);
        setImages([]);
        setGigDescription(gig.description || '');
        setGigRequirements(gig.requirements || '');
        setBaseCity(gig.baseCity || '');
        setSelectedRadius(String(gig.travelRadiusKm || 25));
        setSelectedMapCoords({
          lat: typeof gig.locationLat === 'number' ? gig.locationLat : DEFAULT_CENTER.lat,
          lng: typeof gig.locationLng === 'number' ? gig.locationLng : DEFAULT_CENTER.lng,
        });
        setStep(1);
      } finally {
        setIsLoadingGig(false);
      }
    };

    void loadGigForEdit();
  }, [editId, getMyGigs]);

  const updatePackage = (index: number, field: keyof PackageState, value: string) => {
    setPackages((prev) => prev.map((pkg, pkgIndex) => (pkgIndex === index ? { ...pkg, [field]: value } : pkg)));
  };

  const handleImageSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remainingSlots = MAX_IMAGE_COUNT - existingImageUrls.length - images.length;
    if (remainingSlots <= 0) {
      toast.error(`You can select up to ${MAX_IMAGE_COUNT} images only.`);
      if (imageInputRef.current) imageInputRef.current.value = '';
      return;
    }

    const allowedFiles = files.slice(0, remainingSlots);
    try {
      const nextImages = allowedFiles.filter((file) => file.type.startsWith('image/'));
      if (nextImages.length !== allowedFiles.length) {
        throw new Error('Please select image files only.');
      }

      const nextPreviews = nextImages.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...nextImages]);
      setImagePreviews((prev) => [...prev, ...nextPreviews]);
    } catch {
      toast.error('Could not read selected images.');
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!gigTitle.trim()) {
        toast.error('Please add a gig title.');
        return;
      }
      if (isCustomCategory && !customCategoryName.trim()) {
        toast.error('Please enter your custom category name.');
        return;
      }
    }

    if (step === 2) {
      const incompletePackage = packages.some((pkg) => !pkg.title.trim() || !pkg.description.trim() || !pkg.deliveryTime.trim() || !pkg.price.trim());
      if (incompletePackage) {
        toast.error('Please fill title, description, delivery time, and price for all packages.');
        return;
      }
    }

    if (step === 3 && displayedImagePreviews.length < 1) {
      toast.error('Please select at least 1 image.');
      return;
    }

    if (step === 5 && !baseCity.trim()) {
      toast.error('Please set your base city/area.');
      return;
    }

    setStep((current) => Math.min(6, current + 1));
  };

  const handleBack = () => setStep((current) => Math.max(1, current - 1));

  const handleSetMyLocation = async () => {
    setIsResolvingLocation(true);
    try {
      const address = await resolveAddressFromCoordinates(
        selectedMapCoords.lat,
        selectedMapCoords.lng,
        mapboxToken
      );
      setBaseCity(address);
      toast.success('Location set successfully.');
    } catch {
      toast.error('Could not resolve location right now.');
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', gigTitle.trim());
      formData.append('categorySlug', isCustomCategory ? 'create-your-own-category' : selectedCategory);
      formData.append('categoryName', selectedCategoryName);
      formData.append('customCategoryName', isCustomCategory ? customCategoryName.trim() : '');
      formData.append('customCategoryDescription', isCustomCategory ? customCategoryDescription.trim() : '');
      formData.append('expertType', expertType);
      formData.append('description', gigDescription.trim());
      formData.append('requirements', gigRequirements.trim());
      formData.append('packages', JSON.stringify(packages.map((pkg) => ({
        name: pkg.name,
        title: pkg.title.trim(),
        description: pkg.description.trim(),
        deliveryTime: pkg.deliveryTime.trim(),
        price: Number(pkg.price) || 0,
      }))));
      formData.append('baseCity', baseCity.trim());
      formData.append('locationLat', String(selectedMapCoords.lat));
      formData.append('locationLng', String(selectedMapCoords.lng));
      formData.append('travelRadiusKm', String(Number(selectedRadius) || 0));
      formData.append('images', JSON.stringify(existingImageUrls));
      images.forEach((file) => {
        formData.append('images', file);
      });

      const payload = editId
        ? await updateGig({ id: editId, formData }).unwrap()
        : await createGig(formData).unwrap();
      if (!payload?.success) {
        toast.error(payload?.message || 'Failed to publish gig.');
        return;
      }

      if (payload?.data?.gigRequest?.status === 'pending_approval') {
        toast.success('Your gig is under admin review');
      } else if (editId) {
        toast.success('Your gig has been updated');
      } else {
        toast.success('Your gig has been published');
      }

      router.push('/provider/gigs');
    } catch {
      toast.error('Could not publish gig right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center text-slate-600 hover:text-slate-900 font-medium">
            <ChevronLeft size={20} className="mr-1" /> My Gigs
          </button>
          <div className="font-bold text-slate-800 hidden sm:block">Create New Gig</div>
          <Button variant="ghost" onClick={() => router.push('/provider/gigs')} className="text-slate-500 hover:text-red-500 px-2">
            Cancel
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-8">
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
              <div
                className={`flex flex-col items-center flex-shrink-0 w-20 cursor-pointer ${step >= s.num ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => step > s.num && setStep(s.num)}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 transition-colors ${
                    step === s.num ? 'bg-[#2286BE] text-white ring-4 ring-primary-soft' : step > s.num ? 'bg-primary-soft text-[#2286BE]' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
              {idx < 5 && <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${step > s.num ? 'bg-[#2286BE]' : 'bg-slate-100'}`} />}
            </React.Fragment>
          ))}
        </div>

          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
            {isLoadingGig ? (
              <div className="flex min-h-[420px] items-center justify-center text-sm font-semibold text-slate-500">
                Loading gig details...
              </div>
            ) : null}
            {!isLoadingGig ? (
              <>
          {step === 1 && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Gig Basics</h2>
              <div>
                <label className="text-sm font-bold text-slate-800 mb-2 block">Gig Title</label>
                <Input value={gigTitle} onChange={(e) => setGigTitle(e.target.value)} placeholder="I will do professional deep house cleaning..." className="h-14 lg:text-lg focus-visible:ring-[#2286BE]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-800 mb-2 block">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      if (value === 'create-your-own-category') {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setCustomCategoryName('');
                        setCustomCategoryDescription('');
                      }
                      setSelectedCategory(value);
                    }}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_CATEGORIES.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="create-your-own-category">Create your own category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 pt-5 mt-5 text-sm text-slate-500">
                  You can create your own category as well.
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-800 mb-3 block">Expert Type</label>
                <RadioGroup
                  value={expertType}
                  onValueChange={(value) => setExpertType(value === 'team' ? 'team' : 'solo')}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="solo" id="expert-solo" className="peer sr-only" />
                    <label
                      htmlFor="expert-solo"
                      className="flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors peer-data-[state=checked]:border-[#2286BE] peer-data-[state=checked]:bg-primary-soft"
                    >
                      <span className="text-base font-bold text-slate-900">Solo</span>
                      <span className="mt-1 text-sm text-slate-500">This service will be handled by you alone.</span>
                    </label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="team" id="expert-team" className="peer sr-only" />
                    <label
                      htmlFor="expert-team"
                      className="flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors peer-data-[state=checked]:border-[#2286BE] peer-data-[state=checked]:bg-primary-soft"
                    >
                      <span className="text-base font-bold text-slate-900">Team</span>
                      <span className="mt-1 text-sm text-slate-500">This service will be delivered with a team.</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
              {isCustomCategory && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-slate-800 mb-2 block">Custom Category Name</label>
                    <Input value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} placeholder="Example: Aquarium Cleaning" className="h-12 focus-visible:ring-[#2286BE]" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-800 mb-2 block">Custom Category Short Description</label>
                    <textarea
                      value={customCategoryDescription}
                      onChange={(e) => setCustomCategoryDescription(e.target.value)}
                      className="w-full min-h-[100px] border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-[#2286BE] outline-none text-sm"
                      placeholder="Explain what this custom category is about..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Scope & Pricing</h2>
              <p className="text-slate-500 text-sm">Offer 3 tiers of packages (Basic, Standard, Premium) to capture more clients.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((pkg, idx) => (
                  <div key={pkg.name} className="border border-slate-200 rounded-xl p-4 sm:p-6 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-lg mb-4">{pkg.name}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Title</label>
                        <Input
                          value={pkg.title}
                          onChange={(e) => updatePackage(idx, 'title', e.target.value)}
                          className="h-10 text-sm focus-visible:ring-[#2286BE]"
                          placeholder={`${pkg.name} package`}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
                        <textarea
                          value={pkg.description}
                          onChange={(e) => updatePackage(idx, 'description', e.target.value)}
                          className="w-full text-sm border border-slate-300 rounded-md p-2 h-20 resize-none focus:ring-2 focus:ring-[#2286BE] outline-none"
                          placeholder="Detail what is included..."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Delivery Time</label>
                        <Select value={pkg.deliveryTime} onValueChange={(value) => updatePackage(idx, 'deliveryTime', value)}>
                          <SelectTrigger className="h-10 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Day</SelectItem>
                            <SelectItem value="2">2 Days</SelectItem>
                            <SelectItem value="3">3 Days</SelectItem>
                            <SelectItem value="4">4 Days</SelectItem>
                            <SelectItem value="5">5 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                       <div>
                         <label className="text-xs font-semibold text-slate-500 mb-1 block">Price (USD)</label>
                         <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <Input
                            value={pkg.price}
                            onChange={(e) => updatePackage(idx, 'price', e.target.value)}
                            className="h-10 pl-8 text-sm font-bold text-slate-900 focus-visible:ring-[#2286BE]"
                            type="number"
                             min="0"
                           />
                         </div>
                         <p className="mt-2 text-[11px] font-bold text-slate-500">
                           Admin Fee ${calculateAdminFeeAmount(Number(pkg.price) || 0).toFixed(2)}.
                           Client total ${calculateClientPaymentAmount(Number(pkg.price) || 0).toFixed(2)}.
                         </p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Gallery</h2>
              <p className="text-slate-500 text-sm">Select minimum 1 and maximum 4 images.</p>
              <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelection} />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors"
              >
                <UploadCloud size={44} className="mx-auto text-[#2286BE] mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Select images</h3>
                <p className="text-sm text-slate-500 mt-2">Upload up to 4 JPG or PNG images.</p>
              </button>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayedImagePreviews.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <Image src={image} alt={`Gig preview ${index + 1}`} fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => {
                        if (index < existingImageUrls.length) {
                          setExistingImageUrls((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
                        } else {
                          const fileIndex = index - existingImageUrls.length;
                          setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== fileIndex));
                          setImagePreviews((prev) => prev.filter((_, imageIndex) => imageIndex !== fileIndex));
                        }
                      }}
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, MAX_IMAGE_COUNT - displayedImagePreviews.length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-[4/3] rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
                    Empty slot
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Description & Requirements</h2>
              <div>
                <label className="text-sm font-bold text-slate-800 mb-2 block">Briefly Describe your Gig</label>
                <textarea
                  value={gigDescription}
                  onChange={(e) => setGigDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-[#2286BE] outline-none min-h-[150px] text-sm"
                  placeholder="Hi, I am an expert with 5 years of experience..."
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-800 mb-2 block">Requirements from the Client</label>
                <p className="text-xs text-slate-500 mb-2">Tell your buyer what you need in order to begin work (e.g. access to water, specific address details, etc).</p>
                <textarea
                  value={gigRequirements}
                  onChange={(e) => setGigRequirements(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-[#2286BE] outline-none min-h-[100px] text-sm"
                  placeholder="I need clear access to the premises and..."
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Coverage Area</h2>
              <p className="text-slate-500 text-sm">Define where you can travel and provide the service.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label className="text-sm font-bold text-slate-800 block">Base City/Area</label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSetMyLocation}
                        disabled={isResolvingLocation}
                        className="h-9 rounded-lg border-slate-200 px-3 text-[11px] font-black"
                      >
                        {isResolvingLocation ? 'Setting...' : 'Set My Location'}
                      </Button>
                    </div>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input value={baseCity} onChange={(e) => setBaseCity(e.target.value)} className="h-12 pl-10 focus-visible:ring-[#2286BE]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-800 mb-2 block">Maximum Travel Radius</label>
                    <RadioGroup value={selectedRadius} onValueChange={setSelectedRadius} className="grid grid-cols-2 gap-3">
                      {['5', '10', '25', '50'].map((radius) => (
                        <div key={radius} className="relative">
                          <RadioGroupItem value={radius} id={`rad-${radius}`} className="peer sr-only" />
                          <label
                            htmlFor={`rad-${radius}`}
                            className="flex items-center justify-center p-3 font-semibold text-slate-600 border border-slate-200 rounded-lg cursor-pointer peer-data-[state=checked]:border-[#2286BE] peer-data-[state=checked]:bg-primary-soft peer-data-[state=checked]:text-[#2286BE] hover:bg-slate-50 transition-colors"
                          >
                            Within {radius} km
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden min-h-[280px]">
                  {mapboxToken ? (
                    <MapboxLocationPicker token={mapboxToken} initialCenter={selectedMapCoords} onCenterChange={setSelectedMapCoords} />
                  ) : (
                    <div className="h-full min-h-[280px] flex items-center justify-center bg-slate-50 text-sm text-slate-500 px-6 text-center">
                      Add `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env` to enable the interactive location picker.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-10">
              <div className="mx-auto w-24 h-24 bg-primary-soft rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Check size={48} className="text-[#2286BE]" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">You&apos;re almost there!</h2>
              <p className="text-slate-500 max-w-md mx-auto text-lg mb-8">Review everything once before publishing.</p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-2xl mx-auto mb-8 shadow-sm space-y-2 text-sm text-slate-600">
                <div className="flex justify-between gap-4"><span>Title:</span> <span className="font-semibold text-slate-900 text-right">{gigTitle || 'Untitled Gig'}</span></div>
                <div className="flex justify-between gap-4"><span>Category:</span> <span className="font-semibold text-slate-900 text-right">{selectedCategoryName}</span></div>
                <div className="flex justify-between gap-4"><span>Packages:</span> <span className="font-semibold text-slate-900 text-right">{packages.length} tiers</span></div>
                <div className="flex justify-between gap-4"><span>Expert Type:</span> <span className="font-semibold text-slate-900 text-right">{expertType === 'team' ? 'Team' : 'Solo'}</span></div>
                <div className="flex justify-between gap-4"><span>Images:</span> <span className="font-semibold text-slate-900 text-right">{displayedImagePreviews.length} selected</span></div>
                <div className="flex justify-between gap-4"><span>Location:</span> <span className="font-semibold text-slate-900 text-right">{baseCity}</span></div>
                <div className="flex justify-between gap-4"><span>Radius:</span> <span className="font-semibold text-slate-900 text-right">{selectedRadius} km</span></div>
              </div>
            </div>
          )}
              </>
            ) : null}
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={handleBack} className={`w-32 py-6 font-bold text-slate-600 ${step === 1 ? 'invisible' : ''}`}>
            Back
          </Button>
          {step < 6 ? (
            <Button onClick={handleNext} className="w-32 py-6 font-bold bg-[#2286BE] hover:bg-[#059669] text-white">
              Save & Next <ChevronRight size={18} className="ml-1" />
            </Button>
          ) : (
            <Button onClick={handlePublish} disabled={isSubmitting} className="w-48 py-6 font-bold bg-[#2286BE] hover:bg-[#059669] shadow-lg text-white text-lg">
              {isSubmitting ? (editId ? 'Updating...' : 'Publishing...') : editId ? 'Update Gig Now' : 'Publish Gig Now'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
