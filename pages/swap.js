"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E5E38] to-[#1E1D20]">
      <Navbar />
      
      {/* Animated Background */}
      <div className="relative min-h-screen">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating coins animation */}
          <div className="absolute top-20 left-1/4 animate-float">
            <Image src="/logo.png" alt="floating coin" width={40} height={40} />
          </div>
          <div className="absolute top-40 right-1/3 animate-float-delayed">
            <Image src="/logo.png" alt="floating coin" width={30} height={30} />
          </div>
          {/* Add more floating elements as needed */}
        </div>

        {/* Main Content */}
        <div className="container mx-auto pt-8 pb-16 px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <iframe 
              src="https://pancakeswap.finance/swap?outputCurrency=0xa2d78cb5cc4e8931dc695a24df73cb751c0aeb07&theme=dark"
              height="720px"
              width="100%"
              style={{
                border: 'none',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                background: 'rgba(31, 33, 40, 0.8)',
                backdropFilter: 'blur(12px)'
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}