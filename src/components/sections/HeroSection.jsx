'use client';

import React from 'react';
import Image from 'next/image';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden  py-20 lg:py-24">
      {/* Background Texture: Subtle Radial Dots */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: `url('/herobg.png')`,
        
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* LEFT COLUMN: ~55% width */}
          <div className="lg:col-span-7">
            <h1 className="text-[42px] font-[800] leading-[1.2] text-[#111827] sm:text-[48px]">
              You. Your Neighbors. Saving time <br />
              and money on home services <br />
              with <span className="text-[#1A73E8]">Project Name.</span>
            </h1>

            {/* Search Bar */}
            <div className="mt-8 flex h-[56px] w-full max-w-[580px] items-center rounded-[12px] border border-[#E0E0E0] bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="flex flex-1 items-center px-4">
                <input
                  type="text"
                  placeholder="What do you need help With?"
                  className="w-full bg-transparent text-[15px] text-[#333] outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Vertical Divider */}
              <div className="h-6 w-[1px] bg-[#E0E0E0]" />

              <div className="flex items-center gap-2 px-4 whitespace-nowrap">
                <MapPin size={18} className="text-[#1A73E8]" strokeWidth={2.5} />
                <span className="text-[15px] text-gray-400">Zip code</span>
              </div>

              <button className="flex h-full aspect-square items-center justify-center rounded-[8px] bg-[#1A73E8] text-white transition-colors hover:bg-[#1558B0]">
                <Search size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Feature Badges */}
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              {/* Badge 1 */}
              <div className="flex items-center gap-3">
                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#1A73E8] text-[#1A73E8]">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111827] leading-none">24H</p>
                  <p className="text-[13px] text-gray-500 leading-none mt-1">Availability</p>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center gap-3">
                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#1A73E8] text-[#1A73E8]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111827] leading-none">Local US</p>
                  <p className="text-[13px] text-gray-500 leading-none mt-1">Professional</p>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center gap-3">
                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#1A73E8] text-[#1A73E8]">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111827] leading-none">Flexible</p>
                  <p className="text-[13px] text-gray-500 leading-none mt-1">Appointments</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Image Collage (~45% width) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {/* Image 1: Top Left (Plumber) */}
              <div className="relative h-[220px] overflow-hidden rounded-[12px]">
                <Image
                  src="/hero1.png"
                  alt="Plumber service"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Image 2: Right Side Tall (Handyman) */}
              <div className="relative row-span-2 h-[450px] overflow-hidden rounded-[12px]">
                <Image
                  src="/hero3.png"
                  alt="Handyman"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Image 3: Bottom Left (Cleaning) */}
              <div className="relative h-[220px] overflow-hidden rounded-[12px]">
                <Image
                  src="/hero2.png"
                  alt="Cleaner"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;