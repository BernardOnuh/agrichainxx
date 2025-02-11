import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import StyledConnectButton from './ConnectWallet/ConnectWallet';

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated navItems to handle contact email
  const navItems = [
    { href: '/', label: 'Home', isExternal: false },
    { href: '/staking', label: 'Staking', isExternal: false },
    { href: '/referral', label: 'Referral', isExternal: false },
    { href: '/swap', label: 'Swap', isExternal: false },
    { href: '/', label: 'Earn', isExternal: false },
    { href: 'mailto:agrichainx@gmail.com', label: 'Contact', isExternal: true }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href) && !href.startsWith('mailto:');
  };

  // Helper component for nav items
  const NavItem = ({ item, isMobile = false }) => {
    if (item.isExternal) {
      return (
        <a
          href={item.href}
          className={`relative px-4 py-2 text-md text-white group overflow-hidden rounded-md transition-all duration-300 
                     hover:bg-white/5 ${isMobile ? 'block w-full' : ''}`}
        >
          <span className="relative z-10">{item.label}</span>
        </a>
      );
    }

    return (
      <Link 
        href={item.href} 
        className={`relative px-4 py-2 text-md text-white group overflow-hidden rounded-md transition-all duration-300 ${
          isActive(item.href) 
            ? 'bg-white/20 backdrop-blur-sm font-bold' 
            : 'hover:bg-white/5'
        } ${isMobile ? 'block w-full' : ''}`}
      >
        <span className="relative z-10">{item.label}</span>
        <div className={`absolute inset-0 h-full w-full bg-gradient-to-r from-green-400 to-green-500 
                       transform transition-transform duration-300 origin-left
                       ${isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
      </Link>
    );
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full font-poppins font-bold transition-all duration-300 ${
        scrolled 
          ? 'bg-green-500' // Changed to solid green background
          : 'bg-gradient-to-r from-green-500 to-green-600'
      }`}
    >
      <nav className="px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex-shrink-0 relative group"
            >
              <div className="absolute -inset-2 bg-white/5 rounded-lg blur-sm group-hover:bg-white/10 transition-all duration-300" />
              <Image 
                src="/logo.png"
                alt="Brand Logo"
                width={150}
                height={50}
                priority
                className="h-10 w-auto sm:h-12 relative transform transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block transform hover:scale-105 transition-transform duration-300">
                <StyledConnectButton />
              </div>

              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden relative group p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                aria-label="Menu"
              >
                <div className="flex flex-col justify-center items-center w-6 h-6 space-y-1.5 transform transition-transform duration-300 group-hover:rotate-90">
                  <span className="block w-6 h-0.5 bg-white rounded-full transform transition-transform duration-300 group-hover:rotate-45 group-hover:translate-y-2" />
                  <span className="block w-6 h-0.5 bg-white rounded-full transition-opacity duration-300 group-hover:opacity-0" />
                  <span className="block w-6 h-0.5 bg-white rounded-full transform transition-transform duration-300 group-hover:-rotate-45 group-hover:-translate-y-2" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div 
          className={`fixed right-0 top-0 h-full w-[280px] bg-gradient-to-b from-green-400 to-green-600 p-6 shadow-2xl transform transition-transform duration-500 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h5 className="text-xl text-white font-bold">Menu</h5>
            <button 
              onClick={() => setMenuOpen(false)}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors duration-300"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} isMobile={true} />
            ))}
            
            <div className="pt-4 transform transition-transform duration-300 hover:scale-105">
              <StyledConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;