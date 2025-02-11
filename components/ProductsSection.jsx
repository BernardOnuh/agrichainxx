import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCards } from 'swiper/modules';
import { CreditCard, Rocket, Coins, Repeat } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const ProductsSection = () => {
  const productCards = [
    { 
      title: 'Payments', 
      icon: CreditCard,
      description: 'Fast and secure transactions'
    },
    { 
      title: 'Launchpool', 
      icon: Rocket,
      description: 'Early access to new projects'
    },
    { 
      title: 'Staking', 
      icon: Coins,
      description: 'Earn passive rewards'
    },
    { 
      title: 'Swap', 
      icon: Repeat,
      description: 'Instant token exchanges'
    }
  ];

  const investmentPackages = [
    { stake: 20, earn: 60, color: 'from-blue-600 to-blue-400' },
    { stake: 50, earn: 150, color: 'from-purple-600 to-purple-400' },
    { stake: 100, earn: 300, color: 'from-green-600 to-green-400' },
    { stake: 200, earn: 600, color: 'from-pink-600 to-pink-400' },
    { stake: 500, earn: 1500, color: 'from-yellow-600 to-yellow-400' },
    { stake: 1000, earn: 3000, color: 'from-red-600 to-red-400' }
  ];

  return (
    <section id="explore" className="bg-gradient-to-b from-white to-gray-50 font-poppins py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-1/4 -top-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"/>
          <div className="absolute -left-1/4 -bottom-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"/>
        </div>

        {/* Product Section Header */}
        <div className="relative mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div className="intro-content max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2 mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                <span className="text-green-600 font-semibold tracking-wide">PRODUCTS</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Explore Our 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Offerings</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                AGX is the native token on Agrichainx and serves as the utility token for staking and ecosystem utility. 
                It powers transactions as the gas token and secures the network through staking.
              </p>
            </div>
          </div>
        </div>

        {/* Product Cards Slider */}
        <div className="product-slides mb-20">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }}
            className="pb-12"
          >
            {productCards.map((card, index) => (
              <SwiperSlide key={index}>
                <div className="group h-full">
                  <div className="card bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 h-full 
                                transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                                relative overflow-hidden">
                    {/* Animated gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0">
                      <div className="absolute inset-[2px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl"/>
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <card.icon className="w-10 h-10 text-green-400 transform transition-transform duration-300 
                                           group-hover:scale-110 group-hover:rotate-12" />
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center
                                    transform transition-transform duration-300 group-hover:rotate-45">
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-2">{card.title}</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Investment Packages Section */}
        <div className="investment-packages">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Investment Packages & 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> ROI</span>
            </h3>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Earn a 200% ROI plus capital with a 2% daily earning rate for 150 days
            </p>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }}
            className="pb-12"
          >
            {investmentPackages.map((pkg, index) => (
              <SwiperSlide key={index}>
                <div className="group h-full">
                  <div className="card bg-white rounded-2xl p-6 md:p-8 h-full shadow-lg
                                transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                                border border-gray-100 relative overflow-hidden">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-0 
                                   group-hover:opacity-10 transition-opacity duration-300`}/>
                    
                    <div className="relative z-10">
                      <div className="bg-gray-50 rounded-xl p-4 mb-6 group-hover:bg-white transition-colors duration-300">
                        <h5 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                          Stake ${pkg.stake}
                        </h5>
                        <p className="text-green-600 text-lg md:text-xl font-semibold">
                          Earn ${pkg.earn}
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>2% Daily Earnings</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>150 Days Duration</span>
                        </div>
                      </div>

                      <button className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-500 text-white 
                                       px-6 py-3 rounded-xl font-bold text-lg shadow-lg
                                       hover:from-green-700 hover:to-green-600
                                       transform transition-all duration-300 hover:-translate-y-1
                                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Stake Now
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;