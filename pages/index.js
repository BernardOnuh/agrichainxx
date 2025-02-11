import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import HowItWorks from "@/components/HowItWorks";
import AGXBenefits from "@/components/AGXBenefits";
import StatsAndReferral from "@/components/StatsAndRef";
import FAQ from "@/components/Faq";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <ProductsSection/>
      <HowItWorks/>
      <AGXBenefits/>
      <StatsAndReferral/>
      <FAQ/>
      <Footer/>
    </div>
  );
}
