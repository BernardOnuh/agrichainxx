import React from 'react';
import { LineChart, Coins, Gift, Users, Star, Wallet, Share2, TrendingUp, Award } from 'lucide-react';

const BenefitCard = ({ icon: Icon, text }) => (
  <div className="p-4 sm:p-5 lg:p-6 bg-slate-900 rounded-lg shadow-lg transition-all duration-300 hover:bg-slate-800 hover:transform hover:scale-105">
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="p-2 bg-slate-800 rounded-lg">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
      </div>
      <p className="font-poppins text-gray-200 text-xs sm:text-sm lg:text-base leading-relaxed">{text}</p>
    </div>
  </div>
);

const AGXBenefits = () => {
  const benefits = [
    {
      icon: TrendingUp,
      text: "High potential profits from AGX price growth"
    },
    {
      icon: Gift,
      text: "Free tokens and NFT, Bonuses, Rewards"
    },
    {
      icon: Coins,
      text: "Launchpool rewards"
    },
    {
      icon: Award,
      text: "High yields from staking"
    },
    {
      icon: Wallet,
      text: "Payments within the ecosystem"
    },
    {
      icon: Star,
      text: "Early access to services"
    },
    {
      icon: Share2,
      text: "Referral system"
    },
    {
      icon: Users,
      text: "Participation in community development, contributing to the overall success of the project"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 py-4 sm:py-12 lg:py-16 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-8 sm:mb-12 lg:mb-16">
          AGX Holder Privileges and Benefits
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index}
              icon={benefit.icon}
              text={benefit.text}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default AGXBenefits;