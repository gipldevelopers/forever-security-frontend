"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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

// Gallery Data
const galleryAlbums = [
  {
    id: 1,
    title: "Security System Installations",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "security-system-installations",
  },
  {
    id: 2,
    title: "CCTV Surveillance Projects",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "cctv-surveillance-projects",
  },
  {
    id: 3,
    title: "Access Control Systems",
    image: "https://images.unsplash.com/photo-1560421682-2db0c1312831?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "access-control-systems",
  },
  {
    id: 4,
    title: "Commercial Security Solutions",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "commercial-security-solutions",
  },
  {
    id: 5,
    title: "Residential Security Setups",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "residential-security-setups",
  },
  {
    id: 6,
    title: "Emergency Response Equipment",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "emergency-response-equipment",
  },
  {
    id: 7,
    title: "Smart Home Security",
    image: "https://images.unsplash.com/photo-1558002038-1055897bef33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "smart-home-security",
  },
  {
    id: 8,
    title: "Industrial Security Systems",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "industrial-security-systems",
  },
  {
    id: 9,
    title: "Alarm Systems",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    slug: "alarm-systems",
  }
];

// GalleryCard Component
const GalleryCard = ({ album, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group bg-white border border-blue-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer shadow-lg flex flex-col h-full"
    >
      <Link href={`/gallery/${album.slug}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] flex-1">
          <Image
            src={album.image}
            alt={album.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3"
            >
              <ChevronRight className="w-6 h-6 text-[#1f8fce]" />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-shrink-0">
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat group-hover:text-[#1f8fce] transition-colors duration-300 line-clamp-2 text-center">
              {album.title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default function GalleryPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
              <span className="text-white font-semibold">Gallery</span>
            </motion.div>

            {/* Main Title with Creative Typography - Optimized for mobile */}
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

            {/* Subtitle - Optimized spacing for mobile */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 font-poppins max-w-2xl mx-auto leading-relaxed mb-2 sm:mb-6 px-2 sm:px-0"
            >
              Explore our security installations, projects, and solutions through our comprehensive photo gallery
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section id="gallery-grid" className="py-8 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gallery Grid Layout - 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {galleryAlbums.map((album, index) => (
              <GalleryCard
                key={album.id}
                album={album}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}