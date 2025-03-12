import Navbar from "@/landing_page_src/navbar/Navbar";
import About from "@/landing_page_src/sections/about/About";
import Contact from "@/landing_page_src/sections/contact/Contact";
import Features from "@/landing_page_src/sections/features/Features";
import Hero from "@/landing_page_src/sections/hero/Hero";
import Pricing from "@/landing_page_src/sections/pricing/Pricing";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Pricing />
      <Contact />
    </div>
  );
}
