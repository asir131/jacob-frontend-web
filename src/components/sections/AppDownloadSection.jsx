import Image from 'next/image';

/**
 * HeroSection Component
 * Exactly matches the layout, typography, and overlapping phone effect of the screenshot.
 * * @param {string} bgImage - URL for the light wood texture background
 * @param {string} phoneImage - URL for the mobile app UI screenshot
 */
export default function HeroSection({ 
  bgImage = '/appDownloadbg.png', 
  phoneImage = '/appDownloadFront.png' 
}) {
  return (
    <section 
      className="relative w-full min-h-[500px] flex items-center overflow-hidden bg-cover bg-center px-8 md:px-16 lg:px-32"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center">
        
        {/* LEFT COLUMN: Phone Mockup */}
        {/* We use translate-y to push the phone down so it "crops" at the section bottom */}
        <div className="relative order-2 md:order-1 flex justify-center items-end self-end pt-12">
          <div className="relative w-full max-w-[450px]">
            <Image 
              src={phoneImage} 
              alt="App UI Mockup" 
              width={450}
              height={900}
              priority
              className="w-full h-auto object-contain translate-y-8 md:translate-y-16 drop-shadow-xl"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="order-1 md:order-2 flex flex-col py-16 md:py-24">
          <div className="space-y-4">
            {/* Small uppercase label */}
           
            
            {/* Main Heading */}
            <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#102A43] leading-[1.1] max-w-lg">
              The one app you need to get{' '}
              <span className="text-[#2196F3]">everything done.</span>
            </h1>

            {/* Subtext */}
            <p className="text-gray-500 text-base md:text-lg max-w-md leading-snug">
              Take Project name with you, on your phone. Find, book and manage your Home services all in one place.
            </p>

            {/* App Download Buttons */}
            <div className="flex flex-row flex-wrap gap-3 pt-6">
              {/* App Store */}
              <a href="#" className="inline-block transition-opacity hover:opacity-80">
                <div className="bg-black text-white flex items-center px-4 py-2 rounded-lg border border-gray-800">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-medium leading-none">Download on the</span>
                    <span className="text-lg font-bold leading-tight tracking-tight">App Store</span>
                  </div>
                </div>
              </a>

              {/* Google Play */}
              <a href="#" className="inline-block transition-opacity hover:opacity-80">
                <div className="bg-black text-white flex items-center px-4 py-2 rounded-lg border border-gray-800">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-medium leading-none">GET IT ON</span>
                    <span className="text-lg font-bold leading-tight tracking-tight">Google Play</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
