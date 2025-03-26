"use client";

import Footer from "@/landing_page_src/footer/Footer";
import Navbar from "@/landing_page_src/navbar/Navbar";
import About from "@/landing_page_src/sections/about/About";
import Contact from "@/landing_page_src/sections/contact/Contact";
import Features from "@/landing_page_src/sections/features/Features";
import Hero from "@/landing_page_src/sections/hero/Hero";
import Pricing from "@/landing_page_src/sections/pricing/Pricing";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function LandingPage() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-J2YND7L37W", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center" }}>
      <GoogleAnalytics trackPageViews gaMeasurementId="G-J2YND7L37W" />

      <Navbar />
      <Hero />
      <About />
      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
