// components/faq-section.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, CreditCard, Truck, Globe, Package, Shield, Home, Building, Lock, Users, Wifi } from 'lucide-react';

const FAQItem = ({ item, isOpen, onClick }) => {
  const IconComponent = getIconComponent(item.icon);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 mb-4 last:mb-0 transition-all duration-300 hover:shadow-md"
    >
      <button
        onClick={() => onClick(item.id)}
        className="w-full cursor-pointer items-center py-6 px-6 text-left hover:no-underline rounded-xl"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-10 bg-gradient-to-br from-[#1f8fce] to-blue-600 rounded-lg items-center justify-center flex-shrink-0">
              <IconComponent className="size-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat">
              {item.question}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="size-5 text-gray-400" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="pb-6 px-6">
              <div className="pl-14">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-poppins"
                >
                  {item.answer}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Icon mapping function
const getIconComponent = (iconName) => {
  const iconMap = {
    'shield': Shield,
    'home': Home,
    'building': Building,
    'lock': Lock,
    'users': Users,
    'wifi': Wifi,
    'clock': Clock,
    'credit-card': CreditCard,
    'truck': Truck,
    'globe': Globe,
    'package': Package
  };
  return iconMap[iconName] || Shield;
};

export default function FAQSection() {
  const [openItem, setOpenItem] = useState('item-1');

  const faqItems = [
    {
      id: 'item-1',
      icon: 'shield',
      question: 'What security measures do you have in place?',
      answer: 'We implement multi-layered security including 24/7 monitoring, encrypted data transmission, biometric access controls, and regular security audits. All our systems are compliant with industry standards and regularly updated to protect against emerging threats.',
    },
    {
      id: 'item-2',
      icon: 'home',
      question: 'Do you offer home security solutions?',
      answer: 'Yes, we provide comprehensive home security packages including alarm systems, CCTV cameras, smart locks, and environmental monitoring. Our home solutions are customizable and can be integrated with smart home devices for complete protection.',
    },
    {
      id: 'item-3',
      icon: 'building',
      question: 'What business security services do you offer?',
      answer: 'We offer enterprise-grade security solutions including access control systems, surveillance networks, cybersecurity protection, security personnel, and emergency response planning. Our business packages are scalable to fit organizations of all sizes.',
    },
    {
      id: 'item-4',
      icon: 'lock',
      question: 'How secure is my data with your systems?',
      answer: 'Your data is protected with end-to-end encryption, secure cloud storage, and strict access controls. We comply with data protection regulations and never share your information with third parties without explicit consent.',
    },
    {
      id: 'item-5',
      icon: 'users',
      question: 'Do you provide security personnel?',
      answer: 'Yes, we offer trained security personnel for events, businesses, and residential properties. All our security officers are licensed, background-checked, and receive ongoing training to ensure professional service.',
    },
    {
      id: 'item-6',
      icon: 'wifi',
      question: 'What happens if my internet connection fails?',
      answer: 'Our systems include battery backups and cellular failover capabilities. In case of internet outage, your security system will automatically switch to cellular backup and continue monitoring your property without interruption.',
    },
    {
      id: 'item-7',
      icon: 'clock',
      question: 'What are your response times for emergencies?',
      answer: 'Our average emergency response time is under 3 minutes for priority alerts. We maintain 24/7 monitoring centers with trained professionals who can dispatch emergency services and contact you immediately when an alert is triggered.',
    },
    {
      id: 'item-8',
      icon: 'credit-card',
      question: 'What payment options do you accept?',
      answer: 'We accept all major credit cards, debit cards, bank transfers, and offer financing options. We also provide flexible billing cycles (monthly, quarterly, or annual) to suit your budget and preferences.',
    }
  ];

  const handleItemClick = (itemId) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Left Side - Sticky Header */}
          <div className="lg:w-2/5">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-montserrat mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-poppins mb-8 leading-relaxed">
                  Find answers to common questions about our security services, 
                  installation process, and support. Can&apos;t find what you&apos;re looking for?
                </p>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300 font-poppins">
                    Contact our{' '}
                    <Link
                      href="/contact"
                      className="text-[#1f8fce] font-semibold hover:underline transition-colors duration-200"
                    >
                      customer support team
                    </Link>{' '}
                    for personalized assistance.
                  </p>
                </div>

                {/* Trust Badge */}
                <motion.div 
                  className="mt-8 flex items-center gap-3 p-4 bg-gradient-to-r from-[#1f8fce] to-blue-600 rounded-xl text-white"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Shield className="size-6" />
                  <div>
                    <p className="font-semibold font-montserrat">24/7 Support</p>
                    <p className="text-sm opacity-90 font-poppins">Always here to help you</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="lg:w-3/5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {faqItems.map((item, index) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={openItem === item.id}
                  onClick={handleItemClick}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}