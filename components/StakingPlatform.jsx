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

// Updated staking plans with display and actual values
const STAKING_PLANS = [
  { display: { usdt: 20, agx: 20000 }, actual: { usdt: 10, agx: 10000 } },
  { display: { usdt: 50, agx: 50000 }, actual: { usdt: 25, agx: 25000 } },
  { display: { usdt: 100, agx: 100000 }, actual: { usdt: 50, agx: 50000 } },
  { display: { usdt: 200, agx: 200000 }, actual: { usdt: 100, agx: 100000 } },
  { display: { usdt: 500, agx: 500000 }, actual: { usdt: 250, agx: 250000 } },
  { display: { usdt: 1000, agx: 1000000 }, actual: { usdt: 500, agx: 500000 } }
];

const StakingPlan = ({ plan, onSelect, isSelected }) => {
  return (
    <button
      onClick={() => onSelect(plan)}
      className={`w-full p-4 rounded-xl transition-all ${
        isSelected 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      <div className="text-lg font-semibold">${plan.display.usdt} USDT</div>
      <div className="text-sm opacity-80">{plan.display.agx.toLocaleString()} AGX</div>
    </button>
  );
};

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
  const [selectedPlan, setSelectedPlan] = useState(null);
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

  useEffect(() => {
    if (selectedPlan) {
      setAgxAmount(selectedPlan.actual.agx.toString());
    }
  }, [selectedPlan]);

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

  const [transactionStep, setTransactionStep] = useState('initial'); // 'initial', 'approving_agx', 'approving_usdt', 'staking'

  const { writeContract: approveUSDT, isPending: isApprovingUSDT } = useWriteContract();
  const { writeContract: approveAGX, isPending: isApprovingAGX } = useWriteContract();
  const { writeContract: stake, isPending: isStaking } = useWriteContract();
  const { writeContract: claimRewards, isPending: isClaiming } = useWriteContract();

  useEffect(() => {
    setTransactionStep('initial');
  }, [selectedPlan]);

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
        totalCommission: userStakes[2],
        lastClaimTime: stakeDetails[5] || stakeDetails[2] // Add lastClaimTime tracking
      });

      const startTimestamp = Number(stakeDetails[2]);
      const lastClaimTimestamp = Number(stakeDetails[5] || stakeDetails[2]);
      const now = Math.floor(Date.now() / 1000);
      
      // Check if this is the first claim (6-day delay) or subsequent claims (daily)
      if (lastClaimTimestamp === startTimestamp) {
        // First claim - apply 6-day delay
        const firstClaimTime = startTimestamp + (6 * 24 * 60 * 60);
        setNextClaimTime(firstClaimTime * 1000);
        setCanClaim(now >= firstClaimTime);
      } else {
        // Subsequent claims - daily interval
        const nextDailyClaimTime = lastClaimTimestamp + (24 * 60 * 60);
        setNextClaimTime(nextDailyClaimTime * 1000);
        setCanClaim(now >= nextDailyClaimTime);
      }
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
    if (!selectedPlan) {
      setError('Please select a staking plan');
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

      const usdtAmountToApprove = parseEther(selectedPlan.actual.usdt.toString());
      const agxAmountToApprove = parseEther(selectedPlan.actual.agx.toString());

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
  const referralLink = `${window.location.origin}/staking?ref=${address}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  const continueTransaction = async () => {
    if (!validateAmounts()) return;
  
    try {
      setLoading(true);
      setError('');
  
      const usdtAmountToApprove = parseEther(selectedPlan.actual.usdt.toString());
      const agxAmountToApprove = parseEther(selectedPlan.actual.agx.toString());
  
      // Rest of the transaction logic remains the same, but use actual values
      if (!approvalStatus.agx && transactionStep === 'initial') {
        setTransactionStep('approving_agx');
        await approveAGX({
          address: AGX_ADDRESS,
          abi: erc20ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESS, agxAmountToApprove],
        });
      }
  
      if (!approvalStatus.usdt && (transactionStep === 'initial' || transactionStep === 'approving_agx')) {
        setTransactionStep('approving_usdt');
        await approveUSDT({
          address: USDT_ADDRESS,
          abi: erc20ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESS, usdtAmountToApprove],
        });
      }
  
      if (approvalStatus.agx && approvalStatus.usdt || transactionStep === 'staking') {
        setTransactionStep('staking');
        await stake({
          address: CONTRACT_ADDRESS,
          abi: stakingABI,
          functionName: 'stake',
          args: [parseEther(selectedPlan.actual.usdt.toString()), referrerAddress],
        });
      }

    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      );
    }

    if (isApprovingAGX || transactionStep === 'approving_agx') return 'Approving AGX...';
    if (isApprovingUSDT || transactionStep === 'approving_usdt') return 'Approving USDT...';
    if (isStaking || transactionStep === 'staking') return 'Staking...';
    
    if (!approvalStatus.agx) return 'Approve AGX';
    if (!approvalStatus.usdt) return 'Approve USDT';
    return 'Stake';
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-poppins">
      <CustomAlert title="Welcome to AGX/USDT Staking">
        Earn 2% daily rewards over 150 days. Stake your AGX tokens with USDT to earn USDT rewards.
        Select a staking plan to begin earning rewards.
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
                <Clock className="w-4 h-4" /> Claim Schedule
              </h3>
              <p className="text-gray-300">First claim available after 6 days, then daily claims thereafter.</p>
            </div>
          </div>
        </div>
      </Modal>
  
      <div className="container mx-auto px-4 py-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">Select Staking Plan</h2>
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
  
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {STAKING_PLANS.map((plan) => (
                  <StakingPlan
                    key={plan.usdt}
                    plan={plan}
                    onSelect={setSelectedPlan}
                    isSelected={selectedPlan?.usdt === plan.usdt}
                  />
                ))}
              </div>
  
              {selectedPlan && (
               <div className="space-y-6">
               <div className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white">
                 <div className="flex justify-between items-center">
                   <span className="text-gray-400">Selected Plan:</span>
                   <span className="font-semibold">
                     ${selectedPlan.actual.usdt} USDT / {selectedPlan.actual.agx.toLocaleString()} AGX
                   </span>
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
                  onClick={continueTransaction}
                  disabled={loading || isApprovingUSDT || isApprovingAGX || isStaking || !selectedPlan}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                >
                  {getButtonText()}
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
              )}
            </div>
          </div>
  
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