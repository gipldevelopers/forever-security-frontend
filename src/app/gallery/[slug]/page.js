"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, ZoomIn } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Split text into letters for animation
const splitText = (text) => {
  return text.split("").map((char, index) => (
    <motion.span key={index} variants={letterVariants} className="inline-block">
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ));
};

// Gallery Data with original image URLs
const galleryAlbums = {
  'security-system-installations': {
    id: 1,
    title: "Security System Installations",
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558002038-1055897bef33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560421682-2db0c1312831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ]
  },
  'cctv-surveillance-projects': {
    id: 2,
    title: "CCTV Surveillance Projects",
    images: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560421682-2db0c1312831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  },
  'access-control-systems': {
    id: 3,
    title: "Access Control Systems",
    images: [
      "https://images.unsplash.com/photo-1560421682-2db0c1312831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]
  }
};

// Slide variants for image navigation
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

export default function GalleryDetailPage({ params }) {
  const [slug, setSlug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error('Error resolving params:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getParams();
  }, [params]);

  const openImage = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setDirection(0);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
    setDirection(0);
  };

  const nextImage = () => {
    if (album && album.images) {
      setDirection(1);
      const nextIndex = (currentImageIndex + 1) % album.images.length;
      setCurrentImageIndex(nextIndex);
      setSelectedImage(album.images[nextIndex]);
    }
  };

  const prevImage = () => {
    if (album && album.images) {
      setDirection(-1);
      const prevIndex = (currentImageIndex - 1 + album.images.length) % album.images.length;
      setCurrentImageIndex(prevIndex);
      setSelectedImage(album.images[prevIndex]);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape') {
        closeImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImageIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f8fce] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-poppins">Loading gallery...</p>
        </div>
      </div>
    );
  }

  const album = galleryAlbums[slug];

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 font-montserrat">Gallery Album Not Found</h1>
          <p className="text-gray-600 mt-2">Slug: {slug}</p>
          <Link href="/gallery" className="text-[#1f8fce] hover:underline mt-4 inline-block font-poppins">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Creative Inner Banner - Optimized for mobile */}
      <section className="relative pt-8 pb-4 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 h-[40vh] sm:min-h-[70vh] lg:min-h-[500px] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden flex flex-col justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 sm:top-6 sm:left-6 sm:w-16 sm:h-16 lg:top-10 lg:left-10 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-lg sm:blur-xl"></div>
          <div className="absolute top-1/3 right-4 w-16 h-16 sm:top-1/2 sm:right-6 sm:w-20 sm:h-20 lg:top-1/2 lg:right-20 lg:w-32 lg:h-32 bg-[#1f8fce]/20 rounded-full blur-lg sm:blur-xl lg:blur-2xl"></div>
          <div className="absolute bottom-4 left-1/4 w-12 h-12 sm:bottom-6 sm:left-1/3 sm:w-16 sm:h-16 lg:bottom-10 lg:left-1/3 lg:w-24 lg:h-24 bg-white/5 rounded-full blur-md sm:blur-lg"></div>
          <div className="absolute top-6 right-1/4 w-10 h-10 sm:top-8 sm:right-1/4 sm:w-12 sm:h-12 lg:top-20 lg:right-1/4 lg:w-16 lg:h-16 bg-[#1f8fce]/30 rounded-full blur-md sm:blur-lg"></div>
        </div>

        {/* Main Content - Optimized spacing for mobile */}
        <div className="relative z-10 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-4 sm:py-0"
          >
            {/* Breadcrumb - Smaller on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center items-center space-x-2 text-white/80 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 font-poppins"
            >
              <Link
                href="/"
                className="hover:text-white transition-colors duration-300"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/gallery"
                className="hover:text-white transition-colors duration-300"
              >
                Gallery
              </Link>
              <span>/</span>
              <span className="text-white font-semibold">{album.title}</span>
            </motion.div>

            {/* Main Title - Optimized for mobile */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-montserrat mb-2 sm:mb-6"
            >
              <motion.span
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, margin: "-30px" }}
                className="inline-block"
              >
                {splitText(album.title)}
              </motion.span>
            </motion.h1>

            {/* CTA Button - Optimized for mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-2 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-md px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                All Albums
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Images Section with 4-column layout */}
      <section className="py-8 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Image Grid - Updated to 4 columns on xl screens */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {album.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => openImage(image, index)}
              >
                <Image
                  src={image.replace('w=1200', 'w=600')} // Use smaller thumbnail for 4-column layout
                  alt={`${album.title} - Image ${index + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-3 flex items-center gap-2"
                  >
                    <ZoomIn className="w-5 h-5 text-[#1f8fce]" />
                    <span className="text-sm font-semibold text-gray-700 font-poppins">View</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Image Modal with Slide Animation */}
      <AnimatePresence custom={direction}>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image Container */}
              <div className="relative w-full h-full flex items-center justify-center max-w-6xl max-h-full">
                <AnimatePresence custom={direction} initial={false}>
                  <motion.div
                    key={currentImageIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="absolute w-full h-full flex items-center justify-center"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={selectedImage} // Use original high-quality image
                        alt={`${album.title} - Image ${currentImageIndex + 1}`}
                        width={1920}
                        height={1080}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        quality={100}
                        priority={currentImageIndex === 0}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Close Button */}
              <button
                onClick={closeImage}
                className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-300 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation Arrows */}
              {album.images.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-300 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-300 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-poppins backdrop-blur-sm">
                {currentImageIndex + 1} / {album.images.length}
              </div>

              {/* Keyboard Hint */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white/80 px-3 py-1 rounded text-xs font-poppins backdrop-blur-sm hidden sm:block">
                Use ← → keys to navigate
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}