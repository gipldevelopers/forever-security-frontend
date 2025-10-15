'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';

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
  const titleLine1 = "Get Your Free Security ";
  const titleLine2 = "Consultation";
  const highlight = "Free";
  
  const parts1 = titleLine1.split(highlight);
  
  return (
    <div className="text-center">
      <motion.span
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-30px" }}
        className="inline-block"
      >
        {splitText(parts1[0])}
        <motion.span 
          variants={highlightVariants}
          className="text-[#1f8fce] inline-block"
        >
          {splitText(highlight)}
        </motion.span>
        {parts1[1] && splitText(parts1[1])}
      </motion.span>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, margin: "-30px" }}
        className="inline-block mt-2"
      >
        {splitText(titleLine2)}
      </motion.div>
    </div>
  );
};

// Animated Security Illustration Component
const SecurityEnquiryIllustration = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8 }}
    className="relative w-full h-full"
  >
    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 sm:p-8 border border-blue-100 h-full">
      {/* Main Illustration Container */}
      <div className="relative flex flex-col items-center justify-center h-full">
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-4 left-4 w-6 h-6 bg-blue-200 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute top-8 right-6 w-4 h-4 bg-cyan-200 rounded-full opacity-60"
        />
        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-8 left-8 w-5 h-5 bg-blue-300 rounded-full opacity-40"
        />

        {/* Central Communication Hub */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="relative mb-8"
        >
          {/* Outer Ring */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#1f8fce] to-[#1a1a5e] rounded-full flex items-center justify-center shadow-xl">
            {/* Inner Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1f8fce] to-[#1a1a5e] rounded-full relative"
              >
                {/* Signal Dots */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                />
              </motion.div>
            </div>
          </div>

          {/* Connection Lines */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.6 }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-32 sm:h-32">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <motion.line
                  key={index}
                  x1="50"
                  y1="50"
                  x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                  y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#1f8fce"
                  strokeWidth="1"
                  initial={{ opacity: 0, pathLength: 0 }}
                  whileInView={{ opacity: 0.3, pathLength: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                />
              ))}
            </svg>
          </motion.div>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
          {[
            { icon: "📧", label: "Email", color: "from-blue-400 to-blue-600" },
            { icon: "📞", label: "Call", color: "from-green-400 to-green-600" },
            { icon: "💬", label: "Chat", color: "from-purple-400 to-purple-600" },
            { icon: "📱", label: "SMS", color: "from-orange-400 to-orange-600" },
          ].map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg mb-2`}>
                {method.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{method.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 1.5 }}
          className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700">Ready to Connect</span>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Why Choose Our Security Services?</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>24/7 Professional Monitoring</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Quick Response Times</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Customized Solutions</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Expert Security Consultation</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-300 rounded-full blur-xl"></div>
      </div>
    </div>
  </motion.div>
);

export default function EnquiryPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    urgency: 'standard'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const services = [
    'Home Security Systems',
    'CCTV Surveillance',
    'Access Control',
    'Alarm Systems',
    'Smart Home Integration',
    'Commercial Security',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section - Optimized for mobile like gallery page */}
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
              <span className="hover:text-white transition-colors duration-300 cursor-pointer">Home</span>
              <span>/</span>
              <span className="hover:text-white transition-colors duration-300 cursor-pointer">Contact</span>
              <span>/</span>
              <span className="text-white font-semibold">Enquiry</span>
            </motion.div>

            {/* Main Title with exact formatting as requested */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-6 leading-tight sm:leading-normal"
            >
              <AnimatedTitle />
            </motion.h1>

            {/* Subtitle - Optimized spacing for mobile */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 font-poppins max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 px-2 sm:px-0"
            >
              Let&apos;s discuss your security needs and create a customized solution for your peace of mind
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Two Equal Columns */}
      <section className="py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            
            {/* Left Column - Enhanced Security Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="flex items-stretch"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 w-full">
                <SecurityEnquiryIllustration />
              </div>
            </motion.div>

            {/* Right Column - Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-stretch"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 w-full">
                {isSubmitted ? (
                  <div className="text-center py-12 h-full flex flex-col justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your enquiry has been received. Our security experts will contact you within 2 business hours to discuss your needs.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[#1f8fce] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#167aac] transition-colors duration-300 cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Send Us Your Enquiry
                      </h3>
                      <p className="text-gray-600 mb-6 lg:text-lg">
                        Fill out the form below and our security specialists will get back to you promptly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8 flex-grow">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full text-gray-700 px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-base"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full text-gray-700 px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-base"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full text-gray-700 px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-base"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="urgency" className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
                            Urgency Level
                          </label>
                          <select
                            id="urgency"
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleChange}
                            className="w-full text-gray-700 px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-base cursor-pointer"
                          >
                            <option value="standard">Standard</option>
                            <option value="urgent">Urgent</option>
                            <option value="emergency">Emergency</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="service" className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
                          Service Interested In *
                        </label>
                        <select
                          id="service"
                          name="service"
                          required
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full text-gray-700 px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 text-base cursor-pointer"
                        >
                          <option value="">Select a service</option>
                          {services.map((service, index) => (
                            <option key={index} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-grow">
                        <label htmlFor="message" className="block text-sm lg:text-base font-medium text-gray-700 mb-1">
                          Your Security Needs *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full text-gray-700 px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1f8fce] focus:border-transparent transition-all duration-300 resize-none text-base"
                          placeholder="Please describe your security requirements, property details, and any specific concerns..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#1f8fce] to-[#1a1a5e] text-white py-4 lg:py-5 px-6 rounded-lg font-semibold text-lg hover:from-[#167aac] hover:to-[#141452] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Submit Enquiry</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}