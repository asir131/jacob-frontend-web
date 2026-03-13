'use client';

import React from 'react';
import Image from 'next/image';

const ServicesSection = () => {
  const services = [
    { id: 1, title: 'Appliance Repairs', active: true, image: '/service1.png' },
    { id: 2, title: 'House Cleaning', active: false, image: '/service2.png' },
    { id: 3, title: 'Window Washing', active: false, image: '/service1.png' },
    { id: 4, title: 'Bathroom Remodeling', active: false, image: '/service3.png' },
    { id: 5, title: 'Landscaping Design', active: false, image: '/service1.png' },
    { id: 6, title: 'TV Mounting', active: false, image: '/service4.png' },
  ];

  const description = "Drain pipe leaking, pipe clogged, replace the pipe line";

  return (
    <section className="relative w-full py-20 lg:py-24 overflow-hidden">
      {/* Background Gradient: Matches ProfessionalsSection bottom, fades to white */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, #E8F4F8 0%, #F5FAFC 30%, #FFFFFF 100%)'
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[38px] font-[800] text-[#1A1A1A] sm:text-[42px]">
            Our Services
          </h2>
          <p className="mt-4 mx-auto max-w-[500px] text-[15px] sm:text-[16px] leading-[1.6] text-[#6B7280]">
            You have problems with leaking pipes, broken tiles, lost keys or want
            to tidy up the trees around you, of course you need our help!
          </p>
        </div>

        {/* SERVICE CARDS GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`group relative flex flex-col rounded-[16px] bg-white p-4 border border-[#E5E7EB] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                service.active 
                ? 'border-b-[3px] border-b-[#1A73E8] shadow-[0_4px_16px_rgba(26,115,232,0.15)]' 
                : 'shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
              }`}
            >
              {/* Image Container */}
              <div className="relative h-[180px] w-full overflow-hidden rounded-[10px]">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="mt-[14px]">
                <h3 className="text-[18px] font-[700] text-[#1A1A1A]">
                  {service.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.5] text-[#6B7280]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM BUTTON */}
        <div className="mt-12 flex justify-center lg:mt-16">
          <button className="rounded-full border-[1.5px] border-[#1A73E8] px-9 py-3 text-[15px] font-[500] text-[#1A73E8] transition-all duration-300 hover:bg-[#1A73E8] hover:text-white">
            Explore more service
          </button>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;