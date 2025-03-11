import Navbar from "@/landing_page_src/navbar/Navbar";
import About from "@/landing_page_src/sections/about/About";
import Hero from "@/landing_page_src/sections/hero/Hero";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
    </div>
  );
}
