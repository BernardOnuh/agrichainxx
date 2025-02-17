import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { stakingABI } from './abi';
import { Lock, Users, Gift, ArrowDown } from 'lucide-react';
import { erc20ABI } from './erc20ABI';

const CONTRACT_ADDRESS = "0xAE174F35CeA7f74d29200996Cb2CB0C4E2077148";
const USDT_ADDRESS = "0x55d398326f99059ff775485246999027b3197955";
const AGX_ADDRESS = "0xa2d78cb5cc4e8931dc695a24df73cb751c0aeb07";
const AGX_TO_USDT_RATIO = 1000; // 1 USDT = 1000 AGX
const MIN_AGX = 10000; // Minimum AGX to stake
const MIN_USDT = 10; // Minimum USDT to stake

const StakingPlatform = () => {
  const { address } = useAccount();
  const [agxAmount, setAgxAmount] = useState('');
  const [usdtEquivalent, setUsdtEquivalent] = useState('0');
  const [referrerAddress, setReferrerAddress] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log('Wallet connected:',  'Address:', address);
  console.log('USDT Address:', USDT_ADDRESS);
  console.log('AGX Address:', AGX_ADDRESS);
  console.log('Staking Contract Address:', CONTRACT_ADDRESS);
  console.log('ERC20 ABI:', erc20ABI);
  // Token allowance checks
  const { data: usdtAllowance } = useReadContract({
    address: USDT_ADDRESS,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address, CONTRACT_ADDRESS],
    watch: true,
  });

  const { data: agxAllowance } = useReadContract({
    address: AGX_ADDRESS,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address, CONTRACT_ADDRESS],
    watch: true,
  });

  // Token balance checks
  const { data: usdtBalance } = useReadContract({
    address: USDT_ADDRESS,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: agxBalance } = useReadContract({
    address: AGX_ADDRESS,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  // Contract reads
  const { data: stakingInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: stakingABI,
    functionName: 'getStakingInfo',
    args: [address],
    watch: true,
  });

  // Contract writes with status tracking
  const { writeContract: approveUSDT, isPending: isApprovingUSDT } = useWriteContract();
  const { writeContract: approveAGX, isPending: isApprovingAGX } = useWriteContract();
  const { writeContract: stake, isPending: isStaking } = useWriteContract();
  const { writeContract: claimRewards, isPending: isClaiming } = useWriteContract();

  // Calculate USDT equivalent when AGX amount changes
  useEffect(() => {
    if (agxAmount && !isNaN(agxAmount)) {
      const usdtAmount = parseFloat(agxAmount) / AGX_TO_USDT_RATIO;
      setUsdtEquivalent(usdtAmount.toFixed(6));
    } else {
      setUsdtEquivalent('0');
    }
  }, [agxAmount]);

  // Check if tokens are approved
  useEffect(() => {
    if (agxAmount && usdtAllowance && agxAllowance && !isNaN(agxAmount)) {
      const requiredUSDT = parseEther(usdtEquivalent);
      const requiredAGX = parseEther(agxAmount);
  
      if (usdtAllowance >= requiredUSDT && agxAllowance >= requiredAGX) {
        setIsApproved(true); // This will show the "Stake" button
      } else {
        setIsApproved(false);
      }
    } else {
      setIsApproved(false);
    }
  }, [agxAmount, usdtAllowance, agxAllowance, usdtEquivalent]);
  

  // Validate minimum staking amounts
  const validateAmounts = () => {
    if (!agxAmount || isNaN(agxAmount) || !usdtEquivalent || isNaN(usdtEquivalent)) {
      setError('Please enter a valid amount');
      console.log('Validation failed: Invalid amount');
      return false;
    }

    if (parseFloat(agxAmount) < MIN_AGX) {
      setError(`Minimum AGX to stake is ${MIN_AGX}`);
      console.log(`Validation failed: AGX amount (${agxAmount}) is less than minimum (${MIN_AGX})`);
      return false;
    }

    if (parseFloat(usdtEquivalent) < MIN_USDT) {
      setError(`Minimum USDT to stake is ${MIN_USDT}`);
      console.log(`Validation failed: USDT equivalent (${usdtEquivalent}) is less than minimum (${MIN_USDT})`);
      return false;
    }

    console.log('Validation passed');
    return true;
  };


  const handleApprove = async () => {
    if (!validateAmounts()) return;
  
    try {
      setLoading(true);
      setError('');
  
      // Use the state values for calculations
      const usdtAmountToApprove = parseEther(usdtEquivalent);
      const agxAmountToApprove = parseEther(agxAmount);
  
      console.log('Approving USDT:', usdtAmountToApprove.toString());
      console.log('Approving AGX:', agxAmountToApprove.toString());
  
      console.log('Starting AGX approval...');
      const agxTx = await approveAGX({
        address: AGX_ADDRESS,
        abi: erc20ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, agxAmountToApprove],
      });
      console.log('AGX approval successful:', agxTx);
  
      // After AGX approval, check if USDT approval is also needed
      console.log('Starting USDT approval...');
      const usdtTx = await approveUSDT({
        address: USDT_ADDRESS,
        abi: erc20ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, usdtAmountToApprove],
      });
      console.log('USDT approval successful:', usdtTx);
  
      // Update isApproved to true if both approvals are successful
      setIsApproved(true);
      console.log('Both tokens approved, ready to stake!');
  
    } catch (err) {
      setError('Failed to approve tokens');
      console.error('Error during approval:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleStake = async () => {
    if (!validateAmounts()) return;

    try {
      setLoading(true);
      setError('');
      console.log('Starting staking process...');
      await stake({
        address: CONTRACT_ADDRESS,
        abi: stakingABI,
        functionName: 'stake',
        args: [
          parseEther(usdtEquivalent),
          referrerAddress || '0x0000000000000000000000000000000000000000'
        ],
      });
      console.log('Staking successful');
    } catch (err) {
      setError('Failed to stake tokens');
      console.error('Error during staking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Starting reward claim process...');
      await claimRewards({
        address: CONTRACT_ADDRESS,
        abi: stakingABI,
        functionName: 'claimRewards',
      });
      console.log('Reward claim successful');
    } catch (err) {
      setError('Failed to claim rewards');
      console.error('Error during reward claim:', err);
    } finally {
      setLoading(false);
    }
  };

  // Input validation for AGX amount
  const handleAgxInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setAgxAmount(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-poppins">
      {error && (
        <div className="bg-red-500 text-white p-4 text-center">
          {error}
        </div>
      )}

      <div className="container mx-auto px-4 py-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Stake AGX/USDT</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Your AGX Balance</p>
                  <p className="text-lg font-semibold text-green-500">
                    {agxBalance ? formatEther(agxBalance) : '0.00'} AGX
                  </p>
                </div>
              </div>

              {/* Staking Form */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <input
                    type="number"
                    value={agxAmount}
                    onChange={handleAgxInputChange}
                    placeholder={`Enter amount of AGX to stake (Min: ${MIN_AGX} AGX)`}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  
                  <div className="flex items-center justify-center">
                    <ArrowDown className="text-gray-500 my-2" />
                  </div>
                  
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">USDT Equivalent:</span>
                      <span className="font-semibold">{usdtEquivalent} USDT</span>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  value={referrerAddress}
                  onChange={(e) => setReferrerAddress(e.target.value)}
                  placeholder="Referrer Address (Optional)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <div className="flex gap-4">
                  {!isApproved ? (
                    <button
                      onClick={handleApprove}
                      disabled={loading || isApprovingUSDT || isApprovingAGX || !agxAmount || isNaN(agxAmount)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                    >
                      {isApprovingUSDT || isApprovingAGX ? 'Approving...' : 'Approve Tokens'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStake}
                      disabled={loading || isStaking || !agxAmount || isNaN(agxAmount)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                    >
                      {isStaking ? 'Staking...' : 'Stake'}
                    </button>
                  )}
                  <button
                    onClick={handleClaim}
                    disabled={loading || isClaiming}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isClaiming ? 'Claiming...' : 'Claim Rewards'}
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
                  <p className="text-gray-400 mb-2">Your Staked Amount</p>
                  <p className="text-2xl font-bold text-white">
                    ${stakingInfo ? formatEther(stakingInfo[0]) : '0.00'}
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
                    ${stakingInfo ? formatEther(stakingInfo[3]) : '0.00'}
                  </p>
                </div>
                <Gift className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Total Referrals</p>
                  <p className="text-2xl font-bold text-white">
                    {stakingInfo ? stakingInfo[4].toString() : '0'}
                  </p>
                </div>
                <Users className="text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPlatform;