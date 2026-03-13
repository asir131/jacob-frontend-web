'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  // First item open by default per requirements
  const [openId, setOpenId] = useState(1);

  const faqs = [
    {
      id: 1,
      question: 'What is Project name?',
      answer: 'HomePro is a home care platform that connects homeowners with professional service providers offering a wide range of home services, including repairs, maintenance, cleaning, and more.',
    },
    {
      id: 2,
      question: 'Are the service providers on Project name reliable and qualified?',
      answer: 'Yes, all service providers on our platform go through a thorough vetting process including background checks, license verification, and skills assessment to ensure quality and reliability.',
    },
    {
      id: 3,
      question: 'What if I have an issue or complaint about a service provider?',
      answer: 'You can report any issues directly through our platform. Our support team reviews all complaints within 24 hours and works to resolve disputes fairly for both parties.',
    },
    {
      id: 4,
      question: 'How are payments handled on Project name?',
      answer: 'All payments are processed securely through our platform. You are only charged after the service is completed to your satisfaction, and we support multiple payment methods.',
    },
    {
      id: 5,
      question: 'How do I leave a review for a service provider?',
      answer: 'After your service is completed, you will receive a notification prompting you to leave a review. You can rate your experience and write feedback directly from your dashboard.',
    },
  ];

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-20">
          
          {/* LEFT COLUMN: Title & Help Link */}
          <div className="w-full lg:sticky lg:top-24 lg:w-[35%]">
            <h2 className="text-[38px] font-[800] leading-[1.2] text-[#1A1A1A] sm:text-[42px]">
              Frequently Asked <br />
              Questions
            </h2>
            <div className="mt-6">
              <span className="text-[15px] font-[400] text-[#6B7280]">
                Still need help?{' '}
              </span>
              <button className="text-[15px] font-[700] text-[#1A73E8] hover:underline">
                Get Help Now
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Accordion FAQ Items */}
          <div className="w-full lg:w-[65%]">
            <div className="flex flex-col">
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                
                return (
                  <div 
                    key={faq.id} 
                    className={`transition-all duration-300 border-b border-[#E5E7EB] last:border-0 ${
                      isOpen 
                        ? 'bg-[#F3F6FA] rounded-[10px] px-6 py-5 my-2 border-transparent' 
                        : 'py-[22px]'
                    }`}
                  >
                    {/* Header Row */}
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="flex w-full items-start justify-between text-left focus:outline-none cursor-pointer"
                    >
                      <span className={`text-[16px] font-[700] leading-[1.4] pr-4 transition-colors  ${
                        isOpen ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'
                      }`}>
                        {faq.question}
                      </span>
                      <div className="mt-1 flex-shrink-0">
                        {isOpen ? (
                          <ChevronUp size={22} className="text-[#1A1A1A]" />
                        ) : (
                          <ChevronDown size={22} className="text-[#1A1A1A]" />
                        )}
                      </div>
                    </button>

                    {/* Answer Content */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-height-100 opacity-100' : 'max-height-0 opacity-0'
                      }`}
                      style={{ 
                        maxHeight: isOpen ? '200px' : '0px',
                        marginTop: isOpen ? '10px' : '0px'
                      }}
                    >
                      <p className="text-[14px] leading-[1.7] font-[400] text-[#6B7280]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;