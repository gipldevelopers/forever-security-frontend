"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  X, 
  ChevronLeft, 
  ChevronRight as RightIcon,
  Download,
  Maximize2,
  Minimize2,
  Image as ImageIcon
} from "lucide-react";
import { apiService } from '@/app/lib/api';

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

const highlightVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut",
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

// Animated Title Component
const AnimatedTitle = ({ title, highlight }) => {
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
      {parts[1] && splitText(parts[1])}
    </motion.span>
  );
};

// Helper function to get image URL from any possible field
const getImageUrl = (image) => {
  if (!image) return null;
  
  // Check all possible field names in order of priority
  const possibleFields = [
    'image_url',    // Your actual field name
    'url',          // Common field name
    'image_path',   // Another common field
    'filename',     // Another common field
    'path',         // Another common field
    'src'           // Another common field
  ];
  
  for (const field of possibleFields) {
    if (image[field] && image[field].trim() !== '') {
      const imagePath = image[field];
      
      // If it's already a full URL, return as is
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // If it's a local path, construct the full URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://forever-security-backend.onrender.com/';
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      return `${baseUrl}/${cleanPath}`;
    }
  }
  
  return null;
};

// Debug function to check image object structure
const debugImageObject = (img, index) => {
  console.log(`🔍 Image ${index}:`, img);
  console.log(`   - image_url:`, img.image_url);
  console.log(`   - URL:`, img.url);
  console.log(`   - Image Path:`, img.image_path);
  console.log(`   - Filename:`, img.filename);
  console.log(`   - Full URL:`, getImageUrl(img));
};

// Image Modal Component
const ImageModal = ({ image, isOpen, onClose, onNext, onPrev, hasNext, hasPrev, isFullscreen, onToggleFullscreen, onDownload }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
        case 'ArrowLeft':
          if (hasPrev) onPrev();
          break;
        case 'f':
        case 'F':
          onToggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasNext, hasPrev, onClose, onNext, onPrev, onToggleFullscreen]);

  if (!isOpen || !image) return null;

  const imageUrl = getImageUrl(image);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300"
          >
            <RightIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(imageUrl); }}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300"
            title="Download Image"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFullscreen(); }}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Image Counter */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-white text-sm font-poppins">
          {image.index + 1} / {image.total}
        </div>

        {/* Image Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative ${isFullscreen ? 'w-full h-full' : 'max-w-[90vw] max-h-[90vh]'} m-4`}
          onClick={(e) => e.stopPropagation()}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={image.title || image.description || image.image_name || 'Gallery image'}
              width={1200}
              height={900}
              className={`w-full h-full object-contain ${isFullscreen ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={onToggleFullscreen}
              onError={(e) => {
                console.error(`Failed to load image: ${imageUrl}`);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center text-white">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Image not available</p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Gallery Image Card Component
const GalleryImageCard = ({ image, index, onClick }) => {
  const imageUrl = getImageUrl(image);
  const hasValidImage = imageUrl && imageUrl.trim() !== '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer shadow-lg"
    >
      <div 
        className="relative aspect-[3/4] overflow-hidden"
        onClick={() => onClick(index)}
      >
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={image.title || image.description || image.image_name || 'Gallery image'}
            width={400}
            height={533}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              console.error(`Failed to load image: ${imageUrl}`);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
        {/* Overlay - Only show if image is valid */}
        {hasValidImage && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300"
            >
              <Maximize2 className="w-5 h-5 text-[#1f8fce]" />
            </motion.div>
          </div>
        )}
      </div>

      
    </motion.div>
  );
};

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      console.log('🔄 Fetching gallery images...');
      setIsLoading(true);
      const result = await apiService.getGallery();
      
      console.log('📸 Gallery API response:', result);
      
      if (result && (result.success || Array.isArray(result))) {
        // Handle different response structures
        let images = [];
        
        if (Array.isArray(result.data)) {
          images = result.data;
        } else if (Array.isArray(result.images)) {
          images = result.images;
        } else if (Array.isArray(result)) {
          images = result;
        } else if (result.data && Array.isArray(result.data.images)) {
          images = result.data.images;
        }
        
        console.log('🖼️ Raw images from API:', images);
        
        if (images && images.length > 0) {
          // Debug: Check each image object structure
          console.log('🔍 Debugging image objects:');
          images.forEach((img, index) => debugImageObject(img, index));
          
          // Process ALL images with the correct field name
          const processedImages = images.map((img, index, array) => {
            const imageUrl = getImageUrl(img);
            return {
              ...img,
              index,
              total: array.length,
              fullUrl: imageUrl
            };
          });
          
          console.log('✅ All processed images with URLs:', processedImages);
          
          // Only set to state if we have images
          setGalleryImages(processedImages);
        } else {
          console.warn('⚠️ No images found in the response data');
          setGalleryImages([]);
        }
      } else {
        console.warn('⚠️ Invalid API response structure:', result);
        setGalleryImages([]);
      }
    } catch (error) {
      console.error('❌ Error fetching gallery images:', error);
      setGalleryImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (index) => {
    const image = galleryImages[index];
    if (!image) {
      console.warn('Cannot open modal: Invalid image at index', index);
      return;
    }
    
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    setIsFullscreen(false);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
    setIsFullscreen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < galleryImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const goToPrev = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const downloadImage = async (imageUrl) => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `security-gallery-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback: open image in new tab
      window.open(imageUrl, '_blank');
    }
  };

  const selectedImage = selectedImageIndex !== null ? galleryImages[selectedImageIndex] : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Creative Inner Banner */}
      <section className="relative pt-8 pb-4 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 h-[40vh] sm:min-h-[70vh] lg:min-h-[500px] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden flex flex-col justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 sm:top-6 sm:left-6 sm:w-16 sm:h-16 lg:top-10 lg:left-10 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-lg sm:blur-xl"></div>
          <div className="absolute top-1/3 right-4 w-16 h-16 sm:top-1/2 sm:right-6 sm:w-20 sm:h-20 lg:top-1/2 lg:right-20 lg:w-32 lg:h-32 bg-[#1f8fce]/20 rounded-full blur-lg sm:blur-xl lg:blur-2xl"></div>
          <div className="absolute bottom-4 left-1/4 w-12 h-12 sm:bottom-6 sm:left-1/3 sm:w-16 sm:h-16 lg:bottom-10 lg:left-1/3 lg:w-24 lg:h-24 bg-white/5 rounded-full blur-md sm:blur-lg"></div>
          <div className="absolute top-6 right-1/4 w-10 h-10 sm:top-8 sm:right-1/4 sm:w-12 sm:h-12 lg:top-20 lg:right-1/4 lg:w-16 lg:h-16 bg-[#1f8fce]/30 rounded-full blur-md sm:blur-lg"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-4 sm:py-0"
          >
            {/* Breadcrumb */}
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
              <span className="text-white font-semibold">Gallery</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-white font-montserrat mb-2 sm:mb-6"
            >
              <motion.span
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true, margin: "-30px" }}
                className="inline-block"
              >
                {splitText("Our ")}
                <motion.span
                  variants={highlightVariants}
                  className="text-[#1f8fce] inline-block"
                >
                  {splitText("Gallery")}
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 font-poppins max-w-2xl mx-auto leading-relaxed mb-2 sm:mb-6 px-2 sm:px-0"
            >
              See our commitment to professional security in action, showcasing successful projects and our dedicated personnel across Gujarat.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="py-8 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f8fce] mx-auto"></div>
              <p className="mt-4 text-gray-600 font-poppins">Loading gallery images...</p>
            </div>
          ) : galleryImages.length > 0 ? (
            <>
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {galleryImages.map((image, index) => (
                  <GalleryImageCard
                    key={image.id || image._id || index}
                    image={image}
                    index={index}
                    onClick={openModal}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📷</div>
              <p className="text-gray-500 text-lg font-poppins">No gallery images available at the moment.</p>
              <p className="text-gray-400 mt-2 font-poppins">Check back later for new photos.</p>
              <button
                onClick={fetchGalleryImages}
                className="mt-4 px-6 py-2 bg-[#1f8fce] text-white rounded-lg hover:bg-[#167aac] transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={goToNext}
        onPrev={goToPrev}
        hasNext={selectedImageIndex !== null && selectedImageIndex < galleryImages.length - 1}
        hasPrev={selectedImageIndex !== null && selectedImageIndex > 0}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onDownload={(imageUrl) => downloadImage(imageUrl)}
      />
    </div>
  );
}