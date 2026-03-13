'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: 'Mike taylor',
      location: 'Lahore, Pakistan',
      text: 'Vitalii assembled the IKEA Norli drawer chest for me in less than 30 minutes, and he assembled a metal wire shelving unit as well in about 10 minutes. He also fixed a drawer on an already assembled desk so it',
      avatar: '/review.png',
      title: 'Home Owner'
    },
    {
      id: 2,
      name: 'Chris Thomas',
      location: 'New York, USA',
      text: 'Absolutely amazing service! The technician arrived on time and fixed our plumbing issue within an hour. Very professional and friendly. Will definitely use again.',
      avatar: '/review.png',
      title: 'CEO of Red Button'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      location: 'Chicago, USA',
      text: 'Great experience overall. The cleaning team did a fantastic job and left our home spotless. Booking was easy and the pricing was very transparent.',
      avatar: '/review.png',
      title: 'Product Designer'
    },
  ];

  // Logic to get the "Next" review for the back card
  const nextIndex = (currentIndex + 1) % reviews.length;
  
  const currentReview = reviews[currentIndex];
  const backReview = reviews[nextIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full bg-[#EEF4F8] py-20 lg:py-24 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-[60px] lg:flex-row lg:items-center">
          
          {/* LEFT COLUMN: Heading & Nav */}
          <div className="w-full lg:w-[45%]">
            <h2 className="text-[40px] font-[800] leading-[1.2] text-[#1A1A1A] sm:text-[44px]">
              What people say <br />
              <span className="text-[#1A73E8]">about Us.</span>
            </h2>
            
            <p className="mt-5 max-w-[340px] text-[15px] leading-[1.6] text-[#6B7280]">
              Our Clients send us bunch of smilies with our services and we love them.
            </p>

            {/* Navigation Arrows */}
            <div className="mt-10 flex items-center gap-4">
              <button 
                onClick={handlePrev}
                className="flex h-[44px] w-[44px] items-center justify-center rounded-full border-[1.5px] border-[#D1D5DB] bg-white text-[#6B7280] transition-all hover:border-[#1A73E8] hover:text-[#1A73E8] shadow-sm"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={handleNext}
                className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#1A73E8] text-white transition-all hover:bg-[#1558B0] shadow-md"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Pixel Perfect Stacked Cards */}
          <div className="relative w-full lg:w-[55%] flex justify-center lg:justify-start pt-10">
            <div className="relative w-full max-w-[440px]">
              
              {/* BACK CARD (Next Item Preview) */}
              <div className="absolute top-[40px] left-[40px] z-0 w-full rounded-[16px] border border-[#E5E7EB]/50 bg-white/80 p-[24px_32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] blur-[0.5px] mt-30">
                <div className="opacity-40">
                   <p className="text-[14px] leading-[1.6] text-transparent select-none">
                     {/* Placeholder to maintain height exactly like front card */}
                     {currentReview.text.substring(0, 100)}...
                   </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-[15px] font-[700] text-[#1A1A1A]">
                    {backReview.name}
                  </h4>
                  <p className="mt-1 text-[13px] text-[#6B7280]">
                    {backReview.title || backReview.location}
                  </p>
                </div>
              </div>


              <div className="relative z-10 w-full rounded-[16px] bg-white p-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 ease-in-out">
  {/* Overlapping Avatar - Pixel Perfect update */}
  <div className="absolute -top-[35px] -left-[25px] z-30">
    {/* Outer Pink/Red Ring */}
    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full  bg-white p-[3px] shadow-lg">
      {/* Inner White Border & Image Container */}
      <div className="relative h-full w-full overflow-hidden rounded-full border-[2px] border-white">
        <Image
          src={currentReview.avatar}
          alt={currentReview.name}
          fill
          className="object-cover"
        />
      </div>
    </div>
  </div>

  {/* Testimonial Text */}
  <div className="mt-8"> {/* Increased margin to clear the larger avatar */}
    <p className="text-[15px] font-[400] leading-[1.8] text-[#1A1A1A]">
      {currentReview.text}
    </p>
    
    <div className="mt-8">
      <h4 className="text-[16px] font-[700] text-[#1A1A1A] leading-none">
        {currentReview.name}
      </h4>
      <p className="mt-2 text-[13px] font-[500] text-[#6B7280]">
        {currentReview.location}
      </p>
    </div>
  </div>
</div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;