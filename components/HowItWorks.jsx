import React from 'react';
import Image from 'next/image';
import { Coins, Wallet, HandCoins, Gift } from 'lucide-react';

const steps = [
  {
    title: 'Prepare the tokens',
    description: 'Have or buy the participating farming tokens.',
    icon: Coins,
    iconBg: 'bg-black'
  },
  {
    title: 'Connect wallet',
    description: 'Connect your wallet to the launchpool.',
    icon: Wallet,
    iconBg: 'bg-green-600'
  },
  {
    title: 'Stake',
    description: 'Place AGX or USDT—50% each of your investment packages. Your investment tokens must be 50% AGX and 50% USDT in whatever package you choose.',
    icon: HandCoins,
    iconBg: 'bg-green-600'
  },
  {
    title: 'Get Reward',
    description: 'Withdraw 2% of your investment daily for a period of 150 days.',
    icon: Gift,
    iconBg: 'bg-black'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white font-poppins py-12 md:py-16 lg:py-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Section Header */}
            <div className="mb-8 md:mb-12 lg:mb-16">
              <div className="intro flex flex-col md:flex-row justify-between items-start md:items-end m-0">
                <div className="intro-content">
                  <span className="inline-block text-green-600 text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wider uppercase mb-2">
                    HOW IT WORKS
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mt-2 mb-4">
                    Start Earning in 4 Easy Steps
                  </h2>
                </div>
              </div>
              <p className="text-gray-600 text-base md:text-lg max-w-3xl mt-4 leading-relaxed">
                Join and Participate on multiple blockchains staking in a single click. Support 
                game by providing LP or just stake the game and get rewards.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-8 mt-8 md:mt-12">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-6 transform transition-all duration-300 hover:scale-105">
                  <div 
                    className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 ${step.iconBg} rounded-xl md:rounded-2xl 
                              flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Image - Centered */}
          <div className="lg:flex items-center justify-center h-full">
            <div className="relative w-full h-[600px] rounded-2xl ">
              <Image
                src="/hand.png"
                alt="Staking Illustration"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;