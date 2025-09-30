import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// Carousel slide data
  const carouselSlides = [
    {
      id: 1,
      headline: "The Presentation Paradox",
      subheading: "Style Over Substance",
      body: "Sometimes a boring idea with amazing animations looks more impressive than a brilliant idea with boring slides. Welcome to the corporate world! 🎭",
      cta: "😅 Style Wins",
      color: "from-red-900 to-orange-900",
      gradient: "from-red-900 via-orange-800 to-orange-900"
    },
    {
      id: 2,
      headline: "The Animation Arms Race",
      subheading: "Because Static is Dead",
      body: "Your competitor has spinning logos? You need exploding text! They have smooth transitions? You need zoetrope backgrounds! The presentation wars are real. 💥",
      cta: "🎪 Over the Top",
      color: "from-green-900 to-emerald-900",
      gradient: "from-green-900 via-emerald-800 to-emerald-900"
    },
    {
      id: 3,
      headline: "The Hollywood Effect",
      subheading: "Make Everything Cinematic",
      body: "Transform your quarterly budget report into a Marvel movie trailer. Because nothing says 'professional' like dramatic lighting and orchestral swells! 🎬",
      cta: "🎭 Drama Queen",
      color: "from-indigo-900 to-purple-900",
      gradient: "from-indigo-900 via-purple-800 to-purple-900"
    },
    {
      id: 4,
      headline: "The Social Media Trap",
      subheading: "Content is King? Nah.",
      body: "Your 10-slide carousel about office coffee gets 10K likes, but your groundbreaking research gets 3. The algorithm loves pretty pictures more than deep thoughts. 📱",
      cta: "🤳 Pretty Pictures",
      color: "from-purple-900 to-pink-900",
      gradient: "from-purple-900 via-pink-800 to-pink-900"
    },
    {
      id: 5,
      headline: "The Final Truth",
      subheading: "Presentation > Content",
      body: "In a world where TikTok dances get more engagement than scientific papers, maybe the real innovation is making everything look like a blockbuster movie. 🎪",
      cta: "🎪 Embrace the Chaos",
      color: "from-pink-900 to-red-900",
      gradient: "from-pink-900 via-red-800 to-red-900"
    }
  ]

export function LinkedInCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isExportMode, setIsExportMode] = useState(false)
  const [progressKey, setProgressKey] = useState(0) // Key to reset progress bar animation
  
  // Check if we're in export mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setIsExportMode(params.get('export') === 'true')
  }, [])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])
  
  // Auto-advance slides with synchronized progress bar
  useEffect(() => {
    if (!isReady) return
    
    const slideDuration = isExportMode ? 6000 : 4000
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
      setProgressKey(prev => prev + 1) // Reset progress bar animation
    }, slideDuration)
    
    return () => clearInterval(interval)
  }, [isReady, isExportMode])

  const slide = carouselSlides[currentSlide]

  // Drum beat-style Animation variants with rhythmic pulses
  const slideVariants = {
    enter: {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.3, // Start very small like a drum hit
      rotateY: 0,
      rotateZ: 0,
      filter: "blur(0px)",
      // Drum beat rhythm: quick hit, pause, quick hit
      transition: {
        scale: [
          { duration: 0.1, ease: "easeOut" }, // Quick hit
          { duration: 0.2, ease: "easeInOut" }, // Pause
          { duration: 0.1, ease: "easeOut" }, // Another hit
          { duration: 0.3, ease: "easeInOut" } // Longer pause
        ],
        opacity: [
          { duration: 0.1, ease: "easeOut" },
          { duration: 0.2, ease: "easeInOut" },
          { duration: 0.1, ease: "easeOut" },
          { duration: 0.3, ease: "easeInOut" }
        ]
      }
    },
    center: {
      x: 0,
      opacity: 1,
      scale: [1, 1.05, 1, 1.02, 1], // Rhythmic drum pulses
      rotateY: 0,
      rotateZ: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: "easeOut",
        scale: {
          duration: 2.0,
          times: [0, 0.25, 0.5, 0.75, 1],
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    exit: {
      x: (() => {
        // Varied exit directions: left, right, left, right pattern
        const directions = [-1200, 1200, -1000, 1000, -800]; // left, right, left, right, left
        return directions[slide.id - 1] || -1000;
      })(),
      y: (() => {
        // Add vertical variation for more dynamic exits
        const verticals = [0, -300, 200, -150, 100];
        return verticals[slide.id - 1] || 0;
      })(),
      opacity: 0,
      scale: 0.8,
      rotateY: (() => {
        // Varying 3D rotation per slide
        const rotations = [-45, 45, -60, 60, -30];
        return rotations[slide.id - 1] || -45;
      })(),
      rotateZ: (() => {
        // Unique Z rotation for each slide exit
        const zRotations = [-slide.id * 30, slide.id * 45, -slide.id * 60, slide.id * 20, -slide.id * 40];
        return zRotations[slide.id - 1] || -slide.id * 30;
      })(),
      filter: "blur(8px)",
      transition: {
        duration: 0.8 + slide.id * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateZ: slide.id * 15 // Subtle rotation variation
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateZ: 0,
      transition: {
        duration: 1.0 + slide.id * 0.15,
        delay: 0.4 + slide.id * 0.1,
        ease: "easeOut",
        staggerChildren: 0.15 + slide.id * 0.05
      }
    },
    exit: {
      opacity: 0,
      y: (() => {
        // Content container exit directions
        const contentVerticals = [-80, 80, -60, 100, -40];
        return contentVerticals[slide.id - 1] || -80;
      })(),
      scale: 0.8,
      rotateZ: (() => {
        // Content container rotation
        const contentSpins = [slide.id * 8, -slide.id * 12, slide.id * 6, -slide.id * 10, slide.id * 4];
        return contentSpins[slide.id - 1] || slide.id * 8;
      })(),
      transition: {
        duration: 0.7 + slide.id * 0.1,
        ease: "easeIn",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateZ: slide.id * 5 // Micro rotations per slide
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: {
        duration: 0.7 + slide.id * 0.1,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: (() => {
        // Varied vertical exit directions: up, down, up, down pattern
        const verticals = [-100, 100, -80, 120, -60]; // up, down, up, down, up
        return verticals[slide.id - 1] || -100;
      })(),
      x: (() => {
        // Add horizontal drift during exit
        const horizontals = [0, 20, -15, 25, -10];
        return horizontals[slide.id - 1] || 0;
      })(),
      rotateZ: (() => {
        // Spinning exit rotation
        const spins = [slide.id * 10, -slide.id * 15, slide.id * 8, -slide.id * 12, slide.id * 6];
        return spins[slide.id - 1] || slide.id * 10;
      })(),
      scale: 0.8,
      transition: {
        duration: 0.6 + slide.id * 0.1,
        ease: "easeIn"
      }
    }
  }

  const badgeVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      rotateZ: slide.id * 45 // Spinning badge entrance
    },
    visible: {
      opacity: 1,
      scale: [1, 1.05, 1], // Subtle pulse
      y: 0,
      rotateZ: 0,
      transition: {
        duration: 0.8 + slide.id * 0.1,
        delay: 0.2 + slide.id * 0.05,
        ease: "backOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      y: (() => {
        // Badge exit directions
        const badgeVerticals = [50, -50, 40, -60, 30];
        return badgeVerticals[slide.id - 1] || 50;
      })(),
      rotateZ: (() => {
        // Spinning badge exit
        const badgeSpins = [-slide.id * 20, slide.id * 25, -slide.id * 18, slide.id * 22, -slide.id * 16];
        return badgeSpins[slide.id - 1] || -slide.id * 20;
      })(),
      transition: {
        duration: 0.5 + slide.id * 0.05,
        ease: "easeIn"
      }
    }
  }

  const decorativeVariants = {
    hidden: {
      scale: 0,
      rotate: slide.id * 180, // Unique starting rotation
      opacity: 0,
      filter: "blur(4px)"
    },
    visible: {
      scale: [1, 1.1, 1],
      rotate: slide.id * 180 + 360, // Complete rotation plus slide variation
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 2.5 + slide.id * 0.3,
        delay: 0.8 + slide.id * 0.1,
        ease: "easeOut"
      }
    }
  }

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      data-ready={isReady}
    >
      {/* Dynamic background gradient */}
      <motion.div 
        key={slide.id}
        className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Slide-specific Zoetrope Background Animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rotating concentric circles - unique timing per slide */}
        <motion.div
          key={`bg-circle-1-${slide.id}`}
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-white/5 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1,
            scale: [1, 1.2, 1],
            rotate: 360
          }}
          transition={{
            opacity: { duration: 1, ease: "easeOut" },
            scale: { duration: slide.id * 2 + 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: slide.id * 5 + 15, repeat: Infinity, ease: "linear" }
          }}
        />
        
        <motion.div
          key={`bg-circle-2-${slide.id}`}
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/8 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1,
            scale: [1.2, 1, 1.2],
            rotate: -360
          }}
          transition={{
            opacity: { duration: 1, delay: 0.2, ease: "easeOut" },
            scale: { duration: slide.id * 1.5 + 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: slide.id * 4 + 12, repeat: Infinity, ease: "linear" }
          }}
        />
        
        <motion.div
          key={`bg-circle-3-${slide.id}`}
          className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/12 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1,
            scale: [1, 1.3, 1],
            rotate: 360
          }}
          transition={{
            opacity: { duration: 1, delay: 0.4, ease: "easeOut" },
            scale: { duration: slide.id * 1.2 + 3, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: slide.id * 3 + 8, repeat: Infinity, ease: "linear" }
          }}
        />

        {/* Bottom right zoetrope - unique patterns per slide */}
        <motion.div
          key={`bg-circle-4-${slide.id}`}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 border border-white/6 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1,
            scale: [1, 1.1, 1],
            rotate: -360
          }}
          transition={{
            opacity: { duration: 1, delay: 0.3, ease: "easeOut" },
            scale: { duration: slide.id * 2.5 + 7, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: slide.id * 6 + 18, repeat: Infinity, ease: "linear" }
          }}
        />
        
        <motion.div
          key={`bg-circle-5-${slide.id}`}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/10 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1,
            scale: [1.1, 1, 1.1],
            rotate: 360
          }}
          transition={{
            opacity: { duration: 1, delay: 0.5, ease: "easeOut" },
            scale: { duration: slide.id * 2 + 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: slide.id * 4.5 + 14, repeat: Infinity, ease: "linear" }
          }}
        />

        {/* Center spinning elements - unique orbits per slide */}
        <motion.div
          key={`center-1-${slide.id}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/20 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1,
            scale: 1,
            rotate: 360,
            x: [0, slide.id * 20, 0, -slide.id * 20, 0],
            y: [0, -slide.id * 20, 0, slide.id * 20, 0]
          }}
          transition={{
            opacity: { duration: 0.8, ease: "easeOut" },
            scale: { duration: 0.8, ease: "easeOut" },
            rotate: { duration: slide.id * 3 + 9, repeat: Infinity, ease: "linear" },
            x: { duration: slide.id * 2 + 6, repeat: Infinity, ease: "easeInOut" },
            y: { duration: slide.id * 2 + 6, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        <motion.div
          key={`center-2-${slide.id}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/30 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1,
            scale: 1,
            rotate: -360,
            x: [0, -slide.id * 15, 0, slide.id * 15, 0],
            y: [0, slide.id * 15, 0, -slide.id * 15, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
            scale: { duration: 0.8, delay: 0.3, ease: "easeOut" },
            rotate: { duration: slide.id * 2.5 + 7, repeat: Infinity, ease: "linear" },
            x: { duration: slide.id * 1.5 + 4, repeat: Infinity, ease: "easeInOut" },
            y: { duration: slide.id * 1.5 + 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Dynamic radial gradients - unique patterns per slide */}
        <motion.div 
          key={`gradient-${slide.id}`}
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.05,
            background: [
              `radial-gradient(circle_at_${30 + slide.id * 10}%_${20 + slide.id * 5}%,rgba(255,255,255,0.3),transparent_50%)`,
              `radial-gradient(circle_at_${70 - slide.id * 5}%_${80 - slide.id * 10}%,rgba(255,255,255,0.3),transparent_50%)`,
              `radial-gradient(circle_at_${30 + slide.id * 10}%_${20 + slide.id * 5}%,rgba(255,255,255,0.3),transparent_50%)`
            ]
          }}
          transition={{ 
            opacity: { duration: 1, ease: "easeOut" },
            background: { duration: slide.id * 4 + 12, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Spinning line patterns - unique speeds per slide */}
        <motion.div
          key={`line-1-${slide.id}`}
          className="absolute top-1/3 right-1/3 w-1 h-24 bg-gradient-to-b from-white/10 to-transparent"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ 
            opacity: 1,
            scaleY: 1,
            rotate: 360
          }}
          transition={{
            opacity: { duration: 0.8, ease: "easeOut" },
            scaleY: { duration: 0.8, ease: "easeOut" },
            rotate: { duration: slide.id * 2 + 6, repeat: Infinity, ease: "linear" }
          }}
        />
        
        <motion.div
          key={`line-2-${slide.id}`}
          className="absolute bottom-1/3 left-1/3 w-1 h-32 bg-gradient-to-t from-white/10 to-transparent"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ 
            opacity: 1,
            scaleY: 1,
            rotate: -360
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4, ease: "easeOut" },
            scaleY: { duration: 0.8, delay: 0.4, ease: "easeOut" },
            rotate: { duration: slide.id * 3 + 9, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      {/* Slide counter indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-8 left-8 z-20"
      >
        <div className="flex space-x-2">
          {carouselSlides.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/30'
              }`}
              animate={{
                scale: index === currentSlide ? 1.2 : 1,
                opacity: index === currentSlide ? 1 : 0.3
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Export mode indicator */}
      {isExportMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-8 right-8 z-20"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-mono">
              Export Mode • Slide {currentSlide + 1}/{carouselSlides.length} • 6s
            </span>
          </div>
        </motion.div>
      )}

      {/* Main slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          <motion.article 
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            {/* Highlight badge with zoetrope entrance */}
            <motion.div
              variants={badgeVariants}
              className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/10"
              style={{
                background: `conic-gradient(from ${slide.id * 45}deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1))`
              }}
              animate={{
                rotate: slide.id * 10,
                scale: [1, 1.08, 1, 1.04, 1], // Strong drum beats
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0.1)",
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 0px rgba(255,255,255,0.1)",
                  "0 0 15px rgba(255,255,255,0.2)",
                  "0 0 0px rgba(255,255,255,0.1)"
                ]
              }}
              transition={{
                rotate: { duration: 10 + slide.id * 2, repeat: Infinity, ease: "linear" },
                scale: { 
                  duration: 1.2, 
                  times: [0, 0.15, 0.3, 0.6, 1],
                  repeat: Infinity, 
                  ease: "easeOut" 
                },
                boxShadow: { 
                  duration: 1.2, 
                  times: [0, 0.15, 0.3, 0.6, 1],
                  repeat: Infinity, 
                  ease: "easeOut" 
                }
              }}
            >
              <span className="text-white font-medium text-lg tracking-wide">
                {slide.cta}
              </span>
            </motion.div>
            
            {/* Main headline with zoetrope text effects */}
            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight"
              style={{ 
                textShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 ${slide.id * 5}px rgba(255,255,255,0.1)`,
                background: `linear-gradient(${135 + slide.id * 15}deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              animate={{
                scale: [1, 1.02, 1, 1.01, 1], // Drum beat rhythm
                textShadow: [
                  `0 4px 20px rgba(0,0,0,0.4), 0 0 ${slide.id * 5}px rgba(255,255,255,0.1)`,
                  `0 4px 20px rgba(0,0,0,0.4), 0 0 ${slide.id * 8}px rgba(255,255,255,0.2)`,
                  `0 4px 20px rgba(0,0,0,0.4), 0 0 ${slide.id * 5}px rgba(255,255,255,0.1)`
                ]
              }}
              transition={{
                scale: { 
                  duration: 1.5, 
                  times: [0, 0.2, 0.4, 0.6, 1],
                  repeat: Infinity, 
                  ease: "easeInOut" 
                },
                textShadow: { duration: 4 + slide.id, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {slide.headline}
            </motion.h1>
            
            {/* Subheading with subtle rotation and movement */}
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-light text-white/90 mb-8 tracking-wide"
              animate={{
                y: (() => {
                  // Opposite movement pattern from headline
                  const subheadingMovement = [
                    [0, slide.id * 6, 0, -slide.id * 6, 0], // Slide 1: opposite of headline
                    [0, -slide.id * 8, 0, slide.id * 8, 0], // Slide 2: opposite pattern
                    [0, slide.id * 5, 0, -slide.id * 5, 0], // Slide 3: smaller movement
                    [0, -slide.id * 10, 0, slide.id * 10, 0], // Slide 4: opposite of headline
                    [0, slide.id * 3, 0, -slide.id * 3, 0]  // Slide 5: subtle opposite
                  ];
                  return subheadingMovement[slide.id - 1] || [0, slide.id * 6, 0, -slide.id * 6, 0];
                })(),
                rotateZ: [0, slide.id * 0.5, 0]
              }}
              transition={{
                y: { duration: 7 + slide.id * 0.3, repeat: Infinity, ease: "easeInOut" },
                rotateZ: { duration: 8 + slide.id * 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {slide.subheading}
            </motion.h2>
            
            {/* Body content with floating effect */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto font-light"
              animate={{
                y: (() => {
                  // Different movement pattern for body text
                  const bodyMovement = [
                    [0, slide.id * 4, 0, -slide.id * 4, 0], // Slide 1: gentle floating
                    [0, -slide.id * 6, 0, slide.id * 6, 0], // Slide 2: opposite floating
                    [0, slide.id * 3, 0, -slide.id * 3, 0], // Slide 3: subtle floating
                    [0, -slide.id * 8, 0, slide.id * 8, 0], // Slide 4: larger floating
                    [0, slide.id * 2, 0, -slide.id * 2, 0]  // Slide 5: minimal floating
                  ];
                  return bodyMovement[slide.id - 1] || [0, slide.id * 4, 0, -slide.id * 4, 0];
                })(),
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                y: { duration: 8 + slide.id * 0.2, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 6 + slide.id, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {slide.body}
            </motion.p>
          </motion.article>
        </motion.div>
      </AnimatePresence>

      {/* Slide-specific Zoetrope Decorative Elements */}
      <motion.div
        key={`decorative-1-${slide.id}`}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.3, 1, 1.1, 1], // Drum beat pulses
          rotate: 360
        }}
        className="absolute top-20 right-20 w-32 h-32 border-2 border-white/20 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)"
        }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { 
            duration: 1.8, 
            times: [0, 0.2, 0.4, 0.7, 1],
            repeat: Infinity, 
            ease: "easeOut" 
          },
          rotate: { duration: slide.id * 3 + 15, repeat: Infinity, ease: "linear" }
        }}
      />
      
      <motion.div
        key={`decorative-2-${slide.id}`}
        initial={{ opacity: 0, scale: 0, rotate: 180 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.4, 1, 1.2, 1], // Drum beat pulses
          rotate: -360
        }}
        className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white/20 rounded-full"
        style={{
          background: "conic-gradient(from 180deg, transparent, rgba(255,255,255,0.08), transparent)"
        }}
        transition={{
          opacity: { duration: 1.2, delay: 0.3, ease: "easeOut" },
          scale: { 
            duration: 2.2, 
            times: [0, 0.15, 0.35, 0.65, 1],
            repeat: Infinity, 
            ease: "easeOut" 
          },
          rotate: { duration: slide.id * 4 + 12, repeat: Infinity, ease: "linear" }
        }}
      />

      <motion.div
        key={`decorative-3-${slide.id}`}
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.5, 1, 1.3, 1], // Drum beat pulses
          rotate: 360
        }}
        className="absolute top-1/2 right-10 w-16 h-16 border border-white/15 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
        }}
        transition={{
          opacity: { duration: 1.2, delay: 0.6, ease: "easeOut" },
          scale: { 
            duration: 1.6, 
            times: [0, 0.25, 0.45, 0.75, 1],
            repeat: Infinity, 
            ease: "easeOut" 
          },
          rotate: { duration: slide.id * 2.5 + 8, repeat: Infinity, ease: "linear" }
        }}
      />

      {/* Additional slide-specific zoetrope spinning elements */}
      <motion.div
        key={`extra-1-${slide.id}`}
        className="absolute top-1/4 left-1/2 w-2 h-2 bg-white/30 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: [0.5, 1.5, 0.5],
          rotate: 360
        }}
        transition={{
          opacity: { duration: 0.6, ease: "easeOut" },
          rotate: { duration: slide.id * 2 + 6, repeat: Infinity, ease: "linear" },
          scale: { duration: slide.id * 1.5 + 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      <motion.div
        key={`extra-2-${slide.id}`}
        className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: -360,
          x: [0, slide.id * 12, 0, -slide.id * 12, 0],
          y: [0, -slide.id * 12, 0, slide.id * 12, 0]
        }}
        transition={{
          opacity: { duration: 0.6, delay: 0.2, ease: "easeOut" },
          scale: { duration: 0.6, delay: 0.2, ease: "easeOut" },
          rotate: { duration: slide.id * 1.5 + 4, repeat: Infinity, ease: "linear" },
          x: { duration: slide.id * 1.2 + 2.5, repeat: Infinity, ease: "easeInOut" },
          y: { duration: slide.id * 1.2 + 2.5, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Slide-specific floating particles */}
      <motion.div
        key={`particle-1-${slide.id}`}
        className="absolute top-1/3 left-1/3 w-1 h-1 bg-white/25 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          x: [0, slide.id * 30, 0],
          y: [0, -slide.id * 30, 0]
        }}
        transition={{
          opacity: { duration: slide.id * 3 + 8, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: slide.id * 3 + 8, repeat: Infinity, ease: "easeInOut" },
          x: { duration: slide.id * 3 + 8, repeat: Infinity, ease: "easeInOut" },
          y: { duration: slide.id * 3 + 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      <motion.div
        key={`particle-2-${slide.id}`}
        className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white/35 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          x: [0, -slide.id * 25, 0],
          y: [0, slide.id * 25, 0]
        }}
        transition={{
          opacity: { duration: slide.id * 2.5 + 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
          scale: { duration: slide.id * 2.5 + 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
          x: { duration: slide.id * 2.5 + 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
          y: { duration: slide.id * 2.5 + 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
      />

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-8 left-8 right-8 h-1 bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          key={progressKey} // Reset animation with each slide change
          className="h-full bg-white/60 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: isExportMode ? 6 : 4,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}

export default LinkedInCarousel
