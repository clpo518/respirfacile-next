import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { MethodSection } from "@/components/landing/MethodSection";
import { ProSection } from "@/components/landing/ProSection";
import { FounderSection } from "@/components/landing/FounderSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

// This page is a React Server Component — fully SSR, great for SEO
export default function HomePage() {
  return (
    <div className="w-full">
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <ProblemSection />
        <MethodSection />
        <ProSection />
        <FounderSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
