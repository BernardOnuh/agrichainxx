import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import StyledConnectButton from './ConnectWallet/ConnectWallet'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home', active: true },
    { href: '/project-2', label: 'Referral' },
    { href: '/staking-1', label: 'Staking' },
    { href: '/contact', label: 'Contact' },
    { href: '/register', label: 'Earn' },
    { href: '/analytic', label: 'Launchpool' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[#4CAF50] shadow-lg font-poppins font-bold">
      <nav className="px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/logo.png"
                alt="Brand Logo"
                width={150}
                height={50}
                priority
                className="h-10 w-auto sm:h-12"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`px-3 py-2 rounded-md text-md text-white hover:bg-green-700 transition-colors ${
                    item.active ? 'bg-green-700' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Connect Wallet Button - Desktop */}
              <div className="hidden sm:block">
                <StyledConnectButton/>
              </div>

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1.5"
                aria-label="Menu"
              >
                <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                <span className="block w-6 h-0.5 bg-white rounded-full"></span>
                <span className="block w-6 h-0.5 bg-white rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slide-over */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-[#4CAF50] bg-opacity-50" onClick={() => setMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-[280px] bg-[#4CAF50] p-6 overflow-y-auto transform transition-transform duration-300">
            <div className="flex items-center justify-between mb-8">
              <h5 className="text-xl text-white">Menu</h5>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-2 text-white hover:bg-gray-800 rounded-full"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-white rounded-md hover:bg-gray-800 transition-colors ${
                    item.active ? 'bg-green-800' : ''
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Connect Wallet Button - Mobile */}
              <div className="pt-4">
                <StyledConnectButton/>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar