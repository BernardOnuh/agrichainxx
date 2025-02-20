import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { Rocket, LineChart, Coins, Gift, Users, Star, Wallet, Share2, TrendingUp, Award } from 'lucide-react';

const CONTRACT_ADDRESS = "0x0624034Bea7f21C9ba5668092Da4d7389B34363D";

const StatCounter = ({ end, title, prefix = '', gradient }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const increment = end / (duration / 16);
    let start = 0;

    const timer = setInterval(() => {
      start += increment;
      if (start < end) {
        setCount(Math.ceil(start));
      } else {
        setCount(end);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800
                    transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 
                      group-hover:opacity-100 blur transition-opacity duration-300`} />
      
      <div className="relative">
        <h4 className="text-gray-400 text-lg md:text-xl font-semibold mb-4 
                      group-hover:text-white transition-colors duration-300">{title}</h4>
        <p className="text-white text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text">
          {prefix}{count.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const StatsAndBenefits = () => {
  // Read contract data
  const { data: totalStakers } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: [{
      name: 'totalStakers',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ type: 'uint256' }]
    }],
    functionName: 'totalStakers',
    watch: true,
  });

  const { data: totalStaked } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: [{
      name: 'totalStaked',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ type: 'uint256' }]
    }],
    functionName: 'totalStaked',
    watch: true,
  });

  const { data: totalEarnings } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: [{
      name: 'totalEarnings',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ type: 'uint256' }]
    }],
    functionName: 'totalEarnings',
    watch: true,
  });

  // Convert contract data to display format
  const stats = [
    { 
      title: 'Number of Users', 
      end: totalStakers ? Number(totalStakers) : 0, 
      prefix: '', 
      gradient: 'from-blue-600/20 to-purple-600/20' 
    },
    { 
      title: 'Total Funds Invested', 
      end: totalStaked ? Number(formatEther(totalStaked)*2) : 0, 
      prefix: '$', 
      gradient: 'from-green-600/20 to-emerald-600/20' 
    },
    { 
      title: 'Total Earnings', 
      end: totalEarnings ? Number(formatEther(totalEarnings)) : 0, 
      prefix: '$', 
      gradient: 'from-pink-600/20 to-rose-600/20' 
    }
  ];

  const benefits = [
    { icon: TrendingUp, text: "High potential profits from AGX price growth", gradient: "from-purple-600/20 to-blue-600/20" },
    { icon: Gift, text: "Free tokens and NFT, Bonuses, Rewards", gradient: "from-green-600/20 to-emerald-600/20" },
    { icon: Coins, text: "Launchpool rewards", gradient: "from-blue-600/20 to-cyan-600/20" },
    { icon: Award, text: "High yields from staking", gradient: "from-yellow-600/20 to-amber-600/20" },
    { icon: Wallet, text: "Payments within the ecosystem", gradient: "from-pink-600/20 to-rose-600/20" },
    { icon: Star, text: "Early access to services", gradient: "from-indigo-600/20 to-violet-600/20" },
    { icon: Share2, text: "Referral system", gradient: "from-teal-600/20 to-green-600/20" },
    { icon: Users, text: "Participation in community development", gradient: "from-orange-600/20 to-red-600/20" }
  ]; 

  return (
    <div className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 font-poppins">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-900/20 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* Stats Section */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 font-semibold tracking-wide uppercase text-sm">
                Platform Statistics
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Our Growth
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400"> Numbers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <StatCounter key={index} {...stat} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="https://bibox.com/trade/AGX_USDT"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 transition-transform duration-300 
                             group-hover:scale-105" />
              <span className="relative text-white font-semibold flex items-center justify-center gap-2">
                <Coins className="w-5 h-5" />
                Trade AGX
              </span>
            </a>
            <a
              href="https://coinmarketcap.com/currencies/agricoin/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 transition-transform duration-300 
                             group-hover:scale-105" />
              <span className="relative text-white font-semibold flex items-center justify-center gap-2">
                <LineChart className="w-5 h-5" />
                Charts and Metrics
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 opacity-0 
                           group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-8 md:p-12 relative">
              <div className="relative h-[300px] md:h-[400px] w-full transform transition-transform duration-500 
                            group-hover:scale-105">
                <Image
                  src="/thumb.png"
                  alt="Referral illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-white space-y-6">
                <h2 className="text-4xl font-bold">
                  Refer a
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400"> user</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  Get access to huge set of tools to seamlessly handle your game's
                  integration with blockchain.
                </p>
                <Link 
                  href="/referral"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 
                             rounded-full font-semibold transition-all duration-300 hover:from-green-500 hover:to-green-400"
                >
                  <Rocket className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-12" />
                  Refer Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsAndBenefits;