'use client';

import React from 'react';
import Image from 'next/image';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1.",
      title: "Call us anytime 24/7",
      description: "You can contact us directly, we will quickly put you in touch with our home care professionals who are ready anytime"
    },
    {
      number: "2.",
      title: "Schedule Service",
      description: "After connecting your call, our home care experts will answer your questions and provide flexible appointment times"
    },
    {
      number: "3.",
      title: "Your request is completed",
      description: "Once your technician arrives, he will diagnose the problem and provide an estimate. If you decide to continue, the technician will get to work"
    }
  ];

  return (
    <section className="relative w-full py-20 lg:py-24 overflow-hidden">
      {/* Background Gradient: Matches previous section bottom, fades to white */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, #EEF4F8 0%, #FFFFFF 100%)'
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          
          {/* LEFT COLUMN: Image with Badge Overlay */}
          <div className="relative w-full max-w-[420px] lg:w-[45%]">
            <div className="relative aspect-square w-full overflow-hidden rounded-[24px] ">
              <Image
                src="/howitworks.png"
                alt="Professional technician"
                fill
                className="object-contain"
              />
            </div>

            {/* Blue Verified Badge */}
            {/* <div 
              className="absolute right-[-24px] top-1/2 flex h-[60px] w-[60px] -translate-y-1/2 items-center justify-center bg-[#1A73E8] shadow-[0_4px_16px_rgba(26,115,232,0.4)] sm:h-[72px] sm:w-[72px]"
              style={{
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-6 w-6 sm:h-8 sm:w-8"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div> */}
          </div>

          {/* RIGHT COLUMN: Content & Steps */}
          <div className="w-full lg:w-[55%]">
            <h2 className="mb-9 text-[38px] font-[800] leading-tight text-[#1A1A1A] sm:text-[44px]">
              How Project name works?
            </h2>

            <div className="flex flex-col">
              {steps.map((step, index) => (
                <div key={index} className="w-full">
                  <div className="flex flex-row items-start gap-4 py-7 sm:gap-6">
                    {/* Step Number */}
                    <span className="min-w-[32px] text-[20px] font-[800] text-[#1A1A1A]">
                      {step.number}
                    </span>

                    {/* Step Title */}
                    <h3 className="min-w-[140px] max-w-[160px] text-[15px] font-[700] text-[#1A1A1A] sm:text-[16px]">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="flex-1 text-[14px] leading-[1.6] text-[#6B7280] sm:text-[15px]">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Divider - hidden after the last item */}
                  {index !== steps.length - 1 && (
                    <div className="h-[1px] w-full bg-[#E5E7EB]" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;