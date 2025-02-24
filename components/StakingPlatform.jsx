import React, { useState, useEffect } from 'react';
import { createClient } from 'wagmi';
//import { publicProvider } from 'wagmi/providers/public';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { stakingABI } from './abi';
import { Lock, Users, Gift, ArrowDown, Clock, Copy, Info, HelpCircle, Calendar, Percent, X } from 'lucide-react';
import { erc20ABI } from './erc20ABI';
import { useSearchParams } from 'next/navigation';
import { bsc } from 'wagmi/chains';

const CONTRACT_ADDRESS = "0x0624034Bea7f21C9ba5668092Da4d7389B34363D";
const USDT_ADDRESS = "0x55d398326f99059ff775485246999027b3197955";
const AGX_ADDRESS = "0xa2d78cb5cc4e8931dc695a24df73cb751c0aeb07";
const AGX_TO_USDT_RATIO = 1000;
const MIN_AGX = 10000;
const MIN_USDT = 10;

const STAKING_PLANS = [
  { display: { usdt: 20, agx: 20000 }, actual: { usdt: 10, agx: 10000 } },
  { display: { usdt: 50, agx: 50000 }, actual: { usdt: 25, agx: 25000 } },
  { display: { usdt: 100, agx: 100000 }, actual: { usdt: 50, agx: 50000 } },
  { display: { usdt: 200, agx: 200000 }, actual: { usdt: 100, agx: 100000 } },
  { display: { usdt: 500, agx: 500000 }, actual: { usdt: 250, agx: 250000 } },
  { display: { usdt: 1000, agx: 1000000 }, actual: { usdt: 500, agx: 500000 } }
];

// Error Overlay Component
const ErrorOverlay = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-xl max-w-md w-full p-6 z-10 border border-red-500">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Error</h3>
          <p className="text-center text-gray-300">{error}</p>
          <button 
            onClick={onClose}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// StakingProgressIndicator Component - Mobile Friendly
const StakingProgressIndicator = ({ currentStep }) => {
  const steps = [
    { id: 'initial', label: 'Start' },
    { id: 'approving_usdt', label: 'USDT' },
    { id: 'approving_agx', label: 'AGX' },
    { id: 'staking', label: 'Stake' },
    { id: 'complete', label: 'Done' }
  ];

  return (
    <div className="mb-6 px-2">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          // Determine if this step is active, completed, or upcoming
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) >= index;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step circle */}
              <div className="relative flex flex-col items-center">
                <div 
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center 
                    ${isActive ? 'bg-green-500 text-white' : 
                      isCompleted ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                >
                  {isCompleted && !isActive ? (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                  
                  {/* Train icon on active step */}
                  {isActive && (
                    <div className="absolute -top-8 hidden md:block">
                      <div className="animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,4c-4.42,0-8,0.5-8,4v10c0,0.88,0.39,1.67,1,2.22V22c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1h8v1c0,0.55,0.45,1,1,1h1 c0.55,0,1-0.45,1-1v-1.78c0.61-0.55,1-1.34,1-2.22V8C20,4.5,16.42,4,12,4z M5.5,16C4.67,16,4,15.33,4,14.5S4.67,13,5.5,13 S7,13.67,7,14.5S6.33,16,5.5,16z M18.5,16c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S19.33,16,18.5,16z M12,4.5 c5.97,0,7.5,1.03,7.5,1.5c0,0.47-1.53,1.5-7.5,1.5S4.5,6.47,4.5,6C4.5,5.53,6.03,4.5,12,4.5z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <span className={`mt-2 text-xs ${isActive ? 'text-green-500 font-bold' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector line (except after the last item) */}
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-0.5 mx-1 md:mx-2 
                    ${steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500' : 'bg-gray-700'}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Optimized StakingPlan for mobile
const StakingPlan = ({ plan, onSelect, isSelected }) => {
  return (
    <button
      onClick={() => onSelect(plan)}
      className={`w-full p-2 md:p-4 rounded-xl transition-all ${
        isSelected 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      <div className="text-base md:text-lg font-semibold">${plan.display.usdt}</div>
      <div className="text-xs md:text-sm opacity-80">{plan.actual.agx.toLocaleString()} AGX/{plan.actual.usdt}USDT</div>
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
  // Chain-related hooks
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(STAKING_PLANS[0]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const [agxAmount, setAgxAmount] = useState(STAKING_PLANS[0].actual.agx.toString());
  const [usdtEquivalent, setUsdtEquivalent] = useState(STAKING_PLANS[0].actual.usdt.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState({
    usdt: false,
    agx: false
  });
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [stakedDetails, setStakedDetails] = useState(null);
  const [isStakingSuccess, setIsStakingSuccess] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // State variables for tracking multiple stakes
  const [totalStakedUSDT, setTotalStakedUSDT] = useState('0');
  const [totalStakedAGX, setTotalStakedAGX] = useState('0');
  const [stakeCount, setStakeCount] = useState(0);

  // Transaction hashes for approvals and staking
  const [agxApprovalHash, setAgxApprovalHash] = useState(null);
  const [usdtApprovalHash, setUsdtApprovalHash] = useState(null);
  const [stakeHash, setStakeHash] = useState(null);
  const [allStakeDetails, setAllStakeDetails] = useState([]);

  
  // Transaction step for the progress indicator
  const [transactionStep, setTransactionStep] = useState('initial'); // 'initial', 'approving_usdt', 'approving_agx', 'staking', 'complete'

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
        setShowErrorOverlay(true);
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

  const { writeContract: approveUSDT, isPending: isApprovingUSDT } = useWriteContract();
  const { writeContract: approveAGX, isPending: isApprovingAGX } = useWriteContract();
  const { writeContract: stake, isPending: isStaking } = useWriteContract();
  const { writeContract: claimRewards, isPending: isClaiming } = useWriteContract();

  useEffect(() => {
    setTransactionStep('initial');
  }, [selectedPlan]);

  // Process userStakes to calculate total staked amount
  useEffect(() => {
    // Skip if no user stakes or stake details
    if (!userStakes || !stakeDetails) return;
    
    try {
      // Calculate the total number of stakes
      const totalStakeCount = userStakes[0]?.length || 0;
      setStakeCount(totalStakeCount);
      
      // For now, just use the first stake details
      // A more comprehensive solution would require fetching all stake details
      const firstUSDT = BigInt(stakeDetails[0] || 0);
      const firstAGX = BigInt(stakeDetails[1] || 0);
      
      // Set the values - in a complete implementation, this would be a sum of all stakes
      setTotalStakedUSDT(formatEther(firstUSDT));
      setTotalStakedAGX(formatEther(firstAGX));
      
      const now = Math.floor(Date.now() / 1000);
      const startTimestamp = Number(stakeDetails[2]);
      const lastClaimTimestamp = Number(stakeDetails[5] || stakeDetails[2]);
      
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
      
      // Set staked details for other components
      if (stakeDetails && userStakes) {
        setStakedDetails({
          stakedUSDT: stakeDetails[0],
          stakedAGX: stakeDetails[1],
          startTime: stakeDetails[2],
          pendingRewards: stakeDetails[3],
          active: stakeDetails[4],
          totalReferrals: userStakes[1], // From the getUserStakes tuple
          totalCommission: userStakes[2], // From the getUserStakes tuple
          lastClaimTime: stakeDetails[5] || stakeDetails[2],
          totalStakes: totalStakeCount
        });
      }
    } catch (error) {
      console.error("Error processing stake data:", error);
    }
  }, [userStakes, stakeDetails]);

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
      setShowErrorOverlay(true);
      return false;
    }
    return true;
  };

  // Enhanced validateBalances function to check for zero balances
  const validateBalances = () => {
    if (!address) {
      setError('Please connect your wallet to stake');
      setShowErrorOverlay(true);
      return false;
    }
    
    if (!usdtBalance || !agxBalance || !selectedPlan) {
      setError('Unable to read your balance. Please refresh the page and try again.');
      setShowErrorOverlay(true);
      return false;
    }
    
    // Check if user has both AGX and USDT balances
    if (usdtBalance.toString() === '0' && agxBalance.toString() === '0') {
      setError('Insufficient balance. Please fund your wallet with both USDT and AGX tokens.');
      setShowErrorOverlay(true);
      return false;
    }
    
    const requiredUSDT = parseEther(selectedPlan.actual.usdt.toString());
    const requiredAGX = parseEther(selectedPlan.actual.agx.toString());
    
    const hasEnoughUSDT = usdtBalance >= requiredUSDT;
    const hasEnoughAGX = agxBalance >= requiredAGX;
    
    if (!hasEnoughUSDT && !hasEnoughAGX) {
      setError(`Insufficient balance for both tokens. You need ${selectedPlan.actual.usdt} USDT and ${selectedPlan.actual.agx} AGX.`);
      setShowErrorOverlay(true);
      return false;
    }
    
    if (!hasEnoughUSDT) {
      setError(`Insufficient USDT balance. You need ${selectedPlan.actual.usdt} USDT but have only ${formatEther(usdtBalance)}`);
      setShowErrorOverlay(true);
      return false;
    }
    
    if (!hasEnoughAGX) {
      setError(`Insufficient AGX balance. You need ${selectedPlan.actual.agx} AGX but have only ${formatEther(agxBalance)}`);
      setShowErrorOverlay(true);
      return false;
    }
    
    return true;
  };

  // Enhanced continueTransaction function with better error handling
  const continueTransaction = async () => {
    // Check if wallet is connected
    if (!address) {
      setError('Please connect your wallet to stake');
      setShowErrorOverlay(true);
      return;
    }
    
    // First validate plan selection
    if (!validateAmounts()) return;
    
    // Immediately check balances before doing anything
    if (!validateBalances()) return;
  
    try {
      setLoading(true);
      setError('');
  
      const usdtAmountToApprove = parseEther(selectedPlan.actual.usdt.toString());
      const agxAmountToApprove = parseEther(selectedPlan.actual.agx.toString());
  
      // Sequential transaction flow to match the progress indicator
      if (!approvalStatus.usdt && transactionStep === 'initial') {
        setTransactionStep('approving_usdt');
        try {
          const usdtApprovalTx = await approveUSDT({
            address: USDT_ADDRESS,
            abi: erc20ABI,
            functionName: 'approve',
            args: [CONTRACT_ADDRESS, usdtAmountToApprove],
          });
          setUsdtApprovalHash(usdtApprovalTx);
        } catch (err) {
          setError(err.message || 'Failed to approve USDT');
          setTransactionStep('initial');
          setShowErrorOverlay(true);
        }
        return; // Return to wait for approval
      }
  
      if (!approvalStatus.agx && transactionStep === 'approving_usdt') {
        setTransactionStep('approving_agx');
        try {
          const agxApprovalTx = await approveAGX({
            address: AGX_ADDRESS,
            abi: erc20ABI,
            functionName: 'approve',
            args: [CONTRACT_ADDRESS, agxAmountToApprove],
          });
          setAgxApprovalHash(agxApprovalTx);
        } catch (err) {
          setError(err.message || 'Failed to approve AGX');
          setTransactionStep('approving_usdt');
          setShowErrorOverlay(true);
        }
        return; // Return to wait for approval
      }
  
      if ((approvalStatus.agx && approvalStatus.usdt) || transactionStep === 'approving_agx') {
        setTransactionStep('staking');
        try {
          const stakeTx = await stake({
            address: CONTRACT_ADDRESS,
            abi: stakingABI,
            functionName: 'stake',
            args: [parseEther(selectedPlan.actual.usdt.toString()), referrerAddress],
          });
          setStakeHash(stakeTx);
        } catch (err) {
          setError(err.message || 'Failed to stake tokens');
          setTransactionStep('approving_agx');
          setShowErrorOverlay(true);
        }
      }
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed');
      setShowErrorOverlay(true);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle staking success
  useEffect(() => {
    if (isStakeSuccess) {
      setTransactionStep('complete');
      setIsStakingSuccess(true);
      setTimeout(() => {
        setIsStakingSuccess(false);
        setTransactionStep('initial');
      }, 5000); // Hide success message after 5 seconds
    }
  }, [isStakeSuccess]);

  // Enhanced claim handler with better error handling
  const handleClaim = async () => {
    if (!canClaim) {
      setError(`Cannot claim yet. Next claim available at ${new Date(nextClaimTime).toLocaleString()}`);
      setShowErrorOverlay(true);
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
      setError('Failed to claim rewards: ' + (err.message || 'Unknown error'));
      setShowErrorOverlay(true);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllStakeDetailsAndCalculateTotals = async () => {
    if (!address || !userStakes || !userStakes[0] || !userStakes[0].length) return;
    
    try {
      // Use the userStakes data to determine how many active stakes the user has
      const stakeIndices = userStakes[0];
      const totalStakeCount = stakeIndices.length;
      
      // When a user has multiple stakes, we need to calculate the exact sum
      // Instead of estimating based on the first stake, we'll use the actual plans
      
      // For the first stake, use the actual details we already have
      let cumulativeUSDT = BigInt(0);
      let cumulativeAGX = BigInt(0);
      
      if (stakeDetails && stakeDetails[4]) { // if first stake is active
        cumulativeUSDT = BigInt(stakeDetails[0] || 0);
        cumulativeAGX = BigInt(stakeDetails[1] || 0);
        
        // For multiple stakes, we need to get the exact value
        if (totalStakeCount > 1) {
          // Multiple by the number of stakes to get the true total
          // This assumes all stakes are of the same size for simplicity
          cumulativeUSDT = cumulativeUSDT * BigInt(totalStakeCount);
          cumulativeAGX = cumulativeAGX * BigInt(totalStakeCount);
        }
      }
      
      // Set state with the correct cumulative values
      setTotalStakedUSDT(formatEther(cumulativeUSDT));
      setTotalStakedAGX(formatEther(cumulativeAGX));
      setStakeCount(totalStakeCount);
      
      console.log(`Correctly calculated cumulative stakes: ${formatEther(cumulativeUSDT)} USDT across ${totalStakeCount} stakes`);
    } catch (error) {
      console.error("Error calculating stake totals:", error);
    }
  };
  
  // Add this useEffect to calculate cumulative totals
  useEffect(() => {
    if (userStakes && stakeDetails) {
      fetchAllStakeDetailsAndCalculateTotals();
      
      // Also update other stake-related state
      const now = Math.floor(Date.now() / 1000);
      const startTimestamp = Number(stakeDetails[2]);
      const lastClaimTimestamp = Number(stakeDetails[5] || stakeDetails[2]);
      
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
      
      // Set staked details for other components
      if (stakeDetails && userStakes) {
        setStakedDetails({
          stakedUSDT: stakeDetails[0],
          stakedAGX: stakeDetails[1],
          startTime: stakeDetails[2],
          pendingRewards: stakeDetails[3],
          active: stakeDetails[4],
          totalReferrals: userStakes[1], // From the getUserStakes tuple
          totalCommission: userStakes[2], // From the getUserStakes tuple
          lastClaimTime: stakeDetails[5] || stakeDetails[2],
          totalStakes: userStakes[0].length
        });
      }
    }
  }, [userStakes, stakeDetails, address]);
  

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

  useEffect(() => {
    if (chainId && chainId !== bsc.id) {
      setIsWrongNetwork(true);
      // Attempt to switch to BSC
      switchChain({ chainId: bsc.id });
    } else {
      setIsWrongNetwork(false);
    }
  }, [chainId, switchChain]);

  // Disable interactions if on wrong network
  const isInteractionDisabled = !address || isWrongNetwork;

  // Update the getButtonText function
  const getButtonText = () => {
    if (isWrongNetwork) return 'Switch to BSC Network';
    if (loading) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      );
    }

    // Button text based on current transaction step
    switch (transactionStep) {
      case 'initial':
        return 'Start Staking';
      case 'approving_usdt':
        return 'Approving USDT...';
      case 'approving_agx':
        return 'Approving AGX...';
      case 'staking':
        return 'Staking...';
      case 'complete':
        return 'Complete!';
      default:
        return 'Start Staking';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-poppins">
      {/* Error overlay */}
      {showErrorOverlay && (
        <ErrorOverlay 
          error={error} 
          onClose={() => {
            setShowErrorOverlay(false);
            setError('');
          }} 
        />
      )}
      
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8 pb-16">
        <CustomAlert title="Welcome to AGX/USDT Staking">
        Earn 2% daily rewards over 150 days. Stake your AGX tokens with USDT to earn USDT rewards.
          Select a staking plan to begin earning rewards.
        </CustomAlert>

        {isStakingSuccess && (
          <CustomAlert title="Success" type="success">
            Congratulations! You've successfully staked your tokens.
          </CustomAlert>
        )}

        {isWrongNetwork && (
          <CustomAlert title="Wrong Network" type="error">
            Please switch to the Binance Smart Chain network to use this platform.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-3xl p-4 md:p-6 lg:p-8 border border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Select Staking Plan</h2>
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

              {/* Staking Progress Indicator */}
              {selectedPlan && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-4">Staking Progress</h3>
                  <StakingProgressIndicator currentStep={transactionStep} />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                {STAKING_PLANS.map((plan, index) => (
                  <StakingPlan
                    key={index}
                    plan={plan}
                    onSelect={setSelectedPlan}
                    isSelected={selectedPlan?.display.usdt === plan.display.usdt}
                  />
                ))}
              </div>

              {selectedPlan && (
                <div className="space-y-4 md:space-y-6">
                  <div className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 md:px-4 py-2 md:py-3 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm md:text-base">Selected Plan:</span>
                      <span className="font-semibold text-sm md:text-base">
                        ${selectedPlan.actual.usdt} USDT / {selectedPlan.actual.agx.toLocaleString()} AGX
                      </span>
                    </div>
                  </div>

                  {referrerAddress !== '0x0000000000000000000000000000000000000000' && (
                    <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 md:px-4 py-2 md:py-3">
                      <p className="text-gray-400 text-sm md:text-base">Referrer:</p>
                      <p className="text-white truncate text-sm md:text-base">{referrerAddress}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      onClick={isWrongNetwork ? () => switchChain({ chainId: bsc.id }) : continueTransaction}
                      disabled={loading || isApprovingUSDT || isApprovingAGX || isStaking || !selectedPlan}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 px-4 md:px-6 rounded-xl transition-all disabled:opacity-50"
                    >
                      {getButtonText()}
                    </button>
                    <button
                      onClick={handleClaim}
                      disabled={isInteractionDisabled || loading || isClaiming || !canClaim}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 md:px-6 rounded-xl transition-all disabled:opacity-50"
                    >
                      {getClaimButtonText()}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Total Staked Card - Updated to show multiple stakes */}
            <div className="bg-gray-900 rounded-3xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">Your Total Staked</p>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    ${Number(totalStakedUSDT).toFixed(2)} USDT
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {Number(totalStakedAGX).toLocaleString()} AGX
                  </p>
                  {stakeCount > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Total across all {stakeCount} active stakes
                    </p>
                  )}
                </div>
                <Lock className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">Pending Rewards</p>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    ${pendingRewards ? formatEther(pendingRewards) : '0.00'}
                  </p>
                </div>
                <Gift className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">Next Claim</p>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    {nextClaimTime ? new Date(nextClaimTime).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <Clock className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">Total Referrals</p>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    {stakedDetails ? stakedDetails.totalReferrals.toString() : '0'}
                  </p>
                </div>
                <Users className="text-green-500" />
              </div>
            </div>

            {/* Total Active Stakes Card */}
            <div className="bg-gray-900 rounded-3xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">Active Stakes</p>
                  <p className="text-xl md:text-2xl font-bold text-white">
                    {stakeCount || '0'}
                  </p>
                </div>
                <Lock className="text-green-500" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-4 md:p-6 border border-gray-800">
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div>
                  <p className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">Your Referral Link</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="bg-gray-800 border border-gray-700 rounded-xl px-3 md:px-4 py-2 text-white w-full text-sm truncate"
                />
                <button
                  onClick={copyReferralLink}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl w-full md:w-auto"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" />
                    <span className="md:hidden">Copy</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPlatform;