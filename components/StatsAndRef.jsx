import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

const StatCounter = ({ end, title, prefix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const increment = end / (duration / 20);
    let start = 0;

    const timer = setInterval(() => {
      start += increment;
      if (start < end) {
        setCount(Math.ceil(start));
      } else {
        setCount(end);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center p-6 font-poppins">
      <h4 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h4>
      <p className="text-white text-3xl md:text-4xl font-bold">
        {prefix}{count.toLocaleString()}
      </p>
    </div>
  );
};

const StatsAndReferral = () => {
  const stats = [
    { title: 'Number of Users', end: 3897, prefix: '' },
    { title: 'Total Funds Invested', end: 4000000, prefix: '$' },
    { title: 'Total Earnings', end: 1200000, prefix: '$' }
  ];

  return (
    <>
      {/* Statistics Section */}
      <section className="bg-slate-950  font-poppins">
        <div className="max-w-screen-xl mx-auto px-4">
          <h3 className="text-center text-white text-3xl md:text-4xl font-bold mb-12">
            Statistics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                title={stat.title}
                end={stat.end}
                prefix={stat.prefix}
              />
            ))}
          </div>

          <div className=" flex flex-col sm:flex-row justify-center gap-4 ">
            <a
              href="https://bibox.com/trade/AGX_USDT"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full text-center transition-all duration-300"
            >
              Trade AGX
            </a>
            <a
              href="https://coinmarketcap.com/currencies/agricoin/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-full text-center transition-all duration-300"
            >
              Charts and Metrics
            </a>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="bg-slate-950 py-16 font-poppins">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="bg-[#0B1120] rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-8 md:p-12">
              <div className="relative h-[300px] md:h-[400px] w-full">
                <Image
                  src="/thumb.png"
                  alt="Referral illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-4">Refer a user</h2>
                <p className="text-gray-300 mb-8">
                  Get access to huge set of tools to seamlessly handle your game's
                  integration with blockchain.
                </p>
                <Link 
                  href="/refer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
                >
                  <Rocket className="w-5 h-5" />
                  Refer Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StatsAndReferral;