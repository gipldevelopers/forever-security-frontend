'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('scroll', updateProgress);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-6 right-6 z-50 group cursor-pointer"
          aria-label="Back to top"
        >
          {/* Main Button Container */}
          <div className="relative">
            {/* Outer Glow Effect */}
            <div className={`absolute inset-0 bg-[var(--primary-color)] rounded-full transition-all duration-500 ${
              isHovered ? 'animate-pulse scale-125 opacity-20' : 'opacity-0 scale-100'
            }`}></div>
            
            {/* Progress Ring Container */}
            <div className="relative w-12 h-12 md:w-14 md:h-14">
              {/* Background Circle */}
              <svg className="w-12 h-12 md:w-14 md:h-14 transform -rotate-90" viewBox="0 0 100 100">
                {/* Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-300/50"
                />
                
                {/* Progress Fill */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={251 - (scrollProgress * 251) / 100}
                  className="text-[var(--primary-color)] transition-all duration-150"
                  style={{
                    filter: 'drop-shadow(0 0 2px var(--primary-color))'
                  }}
                />
              </svg>

              {/* Inner Button */}
              <div className={`
                absolute inset-0 m-1.5 md:m-2 rounded-full bg-[var(--primary-color)] 
                flex items-center justify-center cursor-pointer
                transition-all duration-300 transform
                group-hover:scale-110 group-hover:shadow-2xl
                shadow-lg backdrop-blur-sm border border-white/20
              `}>
                {/* Ripple Effect */}
                <div className={`
                  absolute inset-0 rounded-full bg-[var(--primary-color)] 
                  transition-all duration-500
                  ${isHovered ? 'animate-ripple scale-150 opacity-0' : 'scale-100 opacity-100'}
                `}></div>
                
                {/* Shine Effect */}
                <div className={`
                  absolute inset-0 rounded-full overflow-hidden
                  ${isHovered ? 'animate-shine' : ''}
                `}>
                  <div className="absolute top-0 -inset-x-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"></div>
                </div>

                {/* Icon */}
                <ChevronUp className={`
                  w-4 h-4 md:w-5 md:h-5 text-white relative z-10 cursor-pointer
                  transition-all duration-300
                  ${isHovered ? 'scale-110' : 'scale-100'}
                `} />
              </div>
            </div>
          </div>
        </button>
      )}
    </>
  );
};

export default BackToTop;