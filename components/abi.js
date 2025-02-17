export const stakingABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_usdtToken", "type": "address" },
      { "internalType": "address", "name": "_agxToken", "type": "address" },
      { "internalType": "address", "name": "initialOwner", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "calculateRewards",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractBalances",
    "outputs": [
      { "internalType": "uint256", "name": "usdtBalance", "type": "uint256" },
      { "internalType": "uint256", "name": "agxBalance", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getStakingInfo",
    "outputs": [
      { "internalType": "uint256", "name": "stakedUSDT", "type": "uint256" },
      { "internalType": "uint256", "name": "stakedAGX", "type": "uint256" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "pendingRewards", "type": "uint256" },
      { "internalType": "uint256", "name": "totalReferrals", "type": "uint256" },
      { "internalType": "uint256", "name": "totalCommission", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "usdtAmount", "type": "uint256" },
      { "internalType": "address", "name": "referrer", "type": "address" }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];