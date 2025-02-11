import Image from "next/image";
import Navbar from "@/components/Navbar";
import StakingPlatform from "@/components/StakingPlatform";
import Footer from "@/components/Footer";



export default function Home() {
  return (
    <div>
      <Navbar/>
        <StakingPlatform/>
      <Footer/>
    </div>
  );
}
