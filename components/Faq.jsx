import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';
import { Plus, Minus } from 'lucide-react';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What is Agrichainx Launchpool?",
      answer: "Agrichainx Launchpool is a Web3 infrastructure for Agrichainx ecosystem that provides end-to-end staking and liquidity pooling solutions for our 50,000+ individual and institutional clients. Agrichainx Launchpool is a free platform where users can post and farm AGX, AGXT, and USDT. Simply contribute AGX, AGXT, or USDT to the staking pool and earn rewards."
    },
    {
      question: "How does Agrichains Launchpool and staking work?",
      answer: "AgrichainX Launchpool and staking works by contributing AGX, AGXT, and USDT to the investment pool. The pool simplifies this process by delegating your tokens automatically to our trading exchange while issuing you liquid staking tokens in return, such as USDT. Your invested tokens not only gain you rewards but also have liquidity and can be traded on major exchanges."
    },
    {
      question: "What cryptocurrencies can be staked?",
      answer: "You can stake our selected tokens on Proof-of-Stake blockchains via Agrichainx Staking, like AGX, AGXT, USDT, BNB, and more."
    },
    {
      question: "How do I start staking?",
      answer: "You can start staking by navigating to Agrichainx Launchpool and connecting your wallet from the supported wallet options. You can choose an asset to stake and follow the step-by-step instructions on how it works."
    },
    {
      question: "What are the benefits of staking?",
      answer: "Staking is an excellent way to earn rewards on the assets you plan on holding. Staking allows you to earn rewards passively in any market condition, increasing your potential return on investment. Additionally, staking through Agrichainx Launchpool provides several additional benefits, such as increased flexibility and the opportunity to earn more with Liquid Staking tokens in DeFi."
    },
    {
      question: "How much can I earn from staking?",
      answer: "Agrichainx Launchpool staking makes it easy to calculate how much you could be earning on your invested assets. You can visit the investment package and ROI section to know more about your earnings."
    },
    {
      question: "Can I withdraw my staked coins at any time?",
      answer: "Withdrawal is automatic; you can make your 2% withdrawal daily. You can make your withdrawal anytime, and it will automatically be delivered to your wallet."
    },
    {
      question: "What is DeFi staking?",
      answer: "The tokens are locked on the network, and no one but you has access to them. DeFi Staking is the most profitable way to generate passive income from your cryptocurrency. Agrichainx supports AGX, AGXT, BNB, USDT, and safe ways of DeFi Staking."
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-950 to-black py-20 font-poppins overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-900/20 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-semibold tracking-wide uppercase text-sm">FAQ</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently Asked
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400"> Questions</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Find answers to common questions about Agrichainx Launchpool and staking
          </p>
        </div>
        
        <Accordion 
          allowMultipleExpanded={false} 
          allowZeroExpanded 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          onChange={(uuids) => setActiveIndex(uuids[0])}
        >
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              uuid={`item-${index}`}
              className="group"
            >
              <AccordionItemHeading>
                <AccordionItemButton className="
                  relative bg-gradient-to-r from-gray-800 to-gray-900
                  text-white p-6 rounded-xl
                  transition-all duration-300
                  hover:shadow-lg hover:shadow-green-500/10
                  flex items-center justify-between
                  border border-gray-700 group-hover:border-green-500/50
                  cursor-pointer
                ">
                  <span className="font-semibold pr-8">{item.question}</span>
                  <div className="absolute right-6 transition-transform duration-300">
                    {activeIndex === `item-${index}` ? (
                      <Minus className="w-5 h-5 text-green-400" />
                    ) : (
                      <Plus className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className="
                bg-gradient-to-r from-gray-800/50 to-gray-900/50
                backdrop-blur-sm
                text-gray-300
                p-6
                rounded-b-xl
                text-base
                leading-relaxed
                border-x border-b border-gray-700
                transform transition-all duration-300
              ">
                <div className="relative">
                  {/* Green dot decorator */}
                  <div className="absolute -left-2 top-2 w-1 h-1 bg-green-500 rounded-full" />
                  <p className="pl-4">{item.answer}</p>
                </div>
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom decorator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      </div>
    </section>
  );
}

export default FAQ;