import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

function FAQ() {
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
    <section className="bg-slate-950 py-16 font-poppins">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-white text-4xl font-bold">Frequently Asked Questions</h2>
        </div>
        
        <Accordion 
          allowMultipleExpanded={false} 
          allowZeroExpanded 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {faqData.map((item, index) => (
            <AccordionItem key={index} uuid={`item-${index}`}>
              <AccordionItemHeading>
                <AccordionItemButton className="
                  bg-green-600 
                  text-white 
                  p-4 
                  rounded-lg 
                  hover:bg-green-700 
                  transition-colors 
                  duration-300 
                  text-left 
                  font-semibold
                ">
                  {item.question}
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className="
                bg-green-500 
                text-white 
                p-4 
                rounded-b-lg 
                text-sm 
                leading-relaxed
              ">
                {item.answer}
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ; 