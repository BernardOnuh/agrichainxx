import React from 'react';
import Image from 'next/image';
import { Coins, Wallet, HandCoins, Gift } from 'lucide-react';

const steps = [
  {
    title: 'Prepare the tokens',
    description: 'Have or buy the participating farming tokens.',
    icon: Coins,
    iconBg: 'from-purple-600 to-blue-600'
  },
  {
    title: 'Connect wallet',
    description: 'Connect your wallet to the launchpool.',
    icon: Wallet,
    iconBg: 'from-green-600 to-emerald-600'
  },
  {
    title: 'Stake',
    description: 'Place AGX or USDT—50% each of your investment packages. Your investment tokens must be 50% AGX and 50% USDT in whatever package you choose.',
    icon: HandCoins,
    iconBg: 'from-blue-600 to-cyan-600'
  },
  {
    title: 'Get Reward',
    description: 'Withdraw 2% of your investment daily for a period of 150 days.',
    icon: Gift,
    iconBg: 'from-green-600 to-teal-600'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative bg-gradient-to-b from-white to-gray-50 font-poppins py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"/>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"/>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative">
            {/* Section Header */}
            <div className="mb-12 lg:mb-16">
              <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2 mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                <span className="text-green-600 font-semibold tracking-wide">HOW IT WORKS</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
                Start Earning in
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> 4 Easy Steps</span>
              </h2>
              
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                Join and Participate on multiple blockchains staking in a single click. Support 
                game by providing LP or just stake the game and get rewards.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="group flex items-start gap-6 p-4 rounded-2xl transition-all duration-300 
                           hover:bg-white hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="relative">
                    {/* Number indicator */}
                    <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">{index + 1}</span>
                    </div>
                    
                    {/* Icon container */}
                    <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden
                                  bg-gradient-to-br ${step.iconBg} transform transition-transform duration-500
                                  group-hover:scale-110 group-hover:rotate-3`}>
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                    translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"/>
                      
                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <step.icon className="w-10 h-10 md:w-12 md:h-12 text-white transform transition-transform 
                                            duration-500 group-hover:scale-110 group-hover:rotate-12"/>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 pt-2">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 
                                 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed group-hover:text-gray-900 
                                transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Image */}
          <div className="lg:flex items-center justify-center">
            <div className="relative w-full h-[600px] group">
              {/* Glowing effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl 
                            opacity-30 group-hover:opacity-50 blur-2xl transition-opacity duration-500"/>
              
              {/* Image container */}
              <div className="relative h-full rounded-3xl overflow-hidden transform transition-transform 
                            duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/hand.png"
                  alt="Staking Illustration"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transform transition-transform duration-700 
                           group-hover:scale-110"
                  priority
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;