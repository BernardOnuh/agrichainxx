import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { bsc, sepolia } from 'wagmi/chains';

const StyledConnectButton = () => {
  const {
    login,
    logout,
    authenticated,
    ready
  } = usePrivy();
  
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isTransacting, setIsTransacting] = useState(false);
  const [showNetworkPrompt, setShowNetworkPrompt] = useState(false);
  const [currentChain, setCurrentChain] = useState(null);

  useEffect(() => {
    if (authenticated && chainId) {
      // Update current chain
      setCurrentChain(chainId);
      
      // Show network prompt if not on BSC
      if (chainId !== bsc.id) {
        setShowNetworkPrompt(true);
      }
    }
  }, [authenticated, chainId]);

  const handleNetworkSwitch = async () => {
    try {
      await switchChain({ chainId: bsc.id });
      setShowNetworkPrompt(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const sendTransaction = async () => {
    try {
      setIsTransacting(true);
      
      if (chainId !== bsc.id) {
        setShowNetworkPrompt(true);
        setIsTransacting(false);
        return;
      }

      const { sendTransaction } = await import('@wagmi/core');
      const hash = await sendTransaction({
        to: '0x...',
        value: parseEther('0.01'),
        chainId: bsc.id,
      });
      
      console.log('Transaction hash:', hash);
    } catch (error) {
      console.error('Error sending transaction:', error);
    } finally {
      setIsTransacting(false);
    }
  };

  const NetworkPrompt = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Wrong Network
        </h3>
        <p className="text-gray-600 mb-4">
          Please switch to the BNB Smart Chain (BSC) network to continue.
          Currently connected to: {getChainInfo(chainId)?.name}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowNetworkPrompt(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleNetworkSwitch}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
          >
            Switch Network
          </button>
        </div>
      </div>
    </div>
  );

  const getChainInfo = (id) => {
    switch(id) {
      case bsc.id:
        return {
          name: 'BNB Smart Chain',
          shortName: 'BSC',
          status: 'correct',
          icon: '🔸'
        };
      case sepolia.id:
        return {
          name: 'Sepolia Testnet',
          shortName: 'Sepolia',
          status: 'wrong',
          icon: '🔷'
        };
      case 1:
        return {
          name: 'Ethereum',
          shortName: 'ETH',
          status: 'wrong',
          icon: '⚪'
        };
      default:
        return {
          name: `Unknown Network (${id})`,
          shortName: 'Unknown',
          status: 'wrong',
          icon: '⚠️'
        };
    }
  };

  if (!ready) {
    return (
      <div className="opacity-0 pointer-events-none select-none">
        Loading...
      </div>
    );
  }

  const chainInfo = chainId ? getChainInfo(chainId) : null;
  const isWrongNetwork = chainId !== bsc.id;

  return (
    <>
      {!authenticated ? (
        <button
          onClick={login}
          type="button"
          className="relative group px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300" />
          <span className="relative flex items-center">
            <svg
              className="w-5 h-5 mr-2 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Connect Wallet
          </span>
        </button>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <button
              onClick={isWrongNetwork ? handleNetworkSwitch : sendTransaction}
              type="button"
              disabled={isTransacting}
              className={`group flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 ${
                isWrongNetwork 
                  ? 'bg-yellow-500 hover:bg-yellow-600' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
            >
              <div className="w-5 h-5 mr-2 bg-white/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              
              <span className="relative">
                {isTransacting ? 'Processing...' : 
                  isWrongNetwork ?
                  'Switch to BSC' :
                  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'
                }
              </span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Disconnect
            </button>
          </div>
          
          {/* Enhanced network status indicator */}
          {chainInfo && (
            <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-md ${
              isWrongNetwork ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              <span>{chainInfo.icon}</span>
              <span className="font-medium">{chainInfo.name}</span>
              <span className="text-xs bg-yellow-200 px-1.5 py-0.5 rounded">
                {chainId && `Chain ID: ${chainId}`}
              </span>
              {isWrongNetwork && (
                <span className="text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded ml-1">
                  Wrong Network
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {showNetworkPrompt && <NetworkPrompt />}
    </>
  );
};

export default StyledConnectButton;