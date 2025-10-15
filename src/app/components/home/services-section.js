"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const services = [
  {
    title: "Home Security",
    description: "Complete home security solutions with alarm systems, CCTV cameras, and smart home integration for ultimate protection.",
    icon: "🏠",
    slug: "home-security"
  },
  {
    title: "Business Security",
    description: "Comprehensive security systems for businesses with 24/7 monitoring and advanced threat detection technology.",
    icon: "🏢",
    slug: "business-security"
  },
  {
    title: "Cybersecurity",
    description: "Protect your digital assets with advanced cybersecurity solutions, monitoring, and threat prevention systems.",
    icon: "🔒",
    slug: "cybersecurity"
  },
  {
    title: "Security Consulting",
    description: "Expert security assessments and consulting services to identify risks and implement effective solutions.",
    icon: "📊",
    slug: "security-consulting"
  },
  {
    title: "Emergency Response",
    description: "Rapid response teams available 24/7 for emergency security situations and immediate threat resolution.",
    icon: "🚨",
    slug: "emergency-response"
  },
  {
    title: "Access Control",
    description: "Advanced access control systems to manage and monitor entry to your premises with smart technology.",
    icon: "🎫",
    slug: "access-control"
  },
];

// Animation variants
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
    y: 20
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
      duration: 0.5,
      ease: "backOut"
    }
  }
};

// Split text into letters for animation
const splitText = (text) => {
  return text.split('').map((char, index) => (
    <motion.span
      key={index}
      variants={letterVariants}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  ));
};

// Animated Title Component
const AnimatedTitle = () => {
  const title = "Our Security Services";
  const highlight = "Security";
  
  const parts = title.split(highlight);
  
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, margin: "-30px" }}
      className="inline-block"
    >
      {/* First part */}
      {splitText(parts[0])}
      
      {/* Highlighted part */}
      <motion.span 
        variants={highlightVariants}
        className="text-white inline-block"
      >
        {splitText(highlight)}
      </motion.span>
      
      {/* Second part if exists */}
      {parts[1] && splitText(parts[1])}
    </motion.span>
  );
};

export default function ServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef(null);
  const autorotateTiming = 5000;

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1); // 1 card on mobile
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2); // 2 cards on tablet
      } else {
        setCardsPerView(3); // 3 cards on desktop
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Calculate card width and translate percentage
  const cardWidthPercentage = 100 / cardsPerView;
  const translateX = currentIndex * cardWidthPercentage;

  // Auto-slide for right to left infinite carousel
  useEffect(() => {
    if (isDragging) return; // Pause auto-slide when dragging
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, autorotateTiming);

    return () => clearInterval(interval);
  }, [isDragging]);

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes('mouse') ? e.clientX : e.touches[0].clientX);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    
    const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    // Minimum drag distance to trigger slide change
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Drag left - next slide
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
      } else {
        // Drag right - previous slide
        setCurrentIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
      }
    }
    
    setIsDragging(false);
  };

  // Duplicate services for seamless infinite loop
  const duplicatedServices = [...services, ...services, ...services];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white font-montserrat mb-4">
            <AnimatedTitle />
          </h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Comprehensive security solutions tailored to protect your business, home, and digital assets
          </motion.p>
        </div>

        {/* Infinite Carousel Container - Responsive */}
        <div 
          className="relative overflow-hidden"
          ref={carouselRef}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <motion.div
            className="flex py-2 sm:py-4 select-none"
            animate={{ 
              x: `-${translateX}%`
            }}
            transition={{ 
              type: "tween", 
              ease: "easeInOut",
              duration: 0.6
            }}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {duplicatedServices.map((service, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-2 sm:px-3"
                style={{ 
                  width: `${cardWidthPercentage}%`,
                  minWidth: `${cardWidthPercentage}%`
                }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  slug={service.slug}
                  cardsPerView={cardsPerView}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination - Responsive */}
        <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Button - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8 sm:mt-12"
        >
          <Link
            href="/services"
            className="rounded-md px-6 sm:px-8 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-white border-white text-[#1f8fce] hover:bg-transparent hover:border-white hover:text-white transition-all duration-300 inline-flex items-center text-sm sm:text-base"
          >
            <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#1f8fce] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
            <span className="relative transition duration-300 ease font-semibold">
              View All Services
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ServiceCard component - Responsive
const ServiceCard = ({ title, description, icon, slug, cardsPerView }) => {
  return (
    <motion.div
      whileHover={{ 
        y: cardsPerView === 1 ? -5 : -10, // Smaller lift on mobile
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 sm:p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer shadow-lg flex flex-col h-full"
    >
      <div className="flex flex-col h-full">
        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
          {icon}
        </div>

        <div className="space-y-2 py-2 sm:py-4 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white font-montserrat">{title}</h3>
          <p className="text-gray-200 text-xs sm:text-sm font-poppins leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-3 border-t border-dashed border-white/30 pt-4 sm:pt-6 mt-auto">
          <Link
            href={`/services/${slug}`}
            className="inline-flex items-center gap-1 text-white font-medium hover:text-white border border-transparent px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all duration-300 text-xs sm:text-sm font-poppins"
          >
            Learn More
            <ChevronRight className="ml-0 size-3 sm:size-3.5 opacity-70" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};