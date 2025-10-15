"use client";

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

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

// Testimonial data matching the content from the image
const testimonials = [
  {
    img: "https://recrute.fleexstudio.com/wp-content/uploads/2024/12/tes3-img1.png",
    quote: "Discover what our clients have to say about their experience with Recrute. From small businesses to Fortune 500 companies, our tailored staffing solutions have left a lasting impact on organizations across industries. With a focus on excellence",
    name: "Sujon M.",
    role: "Software Engineer"
  },
  {
    img: "https://recrute.fleexstudio.com/wp-content/uploads/2024/12/tes3-img2.png",
    quote: "From startups seeking their first hires to established corporations aiming to expand their teams, our tailored staffing solutions have consistently exceeded expectations. With testimonials highlighting our ability to find the perfect, our tailored staffing solutions",
    name: "Amir Jamil",
    role: "Software Engineer"
  },
  {
    img: "https://recrute.fleexstudio.com/wp-content/uploads/2024/12/tes3-img1.png",
    quote: "Discover what our clients have to say about their experience with Recrute. From small businesses to Fortune 500 companies, our tailored staffing solutions have left a lasting impact on organizations across industries. With a focus on excellence",
    name: "Sujon M.",
    role: "Co Funder"
  },
  {
    img: "https://recrute.fleexstudio.com/wp-content/uploads/2024/12/tes3-img2.png",
    quote: "Discover what our clients have to say about their experience with Recrute. From small businesses to Fortune 500 companies, our tailored staffing solutions have left a lasting impact on organizations across industries. With a focus on excellence",
    name: "Amir Jamil",
    role: "Co Funder"
  }
];

export default function TestimonialPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autorotate, setAutorotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const carouselRef = useRef(null);
  const autorotateTiming = 5000;

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
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Auto-scroll logic
  useEffect(() => {
    if (!autorotate || isDragging) return;
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

    if (Math.abs(diffX) > 50) {
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
  const StarRating = () => (
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current mr-1"
        />
      ))}
    </div>
  );

  // Avatar component
  const Avatar = ({ src, alt }) => (
    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );

  // Single testimonial card component - HOVER ANIMATIONS RESTORED
  const TestimonialCard = ({ testimonial }) => (
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
      <StarRating />
      
      <div className="mb-4 sm:mb-6 flex-1">
        <div className="relative">
          <p className="text-sm sm:text-lg text-gray-700 italic leading-relaxed">
            &quot;{testimonial.quote}&quot;
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        <Avatar src={testimonial.img} alt={testimonial.name} />
        <div>
          <h4 className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</h4>
          <p className="text-gray-600 text-xs sm:text-sm">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );

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
                We take pride in delivering exceptional staffing solutions that exceed our clients&apos; expectations. But don&apos;t just take our word for it
              </motion.p>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="flex space-x-3 sm:space-x-4">
              <button 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                onClick={() => {
                  setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
                  setAutorotate(false);
                }}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
              <button 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                onClick={() => {
                  setCurrentIndex((currentIndex + 1) % testimonials.length);
                  setAutorotate(false);
                }}
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
                key={index}
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
      </div>
    </section>
  );
}