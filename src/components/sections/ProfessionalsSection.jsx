'use client';

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

const ProfessionalsSection = () => {
  const features = [
    "Repair and Installation",
    "Plumbing",
    "Maintenance",
    "Budget-friendly",
    "Home Security Services",
    "Eco-friendly solutions"
  ];

  return (
    <section className="relative w-full bg-white py-20 lg:py-24 overflow-hidden">
      {/* Background Gradient: White at top, Light Blue at bottom */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF 0%, #F0F8FF 60%, #E8F4F8 100%)'
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          
          {/* LEFT COLUMN: Content */}
          <div>
            <h2 className="text-[38px] font-[800] leading-[1.2] text-[#1A1A1A] sm:text-[44px]">
              Professional for your <br />
              home services
            </h2>
            
            <p className="mt-5 max-w-[500px] text-[16px] leading-[1.6] text-[#6B7280]">
              You need help for home care? We are home care professionals
              focused in the US region. We provide several services that
              support home services
            </p>

            {/* Feature List Grid */}
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <Check 
                    size={18} 
                    className="text-[#1A73E8]" 
                    strokeWidth={3} 
                  />
                  <span className="text-[15px] font-[500] text-[#1A73E8]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: House-Shaped Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* House Shape Container */}
              <div 
                className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] bg-[#B9E2F5] shadow-[0_8px_32px_rgba(100,180,220,0.3)]"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)'
                }}
              >
                {/* Worker Image Container with Inner Clip */}
                <div className="relative w-full h-full p-1.5"> 
                  <div 
                    className="w-full h-full overflow-hidden bg-white"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)'
                    }}
                  >
                    <Image
                      src="/professionalSection.png"
                      alt="Professionals working on a roof"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Badge */}
              {/* <div className="absolute -bottom-2 -right-2 z-20 flex h-[44px] w-[44px] items-center justify-center rounded-full border-2 border-white bg-[#E91E8C] text-white shadow-md">
                <span className="text-[18px] font-bold">J</span>
              </div> */}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfessionalsSection;