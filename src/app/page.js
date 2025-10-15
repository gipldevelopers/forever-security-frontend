import HeroSection from "./components/home/hero-section";
import AboutSection from "./components/home/about-section";
import ServicesSection from "./components/home/services-section";
import Statistics from "./components/home/statistics";
import BlogSection from "./components/home/blog-section";
import Testimonials from "./components/home/testimonials";
import CtaSection from "./components/home/cta-section";
import FAQSection from "./components/home/faq-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <Statistics />
      <Testimonials />
      <FAQSection />
      <BlogSection />
      <CtaSection />
      
    </div>
  );
}