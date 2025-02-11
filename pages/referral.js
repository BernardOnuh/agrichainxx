import React, { useState } from 'react';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Copy, Share2, Gift, TrendingUp, ArrowRight } from 'lucide-react';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://agrichainx.com/ref/YOUR_ID"; // Replace with actual referral link

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tiers = [
    {
      level: "1st Level",
      percentage: "5%",
      description: "Direct referral bonus from initial stake",
      icon: Users,
      gradient: "from-green-600 to-green-500"
    },
    {
      level: "2nd Level",
      percentage: "3%",
      description: "Bonus from your referral's referrals",
      icon: Share2,
      gradient: "from-blue-600 to-blue-500"
    },
    {
      level: "3rd Level",
      percentage: "2%",
      description: "Bonus from extended network referrals",
      icon: Gift,
      gradient: "from-purple-600 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-900/20 rounded-full 
                         mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full 
                         mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center space-x-2 bg-green-500/10 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold tracking-wide">Referral Program</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Earn Rewards by
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  {" "}Inviting Friends
                </span>
              </h1>
              <p className="text-gray-300 text-lg">
                Join our multi-level referral program and earn up to 10% in commissions across three tiers. 
                The more friends you bring, the more you earn!
              </p>
              
              {/* Referral Link Box */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 space-y-4 border border-gray-700">
                <h3 className="font-semibold text-white">Your Referral Link</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-gray-900 rounded-xl px-4 py-3 text-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[500px]">
              <Image
                src="/thumb.png"
                alt="Referral Program"
                width={600}
                height={500}
                className="rounded-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-20 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Three-Tier
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                {" "}Reward System
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our multi-level referral program rewards you not just for direct referrals, 
              but also for growing your network through multiple tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${tier.gradient} rounded-2xl opacity-0 
                                group-hover:opacity-100 blur transition-opacity duration-300`} />
                
                <div className="relative bg-gray-800 rounded-2xl p-8 h-full border border-gray-700
                              transform transition-all duration-500 group-hover:translate-y-[-4px]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{tier.level}</h3>
                    <tier.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-3xl font-bold text-white">{tier.percentage}</p>
                    <p className="text-gray-300">{tier.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-white">
                  How the
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                    {" "}Program Works
                  </span>
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Share Your Link</h3>
                      <p className="text-gray-300">Copy your unique referral link and share it with friends</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Friends Join & Stake</h3>
                      <p className="text-gray-300">When they join and stake through your link, you earn rewards</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Earn Multi-Level Rewards</h3>
                      <p className="text-gray-300">Get rewards from their referrals too - up to 3 levels deep</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/herow.jpg"
                  alt="How it works"
                  width={500}
                  height={400}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}