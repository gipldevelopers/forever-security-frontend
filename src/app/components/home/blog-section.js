// components/blog-section.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { apiService } from '@/app/lib/api';

const BlogCard = ({ post, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col"
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-300 z-10" />
      
      {/* Image Container with Link */}
      <Link href={`/blogs/${post.slug}`} className="block relative h-48 sm:h-56 md:h-64 overflow-hidden flex-shrink-0">
        <img
          src={post.featured_image_url || post.image || '/api/placeholder/400/250'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
          <span className="bg-white/95 text-[#1f8fce] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold font-poppins backdrop-blur-sm">
            {post.category || 'Security'}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        {/* Title with Link */}
        <Link href={`/blogs/${post.slug}`} className="block mb-2 sm:mb-3 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-montserrat line-clamp-2 transition-colors duration-300 hover:text-[#1f8fce] leading-tight">
            {post.title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 font-poppins mb-4 sm:mb-6 line-clamp-3 leading-relaxed text-sm sm:text-base flex-1">
          {post.excerpt}
        </p>

        {/* Read More Link */}
        <Link
          href={`/blogs/${post.slug}`}
          className="inline-flex items-center gap-2 text-[#1f8fce] font-semibold transition-colors duration-300 hover:text-blue-600 text-sm sm:text-base mt-auto"
        >
          <span>Read More</span>
          <ArrowRight className="size-3 sm:size-4 transition-transform duration-300 hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
};

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      console.log('🔄 Fetching blog posts...');
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
        
        // Get only published blogs and limit to 3 for the section
        const publishedBlogs = blogs
          .filter(post => !post.status || post.status === 'published')
          .slice(0, 3);
        
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

  // If no blog posts, don't show the section at all
  if (!blogPosts || blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-montserrat mb-4 sm:mb-6"
          >
            Latest Blog Posts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 font-poppins max-w-2xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg px-4"
          >
            Stay informed with expert articles, security trends, and practical tips 
            to protect what matters most.
          </motion.p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16"
        >
          {blogPosts.map((post, index) => (
            <BlogCard key={post.id || post._id || index} post={post} index={index} />
          ))}
        </motion.div>

        {/* View All Blogs Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/blogs"
            className="rounded-md px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-white border-white text-[#1f8fce] hover:bg-transparent hover:border-white hover:text-white transition-all duration-300 inline-flex items-center text-sm sm:text-base"
          >
            <span className="absolute w-48 sm:w-56 md:w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-16 sm:-translate-x-18 md:-translate-x-20 bg-[#1f8fce] top-1/2 group-hover:h-48 sm:group-hover:h-56 md:group-hover:h-64 group-hover:-translate-y-24 sm:group-hover:-translate-y-28 md:group-hover:-translate-y-32 ease"></span>
            <span className="relative transition duration-300 ease font-semibold">
              View All Blogs
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}