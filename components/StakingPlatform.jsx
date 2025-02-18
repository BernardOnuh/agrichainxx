import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { stakingABI } from './abi';
import { Lock, Users, Gift, ArrowDown, Clock, Copy, Info, HelpCircle, Calendar, Percent, X } from 'lucide-react';
import { erc20ABI } from './erc20ABI';
import { useSearchParams } from 'next/navigation';

const CONTRACT_ADDRESS = "0x0624034Bea7f21C9ba5668092Da4d7389B34363D";
const USDT_ADDRESS = "0x55d398326f99059ff775485246999027b3197955";
const AGX_ADDRESS = "0xa2d78cb5cc4e8931dc695a24df73cb751c0aeb07";
const AGX_TO_USDT_RATIO = 1000;
const MIN_AGX = 10000;
const MIN_USDT = 10;

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-xl max-w-lg w-full m-4 p-6 z-10">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const CustomAlert = ({ title, children, type = 'info' }) => {
  const bgColors = {
    info: 'bg-green-500/10 border-green-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    success: 'bg-green-500/10 border-green-500/20'
  };

  const textColors = {
    info: 'text-green-500',
    error: 'text-red-500',
    success: 'text-green-500'
  };

  return (
    <div className={`p-4 rounded-xl border ${bgColors[type]} mb-6`}>
      <div className={`flex items-center gap-2 font-semibold ${textColors[type]}`}>
        <Gift className="w-4 h-4" />
        {title}
      </div>
      <div className="mt-1 text-gray-300">
        {children}
      </div>
    </div>
  );
};

const StakingPlatform = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const [agxAmount, setAgxAmount] = useState('');
  const [usdtEquivalent, setUsdtEquivalent] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvalStatus, setApprovalStatus] = useState({
    usdt: false,
    agx: false
  });
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [stakedDetails, setStakedDetails] = useState(null);
  const [isStakingSuccess, setIsStakingSuccess] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Transaction hashes for approvals and staking
  const [agxApprovalHash, setAgxApprovalHash] = useState(null);
  const [usdtApprovalHash, setUsdtApprovalHash] = useState(null);
  const [stakeHash, setStakeHash] = useState(null);

  // Wait for transaction receipts
  const { data: agxApprovalReceipt, isSuccess: isAgxApprovalSuccess } = useWaitForTransactionReceipt({
    hash: agxApprovalHash,
  });

  const { data: usdtApprovalReceipt, isSuccess: isUsdtApprovalSuccess } = useWaitForTransactionReceipt({
    hash: usdtApprovalHash,
  });

  const { data: stakeReceipt, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeHash,
  });

  const referrerAddress = searchParams.get('ref')?.toLowerCase() || '0x0000000000000000000000000000000000000000';

  // Validate referrer address
  useEffect(() => {
    if (referrerAddress && referrerAddress !== '0x0000000000000000000000000000000000000000') {
      if (!/^0x[a-fA-F0-9]{40}$/.test(referrerAddress)) {
        setError('Invalid referrer address format');
      }
    }
  }, [referrerAddress]);

  // Get all user stakes
  const { data: userStakes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: stakingABI,
    functionName: 'getUserStakes',
    args: [address],
    watch: true,
  });

  // Get stake details for the first stake
  const { data: stakeDetails } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: stakingABI,
    functionName: 'getStakeDetails',
    args: [address, 0],
    watch: true,
    enabled: address != null,
  });

  // Token allowances
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

  // Token balances
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

  // Calculate pending rewards
  const { data: pendingRewards } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: stakingABI,
    functionName: 'calculateRewards',
    args: [address, 0],
    watch: true,
  });

  // Contract writes
  const { writeContract: approveUSDT, isPending: isApprovingUSDT } = useWriteContract();
  const { writeContract: approveAGX, isPending: isApprovingAGX } = useWriteContract();
  const { writeContract: stake, isPending: isStaking } = useWriteContract();
  const { writeContract: claimRewards, isPending: isClaiming } = useWriteContract();

  // Update staked details when data changes
  useEffect(() => {
    if (stakeDetails && userStakes) {
      setStakedDetails({
        stakedUSDT: stakeDetails[0],
        stakedAGX: stakeDetails[1],
        startTime: stakeDetails[2],
        pendingRewards: stakeDetails[3],
        active: stakeDetails[4],
        totalReferrals: userStakes[1],
        totalCommission: userStakes[2]
      });

      // Update next claim time based on start time and claim delay
      const nextClaimTimestamp = Number(stakeDetails[2]) + (6 * 24 * 60 * 60); // 6 days claim delay
      setNextClaimTime(nextClaimTimestamp * 1000); // Convert to milliseconds
      setCanClaim(Date.now() >= nextClaimTimestamp * 1000);
    }
  }, [stakeDetails, userStakes]);

  // Calculate USDT equivalent when AGX amount changes
  useEffect(() => {
    if (agxAmount && !isNaN(agxAmount)) {
      const usdtAmount = parseFloat(agxAmount) / AGX_TO_USDT_RATIO;
      setUsdtEquivalent(usdtAmount.toFixed(6));
    } else {
      setUsdtEquivalent('0');
    }
  }, [agxAmount]);

  // Check token approvals
  useEffect(() => {
    if (agxAmount && usdtAllowance && agxAllowance && !isNaN(agxAmount)) {
      const requiredUSDT = parseEther(usdtEquivalent);
      const requiredAGX = parseEther(agxAmount);
      
      setApprovalStatus({
        usdt: usdtAllowance >= requiredUSDT,
        agx: agxAllowance >= requiredAGX
      });
    }
  }, [agxAmount, usdtAllowance, agxAllowance, usdtEquivalent]);

  // Validate minimum staking amounts
  const validateAmounts = () => {
    if (!agxAmount || isNaN(agxAmount) || !usdtEquivalent || isNaN(usdtEquivalent)) {
      setError('Please enter a valid amount');
      return false;
    }

    if (parseFloat(agxAmount) < MIN_AGX) {
      setError(`Minimum AGX to stake is ${MIN_AGX}`);
      return false;
    }

    if (parseFloat(usdtEquivalent) < MIN_USDT) {
      setError(`Minimum USDT to stake is ${MIN_USDT}`);
      return false;
    }

    return true;
  };

  const handleApproveAndStake = async () => {
    if (!validateAmounts()) return;

    try {
      setLoading(true);
      setError('');
      setIsApproving(true);

      const usdtAmountToApprove = parseEther(usdtEquivalent);
      const agxAmountToApprove = parseEther(agxAmount);

      // Approve AGX if needed
      if (!approvalStatus.agx) {
        const agxApprovalTx = await approveAGX({
          address: AGX_ADDRESS,
          abi: erc20ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESS, agxAmountToApprove],
        });
        setAgxApprovalHash(agxApprovalTx.hash); // Store the AGX approval transaction hash
      }

      // Approve USDT if needed
      if (!approvalStatus.usdt) {
        const usdtApprovalTx = await approveUSDT({
          address: USDT_ADDRESS,
          abi: erc20ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESS, usdtAmountToApprove],
        });
        setUsdtApprovalHash(usdtApprovalTx.hash); // Store the USDT approval transaction hash
      }

      // Wait for both approvals to succeed
      if ((approvalStatus.agx || isAgxApprovalSuccess) && (approvalStatus.usdt || isUsdtApprovalSuccess)) {
        // Proceed with staking
        const stakeTx = await stake({
          address: CONTRACT_ADDRESS,
          abi: stakingABI,
          functionName: 'stake',
          args: [parseEther(usdtEquivalent), referrerAddress],
        });
        setStakeHash(stakeTx.hash); // Store the staking transaction hash
      }

    } catch (err) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
      setIsApproving(false);
    }
  };

  // Effect to handle staking success
  useEffect(() => {
    if (isStakeSuccess) {
      setIsStakingSuccess(true);
      setTimeout(() => setIsStakingSuccess(false), 5000); // Hide success message after 5 seconds
    }
  }, [isStakeSuccess]);

  const handleClaim = async () => {
    if (!canClaim) {
      setError(`Cannot claim yet. Next claim available at ${new Date(nextClaimTime).toLocaleString()}`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await claimRewards({
        address: CONTRACT_ADDRESS,
        abi: stakingABI,
        functionName: 'claimRewards',
        args: [0], // Claim from first stake
      });
    } catch (err) {
      setError('Failed to claim rewards');
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

  const getClaimButtonText = () => {
    if (isClaiming) return 'Claiming...';
    if (!canClaim && nextClaimTime) {
      const timeLeft = Math.max(0, Math.ceil((nextClaimTime - Date.now()) / 1000));
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      return `Claim in ${hours}h ${minutes}m`;
    }
    return 'Claim Rewards';
  };

  // Generate referral link
  const referralLink = `${window.location.origin}?ref=${address}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-poppins">
      <CustomAlert title="Welcome to AGX/USDT Staking">
        Earn 2% daily rewards over 150 days. Stake your AGX tokens with USDT to earn USDT rewards.
        Minimum stake: {MIN_AGX} AGX with ${MIN_USDT} USDT equivalent
      </CustomAlert>

      {error && (
        <CustomAlert title="Error" type="error">
          {error}
        </CustomAlert>
      )}

      {isStakingSuccess && (
        <CustomAlert title="Success" type="success">
          Congratulations! You've successfully staked your tokens.
        </CustomAlert>
      )}

      <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)}>
        <div className="text-white">
          <h2 className="text-xl font-bold mb-4">Staking Rewards Information</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-green-500 font-semibold mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4" /> Daily Rewards
              </h3>
              <p className="text-gray-300">Earn 2% of your staked amount daily in USDT rewards.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-green-500 font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Reward Period
              </h3>
              <p className="text-gray-300">Program runs for 150 days, allowing you to earn back your full investment plus additional rewards.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-green-500 font-semibold mb-2 flex items-center gap-2">
                <Gift className="w-4 h-4" /> Total Return
              </h3>
              <p className="text-gray-300">Over the 150-day period, you can earn up to 300% of your initial stake.</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-green-500 font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Claim Schedule
              </h3>
              <p className="text-gray-300">Rewards can be claimed every 6 days, accumulating at 2% daily.</p>
            </div>
          </div>
        </div>
      </Modal>

      <div className="container mx-auto px-4 py-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">Stake AGX/USDT</h2>
                  <button 
                    onClick={() => setIsInfoModalOpen(true)}
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-500 p-2 rounded-full transition-colors"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Your AGX Balance</p>
                  <p className="text-lg font-semibold text-green-500">
                    {agxBalance ? formatEther(agxBalance) : '0.00'} AGX
                  </p>
                </div>
              </div>

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

                {referrerAddress !== '0x0000000000000000000000000000000000000000' && (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                    <p className="text-gray-400">Referrer:</p>
                    <p className="text-white truncate">{referrerAddress}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleApproveAndStake}
                    disabled={loading || isApprovingUSDT || isApprovingAGX || isStaking || !agxAmount || isNaN(agxAmount)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isApproving ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      </div>
                    ) : isApprovingUSDT || isApprovingAGX ? 'Approving...' : 
                       isStaking ? 'Staking...' : 
                       approvalStatus.usdt && approvalStatus.agx ? 'Stake' : 'Approve '}
                  </button>
                  <button
                    onClick={handleClaim}
                    disabled={loading || isClaiming || !canClaim}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                  >
                    {getClaimButtonText()}
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
                    ${stakedDetails ? formatEther(stakedDetails.stakedUSDT) : '0.00'}
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
                  ${pendingRewards ? formatEther(pendingRewards) : '0.00'}
                  </p>
                </div>
                <Gift className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Next Claim</p>
                  <p className="text-2xl font-bold text-white">
                    {nextClaimTime ? new Date(nextClaimTime).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <Clock className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Total Referrals</p>
                  <p className="text-2xl font-bold text-white">
                    {stakedDetails ? stakedDetails.totalReferrals.toString() : '0'}
                  </p>
                </div>
                <Users className="text-green-500" />
              </div>
            </div>

            {/* Referral Link Section */}
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-2">Your Referral Link</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white flex-1 truncate"
                    />
                    <button
                      onClick={copyReferralLink}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPlatform;