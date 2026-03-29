'use client';

import React from 'react';
import Image from 'next/image';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 lg:py-24">
      {/* Background Texture — Using CSS opacity for subtle texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{ backgroundImage: `url('/herobg.png')` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

          {/* LEFT COLUMN: Main H1 and Search */}
          <div className="lg:col-span-7">
            <h1 className="text-[38px] font-[800] leading-[1.2] text-[#111827] sm:text-[48px]">
              You. Your Neighbors. Saving time{' '}
              and money on home services{' '}
              with <span className="text-[#2286BE]">{BRAND.name}.</span>
            </h1>

            {/* Accessible Search Bar */}
            <form
              role="search"
              aria-label="Find a home service"
              className="mt-8 flex h-[56px] w-full max-w-[580px] items-center rounded-[12px] border border-[#E0E0E0] bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="hero-search" className="sr-only">
                What do you need help with?
              </label>
              <div className="flex flex-1 items-center px-4">
                <input
                  id="hero-search"
                  type="text"
                  placeholder="What do you need help with?"
                  className="w-full bg-transparent text-[15px] text-[#333] outline-none placeholder:text-gray-400 font-medium"
                />
              </div>

              {/* Native Divider */}
              <div className="h-6 w-[1px] bg-[#E0E0E0]" aria-hidden="true" />

              <label htmlFor="hero-zip" className="sr-only">
                Zip code
              </label>
              <div className="flex items-center gap-2 px-4 whitespace-nowrap">
                <MapPin size={18} className="text-[#2286BE]" strokeWidth={2.5} aria-hidden="true" />
                <input
                  id="hero-zip"
                  type="text"
                  placeholder="Zip"
                  className="w-16 bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-gray-400 font-medium"
                  maxLength={5}
                />
              </div>

              <button
                type="submit"
                aria-label="Search for home services"
                className="flex h-full aspect-square items-center justify-center rounded-[8px] bg-[#2286BE] text-white hover:bg-[#1b6da0] transition-transform active:scale-95 shadow-md shadow-primary/20"
              >
                <Search size={20} strokeWidth={3} aria-hidden="true" />
              </button>
            </form>

            {/* Quick Link Buttons for Connections */}
            <div className="mt-8 flex flex-wrap gap-4">
               <Link href="/services">
                  <button className="h-14 px-8 bg-[#2286BE] hover:bg-[#1b6da0] text-white font-black text-[15px] uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#2286BE]/20 active:scale-95">
                     Find Services
                  </button>
               </Link>
               <Link href="/join-provider">
                  <button className="h-14 px-8 bg-white hover:bg-slate-50 text-[#2286BE] border-2 border-[#2286BE] font-black text-[15px] uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-100">
                     Join as Pro
                  </button>
               </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#2286BE] text-[#2286BE] bg-primary/5 shadow-sm"
                  aria-hidden="true"
                >
                  <Clock size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111827] leading-none">24H</p>
                  <p className="text-[13px] text-gray-400 font-medium leading-none mt-1">Availability</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#2286BE] text-[#2286BE] bg-primary/5 shadow-sm"
                  aria-hidden="true"
                >
                  <MapPin size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111827] leading-none">Local</p>
                  <p className="text-[13px] text-gray-400 font-medium leading-none mt-1">Professionals</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#2286BE] text-[#2286BE] bg-primary/5 shadow-sm"
                  aria-hidden="true"
                >
                  <Calendar size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111827] leading-none">Flexible</p>
                  <p className="text-[13px] text-gray-400 font-medium leading-none mt-1">Appointments</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Image Collage */}
          <div className="lg:col-span-5 hidden sm:grid grid-cols-2 gap-3">
            <div className="relative h-[200px] sm:h-[220px] overflow-hidden rounded-[20px] shadow-xl shadow-slate-200/50">
              <Image
                src="/hero1.png"
                alt="Reliable plumber fixing sink leakage"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative row-span-2 h-[420px] sm:h-[450px] overflow-hidden rounded-[20px] shadow-2xl shadow-slate-200/60">
              <Image
                src="/hero3.png"
                alt="Skilled handyman at work"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="relative h-[200px] sm:h-[220px] overflow-hidden rounded-[20px] shadow-xl shadow-slate-200/50">
              <Image
                src="/hero2.png"
                alt="Detail oriented cleaning technician"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
