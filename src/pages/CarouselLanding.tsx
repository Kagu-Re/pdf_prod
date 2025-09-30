import React, { useState, useEffect } from 'react';

const CarouselLanding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Slide data with enhanced content
  const slides = [
    {
      id: 1,
      title: "NEURAL",
      subtitle: "ARCHITECTURE",
      content: "Building the future of artificial intelligence\nOne algorithm at a time",
      special: "SYSTEM_INITIALIZED",
      color: "from-green-500 to-emerald-600",
      accent: "text-green-400"
    },
    {
      id: 2,
      title: "QUANTUM",
      subtitle: "COMPUTING",
      content: "Harnessing the power of quantum mechanics\nTo solve impossible problems",
      special: "QUANTUM_STATE_ACTIVE",
      color: "from-purple-500 to-pink-600",
      accent: "text-purple-400"
    },
    {
      id: 3,
      title: "BIOMETRIC",
      subtitle: "AUTHENTICATION",
      content: "Your body becomes your password\nSecurity redefined",
      special: "BIOMETRIC_SCAN_COMPLETE",
      color: "from-blue-500 to-cyan-600",
      accent: "text-blue-400"
    },
    {
      id: 4,
      title: "EDGE",
      subtitle: "COMPUTING",
      content: "Processing at the edge of possibility\nWhere data meets destiny",
      special: "EDGE_NODES_ONLINE",
      color: "from-orange-500 to-red-600",
      accent: "text-orange-400"
    },
    {
      id: 5,
      title: "BLOCKCHAIN",
      subtitle: "REVOLUTION",
      content: "Decentralized trust in a centralized world\nDemocracy of data",
      special: "BLOCK_VERIFIED",
      color: "from-yellow-500 to-orange-600",
      accent: "text-yellow-400"
    },
    {
      id: 6,
      title: "AUGMENTED",
      subtitle: "REALITY",
      content: "Blurring the lines between\nDigital and physical worlds",
      special: "AR_OVERLAY_ACTIVE",
      color: "from-pink-500 to-rose-600",
      accent: "text-pink-400"
    },
    {
      id: 7,
      title: "MACHINE",
      subtitle: "LEARNING",
      content: "Teaching machines to think\nLearning from their mistakes",
      special: "MODEL_TRAINING",
      color: "from-indigo-500 to-purple-600",
      accent: "text-indigo-400"
    },
    {
      id: 8,
      title: "CYBERSECURITY",
      subtitle: "FRONTLINE",
      content: "Defending against digital threats\nIn an interconnected world",
      special: "THREAT_DETECTED",
      color: "from-red-500 to-pink-600",
      accent: "text-red-400"
    },
    {
      id: 9,
      title: "CLOUD",
      subtitle: "NATIVE",
      content: "Born in the cloud\nBuilt for scale",
      special: "CLOUD_DEPLOYED",
      color: "from-sky-500 to-blue-600",
      accent: "text-sky-400"
    },
    {
      id: 10,
      title: "IOT",
      subtitle: "ECOSYSTEM",
      content: "Everything connected\nEverywhere intelligent",
      special: "DEVICES_SYNCED",
      color: "from-teal-500 to-green-600",
      accent: "text-teal-400"
    },
    {
      id: 11,
      title: "FUTURE",
      subtitle: "TECHNOLOGY",
      content: "Tomorrow's solutions\nToday's innovations",
      special: "FUTURE_LOADING",
      color: "from-violet-500 to-purple-600",
      accent: "text-violet-400"
    },
    {
      id: 12,
      title: "INNOVATION",
      subtitle: "CONTINUES",
      content: "The journey never ends\nOnly evolves",
      special: "EVOLUTION_COMPLETE",
      color: "from-cyan-500 to-blue-600",
      accent: "text-cyan-400"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, slides.length]);

  // Load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-cyan-500/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold font-mono cyberpunk-glow">
            TECH CAROUSEL
          </div>
          <div className="flex space-x-4">
            <a
              href="?component=DirectCarouselViewer"
              className="px-6 py-3 bg-green-400 text-black rounded font-mono font-bold hover:bg-green-300 transition-colors"
            >
              VIEW CAROUSEL
            </a>
            <a
              href="?component=AdvancedCarousel"
              className="px-6 py-3 bg-gray-800 text-green-400 border border-green-400 rounded font-mono hover:bg-green-400 hover:text-black transition-colors"
            >
              DOWNLOAD PDF
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Slide Content */}
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <div className="text-6xl md:text-8xl font-bold font-mono mb-4 cyberpunk-glow">
                <span className={`bg-gradient-to-r ${currentSlideData.color} bg-clip-text text-transparent`}>
                  {currentSlideData.title}
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-mono mb-8 text-pink-500">
                {currentSlideData.subtitle}
              </div>
            </div>

            <div className="text-xl md:text-2xl text-gray-300 mb-8 font-mono leading-relaxed max-w-4xl mx-auto">
              {currentSlideData.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>

            <div className={`inline-block px-8 py-4 bg-gradient-to-r ${currentSlideData.color} text-black rounded-lg font-mono font-bold text-xl mb-12`}>
              {currentSlideData.special}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-8">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              className="px-6 py-3 bg-gray-800 text-green-400 border border-green-400 rounded font-mono hover:bg-green-400 hover:text-black transition-colors"
            >
              ← PREV
            </button>

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-green-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              className="px-6 py-3 bg-gray-800 text-green-400 border border-green-400 rounded font-mono hover:bg-green-400 hover:text-black transition-colors"
            >
              NEXT →
            </button>
          </div>

          {/* Auto-play Control */}
          <div className="mt-8">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-6 py-3 rounded font-mono font-bold transition-colors ${
                isAutoPlaying 
                  ? 'bg-green-400 text-black' 
                  : 'bg-gray-800 text-green-400 border border-green-400'
              }`}
            >
              {isAutoPlaying ? 'PAUSE AUTO' : 'START AUTO'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-sm text-gray-400 font-mono mb-4">
            Advanced Technology Carousel • LinkedIn PDF Format • 1080x1350px
          </div>
          <div className="flex justify-center space-x-6">
            <a href="?component=Home" className="text-green-400 hover:text-green-300 font-mono">
              HOME
            </a>
            <a href="?component=DirectCarouselViewer" className="text-green-400 hover:text-green-300 font-mono">
              VIEWER
            </a>
            <a href="?component=AdvancedCarousel" className="text-green-400 hover:text-green-300 font-mono">
              DOWNLOAD
            </a>
          </div>
        </div>
      </footer>

      {/* Slide Counter */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-20">
        <div className="bg-gray-900 px-4 py-2 rounded font-mono text-sm border border-green-400">
          {currentSlide + 1}/{slides.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-800 z-20">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CarouselLanding;




