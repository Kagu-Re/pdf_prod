import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon, SystemIcons, ProcessIcons } from '../components/IconLibrary';

const FreelanceQuestLanding: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const neonGlow = {
    hidden: { textShadow: '0 0 0px currentColor' },
    visible: { 
      textShadow: '0 0 3px currentColor, 0 0 6px currentColor',
      transition: { duration: 0.5 }
    }
  };

  const stages = [
    {
      id: 1,
      name: "EXPLORER",
      duration: "4 weeks",
      skills: ["Portfolio Creation", "Market Research", "Pricing Strategy", "Personal Branding"],
      income: "$0 - $1,000",
      description: "Learn the fundamentals and build your foundation"
    },
    {
      id: 2,
      name: "FREELANCER", 
      duration: "6 weeks",
      skills: ["Client Acquisition", "Proposal Writing", "Contract Negotiation", "Project Management"],
      income: "$1,000 - $3,000",
      description: "Get your first clients and establish your workflow"
    },
    {
      id: 3,
      name: "SPECIALIST",
      duration: "8 weeks", 
      skills: ["Niche Positioning", "Premium Pricing", "Advanced Marketing", "Client Retention"],
      income: "$3,000 - $6,000",
      description: "Specialize and command higher rates"
    },
    {
      id: 4,
      name: "SYSTEMATIZER",
      duration: "6 weeks",
      skills: ["Process Automation", "Tool Integration", "Quality Systems", "Efficiency Optimization"],
      income: "$6,000 - $8,000", 
      description: "Automate and scale your operations"
    },
    {
      id: 5,
      name: "BUSINESS BUILDER",
      duration: "10 weeks",
      skills: ["Team Building", "System Creation", "Revenue Diversification", "Strategic Planning"],
      income: "$8,000 - $12,000",
      description: "Build systems and expand your business"
    },
    {
      id: 6,
      name: "LEADER",
      duration: "Ongoing",
      skills: ["Strategic Vision", "Market Leadership", "Mentorship", "Industry Influence"],
      income: "$12,000+",
      description: "Lead the industry and create lasting impact"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Web Developer",
      income: "$8,500",
      quote: "I went from $0 to $8,500/month in just 5 months. The systematic approach made all the difference."
    },
    {
      name: "Marcus Rodriguez", 
      role: "Digital Marketer",
      income: "$12,000",
      quote: "The client acquisition strategies alone paid for the course 10x over. Best investment I ever made."
    },
    {
      name: "Emily Johnson",
      role: "Graphic Designer", 
      income: "$6,200",
      quote: "I finally learned how to price my services properly. My income tripled in 3 months."
    }
  ];

  return (
    <div className="min-h-screen matrix-bg relative" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-brand-primary to-brand-accent"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Matrix Background */}
        <div className="absolute inset-0">
          {/* Cyberpunk Grid */}
          <div className="absolute inset-0 cyberpunk-grid opacity-20"></div>
          
          {/* Enhanced Gradient Overlays */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(106, 155, 106, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(212, 79, 79, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(106, 123, 155, 0.2) 0%, transparent 50%),
                linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%)
              `
            }}
          ></div>
          
          {/* Data Streams */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={`stream-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60"
                style={{
                  top: `${20 + i * 15}%`,
                  left: 0,
                  width: '100%'
                }}
              />
            ))}
          </div>
          
          {/* Enhanced Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(25)].map((_, i) => {
              const icons = ['briefcase', 'currency-dollar', 'rocket-launch', 'star', 'target', 'light-bulb', 'chart-bar', 'shield-check'];
              const colors = ['#6A9B6A', '#D44F4F', '#6A7B9B', '#FF6B35'];
              const iconName = icons[Math.floor(Math.random() * icons.length)];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <div
                  key={i}
                  className="absolute opacity-15"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <Icon name={iconName} size="sm" color="custom" customColor={color} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
          {/* Enhanced Social Proof Badge */}
          <motion.div 
            className="inline-flex items-center px-6 py-3 rounded-full mb-8 cyberpunk-panel data-stream"
            style={{ backgroundColor: '#2A2A2A', border: '2px solid #6A9B6A' }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px #6A9B6A' }}
          >
            <Icon name="check-circle" size="sm" color="success" className="mr-3" />
            <span className="text-sm font-mono" style={{ color: '#6A9B6A' }}>
              Join 2,847 successful freelancers
            </span>
          </motion.div>

          {/* Enhanced Main Title */}
          <motion.h1 
            className="text-6xl md:text-8xl font-bold font-mono mb-6"
            style={{ color: '#6A9B6A', textShadow: '0 0 3px #6A9B6A' }}
            whileHover={{ scale: 1.02 }}
          >
              FROM $0 TO $10K
          </motion.h1>
          
          {/* Enhanced Subtitle */}
          <motion.h2 
            className="text-3xl md:text-4xl font-mono mb-8 flex flex-col md:flex-row items-center justify-center"
            style={{ color: '#6A7B9B' }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-2 md:mb-0 md:mr-3"
            >
              <Icon name="rocket-launch" size="lg" color="success" />
            </motion.div>
            <span>IN 6 MONTHS</span>
          </motion.h2>
          
          {/* Enhanced Description */}
          <motion.p 
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
            style={{ color: '#6A7B9B' }}
          >
              Master the proven 6-stage system that transforms complete beginners into 
              high-earning freelancers. No experience required.
          </motion.p>
            
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <motion.button 
              className="px-12 py-6 rounded-lg font-mono font-bold text-2xl cyberpunk-button flex items-center justify-center neon-accent"
                style={{ 
                  background: 'linear-gradient(90deg, #D44F4F 0%, #7B3A3A 100%)',
                  color: '#1A1A1A',
                  border: '2px solid #D44F4F'
                }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 30px #D44F4F',
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Icon name="rocket-launch" size="lg" color="custom" customColor="#1A1A1A" className="mr-3" />
              </motion.div>
                START YOUR JOURNEY
            </motion.button>
            
            <motion.button 
              className="px-12 py-6 rounded-lg font-mono text-2xl border-2 cyberpunk-button flex items-center justify-center"
                style={{ 
                  backgroundColor: '#1A1A1A',
                  color: '#6A9B6A',
                  borderColor: '#6A9B6A'
                }}
              whileHover={{ 
                backgroundColor: '#6A9B6A',
                color: '#1A1A1A',
                scale: 1.05,
                boxShadow: '0 0 20px #6A9B6A',
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              >
                <Icon name="check-circle" size="lg" color="success" className="mr-3" />
                VIEW CURRICULUM
            </motion.button>
          </div>

          {/* Enhanced Trust Indicators */}
          <div 
            className="flex justify-center"
            style={{ color: '#6A7B9B' }}
          >
            <div className="space-y-3 text-sm">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Icon name="check-circle" size="sm" color="success" className="mr-2" />
                <span>30-Day Money-Back Guarantee</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Icon name="check-circle" size="sm" color="success" className="mr-2" />
                <span>Lifetime Access</span>
              </motion.div>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Icon name="check-circle" size="sm" color="success" className="mr-2" />
                <span>Private Community</span>
              </motion.div>
              </div>
          </div>
        </div>
      </section>


      {/* Enhanced Problem Section */}
      <section className="py-24 relative" style={{ backgroundColor: '#2A2A2A' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="cyberpunk-grid"></div>
            </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-5xl font-bold font-mono mb-6 flex flex-col items-center justify-center"
              style={{ color: '#D44F4F' }}
              variants={fadeInUp}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <Icon name="exclamation-triangle" size="xl" color="danger" />
              </motion.div>
              <span>THE FREELANCER STRUGGLE IS REAL</span>
            </motion.h2>
            <motion.p 
              className="text-xl max-w-4xl mx-auto"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
              You're talented, skilled, and ready to work. But something's holding you back...
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: 'user-group', title: 'No Clients', text: "I don't know where to find clients or how to approach them. I've tried everything but nothing works." },
              { icon: 'currency-dollar', title: 'Low Rates', text: "I'm competing with $5/hour freelancers. I know I'm worth more but I don't know how to charge premium rates." },
              { icon: 'exclamation-triangle', title: 'Inconsistent Income', text: "One month I make $3,000, the next month $200. I need predictable income but don't know how to create it." },
              { icon: 'clock', title: 'No Time', text: "I'm working 12-hour days but barely making ends meet. I need to work smarter, not harder." },
              { icon: 'map', title: 'No Direction', text: "I'm taking random courses and following random advice. I need a clear path to follow." },
              { icon: 'lock-closed', title: 'Feeling Stuck', text: "I've been trying for months/years but I'm not making progress. I'm starting to doubt if freelancing is for me." }
            ].map((problem, index) => (
              <motion.div 
                key={index}
                className="cyberpunk-panel p-6 rounded-lg text-center data-stream"
                style={{ backgroundColor: '#1A1A1A' }}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 0 20px #D44F4F',
                  y: -5
                }}
              >
                <motion.div 
                  className="mb-4 flex justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon name={problem.icon} size="xl" color="danger" />
                </motion.div>
                <h3 className="text-xl font-mono font-bold mb-4 " style={{ color: '#D44F4F' }}>
                  {problem.title}
                </h3>
              <p className="text-sm" style={{ color: '#6A7B9B' }}>
                  "{problem.text}"
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="text-lg" style={{ color: '#6A7B9B' }}>
              <strong style={{ color: '#6A9B6A' }}>Sound familiar?</strong> You're not alone. 
              Most freelancers face these exact same challenges. But here's the thing...
            </p>
          </motion.div>
        </div>
      </section>


      {/* Enhanced Solution Section */}
      <section className="py-24 relative" style={{ backgroundColor: '#1A1A1A' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="cyberpunk-grid"></div>
                </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-5xl font-bold font-mono mb-6 flex flex-col items-center justify-center"
              style={{ color: '#6A9B6A' }}
              variants={fadeInUp}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-4"
              >
                <Icon name="light-bulb" size="xl" color="success" />
              </motion.div>
              <span>THE SOLUTION: SYSTEMATIC PROGRESSION</span>
            </motion.h2>
            <motion.p 
              className="text-xl max-w-4xl mx-auto"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
              Instead of random courses and scattered advice, you get a proven 6-stage system 
              that takes you from complete beginner to $10K/month freelancer.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <motion.h3 
                className="text-3xl font-mono font-bold mb-6 "
                style={{ color: '#6A9B6A' }}
                variants={fadeInUp}
              >
                Why This Works
              </motion.h3>
              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
              >
                {[
                  { 
                    title: "Proven System", 
                    text: "Not random advice. A tested, step-by-step system that 2,847+ freelancers have used successfully." 
                  },
                  { 
                    title: "No Experience Required", 
                    text: "Start from absolute zero. We teach you everything from basic skills to advanced business strategies." 
                  },
                  { 
                    title: "Guaranteed Results", 
                    text: "30-day money-back guarantee. If you don't see results, we refund every penny." 
                  },
                  { 
                    title: "Community Support", 
                    text: "Join 2,847+ successful freelancers in our private community. Get help, share wins, stay motivated." 
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start"
                    variants={fadeInUp}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 neon-accent"
                      style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}
                      whileHover={{ scale: 1.1, boxShadow: '0 0 15px #6A9B6A' }}
                    >
                      <span className="text-sm font-bold">{index + 1}</span>
                    </motion.div>
                  <div>
                      <h4 className="text-lg font-mono font-bold mb-2" style={{ color: '#6A9B6A' }}>
                        {item.title}
                      </h4>
                    <p className="text-sm" style={{ color: '#6A7B9B' }}>
                        {item.text}
                    </p>
                  </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="cyberpunk-panel p-8 rounded-lg data-stream"
              style={{ backgroundColor: '#2A2A2A' }}
              variants={fadeInUp}
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px #6A9B6A' }}
            >
              <motion.h4 
                className="text-2xl font-mono font-bold mb-6 text-center "
                style={{ color: '#6A9B6A' }}
                variants={fadeInUp}
              >
                The 6-Stage System
              </motion.h4>
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
              >
                {stages.map((stage, index) => (
                  <motion.div 
                    key={stage.id} 
                    className="flex items-center justify-between p-4 rounded cyberpunk-panel"
                    style={{ backgroundColor: '#1A1A1A' }}
                    variants={fadeInUp}
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: '0 0 15px #6A9B6A',
                      x: 5
                    }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-4 neon-accent"
                        style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}
                        whileHover={{ scale: 1.1, boxShadow: '0 0 10px #6A9B6A' }}
                      >
                        <span className="text-sm font-bold">{stage.id}</span>
                      </motion.div>
                      <div>
                        <h5 className="font-mono font-bold" style={{ color: '#6A9B6A' }}>{stage.name}</h5>
                        <p className="text-xs" style={{ color: '#6A7B9B' }}>{stage.duration} • {stage.income}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono " style={{ color: '#D44F4F' }}>{stage.income}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
              </div>
      </section>

      {/* Section Connector */}
      <div className="relative h-20 flex items-center justify-center">
        <div className="w-px h-16 bg-gradient-to-b from-brand-primary to-transparent"></div>
        <motion.div
          className="absolute w-4 h-4 bg-brand-primary rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
            </div>

      {/* Enhanced Curriculum Showcase */}
      <section className="py-24 relative" style={{ backgroundColor: '#2A2A2A' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="cyberpunk-grid"></div>
          </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-5xl font-bold font-mono mb-6 flex flex-col items-center justify-center"
              style={{ color: '#6A9B6A' }}
              variants={fadeInUp}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mb-4"
              >
                <Icon name="academic-cap" size="xl" color="success" />
              </motion.div>
              <span>DETAILED CURRICULUM</span>
            </motion.h2>
            <motion.p 
              className="text-xl max-w-4xl mx-auto"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
              Here's exactly what you'll learn in each stage. No fluff, no filler. 
              Just the skills that actually matter for building a successful freelance business.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stages.map((stage, index) => (
              <motion.div 
                key={stage.id} 
                className="cyberpunk-panel p-8 rounded-lg data-stream"
                style={{ backgroundColor: '#1A1A1A' }}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 0 25px #6A9B6A',
                  y: -5
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-mono font-bold" style={{ color: '#6A9B6A' }}>
                      STAGE {stage.id}: {stage.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#6A7B9B' }}>{stage.duration} • {stage.income}/month</p>
                  </div>
                  <motion.div 
                    className="text-right"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-mono font-bold " style={{ color: '#D44F4F' }}>{stage.income}</div>
                    <div className="text-xs" style={{ color: '#6A7B9B' }}>Target Income</div>
                  </motion.div>
                </div>

                <p className="text-sm mb-6" style={{ color: '#6A7B9B' }}>{stage.description}</p>

                <div>
                  <h4 className="text-lg font-mono font-bold mb-4" style={{ color: '#6A9B6A' }}>Skills You'll Master:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {stage.skills.map((skill, skillIndex) => (
                      <motion.div 
                        key={skillIndex} 
                        className="flex items-center text-sm"
                        style={{ color: '#6A7B9B' }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.span 
                          className="mr-2"
                          style={{ color: '#6A9B6A' }}
                          whileHover={{ scale: 1.2 }}
                        >
                          ✓
                        </motion.span>
                        <span>{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div 
                  className="mt-6 pt-6 border-t"
                  style={{ borderColor: '#2A2A2A' }}
                  whileHover={{ borderColor: '#6A9B6A' }}
                >
                  <div className="flex justify-between items-center text-sm">
                    <span style={{ color: '#6A7B9B' }}>Time Investment:</span>
                    <span className="font-mono font-bold" style={{ color: '#6A9B6A' }}>{stage.duration}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span style={{ color: '#6A7B9B' }}>Expected Income:</span>
                    <span className="font-mono font-bold " style={{ color: '#D44F4F' }}>{stage.income}/month</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Connector */}
      <div className="relative h-20 flex items-center justify-center">
        <div className="w-px h-16 bg-gradient-to-b from-brand-primary to-transparent"></div>
        <motion.div
          className="absolute w-4 h-4 bg-brand-primary rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Enhanced Social Proof Section */}
      <section className="py-24 relative" style={{ backgroundColor: '#1A1A1A' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="cyberpunk-grid"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-5xl font-bold font-mono mb-6 flex flex-col items-center justify-center"
              style={{ color: '#6A9B6A' }}
              variants={fadeInUp}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-4"
              >
                <Icon name="trophy" size="xl" color="success" />
              </motion.div>
              <span>SUCCESS STORIES</span>
            </motion.h2>
            <motion.p 
              className="text-xl max-w-4xl mx-auto"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
              Don't just take our word for it. Here's what real freelancers are saying 
              about their transformation.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="cyberpunk-panel p-8 rounded-lg text-center data-stream"
                style={{ backgroundColor: '#2A2A2A' }}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 0 30px #6A9B6A',
                  y: -10
                }}
              >
                <motion.div 
                  className="mb-4 flex justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon name="user-circle" size="xl" color="success" />
                </motion.div>
                <h4 className="text-xl font-mono font-bold mb-2" style={{ color: '#6A9B6A' }}>
                  {testimonial.name}
                </h4>
                <p className="text-sm mb-4" style={{ color: '#6A7B9B' }}>{testimonial.role}</p>
                <motion.div 
                  className="text-2xl font-mono font-bold mb-4 "
                  style={{ color: '#D44F4F' }}
                  whileHover={{ scale: 1.1 }}
                >
                  {testimonial.income}/month
                </motion.div>
                <p className="text-sm italic" style={{ color: '#6A7B9B' }}>
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.div 
              className="cyberpunk-panel p-6 rounded-lg inline-block data-stream"
              style={{ backgroundColor: '#2A2A2A' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px #6A9B6A' }}
            >
              <motion.h3 
                className="text-2xl font-mono font-bold mb-4 "
                style={{ color: '#6A9B6A' }}
                variants={fadeInUp}
              >
                Join 2,847+ Successful Freelancers
              </motion.h3>
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
                variants={staggerContainer}
              >
                {[
                  { value: '2,847', label: 'Students' },
                  { value: '$7,200', label: 'Avg Monthly Income' },
                  { value: '94%', label: 'Success Rate' },
                  { value: '4.9/5', label: 'Student Rating' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="text-3xl font-mono font-bold "
                      style={{ color: '#D44F4F' }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm" style={{ color: '#6A7B9B' }}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Enhanced Pricing Section */}
      <section className="py-24 relative" style={{ backgroundColor: '#2A2A2A' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="cyberpunk-grid"></div>
              </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-5xl font-bold font-mono mb-6 flex flex-col items-center justify-center"
              style={{ color: '#6A9B6A' }}
              variants={fadeInUp}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <Icon name="currency-dollar" size="xl" color="success" />
              </motion.div>
              <span>SIMPLE PRICING</span>
            </motion.h2>
            <motion.p 
              className="text-xl max-w-4xl mx-auto"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
              One price. Everything included. No hidden fees. No monthly subscriptions.
            </motion.p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.div 
              className="cyberpunk-panel p-8 rounded-lg text-center relative data-stream"
              style={{ backgroundColor: '#1A1A1A', border: '3px solid #6A9B6A' }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 0 40px #6A9B6A',
                y: -5
              }}
            >

              <motion.h3 
                className="text-3xl font-mono font-bold mb-4"
                style={{ color: '#6A9B6A' }}
                variants={fadeInUp}
              >
                FREELANCE QUEST COMPLETE
              </motion.h3>
              
              <motion.div 
                className="mb-8"
                variants={fadeInUp}
              >
                <motion.div 
                  className="text-6xl font-mono font-bold mb-2"
                  style={{ color: '#D44F4F', textShadow: '0 0 2px #D44F4F' }}
                  whileHover={{ scale: 1.05 }}
                >
                  $497
                </motion.div>
                <div className="text-lg" style={{ color: '#6A7B9B' }}>One-time payment</div>
                <motion.div 
                  className="text-sm mt-2"
                  style={{ color: '#6A9B6A' }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="line-through" style={{ color: '#6A7B9B' }}>$1,997</span> 
                  <span className="ml-2">Limited Time: 75% OFF</span>
                </motion.div>
              </motion.div>

              <motion.div 
                className="mb-8 flex justify-center"
                variants={staggerContainer}
              >
                <div className="space-y-4 text-left max-w-md">
                  {[
                    'Complete 6-stage curriculum',
                    'Lifetime access to all materials',
                    'Private community access',
                    'Client acquisition templates',
                    'Pricing calculator tools',
                    'Contract templates',
                    'Weekly group coaching calls',
                    '30-day money-back guarantee'
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center"
                      variants={fadeInUp}
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                      >
                  <Icon name="check-circle" size="sm" color="success" className="mr-3" />
                      </motion.div>
                      <span style={{ color: '#6A7B9B' }}>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.button 
                className="w-full px-8 py-6 rounded-lg font-mono font-bold text-2xl cyberpunk-button mb-4 flex items-center justify-center neon-accent"
                style={{ 
                  background: 'linear-gradient(90deg, #D44F4F 0%, #7B3A3A 100%)',
                  color: '#1A1A1A',
                  border: '2px solid #D44F4F'
                }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 0 30px #D44F4F',
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Icon name="rocket-launch" size="lg" color="custom" customColor="#1A1A1A" className="mr-3" />
                </motion.div>
                GET INSTANT ACCESS
              </motion.button>

              <motion.p 
                className="text-sm flex items-center justify-center"
                style={{ color: '#6A7B9B' }}
                variants={fadeInUp}
              >
                <Icon name="lock-closed" size="sm" color="success" className="mr-2" />
                Secure payment • 30-day guarantee • Instant access
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Enhanced FAQ Section */}
      <section className="py-24 relative" style={{ backgroundColor: '#1A1A1A' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="cyberpunk-grid"></div>
            </div>

        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-5xl font-bold font-mono mb-6 flex flex-col items-center justify-center"
              style={{ color: '#6A9B6A' }}
              variants={fadeInUp}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mb-4"
              >
                <Icon name="question-mark-circle" size="xl" color="success" />
              </motion.div>
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </motion.h2>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                question: "Do I need any experience to start?",
                answer: "No experience required! The system is designed for complete beginners. We start from the absolute basics and build up your skills systematically."
              },
              {
                question: "How long does it take to see results?",
                answer: "Most students get their first paying client within 2-4 weeks of starting Stage 2. By the end of Stage 2 (6 weeks), you should have a steady stream of clients."
              },
              {
                question: "What if I don't see results?",
                answer: "We offer a 30-day money-back guarantee. If you don't see results within 30 days, we'll refund every penny. No questions asked."
              },
              {
                question: "Is this a one-time payment?",
                answer: "Yes! One payment of $497 gives you lifetime access to everything. No monthly subscriptions, no hidden fees."
              },
              {
                question: "What skills does this work for?",
                answer: "The system works for any skill-based freelance service: web development, design, writing, marketing, consulting, coaching, and more."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="cyberpunk-panel p-6 rounded-lg data-stream"
                style={{ backgroundColor: '#2A2A2A' }}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 0 20px #6A9B6A',
                  x: 5
                }}
              >
              <h3 className="text-xl font-mono font-bold mb-3" style={{ color: '#6A9B6A' }}>
                  {faq.question}
              </h3>
              <p className="text-sm" style={{ color: '#6A7B9B' }}>
                  {faq.answer}
              </p>
              </motion.div>
            ))}
          </motion.div>
            </div>
      </section>

      {/* Section Connector */}
      <div className="relative h-20 flex items-center justify-center">
        <div className="w-px h-16 bg-gradient-to-b from-brand-primary to-transparent"></div>
        <motion.div
          className="absolute w-4 h-4 bg-brand-primary rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
            </div>

      {/* Enhanced Final CTA Section */}
      <section className="py-24 relative" style={{ backgroundColor: '#2A2A2A' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="cyberpunk-grid"></div>
            </div>
        
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-5xl font-bold font-mono mb-6 flex flex-col items-center justify-center"
              style={{ color: '#6A9B6A' }}
              variants={fadeInUp}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <Icon name="rocket-launch" size="xl" color="success" />
              </motion.div>
              <span>READY TO TRANSFORM YOUR LIFE?</span>
            </motion.h2>
            <motion.p 
              className="text-xl mb-8"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
            Join 2,847+ freelancers who've already made the transformation. 
            Your journey to $10K/month starts now.
            </motion.p>

          <motion.div 
            className="cyberpunk-panel p-8 rounded-lg mb-8 data-stream"
            style={{ backgroundColor: '#1A1A1A', border: '2px solid #D44F4F' }}
            variants={fadeInUp}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: '0 0 30px #D44F4F',
              y: -5
            }}
          >
            <motion.h3 
              className="text-2xl font-mono font-bold mb-4 flex items-center justify-center "
              style={{ color: '#D44F4F' }}
              variants={fadeInUp}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
              <Icon name="clock" size="lg" color="danger" className="mr-3" />
              </motion.div>
              LIMITED TIME OFFER
            </motion.h3>
            <motion.p 
              className="text-lg mb-6"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
              Get 75% OFF the regular price of $1,997. This offer expires in:
            </motion.p>
            <motion.div 
              className="flex justify-center space-x-4 mb-6"
              variants={staggerContainer}
            >
              {[
                { value: '23', label: 'Hours' },
                { value: '47', label: 'Minutes' },
                { value: '12', label: 'Seconds' }
              ].map((time, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-3xl font-mono font-bold "
                    style={{ color: '#D44F4F' }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {time.value}
                  </motion.div>
                  <div className="text-sm" style={{ color: '#6A7B9B' }}>{time.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.button 
            className="px-16 py-8 rounded-lg font-mono font-bold text-3xl cyberpunk-button mb-6 flex items-center justify-center neon-accent mx-auto"
            style={{ 
              background: 'linear-gradient(90deg, #D44F4F 0%, #7B3A3A 100%)',
              color: '#1A1A1A',
              border: '3px solid #D44F4F'
            }}
            variants={fadeInUp}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 0 40px #D44F4F',
              y: -3
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Icon name="rocket-launch" size="xl" color="custom" customColor="#1A1A1A" className="mr-4" />
            </motion.div>
            START YOUR JOURNEY NOW
          </motion.button>

          <motion.div 
            className="flex justify-center"
            style={{ color: '#6A7B9B' }}
            variants={fadeInUp}
          >
            <div className="space-y-3 text-sm">
              {[
                '30-Day Money-Back Guarantee',
                'Instant Access',
                'Lifetime Updates'
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
              <Icon name="check-circle" size="sm" color="success" className="mr-2" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12 relative" style={{ backgroundColor: '#1A1A1A' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="cyberpunk-grid"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <motion.div 
            className="cyberpunk-panel p-6 rounded-lg data-stream"
            style={{ backgroundColor: '#2A2A2A' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px #6A9B6A' }}
          >
            <motion.h3 
              className="text-2xl font-mono font-bold mb-4 "
              style={{ color: '#6A9B6A' }}
              variants={fadeInUp}
            >
              FREELANCE QUEST
            </motion.h3>
            <motion.p 
              className="text-sm mb-4"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
              The proven system to go from $0 to $10K/month as a freelancer
            </motion.p>
            <motion.div 
              className="text-xs"
              style={{ color: '#6A7B9B' }}
              variants={fadeInUp}
            >
              © 2024 Freelance Quest. All rights reserved.
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default FreelanceQuestLanding;
