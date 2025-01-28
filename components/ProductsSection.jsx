import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { CreditCard, Rocket, Coins, Repeat } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const ProductsSection = () => {
  const productCards = [
    { title: 'Payments', icon: CreditCard },
    { title: 'Launchpool', icon: Rocket },
    { title: 'Staking', icon: Coins },
    { title: 'Swap', icon: Repeat }
  ];

  const investmentPackages = [
    { stake: 20, earn: 60 },
    { stake: 50, earn: 150 },
    { stake: 100, earn: 300 },
    { stake: 200, earn: 600 },
    { stake: 500, earn: 1500 },
    { stake: 1000, earn: 3000 }
  ];

  return (
    <section id="explore" className="bg-white font-poppins py-12 md:py-16 lg:py-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Section Header */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="intro flex flex-col md:flex-row justify-between items-start md:items-end m-0">
            <div className="intro-content">
              <span className="inline-block text-green-600 text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wider uppercase mb-2">
                PRODUCTS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mt-2 mb-4">
                Explore Our Offerings
              </h2>
            </div>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mt-4 leading-relaxed">
            AGX is the native token on Agrichainx and serves as the utility token for staking and ecosystem utility. 
            It powers transactions as the gas token and secures the network through staking. AGX is crucial for 
            governance, incentivizing growth, and facilitating payments.
          </p>
        </div>

        {/* Product Cards Slider */}
        <div className="product-slides mt-8 md:mt-12">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }}
            className="pb-12"
          >
            {productCards.map((card, index) => (
              <SwiperSlide key={index}>
                <div className="card product-card bg-black rounded-xl p-6 md:p-8 transform transition-all duration-300 hover:scale-105">
                  <div className="card-body text-white flex items-center justify-between">
                    <div>
                      <h4 className="text-lg md:text-xl lg:text-2xl font-bold">{card.title}</h4>
                    </div>
                    <card.icon className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Investment Packages Section */}
        <div className="investment-packages mt-12 md:mt-16 lg:mt-20">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4">
            Investment Packages & ROI
          </h3>
          <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
            Earn a 200% ROI plus capital with a 2% daily earning rate for 150 days. 
            Choose from the following packages:
          </p>

          {/* Investment Package Slider */}
          <div className="investment-slides">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
              className="pb-12"
            >
              {investmentPackages.map((pkg, index) => (
                <SwiperSlide key={index}>
                  <div className="card investment-card bg-black rounded-xl p-6 md:p-8 transform transition-all duration-300 hover:scale-105">
                    <div className="card-body text-white">
                      <h5 className="text-xl md:text-2xl font-bold mb-3">Stake ${pkg.stake}</h5>
                      <p className="text-lg md:text-xl font-semibold mb-6">Earn ${pkg.earn}</p>
                    </div>
                    <div className="action text-center">
                      <button className="w-full bg-white text-black px-6 py-3 rounded-full font-bold text-base md:text-lg 
                                     hover:bg-green-500 hover:text-white transition-all duration-300 
                                     transform hover:-translate-y-1">
                        Stake Now
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;