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

const WaterRippleCarousel: React.FC = () => {
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

  // Generate random patterns for static design
  const generateRipplePattern = () => {
    const ripples = [];
    for (let i = 0; i < 12; i++) {
      ripples.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 40 + Math.random() * 120,
        opacity: 0.1 + Math.random() * 0.3,
        delay: Math.random() * 2
      });
    }
    return ripples;
  };

  const generateDropPattern = () => {
    const drops = [];
    for (let i = 0; i < 8; i++) {
      drops.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
    return drops;
  };

  const generateParticlePattern = () => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.6
      });
    }
    return particles;
  };

  const ripplePattern = generateRipplePattern();
  const dropPattern = generateDropPattern();
  const particlePattern = generateParticlePattern();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800 relative overflow-hidden">
      {/* SVG Liquify Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquify" x="-50%" y="-50%" width="200%" height="200%">
            {/* Turbulence for organic distortion */}
            <feTurbulence
              baseFrequency="0.02 0.03"
              numOctaves="3"
              result="noise"
              type="fractalNoise"
            />
            {/* Displacement map for liquify effect */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="15"
              result="displacement"
            />
            {/* Blur for smooth liquify effect */}
            <feGaussianBlur
              in="displacement"
              stdDeviation="2"
              result="blurred"
            />
            {/* Merge with original */}
            <feComposite
              in="blurred"
              in2="SourceGraphic"
              operator="overlay"
              result="liquify"
            />
          </filter>
          
          {/* Water ripple distortion filter */}
          <filter id="waterRipple" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              baseFrequency="0.01 0.02"
              numOctaves="4"
              result="waterNoise"
              type="fractalNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="waterNoise"
              scale="8"
              result="waterDistortion"
            />
            <feGaussianBlur
              in="waterDistortion"
              stdDeviation="1.5"
              result="smoothWater"
            />
          </filter>
        </defs>
      </svg>

      {/* Liquify distortion layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 25% 25%, rgba(34, 211, 238, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 75% 75%, rgba(6, 182, 212, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 20%, rgba(8, 145, 178, 0.08) 0%, transparent 70%)
          `,
          filter: 'url(#liquify)',
          transform: 'perspective(800px) rotateX(1deg) rotateY(-0.5deg)',
          mixBlendMode: 'overlay'
        }}
      />
      {/* Water Ripple Background */}
      <div className="absolute inset-0">
        {/* Randomized static ripples with liquify distortion */}
        {ripplePattern.map((ripple) => (
          <div
            key={`ripple-${ripple.id}`}
            className="absolute border border-cyan-400/30 rounded-full"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              opacity: ripple.opacity,
              filter: 'url(#waterRipple)',
              transform: `perspective(1000px) rotateX(${Math.random() * 4 - 2}deg) rotateY(${Math.random() * 4 - 2}deg)`,
              mixBlendMode: 'screen'
            }}
          />
        ))}

        {/* Randomized water drops with liquify distortion */}
        {dropPattern.map((drop) => (
          <div
            key={`drop-${drop.id}`}
            className="absolute bg-cyan-300/60 rounded-full"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              width: `${drop.size}px`,
              height: `${drop.size}px`,
              opacity: drop.opacity,
              filter: 'url(#liquify)',
              transform: `perspective(1200px) rotateX(${Math.random() * 6 - 3}deg) rotateY(${Math.random() * 6 - 3}deg) scale(${0.8 + Math.random() * 0.4})`,
              mixBlendMode: 'soft-light'
            }}
          />
        ))}

        {/* Randomized particles with subtle liquify */}
        {particlePattern.map((particle) => (
          <div
            key={`particle-${particle.id}`}
            className="absolute bg-cyan-400/40 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: 'url(#waterRipple)',
              transform: `perspective(1500px) rotateX(${Math.random() * 3 - 1.5}deg) rotateY(${Math.random() * 3 - 1.5}deg)`,
              mixBlendMode: 'color-dodge'
            }}
          />
        ))}
      </div>

      {/* Hero Content with subtle liquify distortion */}
      <div 
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
        style={{
          filter: 'url(#waterRipple)',
          transform: 'perspective(2000px) rotateX(0.5deg)'
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Decorative Line */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent mx-auto mb-8" />

          {/* Main Title */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-thin text-cyan-50 mb-8 tracking-tight leading-none"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              textShadow: '0 0 30px rgba(34, 211, 238, 0.3), 0 0 60px rgba(34, 211, 238, 0.1)',
              letterSpacing: '-0.02em'
            }}
          >
            <span className="block">
              The Future
            </span>
            <span 
              className="block text-cyan-300/90 italic font-light"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 0 40px rgba(34, 211, 238, 0.4)'
              }}
            >
              of Innovation
            </span>
          </h1>

          {/* Subtitle with artistic styling */}
          <div className="relative mb-16">
            <p 
              className="text-xl md:text-2xl text-cyan-100/90 max-w-3xl mx-auto leading-relaxed font-light"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.6'
              }}
            >
              Discover how emerging technologies are reshaping industries and creating 
              <span 
                className="text-cyan-300 font-medium"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                unprecedented opportunities
              </span>
              {" "}for growth.
            </p>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-2 h-2 bg-cyan-400/40 rounded-full" />
            <div className="absolute -bottom-4 -right-4 w-1 h-1 bg-cyan-300/60 rounded-full" />
          </div>

          {/* CTA Button */}
          <button
            className="group relative px-12 py-5 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-500/40 rounded-full text-slate-200 font-medium text-lg hover:from-slate-700/60 hover:to-slate-600/60 hover:border-slate-400/60 transition-all duration-500 backdrop-blur-md overflow-hidden hover:scale-105 hover:shadow-cyan-500/20"
            style={{ 
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '0.02em'
            }}
          >
            {/* Static background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Button text */}
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>→</span>
              Explore the Journey
              <span>←</span>
            </span>
          </button>

          {/* Artistic Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
            {/* Decorative text */}
            <p 
              className="text-cyan-300/60 text-sm font-light tracking-widest uppercase"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              Scroll to explore
            </p>
            
            {/* Enhanced scroll indicator */}
            <div className="relative w-8 h-12 border-2 border-cyan-400/50 rounded-full flex justify-center group cursor-pointer hover:scale-110 hover:border-cyan-400/80 transition-all duration-300">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-cyan-300 rounded-full mt-2" />
              
              {/* Static glow effect */}
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm" />
            </div>
            
            {/* Static particles around scroll indicator */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                style={{
                  left: `${-20 + i * 20}px`,
                  top: `${10 + i * 5}px`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Ambient Light Effects with Liquify */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary ambient lights with liquify distortion */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl"
          style={{
            filter: 'url(#liquify)',
            transform: 'perspective(1000px) rotateX(2deg) rotateY(-1deg)',
            mixBlendMode: 'screen'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/6 rounded-full blur-3xl"
          style={{
            filter: 'url(#waterRipple)',
            transform: 'perspective(1200px) rotateX(-1deg) rotateY(2deg)',
            mixBlendMode: 'overlay'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-300/5 rounded-full blur-2xl"
          style={{
            filter: 'url(#liquify)',
            transform: 'perspective(1500px) rotateX(1deg) rotateY(-0.5deg)',
            mixBlendMode: 'soft-light'
          }}
        />
        
        {/* Additional artistic light spots with distortion */}
        <div 
          className="absolute top-1/6 right-1/3 w-32 h-32 bg-blue-400/4 rounded-full blur-2xl"
          style={{
            filter: 'url(#waterRipple)',
            transform: 'perspective(800px) rotateX(3deg) rotateY(-2deg)',
            mixBlendMode: 'color-dodge'
          }}
        />
        <div 
          className="absolute bottom-1/6 left-1/6 w-40 h-40 bg-teal-400/3 rounded-full blur-3xl"
          style={{
            filter: 'url(#liquify)',
            transform: 'perspective(1000px) rotateX(-2deg) rotateY(3deg)',
            mixBlendMode: 'multiply'
          }}
        />
        
        {/* Liquify distortion overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, rgba(34, 211, 238, 0.03) 0%, transparent 80%),
              radial-gradient(ellipse at 70% 60%, rgba(6, 182, 212, 0.02) 0%, transparent 80%)
            `,
            filter: 'url(#liquify)',
            transform: 'perspective(2000px) rotateX(0.5deg) rotateY(-0.3deg)',
            mixBlendMode: 'overlay'
          }}
        />
        
        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-slate-900/20" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-cyan-800/5 to-transparent" />
      </div>
    </div>
  );
};

export default WaterRippleCarousel;
