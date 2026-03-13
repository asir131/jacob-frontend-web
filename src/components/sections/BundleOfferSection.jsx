'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

const BundleOfferSection = () => {
  const bundles = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    service: 'Window Washing',
    published: 'Published 1hr ago',
    bundle: '3-Person Bundle (1 Spot Open)',
    date: 'Service Date: jun 10, 2025',
    location: 'Street Springfield, IL 62704',
    rate: 'Standard rates est.',
    discount: '5-10% off',
    avatar1: `/bundleOffer1.png`,
    avatar2: `/bundleOffer2.png`,
  }));

  return (
    <section className="relative w-full py-20 lg:py-24 overflow-hidden">
      {/* Background Gradient: White top to match previous section, fading to soft blue */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #EEF4F8 100%)'
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-[40px] font-[800] leading-tight text-[#1A1A1A] sm:text-[44px]">
            Project name Bundle Offer
          </h2>
          <p className="mt-3 text-[15px] text-[#6B7280] font-[400]">
            Share home services with your neighborhood — collaborate and cut costs together.
          </p>
        </div>

        {/* BUNDLE OFFER CARDS GRID */}
        <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col rounded-[14px] bg-white p-[18px_20px] border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
            >
              {/* TOP ROW */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-[700] text-[#1A1A1A]">
                    {item.service}
                  </h3>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                    {item.published}
                  </p>
                </div>
                {/* <div className="relative h-[48px] w-[48px] overflow-hidden rounded-full border-2 border-[#E5E7EB]">
                  <Image
                    src={item.avatar}
                    alt="User avatar"
                    fill
                    className="object-cover"
                  />
                </div> */}
                {/* STACKED AVATARS - Exact Match */}
<div className="flex items-center">
  <div className="relative flex -space-x-4">
    {/* First Avatar (Left) */}
    <div className="relative h-[44px] w-[44px] overflow-hidden rounded-full border-[2px] border-[#1A73E8] bg-white p-[1.5px]">
      <div className="relative h-full w-full overflow-hidden rounded-full border-[2px] border-white">
        <Image
          src={item.avatar1}
          alt="User 1"
          fill
          className="object-cover"
        />
      </div>
    </div>
    
    {/* Second Avatar (Right) */}
    <div className="relative h-[44px] w-[44px] overflow-hidden rounded-full border-[2px] border-[#1A73E8] bg-white p-[1.5px]">
      <div className="relative h-full w-full overflow-hidden rounded-full border-[2px] border-white">
        <Image
          src={item.avatar2}
          alt="User 2"
          fill
          className="object-cover"
        />
      </div>
    </div>
  </div>
</div>
              </div>

              {/* MIDDLE CONTENT */}
              <div className="mt-2.5">
                <p className="text-[15px] font-[700] text-[#1A1A1A]">
                  {item.bundle}
                </p>
                <p className="text-[13px] text-[#6B7280] mt-1">
                  {item.date}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <MapPin size={14} className="text-[#1A73E8]" />
                  <span className="text-[13px] text-[#6B7280]">
                    {item.location}
                  </span>
                </div>
              </div>

              {/* BOTTOM ROW */}
              <div className="mt-4 pt-3 flex items-center justify-between ">
                <div>
                  <p className="text-[13px] font-[600] text-[#1A1A1A]">
                    {item.rate}
                  </p>
                  <p className="text-[12px] text-[#6B7280]">
                    {item.discount}
                  </p>
                </div>
                <button className="rounded-[8px] bg-[#EBF3FF] px-4 py-2 text-[13px] font-[600] text-[#1A73E8] transition-colors hover:bg-[#DBEAFE]">
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM BUTTON */}
        <div className="mt-12 flex justify-center">
          <button className="rounded-full border-[1.5px] border-[#1A73E8] px-9 py-3 text-[15px] font-[500] text-[#1A73E8] transition-all duration-300 hover:bg-[#1A73E8] hover:text-white">
            Explore more Offer
          </button>
        </div>

      </div>
    </section>
  );
};

export default BundleOfferSection;