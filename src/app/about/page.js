"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Target,
  Award,
  Clock,
  Globe,
  Star,
  CheckCircle,
} from "lucide-react";

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

// Counter Component for Statistics
const Counter = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 2000;
          const steps = 60;
          const stepValue = value / steps;
          const stepTime = duration / steps;

          let currentStep = 0;
          const timer = setInterval(() => {
            currentStep++;
            setCount(Math.min(stepValue * currentStep, value));

            if (currentStep >= steps) {
              clearInterval(timer);
            }
          }, stepTime);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className="inline-block">
      {suffix === "%" ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
};

// Statistics Component
const Statistics = () => {
  const stats = [
    { number: 99.8, label: "Client Satisfaction Rate", suffix: "%" },
    { number: 15, label: "Years of Experience", suffix: "+" },
    { number: 5000, label: "Systems Installed", suffix: "+" },
    { number: 24, label: "Support Available", suffix: "/7" },
  ];

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        duration: 0.8,
      },
    },
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-4">
            <AnimatedTitle title="Trusted by Thousands" highlight="Trusted" />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 text-sm sm:text-base font-poppins max-w-2xl mx-auto px-4"
          >
            Our track record speaks for itself. With years of experience and
            thousands of satisfied clients, we deliver exceptional security
            solutions you can rely on.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={statsContainerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center bg-white rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Number with Counter */}
              <motion.div
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1f8fce] mb-2 sm:mb-3 lg:mb-4 font-montserrat"
                variants={numberVariants}
                viewport={{ once: true }}
              >
                <Counter value={stat.number} suffix={stat.suffix} />
              </motion.div>

              {/* Label */}
              <div className="text-gray-600 text-xs sm:text-sm lg:text-base font-poppins leading-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Team members data with online images
  const teamMembers = [
    {
      name: "John Anderson",
      role: "Chief Security Officer",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      experience: "15+ years",
      specialty: "Strategic Security Planning",
      achievements: ["CISSP Certified", "25+ Major Projects"],
    },
    {
      name: "Sarah Mitchell",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      experience: "12+ years",
      specialty: "Security Operations Management",
      achievements: ["PMP Certified", "99.8% Success Rate"],
    },
    {
      name: "Michael Chen",
      role: "Cybersecurity Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      experience: "10+ years",
      specialty: "Digital Security Solutions",
      achievements: ["CEH Certified", "500+ Systems Secured"],
    },
    {
      name: "Emily Rodriguez",
      role: "Client Relations Manager",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      experience: "8+ years",
      specialty: "Customer Experience",
      achievements: ["98% Client Retention", "5000+ Clients Served"],
    },
  ];

  // Values data
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description:
        "Your safety is our top priority in every solution we design and implement.",
    },
    {
      icon: Users,
      title: "Client Focused",
      description:
        "We build lasting relationships by understanding and exceeding client expectations.",
    },
    {
      icon: Target,
      title: "Excellence",
      description:
        "We strive for perfection in every service we provide and every system we install.",
    },
    {
      icon: Globe,
      title: "Innovation",
      description:
        "We continuously evolve with technology to provide cutting-edge security solutions.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Creative Inner Banner */}
      <section className="relative pt-10 pb-8 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24 h-auto min-h-[45vh] sm:min-h-[70vh] lg:min-h-[500px] bg-gradient-to-br from-[#1a1a5e] via-[#27276f] to-[#1f8fce] overflow-hidden">
  {/* Animated Background Elements */}
  <div className="absolute inset-0">
    {/* Mobile optimized background elements */}
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
        <span className="text-white font-semibold">About Us</span>
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
          {splitText("About ")}
          <motion.span
            variants={highlightVariants}
            className="text-[#1f8fce] inline-block"
          >
            {splitText("Forever")}
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
        Protecting what matters most with cutting-edge security solutions
        and unwavering commitment
      </motion.p>

      {/* Animated CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-4 sm:mt-8"
      >
        <Link
          href="/contact"
          className="rounded-md px-6 sm:px-8 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-white border-white text-[#1f8fce] hover:bg-transparent hover:border-white hover:text-white transition-all duration-300 inline-flex items-center text-sm sm:text-base"
        >
          <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[#1f8fce] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
          <span className="relative transition duration-300 ease font-semibold">
            Get In Touch
          </span>
        </Link>
      </motion.div>
    </motion.div>
  </div>
</section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-4">
                <h2 className="text-base sm:text-lg text-[#1f8fce] font-semibold font-poppins">
                  Our Story
                </h2>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat mb-6 leading-tight">
                <motion.span
                  initial="hidden"
                  whileInView="visible"
                  variants={containerVariants}
                  viewport={{ once: true, margin: "-30px" }}
                  className="inline-block"
                >
                  {/* First part */}
                  {splitText("Leading the Way in ")}

                  {/* Highlighted part */}
                  <motion.span
                    variants={highlightVariants}
                    className="text-[#1f8fce] inline-block"
                  >
                    {splitText("Security ")}
                  </motion.span>

                  {/* Line break after highlight on larger screens */}
                  <br className="hidden lg:block" />

                  {/* Second part */}
                  {splitText("Solutions Since 2008")}
                </motion.span>
              </h3>

              <div className="space-y-4 text-[#838383] font-poppins leading-relaxed">
                <p className="text-sm sm:text-base lg:text-lg">
                  Founded with a vision to revolutionize the security industry,
                  Forever Security has grown from a small startup to a trusted
                  leader in comprehensive security solutions. Our journey began
                  with a simple mission: to make advanced security accessible to
                  everyone.
                </p>
                <p className="text-sm sm:text-base lg:text-lg">
                  Over the years, we&apos;ve expanded our expertise across
                  residential, commercial, and cybersecurity domains, always
                  staying ahead of emerging threats and technological
                  advancements.
                </p>
                <p className="text-sm sm:text-base lg:text-lg">
                  Today, we serve thousands of clients nationwide, backed by
                  cutting-edge technology and a team of dedicated security
                  professionals committed to your safety.
                </p>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Modern security control room with advanced monitoring systems"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover rounded-xl sm:rounded-2xl"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-[#1f8fce]/10 rounded-full blur-xl sm:blur-2xl z-0"></div>
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-[#1f8fce]/5 rounded-full blur-lg sm:blur-xl z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <Statistics />

      {/* Our Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-base sm:text-lg text-[#1f8fce] font-semibold font-poppins mb-2">
              Our Values
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
              <AnimatedTitle
                title="The Principles That Guide Us"
                highlight="Principles"
              />
            </h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 font-poppins max-w-2xl mx-auto mt-4 text-sm sm:text-base"
            >
              Our core values shape every decision we make and every service we
              provide
            </motion.p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="flex justify-center mb-4 sm:mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1f8fce] to-blue-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
                  >
                    <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600 font-poppins text-sm sm:text-base leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8 sm:mb-12"
    >
      <h2 className="text-base sm:text-lg text-[#1f8fce] font-semibold font-poppins mb-2">
        Our Team
      </h2>
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-montserrat">
        <AnimatedTitle
          title="Meet Our Security Experts"
          highlight="Security"
        />
      </h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-600 font-poppins max-w-2xl mx-auto mt-4 text-sm sm:text-base px-4"
      >
        Dedicated professionals with decades of combined experience in
        security and protection
      </motion.p>
    </motion.div>

    {/* Team Grid - Mobile Optimized */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {teamMembers.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group mx-2 sm:mx-0"
        >
          {/* Image Container - Mobile Safe */}
          <div className="relative h-60 sm:h-56 lg:h-56 overflow-hidden">
            <div className="w-full h-full">
              <Image
                src={member.image}
                alt={`Professional portrait of ${member.name}, ${member.role} at Forever Security`}
                width={400}
                height={400}
                className="w-full h-full object-cover object-center"
                priority={index < 2}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{ 
                  objectPosition: "center 30%",
                  transform: "scale(1.1)" // Slight zoom to ensure face is visible
                }}
              />
            </div>
            
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

            {/* Experience Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.1 + 0.3,
                type: "spring",
                stiffness: 200,
              }}
              className="absolute top-3 right-3 bg-[#1f8fce] text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
            >
              {member.experience}
            </motion.div>
          </div>

          {/* Content - Mobile Optimized */}
          <div className="p-4 sm:p-6 text-center">
            <motion.h4
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="text-lg sm:text-xl font-bold text-gray-900 font-montserrat mb-2"
            >
              {member.name}
            </motion.h4>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="text-[#1f8fce] font-semibold font-poppins text-sm sm:text-base mb-3"
            >
              {member.role}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="text-gray-600 font-poppins text-xs sm:text-sm mb-4 leading-relaxed"
            >
              {member.specialty}
            </motion.p>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="space-y-2"
            >
              {member.achievements.map(
                (achievement, achievementIndex) => (
                  <div
                    key={achievementIndex}
                    className="flex items-center justify-center gap-2 text-gray-600 text-xs"
                  >
                    <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                    <span className="text-center">{achievement}</span>
                  </div>
                )
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* CTA Section */}
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
          title="Ready to Secure Your Future?"
          highlight="Secure"
        />
      </h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-white/90 font-poppins text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
      >
        Join thousands of satisfied clients who trust us with their
        security needs
      </motion.p>

      {/* Buttons inline on mobile and desktop */}
            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-2xl mx-auto"
            >
              {/* Primary Button: Get Security Assessment - Longer */}
              <Link
                href="/contact"
                className="w-full sm:w-auto rounded-md px-8 sm:px-12 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-[#1f8fce] border-[#1f8fce] text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap min-w-[200px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  Free Cunsultation
                </span>
              </Link>

              {/* Secondary Button: Browse Services */}
              <Link
                href="/services"
                className="w-full sm:w-auto rounded-md px-8 sm:px-12 py-3 sm:py-4 overflow-hidden relative group cursor-pointer border-2 font-medium bg-transparent border-white text-white hover:bg-white hover:text-[#1f8fce] transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base whitespace-nowrap min-w-[200px]"
              >
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative transition duration-300 ease font-semibold">
                  View Services
                </span>
              </Link>
            </motion.div>
    </motion.div>
  </div>
</section>
    </div>
  );
}
