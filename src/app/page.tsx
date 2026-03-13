import AppDownloadSection from "@/components/sections/AppDownloadSection";
import BundleOfferSection from "@/components/sections/BundleOfferSection";
import FAQSection from "@/components/sections/FAQSection";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ProfessionalsSection from "@/components/sections/ProfessionalsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ServicesSection from "@/components/sections/ServicesSection";


export default function Home() {
  return (
    <div>
      
       
        
        <HeroSection></HeroSection>
      <ProfessionalsSection></ProfessionalsSection>
      <ServicesSection></ServicesSection>
      <BundleOfferSection></BundleOfferSection>
      <HowItWorksSection></HowItWorksSection>
      <ReviewsSection></ReviewsSection>
      <FAQSection></FAQSection>
      <AppDownloadSection></AppDownloadSection>
      </div>
  );
}
