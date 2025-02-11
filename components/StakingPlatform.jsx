import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { stakingABI } from './abi';
import { Lock, Timer, Users, Wallet, TrendingUp, Gift } from 'lucide-react';

// You'll need to import your contract ABI and address
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const USDT_ADDRESS = "USDT_CONTRACT_ADDRESS";
const AGX_ADDRESS = "AGX_CONTRACT_ADDRESS";

const StakingPlatform = () => {
  const { address } = useAccount();
  const [stakingAmount, setStakingAmount] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('150');

  // Contract reads
  const { data: stakingInfo } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: stakingABI,
    functionName: 'getStakingInfo',
    args: [address],
    watch: true,
  });

  const { data: contractBalances } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: stakingABI,
    functionName: 'getContractBalances',
    watch: true,
  });

  // Staking write function
  const { write: stake, data: stakeData } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: stakingABI,
    functionName: 'stake',
  });

  // Claim rewards write function
  const { write: claimRewards, data: claimData } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: stakingABI,
    functionName: 'claimRewards',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-poppins">
      {/* Breadcrumb */}
 

      {/* Main Staking Area */}
      <div className="container mx-auto px-4 py-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Stake AGX/USDT</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Your Balance</p>
                  <p className="text-lg font-semibold text-green-500">
                    {stakingInfo?.stakedAmount ? formatEther(stakingInfo.stakedAmount) : '0.00'} USDT
                  </p>
                </div>
              </div>

              {/* Duration Tabs */}
              <div className="flex space-x-4 mb-8">
                {['150'].map((days) => (
                  <button
                    key={days}
                    onClick={() => setSelectedDuration(days)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedDuration === days
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>

              {/* Staking Info */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 mb-2">Lock Period</p>
                      <p className="text-xl font-bold text-white">{selectedDuration} Days</p>
                    </div>
                    <Lock className="text-green-500" />
                  </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-400 mb-2">APY</p>
                      <p className="text-xl font-bold text-white">200%</p>
                    </div>
                    <TrendingUp className="text-green-500" />
                  </div>
                </div>
              </div>

              {/* Staking Form */}
              <div className="space-y-6">
                {/* Stake Input */}
                <div className="relative">
                  <input
                    type="number"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    placeholder="Enter amount to stake"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => setStakingAmount('1000')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-500 font-semibold"
                  >
                    MAX
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => stake?.()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                  >
                    Stake
                  </button>
                  <button
                    onClick={() => claimRewards?.()}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                  >
                    Claim Rewards
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Total Value Locked</p>
                  <p className="text-2xl font-bold text-white">
                    ${contractBalances?.usdtBalance ? formatEther(contractBalances.usdtBalance) : '0.00'}
                  </p>
                </div>
                <Wallet className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Your Staked Amount</p>
                  <p className="text-2xl font-bold text-white">
                    ${stakingInfo?.stakedAmount ? formatEther(stakingInfo.stakedAmount) : '0.00'}
                  </p>
                </div>
                <Lock className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Pending Rewards</p>
                  <p className="text-2xl font-bold text-white">
                    ${stakingInfo?.pendingRewards ? formatEther(stakingInfo.pendingRewards) : '0.00'}
                  </p>
                </div>
                <Gift className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Total Stakers</p>
                  <p className="text-2xl font-bold text-white">6,997</p>
                </div>
                <Users className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Time Left</p>
                  <p className="text-2xl font-bold text-white">14d 22h 15m</p>
                </div>
                <Timer className="text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPlatform;