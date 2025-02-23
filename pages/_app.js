import "../styles/globals.css";
import { Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
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

// Web3Modal configuration
const projectId = 'YOUR_PROJECT_ID';

const metadata = {
  name: 'Your App Name',
  description: 'Your App Description',
  url: 'https://yourapp.com',
  icons: ['https://yourapp.com/icon.png']
};

// Configure wagmi
const chains = [bscChain];
const wagmiConfig = defaultWagmiConfig({ 
  chains, 
  projectId, 
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
});

// Create Query Client
const queryClient = new QueryClient();

// Wrapper component to handle client-side initialization
function Web3ModalProvider({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Initialize Web3Modal on the client side
    createWeb3Modal({
      wagmiConfig,
      projectId,
      chains,
      defaultChain: bscChain,
      themeMode: 'light',
      themeVariables: {
        '--w3m-accent': '#22c55e',
        '--w3m-font-family': 'var(--font-poppins)',
      }
    });
    setReady(true);
  }, []);

  if (!ready) return null;

  return children;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Web3ModalProvider>
          <main className={`${poppins.variable}`}>
            <Component {...pageProps} />
          </main>
        </Web3ModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}