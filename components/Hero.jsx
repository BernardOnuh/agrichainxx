import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoRocketOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";

const HeroSection = () => {
  return (
    <section
      className="relative w-full bg-gradient-to-b from-green-600 to-black font-poppins overflow-hidden"
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container max-w-7xl mx-auto px-4 py-24 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column: Text and Buttons */}
          <div className="w-full md:w-1/2 animate-fade-in-up">
            <div className="space-y-8">
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-white/80 font-semibold text-sm tracking-wider backdrop-blur-sm">
                AGX/AGXT/USDT
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight">
                Agrichainx Launchpool and DeFi Staking
              </h1>
              
              <p className="text-blue-200/90 text-lg max-w-xl">
                Agrichainx launchpool is a non-custodial platform that lets you effortlessly stake AGX, AGXT & USDT tokens without the risks of centralized staking to provide attractive returns, profitable staking APR, and complete safety.
              </p>
              
              <p className="text-blue-200/90 font-semibold text-xl">
                Buy AGX/AGXT/USDT | Stake | Get Rewards!
              </p>
              
              <div className="flex flex-wrap gap-6">
                <Link
                  href="#explore"
                  className="group inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-green-600/50"
                >
                  <IoRocketOutline className="text-2xl mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="font-semibold">Explore</span>
                </Link>
                
                <Link
                  href="/apply"
                  className="group inline-flex items-center px-8 py-4 border-2 border-white/80 text-white rounded-full hover:bg-white hover:text-green-600 transition-all duration-300"
                >
                  <LuNotebookPen className="text-2xl mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Refer a user</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right Column: Circular Image */}
          <div className="w-full md:w-1/2 animate-fade-in-right flex justify-center items-center">
            <div className="relative group">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-600 via-blue-400 to-green-600 rounded-full blur-xl opacity-70 group-hover:opacity-100 animate-glow"></div>
              
              {/* Inner container */}
              <div className="relative aspect-square w-80 md:w-96 rounded-full overflow-hidden border-4 border-white/20">
                <Image
                  src="/herow.jpg"
                  alt="Hero"
                  width={800}
                  height={800}
                  className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110"
                  priority
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-green-600/20"></div>
              </div>
              
              {/* Decorative ring */}
              <div className="absolute -inset-2 border-2 border-white/20 rounded-full animate-spin-slow"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
    </section>
  );
};

export default HeroSection;

// Add this to your global CSS for animations
const style = {
  '.animate-spin-slow': {
    animation: 'spin 20s linear infinite'
  },
  '.animate-glow': {
    animation: 'glow 3s ease-in-out infinite alternate'
  },
  '.animate-fade-in-up': {
    animation: 'fadeInUp 1s ease-out'
  },
  '.animate-fade-in-right': {
    animation: 'fadeInRight 1s ease-out'
  },
  '.animate-blob': {
    animation: 'blob 7s infinite'
  },
  '.animation-delay-2000': {
    animationDelay: '2s'
  },
  '@keyframes fadeInUp': {
    '0%': {
      opacity: '0',
      transform: 'translateY(20px)'
    },
    '100%': {
      opacity: '1',
      transform: 'translateY(0)'
    }
  },
  '@keyframes fadeInRight': {
    '0%': {
      opacity: '0',
      transform: 'translateX(20px)'
    },
    '100%': {
      opacity: '1',
      transform: 'translateX(0)'
    }
  },
  '@keyframes blob': {
    '0%': {
      transform: 'translate(0px, 0px) scale(1)'
    },
    '33%': {
      transform: 'translate(30px, -50px) scale(1.1)'
    },
    '66%': {
      transform: 'translate(-20px, 20px) scale(0.9)'
    },
    '100%': {
      transform: 'translate(0px, 0px) scale(1)'
    }
  },
  '@keyframes glow': {
    '0%': {
      opacity: '0.5',
      transform: 'scale(0.95)'
    },
    '100%': {
      opacity: '0.8',
      transform: 'scale(1.05)'
    }
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
}