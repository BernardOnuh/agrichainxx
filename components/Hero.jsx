import Image from 'next/image'
import Link from 'next/link'
import { IoRocketOutline } from "react-icons/io5";
import { LuNotebookPen } from "react-icons/lu";

const HeroSection = () => {
  return (
    <section 
      className="relative  w-full bg-green-600 font-poppins font-bold"
      style={{
        backgroundImage: "linear-gradient(180deg, rgba(76, 175, 80, 1), rgba(0, 0, 0, 0.9))",
      }}
    >
      <div className="container max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Column: Text and Buttons */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <div className="hero-content">
              <div className="mb-12">
                <span className="text-white/80 font-semibold text-sm tracking-wider">
                  AGX/AGXT/USDT
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mt-4 leading-[1.5] sm:leading-[1.1]">
                    Agrichainx Launchpool and DeFi Staking
                    </h1>
                <p className="text-blue-200/90 font-semibold text-lg mt-6">
                  Agrichainx launchpool is a non-custodial platform that lets you effortlessly stake AGX, AGXT & USDT tokens without the risks of centralized staking to provide attractive returns, profitable staking APR, and complete safety.
                </p>
              </div>

              {/* Call to Action Text */}
              <p className="text-blue-200/90 font-semibold mb-6">
                Buy AGX/AGXT/USDT | Stake | Get Rewards!
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#explore"
                  className="inline-flex items-center px-8 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-all duration-300"
                >
                 <div className="relative px-2">
                 <IoRocketOutline className=' text-xl md:text-2xl'/>
                    </div>
                  Explore
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-full hover:bg-gray-900/90 hover:text-white transition-all duration-300"
                >
                  <div className="relative px-2">
                    <LuNotebookPen className=' text-xl md:text-2xl'/>
                    </div>
                  Refer a user
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="w-full md:w-1/2 text-center">
            <div className="relative">
              <Image
                src="/herow.jpg"
                alt="Hero"
                width={600}
                height={500}
                className="rounded-lg w-full max-w-xl mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection