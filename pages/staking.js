// pages/staking.js
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dynamically import StakingPlatform with SSR disabled
const StakingPlatform = dynamic(
  () => import('../components/StakingPlatform'),
  { ssr: false }
);

const StakingPage = () => {
  return (
    <div>
      <Navbar />
      <StakingPlatform />
      <Footer />
    </div>
  );
};

export default StakingPage;
