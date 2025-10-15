"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Hamburger icon variants for animation
  const topLineVariants = {
    open: { rotate: 45, y: 7 },
    closed: { rotate: 0, y: 0 }
  };

  const middleLineVariants = {
    open: { opacity: 0 },
    closed: { opacity: 1 }
  };

  const bottomLineVariants = {
    open: { rotate: -45, y: -7 },
    closed: { rotate: 0, y: 0 }
  };

  // Mobile menu variants
  const mobileMenuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  // Changed to bottom-to-top animation
  const menuItemVariants = {
    closed: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
    },
    open: { 
      y: 0, 
      opacity: 1,
      scale: 1
    }
  };

  // Navigation Items Array (used for both menus)
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/blogs", label: "Blogs" },
    // New Gallery Link
    { href: "/gallery", label: "Gallery" }, 
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-500 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className={`relative transition-all duration-300 ${
                isScrolled ? 'w-12 h-12' : 'w-16 h-16'
              }`}>
                <Image
                  src="/images/logo.png"
                  alt="Forever Security"
                  fill
                  className="object-contain transition-transform duration-300"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isScrolled 
                      ? 'text-gray-800 hover:text-[#1f8fce]' 
                      : 'text-white hover:text-blue-200'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled ? 'bg-[#1f8fce]' : 'bg-white'
                  }`}></span>
                </Link>
              ))}

              {/* Contact Us Button (formerly "Free Enquiry") */}
              <Link 
                href="/contact" 
                className={`rounded-md px-5 py-2.5 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium transition-all duration-300 ${
                  isScrolled 
                    ? 'bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-transparent hover:border-[#1f8fce] hover:text-[#1f8fce]' 
                    : 'bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-transparent hover:border-[#1f8fce] hover:text-[#1f8fce]'
                }`}
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-medium text-sm">
                  Contact Us
                </span>
              </Link>
            </div>

            {/* Mobile menu button with animated hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                  isScrolled 
                    ? 'text-gray-800 hover:text-[#1f8fce] hover:bg-gray-100' 
                    : 'text-white hover:text-blue-200 hover:bg-white/20'
                }`}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-between">
                  <motion.div
                    variants={topLineVariants}
                    animate={isOpen ? "open" : "closed"}
                    className="w-full h-0.5 bg-current rounded-full origin-center"
                  />
                  <motion.div
                    variants={middleLineVariants}
                    animate={isOpen ? "open" : "closed"}
                    className="w-full h-0.5 bg-current rounded-full"
                  />
                  <motion.div
                    variants={bottomLineVariants}
                    animate={isOpen ? "open" : "closed"}
                    className="w-full h-0.5 bg-current rounded-full origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Offcanvas Mobile Menu - COMPLETELY FIXED */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            
            {/* Mobile Menu Panel - NO SCROLLBAR */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl z-50 md:hidden flex flex-col"
              style={{ overflow: 'hidden' }}
            >
              {/* Header with Logo */}
              <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <div className="relative w-16 h-16">
                      <Image
                        src="/images/logo.png"
                        alt="Forever Security"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Menu Items - NO SCROLLBAR & BOTTOM-TO-TOP ANIMATION */}
              <div 
                className="flex-1 py-6 px-4"
                style={{ 
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <nav className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      variants={menuItemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:text-[#1f8fce] hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                      >
                        <span className="relative">
                          {item.label}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1f8fce] transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Footer with CTA Button */}
              <div className="p-6 border-t border-gray-200 flex-shrink-0">
                <motion.div
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: 0.6 }}
                  className="flex justify-start"
                >
                  {/* Updated Link to /contact and text to "Contact Us" */}
                  <Link
                    href="/contact" 
                    onClick={() => setIsOpen(false)}
                    className="rounded-md px-4 py-2.5 overflow-hidden relative group cursor-pointer border-2 font-medium bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-transparent hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm"
                  >
                    <span className="absolute w-48 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-16 bg-white top-1/2 group-hover:h-48 group-hover:-translate-y-24 ease"></span>
                    <span className="relative transition duration-300 ease font-medium">
                      Contact Us
                    </span>
                  </Link>
                </motion.div>
                
                {/* Contact Info */}
                <motion.div
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ delay: 0.7 }}
                  className="mt-4 text-left text-sm text-gray-600"
                >
                  <p>24/7 Support Available</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}