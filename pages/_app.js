import "../styles/globals.css";
import { Poppins } from 'next/font/google';
import { PrivyProvider } from '@privy-io/react-auth';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
});

// Enhanced BNB Smart Chain configuration
const bscChain = {
  ...bsc,
  rpcUrls: {
    default: {
      http: ['https://bsc-dataseed.binance.org'],
    },
    public: {
      http: ['https://bsc-dataseed1.binance.org', 'https://bsc-dataseed2.binance.org'],
    },
  },
};

// Configure wagmi with explicit BNB chain settings
const config = createConfig({
  chains: [bscChain],
  transports: {
    [bscChain.id]: http(bscChain.rpcUrls.default.http[0]),
  },
});

// Create Query Client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Handler for successful wallet connection
  const handleSuccess = async () => {
    try {
      // Verify chain connection
      const { getNetwork } = await import('@wagmi/core');
      const network = await getNetwork();
      
      if (network.chain?.id !== bscChain.id) {
        console.warn('Not connected to BSC. Please switch networks.');
        return;
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error verifying chain connection:', error);
    }
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId="cm7gjpxpq00jkomoae7hab47s"
          config={{
            loginMethods: ['email', 'wallet'],
            appearance: {
              theme: 'light',
              accentColor: '#22c55e',
            },
            supportedChains: [{
              chainId: 56,
              name: 'BNB Smart Chain',
              chainId_hex: '0x38',
              namespace: 'eip155',
              rpcUrls: {
                default: {
                  http: ['https://bsc-dataseed.binance.org']
                }
              },
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
              },
              blockExplorerUrls: ['https://bscscan.com'],
              iconUrls: ['https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png']
            }],
            defaultChain: {
              chainId: 56,
              name: 'BNB Smart Chain'
            }
          }}
          onSuccess={handleSuccess}
        >
          <main className={`${poppins.variable}`}>
            <Component {...pageProps} />
          </main>
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}