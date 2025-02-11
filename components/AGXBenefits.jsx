import React from 'react';
import { LineChart, Coins, Gift, Users, Star, Wallet, Share2, TrendingUp, Award } from 'lucide-react';

const BenefitCard = ({ icon: Icon, text, gradient }) => (
  <div className="group relative">
    {/* Animated background */}
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 
                    group-hover:opacity-100 blur transition-opacity duration-300`} />
    
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 h-full
                    transform transition-all duration-500 group-hover:translate-y-[-4px]
                    border border-gray-800 group-hover:border-gray-700">
      <div className="flex items-start gap-4">
        {/* Icon container with animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 rounded-xl 
                        opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur" />
          <div className="relative p-3 bg-gray-800 rounded-xl group-hover:bg-gray-700 
                        transform transition-all duration-300 group-hover:rotate-6">
            <Icon className="w-6 h-6 text-green-400 transform transition-transform duration-300 
                           group-hover:scale-110" />
          </div>
        </div>

        {/* Text content */}
        <p className="font-poppins text-gray-300 text-base leading-relaxed 
                     group-hover:text-white transition-colors duration-300">
          {text}
        </p>
      </div>
    </div>
  </div>
);

const AGXBenefits = () => {
  const benefits = [
    {
      icon: TrendingUp,
      text: "High potential profits from AGX price growth",
      gradient: "from-purple-600/20 to-blue-600/20"
    },
    {
      icon: Gift,
      text: "Free tokens and NFT, Bonuses, Rewards",
      gradient: "from-green-600/20 to-emerald-600/20"
    },
    {
      icon: Coins,
      text: "Launchpool rewards",
      gradient: "from-blue-600/20 to-cyan-600/20"
    },
    {
      icon: Award,
      text: "High yields from staking",
      gradient: "from-yellow-600/20 to-amber-600/20"
    },
    {
      icon: Wallet,
      text: "Payments within the ecosystem",
      gradient: "from-pink-600/20 to-rose-600/20"
    },
    {
      icon: Star,
      text: "Early access to services",
      gradient: "from-indigo-600/20 to-violet-600/20"
    },
    {
      icon: Share2,
      text: "Referral system",
      gradient: "from-teal-600/20 to-green-600/20"
    },
    {
      icon: Users,
      text: "Participation in community development, contributing to the overall success of the project",
      gradient: "from-orange-600/20 to-red-600/20"
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 
                    py-16 lg:py-24 font-poppins overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-900/20 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-semibold tracking-wide uppercase text-sm">
              Exclusive Benefits
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            AGX Holder 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              {" "}Privileges
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock exclusive benefits and opportunities as an AGX token holder
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index}
              icon={benefit.icon}
              text={benefit.text}
              gradient={benefit.gradient}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AGXBenefits;