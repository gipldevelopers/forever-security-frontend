"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const sliderRef = useRef(null);

  // Slide data with local images - REAL DATA CONTENT
  const slides = [
    {
      id: 1,
      backgroundImage: '/images/2148404004.jpg',
      title: 'Count on us for Professional Security',
      highlight: 'Professional Security',
      subtitle: 'Reliable, vigilant, and comprehensive security solutions across Commercial, Residential, and Event venues in Gujarat.'
    },
    {
      id: 2,
      backgroundImage: '/images/security-guard-officer-group_1016675-833.jpg',
      title: '24/7 Elite Guard Deployment',
      highlight: 'Elite Guard',
      subtitle: 'Highly trained personnel and technology-driven response teams for ultimate, round-the-clock protection.'
    },
    {
      id: 3,
      backgroundImage: '/images/3rd.jpg', // Placeholder image - replace with a relevant one
      title: 'Tech-Driven Security Solutions',
      highlight: 'Tech-Driven',
      subtitle: 'Combining smart surveillance, real-time monitoring, and advanced access controls for maximum asset safety.'
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isDragging]);

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes('mouse') ? e.clientX : e.touches[0].clientX);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;

    const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }

    setIsDragging(false);
  };

  // Split text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const highlightVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "backOut"
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const buttonsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Split text into letters for animation - with better word wrapping
  const splitText = (text, isHighlight = false) => {
    // Split by words instead of individual letters for better wrapping
    const words = text.split(' ');
    
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block mr-1 last:mr-0">
        {word.split('').map((char, charIndex) => (
          <motion.span
            key={`${wordIndex}-${charIndex}`}
            variants={isHighlight ? highlightVariants : letterVariants}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
        {wordIndex < words.length - 1 && '\u00A0'}
      </span>
    ));
  };

  // Split title with highlight - improved for mobile wrapping
  const renderAnimatedTitle = (title, highlight) => {
    const parts = title.split(highlight);

    return (
      <div className="break-words">
        {splitText(parts[0])}
        <motion.span variants={highlightVariants} className="text-[#1f8fce] inline-block">
          {splitText(highlight, true)}
        </motion.span>
        {parts[1] && splitText(parts[1])}
      </div>
    );
  };

  return (
    <section
      className="relative h-[70vh] sm:h-screen w-full overflow-hidden"
      ref={sliderRef}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark overlay for better text contrast */}
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-black/60 sm:bg-black/70"></div>
        </div>
      ))}

      {/* Content with split text animations */}
      <main className="relative h-full flex items-center justify-center text-center z-10">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-4xl">
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
              >
                {/* Main Headline with Split Text Animation - Improved wrapping */}
                <motion.h1
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 font-montserrat leading-tight break-words px-2"
                >
                  {renderAnimatedTitle(slides[currentSlide].title, slides[currentSlide].highlight)}
                </motion.h1>

                {/* Subtext/Description - Responsive */}
                <motion.p
                  variants={subtitleVariants}
                  className="text-sm sm:text-lg md:text-xl text-white max-w-xl mx-auto px-4 font-poppins leading-relaxed mb-4 sm:mb-6"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                {/* Action Buttons - Properly centered on all screens */}
                <motion.div
                  variants={buttonsVariants}
                  className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md mx-auto"
                >
                  {/* Primary Button: Our Services */}
                  <Link
                    href="/services"
                    className="rounded-md px-4 sm:px-6 py-2.5 sm:py-3 overflow-hidden relative group cursor-pointer border-2 font-medium bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                    <span className="relative transition duration-300 ease font-semibold">
                      Our Services
                    </span>
                  </Link>

                  {/* Secondary Button: Contact Us */}
                  <Link
                    href="/contact"
                    className="rounded-md px-4 sm:px-6 py-2.5 sm:py-3 overflow-hidden relative group cursor-pointer border-2 font-medium bg-transparent border-white text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                    <span className="relative transition duration-300 ease font-semibold">
                      Contact Us
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-[#1f8fce] w-4 sm:w-6' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}