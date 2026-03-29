'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
  id: number;
  title: string;
  active: boolean;
  image: string;
}

export default function ServicesSection() {
  const services: Service[] = [
    { id: 1, title: 'Appliance Repairs', active: true, image: '/service1.png' },
    { id: 2, title: 'House Cleaning', active: false, image: '/service2.png' },
    { id: 3, title: 'Window Washing', active: false, image: '/service1.png' },
    { id: 4, title: 'Bathroom Remodeling', active: false, image: '/service3.png' },
    { id: 5, title: 'Landscaping Design', active: false, image: '/service1.png' },
    { id: 6, title: 'TV Mounting', active: false, image: '/service4.png' },
  ];

  const description = "Drain pipe leaking, pipe clogged, or need a full pipeline replacement — we handle it all with precision.";

  return (
    <section className="relative w-full py-20 lg:py-24 overflow-hidden bg-[#FFFFFF]">
      {/* Dynamic Background Gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, #E8F4F8 0%, #FFFFFF 60%)', opacity: 0.6 }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[38px] font-black text-slate-900 sm:text-[44px] tracking-tight">
            Our Quality Services
          </h2>
          <p className="mt-4 mx-auto max-w-[500px] text-[15px] sm:text-[16px] leading-[1.6] text-slate-500 font-medium">
            From leaking pipes to lost keys or landscaping, our verified professionals are ready to help you keep your home in perfect shape.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className={`group relative flex flex-col rounded-[24px] bg-white p-5 border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2286BE]/10 ${
                service.active
                ? 'border-[#2286BE]/20 ring-1 ring-[#2286BE]/20 shadow-[0_12px_40px_rgba(34,134,190,0.1)]'
                : 'border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]'
              }`}
            >
              {/* Premium Image Container */}
              <div className="relative h-[200px] w-full overflow-hidden rounded-[18px]">
                <Image
                  src={service.image}
                  alt={`${service.title} professional service`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Active Indicator Badge */}
                {service.active && (
                  <div className="absolute top-3 right-3 bg-[#2286BE] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    Featured
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="mt-5 px-1">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-[#2286BE] transition-colors leading-tight">
                  {service.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-slate-500 font-medium">
                  {description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                   <div className="flex gap-1.5">
                      <div className="h-1.5 w-6 rounded-full bg-[#2286BE]" />
                      <div className="h-1.5 w-2 rounded-full bg-slate-100" />
                   </div>
                   <Link href="/services" className="text-[13px] font-black text-[#2286BE] uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Learn More
                   </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Explore More CTA */}
        <div className="mt-12 flex justify-center lg:mt-20">
          <Link
            href="/services"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-10 py-4 font-black transition-all hover:scale-105 active:scale-95 bg-white border-2 border-[#2286BE] text-[#2286BE] shadow-xl shadow-[#2286BE]/10"
          >
            <span className="relative text-base uppercase tracking-widest">Explore More Services</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
