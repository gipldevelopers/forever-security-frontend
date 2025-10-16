"use client";

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { apiService } from '@/app/lib/api';

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
  const title = "Feedback from Satisfied Customers";
  const highlight = "Satisfied";
  
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
        className="text-[#1f8fce] inline-block"
      >
        {splitText(highlight)}
      </motion.span>
      
      {/* Second part if exists */}
      {parts[1] && (
        <>
          {/* Space between "Satisfied" and "Customers" */}
          <span className="inline-block"> </span>
          {splitText(parts[1])}
        </>
      )}
    </motion.span>
  );
};

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autorotate, setAutorotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const carouselRef = useRef(null);
  const autorotateTiming = 5000;

  // Fetch testimonials from API
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getTestimonials();
      
      if (response.success) {
        // Handle different response structures
        let testimonialsData = [];
        
        if (Array.isArray(response.data)) {
          testimonialsData = response.data;
        } else if (response.data && Array.isArray(response.data.testimonials)) {
          testimonialsData = response.data.testimonials;
        } else if (response.data && Array.isArray(response.data.data)) {
          testimonialsData = response.data.data;
        }
        
        if (testimonialsData.length === 0) {
          setTestimonials([]);
        } else {
          // Filter only approved testimonials if the field exists
          const approvedTestimonials = testimonialsData.filter(testimonial => {
            // Check different possible field names for approval status
            const isApproved = 
              testimonial.is_active === true || 
              testimonial.is_active === 1 ||
              testimonial.status === 'approved' ||
              testimonial.status === 'active' ||
              testimonial.approved === true;
            
            return isApproved;
          });
          
          setTestimonials(approvedTestimonials);
        }
      } else {
        setError(response.error || 'Failed to load testimonials');
      }
    } catch (error) {
      setError('Failed to load testimonials: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1); // 1 card on mobile
      } else {
        setCardsPerView(2); // 2 cards on tablet/desktop
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Calculate card width and translate percentage
  const cardWidthPercentage = 100 / cardsPerView;
  const translateX = currentIndex * cardWidthPercentage;

  // Duplicate testimonials for seamless infinite loop
  const duplicatedTestimonials = testimonials.length > 0 ? [...testimonials, ...testimonials, ...testimonials] : [];

  // Auto-scroll logic
  useEffect(() => {
    if (!autorotate || isDragging || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autorotateTiming);
    return () => clearInterval(interval);
  }, [currentIndex, autorotate, testimonials.length, isDragging]);

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes('mouse') ? e.clientX : e.touches[0].clientX);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;

    const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50 && testimonials.length > 0) {
      if (diffX > 0) {
        // Swipe left - next slide
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      } else {
        // Swipe right - previous slide
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
      setAutorotate(false);
    }

    setIsDragging(false);
  };

  // Star rating component with Lucide icons
  const StarRating = ({ rating = 5 }) => (
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          } mr-1`}
        />
      ))}
    </div>
  );

  // Avatar component
  const Avatar = ({ src, alt, name }) => {
    // If no image, show initials
    if (!src) {
      const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CU';
      return (
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1f8fce] flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <span className="text-white font-semibold text-sm sm:text-base">
            {initials}
          </span>
        </div>
      );
    }

    return (
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, show initials
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            const initials = alt ? alt.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'CU';
            parent.innerHTML = `
              <div class="w-full h-full bg-[#1f8fce] flex items-center justify-center">
                <span class="text-white font-semibold text-sm sm:text-base">${initials}</span>
              </div>
            `;
          }}
        />
      </div>
    );
  };

  // Single testimonial card component
  const TestimonialCard = ({ testimonial }) => {
    // Get content from different possible field names
    const content = testimonial.content || testimonial.message || testimonial.testimonial || 'No testimonial content available.';
    
    // Get name from different possible field names
    const name = testimonial.name || testimonial.client_name || 'Anonymous Customer';
    
    // Get position/role from different possible field names
    const position = testimonial.position || testimonial.role || testimonial.designation || 'Customer';
    
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
        className="flex flex-col h-full bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mx-2"
      >
        <StarRating rating={testimonial.rating || 5} />
        
        <div className="mb-4 sm:mb-6 flex-1">
          <div className="relative">
            <p className="text-sm sm:text-lg text-gray-700 italic leading-relaxed">
              &quot;{content}&quot;
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Avatar 
            src={testimonial.image_url || testimonial.avatar || testimonial.profile_picture} 
            alt={name} 
            name={name}
          />
          <div>
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">
              {name}
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm">
              {position}
            </p>
            {testimonial.company && (
              <p className="text-gray-500 text-xs mt-1">
                {testimonial.company}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Loading Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8 sm:mb-12">
            <div className="lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mt-2"></div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="flex space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex py-2 sm:py-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ 
                    width: `${cardWidthPercentage}%`,
                    minWidth: `${cardWidthPercentage}%`
                  }}
                >
                  <div className="flex flex-col h-full bg-white p-4 sm:p-6 rounded-xl shadow-md animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6 mb-6"></div>
                    <div className="flex items-center mt-auto">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Testimonials
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {error}
          </p>
          <button
            onClick={fetchTestimonials}
            className="bg-[#1f8fce] text-white px-6 py-3 rounded-lg hover:bg-[#167aac] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Customer Testimonials
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            No testimonials available yet. Check back later to see what our customers are saying about our services.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Section - Responsive */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 sm:mb-12">
          <div className="lg:w-1/2 mb-6 lg:mb-0 text-center lg:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                <AnimatedTitle />
              </h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0"
              >
                We take pride in delivering exceptional security solutions that exceed our clients&apos; expectations. But don&apos;t just take our word for it
              </motion.p>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="flex space-x-3 sm:space-x-4">
              <button 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
                  setAutorotate(false);
                }}
                disabled={testimonials.length === 0}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
              <button 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setCurrentIndex((currentIndex + 1) % testimonials.length);
                  setAutorotate(false);
                }}
                disabled={testimonials.length === 0}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
            </div>
          </div>
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
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 px-2 sm:px-3"
                style={{ 
                  width: `${cardWidthPercentage}%`,
                  minWidth: `${cardWidthPercentage}%`
                }}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        {testimonials.length > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutorotate(false);
                }}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#1f8fce] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}