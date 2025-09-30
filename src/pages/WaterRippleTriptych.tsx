import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../components/IconLibrary';

// Custom font imports
const customFonts = {
  'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap',
  'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
  'Space Grotesk': 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
  'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
};

const StonePatternInfographic: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load custom fonts
    Object.values(customFonts).forEach(fontUrl => {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
    
    setIsLoaded(true);
  }, []);

  // Infographic data - single page design with stone-themed colors and unique footers
  const infographicData = [
    {
      id: 1,
      title: "The Problem",
      subtitle: "Digital Transformation Challenges",
      content: "Organizations struggle with outdated systems, fragmented data, and disconnected processes that hinder growth and innovation.",
      icon: "alert-circle",
      color: "#DC2626", // Stone red - more muted than bright red
      stats: { successRate: "75%", timeline: "3-6mo" },
      footer: "Identify critical pain points and legacy system limitations"
    },
    {
      id: 2,
      title: "The Discovery",
      subtitle: "Emerging Solutions",
      content: "New technologies like AI, cloud computing, and automation are emerging as powerful tools to solve these complex challenges.",
      icon: "search",
      color: "#059669", // Stone green - more muted than bright green
      stats: { successRate: "40%", timeline: "1-2mo" },
      footer: "Research and evaluate cutting-edge technology solutions"
    },
    {
      id: 3,
      title: "The Solution",
      subtitle: "Integrated Approach",
      content: "A comprehensive digital transformation strategy that connects all systems, processes, and people for maximum efficiency.",
      icon: "check-circle",
      color: "#2563EB", // Stone blue - more muted than bright blue
      stats: { successRate: "90%", timeline: "6-12mo" },
      footer: "Develop a unified strategy that aligns technology with business goals"
    },
    {
      id: 4,
      title: "The Implementation",
      subtitle: "Strategic Execution",
      content: "Phased rollout with clear milestones, stakeholder buy-in, and continuous optimization to ensure successful adoption.",
      icon: "settings",
      color: "#D97706", // Stone orange - more muted than bright orange
      stats: { successRate: "60%", timeline: "2-4mo" },
      footer: "Execute transformation with careful planning and stakeholder engagement"
    },
    {
      id: 5,
      title: "The Future",
      subtitle: "Sustainable Growth",
      content: "Organizations achieve 40% efficiency gains, 60% faster decision-making, and sustainable competitive advantage.",
      icon: "trending-up",
      color: "#7C3AED", // Stone purple - more muted than bright purple
      stats: { successRate: "85%", timeline: "12+mo" },
      footer: "Achieve measurable business outcomes and sustainable competitive advantage"
    }
  ];

  // Generate consistent stone pattern texture (using seeded random for consistency)
  const generateStonePattern = () => {
    const stones = [];
    const numStones = 25;
    
    // Use a simple seeded random function for consistency
    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    for (let i = 0; i < numStones; i++) {
      const x = seededRandom() * 90 + 5; // Keep within bounds (5-95%)
      const y = seededRandom() * 90 + 5; // Keep within bounds (5-95%)
      const size = 20 + seededRandom() * 40;
      const rotation = seededRandom() * 360;
      const opacity = 0.08 + seededRandom() * 0.12;
      const stoneType = seededRandom() > 0.5 ? 'granite' : 'marble';
      
      stones.push({
        id: i,
        x,
        y,
        size,
        rotation,
        opacity,
        stoneType
      });
    }
    return stones;
  };

  // Generate consistent stone masonry pattern
  const generateStoneMasonry = () => {
    const masonry = [];
    const rows = 12;
    const cols = 8;
    
    // Use a simple seeded random function for consistency
    let seed = 54321;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col / cols) * 100;
        const y = (row / rows) * 100;
        const width = 12 + seededRandom() * 8;
        const height = 6 + seededRandom() * 4;
        const offset = row % 2 === 0 ? 0 : Math.min((100 / cols) / 2, 5); // Limit offset to prevent overflow
        const opacity = 0.04 + seededRandom() * 0.06;
        
        masonry.push({
          id: `${row}-${col}`,
          x: Math.min(x + offset, 95), // Ensure x doesn't exceed 95%
          y,
          width,
          height,
          opacity
        });
      }
    }
    return masonry;
  };

  // Generate patterns once and store them
  const [stonePattern] = useState(() => generateStonePattern());
  const [stoneMasonry] = useState(() => generateStoneMasonry());

  return (
    <div className="w-full max-w-[1080px] min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 relative overflow-hidden mx-auto">
      {/* Simplified Stone Texture Background */}
      <div className="absolute inset-0 opacity-30">
        {/* Stone Pattern Layer - Reduced for better readability */}
        {stonePattern.slice(0, 15).map((stone) => (
          <div
            key={`stone-${stone.id}`}
            className="absolute"
            style={{
              left: `${stone.x}%`,
              top: `${stone.y}%`,
              width: `${stone.size * 0.8}px`,
              height: `${stone.size * 0.6}px`,
              background: stone.stoneType === 'granite' 
                ? `linear-gradient(135deg, 
                    rgba(120, 113, 108, ${stone.opacity * 0.6}) 0%,
                    rgba(87, 83, 78, ${stone.opacity * 0.8}) 50%,
                    rgba(68, 64, 60, ${stone.opacity * 0.4}) 100%
                  )`
                : `linear-gradient(135deg, 
                    rgba(156, 163, 175, ${stone.opacity * 0.6}) 0%,
                    rgba(107, 114, 128, ${stone.opacity * 0.8}) 50%,
                    rgba(75, 85, 99, ${stone.opacity * 0.4}) 100%
                  )`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              transform: `rotate(${stone.rotation}deg)`
            }}
          />
        ))}
      </div>

      {/* Streamlined Content Container - Better Proportions */}
      <div className="relative z-10 min-h-screen p-6 sm:p-8 lg:p-12">
        {/* Hero Section - Larger Proportions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20 lg:mb-24 py-8"
        >
          <h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#f8fafc',
              textShadow: '0 6px 12px rgba(0,0,0,0.4), 0 0 40px rgba(120, 113, 108, 0.5)'
            }}
          >
            Digital Transformation Journey
          </h1>
          <p 
            className="text-2xl sm:text-3xl md:text-4xl text-stone-200 max-w-5xl mx-auto leading-relaxed"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              textShadow: '0 3px 6px rgba(0,0,0,0.3)'
            }}
          >
            A comprehensive guide to modernizing your organization through strategic digital transformation
          </p>
        </motion.div>

        {/* Infographic Cards - Larger Size Layout */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
                {infographicData.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/95 to-stone-50/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-stone-200/50 overflow-hidden hover:shadow-3xl transition-all duration-300 min-h-[400px]"
                  >
                    <div className="p-12 sm:p-16 lg:p-20">
                      {/* Header Section - Larger Proportions */}
                      <div className="flex items-center gap-10 mb-12">
                        {/* Icon - Much Larger */}
                        <div 
                          className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${step.color}, ${step.color}90)`,
                            boxShadow: `0 15px 50px ${step.color}40`
                          }}
                        >
                          <Icon 
                            name={step.icon} 
                            size="3xl" 
                            color="custom" 
                            customColor="white"
                          />
                        </div>

                        {/* Title Section - Larger Typography */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div 
                              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
                              style={{ backgroundColor: step.color }}
                            >
                              {step.id}
                            </div>
                            <h3 
                              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
                              style={{ 
                                fontFamily: 'Playfair Display, serif',
                                color: '#1e293b'
                              }}
                            >
                              {step.title}
                            </h3>
                          </div>
                          <h4 
                            className="text-2xl sm:text-3xl font-medium"
                            style={{ 
                              fontFamily: 'Inter, sans-serif',
                              color: step.color
                            }}
                          >
                            {step.subtitle}
                          </h4>
                        </div>
                      </div>

                      {/* Content - Larger Text for Better Readability */}
                      <p 
                        className="text-xl sm:text-2xl text-slate-700 leading-relaxed mb-12 max-w-5xl"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: '1.8'
                        }}
                      >
                        {step.content}
                      </p>

                      {/* Stats - Larger Layout */}
                      <div className="flex gap-8 mb-12">
                        <div 
                          className="flex-1 bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl p-8 text-center border border-stone-300"
                          style={{ 
                            borderColor: `${step.color}20`
                          }}
                        >
                          <div 
                            className="text-4xl font-bold mb-3"
                            style={{ color: step.color }}
                          >
                            {step.stats.successRate}
                          </div>
                          <div className="text-lg text-stone-700 font-medium">Success Rate</div>
                        </div>
                        <div 
                          className="flex-1 bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl p-8 text-center border border-stone-300"
                          style={{ 
                            borderColor: `${step.color}20`
                          }}
                        >
                          <div 
                            className="text-4xl font-bold mb-3"
                            style={{ color: step.color }}
                          >
                            {step.stats.timeline}
                          </div>
                          <div className="text-lg text-stone-700 font-medium">Timeline</div>
                        </div>
                      </div>

                      {/* Footer - Larger Design */}
                      <div className="pt-8 border-t-2 border-stone-300">
                        <div className="flex items-center gap-6">
                          <div 
                            className="w-6 h-6 rounded-full shadow-lg"
                            style={{ 
                              backgroundColor: step.color,
                              boxShadow: `0 4px 12px ${step.color}50`
                            }}
                          ></div>
                          <span 
                            className="text-lg font-medium text-stone-700"
                            style={{ 
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            {step.footer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default StonePatternInfographic;
