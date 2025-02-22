import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Send } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { 
      icon: Facebook, 
      href: 'https://www.facebook.com/share/1AE3WAd7FQ/',
      hoverColor: 'hover:bg-blue-600',
      label: 'Follow us on Facebook'
    },
    
    { 
      icon: Twitter, 
      href: 'https://x.com/agrichainx2022',
      hoverColor: 'hover:bg-blue-400',
      label: 'Follow us on X (Twitter)'
    },
    { 
      icon: Send, 
      href: 'https://t.me/agrichainxofficial',
      hoverColor: 'hover:bg-blue-500',
      label: 'Join our Telegram'
    }
  ];

  return (
    <footer className="relative w-full bg-gradient-to-b from-gray-900 to-black py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-900/20 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-900/20 rounded-full 
                       mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-10">
          {/* Logo Circle */}
          <div className="group relative">
            {/* Outer glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-full 
                          opacity-75 group-hover:opacity-100 blur transition-opacity duration-500" />
            {/* Logo container */}
            <div className="relative w-32 h-32 bg-black rounded-full flex items-center justify-center
                          transform transition-transform duration-500 group-hover:scale-105">
              <div className="text-green-500 transform transition-transform duration-500 group-hover:rotate-180">
              <Image 
                src="/logo.png"
                alt="Brand Logo"
                width={150}
                height={50}
                priority
                className="h-10 w-auto sm:h-12 relative transform transition-transform duration-300 group-hover:scale-105"
              />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center space-x-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label={social.label}
              >
                {/* Button background with hover effect */}
                <div className="relative p-3 rounded-full bg-gray-800 
                              transform transition-all duration-300 
                              group-hover:scale-110 group-hover:rotate-6">
                  <social.icon className="w-6 h-6 text-gray-400 
                                       transition-colors duration-300 
                                       group-hover:text-white" />
                </div>
                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 
                               text-sm text-white bg-gray-800 rounded-lg opacity-0 
                               group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {social.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Community Text */}
          <div className="text-center">
            <h3 className="text-xl text-transparent bg-clip-text bg-gradient-to-r 
                         from-green-400 to-blue-400 font-bold mb-2">
              Join Our 52K+ Strong Community
            </h3>
            <p className="text-gray-400">
              Be part of the revolution in agricultural blockchain technology
            </p>
          </div>

          {/* Divider */}
          <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              ©2024 Agrichainx , All Rights Reserved By @Agrichainx 
            </p>
            <div className="mt-2 text-gray-600 text-xs">
              <Link href="/privacy" className="hover:text-green-500 transition-colors">Privacy Policy</Link>
              <span className="mx-2">•</span>
              <Link href="/terms" className="hover:text-green-500 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;