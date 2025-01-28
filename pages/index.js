import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import HowItWorks from "@/components/HowItWorks";
import AGXBenefits from "@/components/AGXBenefits";
import StatsAndReferral from "@/components/StatsAndRef";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <ProductsSection/>
      <HowItWorks/>
      <AGXBenefits/>
      <StatsAndReferral/>
    </div>
  );
}
