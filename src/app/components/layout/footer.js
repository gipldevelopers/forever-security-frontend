import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8">
        {/* Main Footer Content - Responsive Grid */}
        {/* Changed grid-cols-1 to grid-cols-2 to force Quick Links and Services inline on smallest screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          
          {/* Company Info - Column 1 (Spans full width on mobile) */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex flex-col space-y-4">
              {/* Logo/Brand */}
              <h3 className="text-xl sm:text-2xl font-bold font-montserrat text-gray-900 mb-2">
                Forever Security
              </h3>
              
              <p className="text-gray-600 font-poppins text-sm leading-relaxed max-w-md">
                Your trusted partner in comprehensive security solutions. Protecting what matters most with cutting-edge technology and professional expertise.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3 sm:space-x-4 mt-4">
                <a 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1f8fce] hover:scale-110 transition-all duration-300 border border-gray-200 shadow-sm group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1f8fce] hover:scale-110 transition-all duration-300 border border-gray-200 shadow-sm group"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1f8fce] hover:scale-110 transition-all duration-300 border border-gray-200 shadow-sm group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-[#1f8fce] hover:scale-110 transition-all duration-300 border border-gray-200 shadow-sm group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links - Column 2 (Takes 1 of 2 columns on mobile) */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-semibold font-montserrat text-gray-900 mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Services
                </Link>
              </li>
              {/* --- NEW GALLERY LINK --- */}
              <li>
                <Link 
                  href="/gallery" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Gallery
                </Link>
              </li>
              {/* ------------------------ */}
              <li>
                <Link 
                  href="/blogs" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services - Column 3 (Takes 1 of 2 columns on mobile, sits next to Quick Links) */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-semibold font-montserrat text-gray-900 mb-4 sm:mb-6">Our Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link 
                  href="/services/home-security" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Home Security
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/business-security" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Business Security
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/cybersecurity" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/security-consulting" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Security Consulting
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/emergency-response" 
                  className="text-gray-600 font-poppins hover:text-[#1f8fce] transition-all duration-300 hover:translate-x-1 inline-block text-sm sm:text-base"
                >
                  Emergency Response
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Column 4 (Spans full width on mobile) */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold font-montserrat text-gray-900 mb-4 sm:mb-6">Contact Info</h4>
            <ul className="space-y-3 text-gray-600 font-poppins text-sm sm:text-base">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f8fce] mt-0.5 flex-shrink-0" />
                <span className="break-words">123 Security Street, Safe City, SC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f8fce] flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f8fce] flex-shrink-0" />
                <span className="break-all">info@foreversecurity.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#1f8fce] flex-shrink-0" />
                <span>24/7 Support Available</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer - Responsive Layout */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
            {/* Left Side - Copyright */}
            <div className="text-gray-600 font-poppins text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} Forever Security. All rights reserved.
            </div>

            {/* Right Side - Powered By */}
            <div className="flex items-center space-x-2 text-gray-600 font-poppins text-xs sm:text-sm">
              <span>Powered by:</span>
              <a 
                href="https://gohilinfotech.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1f8fce] hover:text-blue-600 transition-colors duration-300 font-semibold"
              >
                Gohil Infotech
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}