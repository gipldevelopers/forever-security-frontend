"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, User, Clock, ArrowLeft } from "lucide-react";
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

// Date formatting function to avoid hydration mismatch
const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// BlogCard Component
const BlogCard = ({ post, index }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(formatDate(post.published_at || post.created_at || post.date));
  }, [post.published_at, post.created_at, post.date]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group bg-white border border-blue-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-lg flex flex-col h-full"
    >
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative rounded-lg overflow-hidden mb-4 aspect-video">
          <Image
            src={post.featured_image_url || post.image || '/api/placeholder/400/250'}
            alt={post.title}
            width={400}
            height={250}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
        </div>

        {/* Content */}
        <div className="space-y-3 flex-1">
          <Link href={`/blogs/${post.slug}`} className="block">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat group-hover:text-[#1f8fce] transition-colors duration-300 line-clamp-2">
              {post.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm sm:text-base font-poppins leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-gray-500 text-xs sm:text-sm mt-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-poppins">{post.author || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-poppins">{formattedDate}</span>
          </div>
        </div>

        {/* Read Time */}
        <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
          <Clock className="w-3 h-3" />
          <span className="font-poppins">{post.read_time || '5 min read'}</span>
        </div>

        {/* Read More */}
        <div className="flex gap-3 pt-4 mt-4 border-t border-dashed border-blue-200">
          <Link
            href={`/blogs/${post.slug}`}
            className="inline-flex items-center gap-1 text-[#1f8fce] font-semibold hover:text-[#167aac] border border-[#1f8fce] hover:border-[#167aac] px-4 sm:px-6 py-2 rounded-md transition-all duration-300 text-sm sm:text-base font-poppins whitespace-nowrap"
          >
            Read More
            <ChevronRight className="ml-1 size-4 sm:size-5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      console.log('🔄 Fetching all blog posts...');
      const result = await apiService.getAllBlogs();
      
      console.log('📝 API Response:', result);
      
      if (result && result.success) {
        // Handle different response structures
        let blogs = [];
        
        if (Array.isArray(result.data)) {
          blogs = result.data;
        } else if (Array.isArray(result.blogs)) {
          blogs = result.blogs;
        } else if (Array.isArray(result)) {
          blogs = result;
        }
        
        console.log('📚 Processed blogs:', blogs);
        
        // Filter only published blogs (if status field exists)
        const publishedBlogs = blogs.filter(post => !post.status || post.status === 'published');
        
        console.log('✅ Published blogs:', publishedBlogs);
        setBlogPosts(publishedBlogs);
      } else {
        console.warn('⚠️ No blog data found in response');
        // Fallback to empty array
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching blog posts:', error);
      // Fallback to empty array on error
      setBlogPosts([]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Creative Inner Banner */}
      <section className="relative pt-10 pb-8 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 h-auto min-h-[45vh] sm:min-h-[70vh] lg:min-h-[500px] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-4 left-4 w-12 h-12 sm:top-6 sm:left-6 sm:w-16 sm:h-16 lg:top-10 lg:left-10 lg:w-20 lg:h-20 bg-white/10 rounded-full blur-lg sm:blur-xl"></div>
          <div className="absolute top-1/3 right-4 w-16 h-16 sm:top-1/2 sm:right-6 sm:w-20 sm:h-20 lg:top-1/2 lg:right-20 lg:w-32 lg:h-32 bg-[#1f8fce]/20 rounded-full blur-lg sm:blur-xl lg:blur-2xl"></div>
          <div className="absolute bottom-4 left-1/4 w-12 h-12 sm:bottom-6 sm:left-1/3 sm:w-16 sm:h-16 lg:bottom-10 lg:left-1/3 lg:w-24 lg:h-24 bg-white/5 rounded-full blur-md sm:blur-lg"></div>
          <div className="absolute top-6 right-1/4 w-10 h-10 sm:top-8 sm:right-1/4 sm:w-12 sm:h-12 lg:top-20 lg:right-1/4 lg:w-16 lg:h-16 bg-[#1f8fce]/30 rounded-full blur-md sm:blur-lg"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full pt-12 pb-0 sm:py-0"
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
              <span className="text-white font-semibold">Blogs</span>
            </motion.div>

            {/* Main Title with Creative Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-white font-montserrat mb-3 sm:mb-6"
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
                  {splitText("Blogs")}
                </motion.span>
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 font-poppins max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 px-2 sm:px-0"
            >
              Stay informed with expert articles, regional security trends, and practical tips from our licensed specialists to protect what matters most.
            </motion.p>

            {/* Animated CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 sm:mt-8"
            >
              <Link
                href="#blog-grid"
                className="rounded-md px-8 sm:px-10 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-white border-white text-[#1f8fce] hover:bg-transparent hover:border-white hover:text-white transition-all duration-300 inline-flex items-center text-sm sm:text-base whitespace-nowrap"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#1f8fce] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Explore Articles
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid Section with Blue/Indigo Background */}
      <section id="blog-grid" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-4">
              <AnimatedTitle
                title="Latest Security Insights"
                highlight="Security"
              />
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto"
            >
              Discover expert articles, security trends, and practical tips to enhance your protection strategies
            </motion.p>
          </div>

          {/* Blog Grid Layout */}
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogPosts.map((post, index) => (
                <BlogCard
                  key={post.id || post._id || index}
                  post={post}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
              <p className="text-gray-400 mt-2">Check back later for new articles.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Blog Focused - REVISED CONTENT */}
<section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-montserrat mb-4">
        <AnimatedTitle
          title="Need Direct Expert Security Advice?" // REVISED TITLE
          highlight="Expert Security"
        />
      </h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-white/90 font-poppins text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
      >
        If you have specific security challenges, don&apos;t wait for the next blog post. Contact our licensed specialists directly for immediate assistance.
      </motion.p>

      {/* Buttons inline on mobile and desktop - MODIFIED to one button */}
      <motion.div
        className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto"
      >
        {/* Secondary Button: Contact Us (Now the only button) */}
        <Link
          href="/contact"
          // Class modified to ensure it centers nicely when alone
          className="w-full sm:w-auto rounded-md px-8 sm:px-12 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap min-w-[200px]"
        >
          <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
          <span className="relative transition duration-300 ease font-semibold">
            Contact Us Today
          </span>
        </Link>
      </motion.div>
    </motion.div>
  </div>
</section>
    </div>
  );
}