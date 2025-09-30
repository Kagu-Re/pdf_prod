import React, { useState, useEffect } from 'react';
import CryptoAIMockups from '../components/CryptoAIMockups';

const CryptoAILanding: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation triggers
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate sections
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveSection((prev) => (prev + 1) % 4);
        setIsAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sections = [
    {
      id: 0,
      title: "QUANTUM",
      subtitle: "COMPUTING",
      description: "Harnessing quantum mechanics for exponential processing power",
      features: ["Quantum Entanglement", "Superposition States", "Quantum Gates", "Error Correction"],
      color: "from-purple-500 to-indigo-600",
      accent: "text-purple-400"
    },
    {
      id: 1,
      title: "NEURAL",
      subtitle: "NETWORKS",
      description: "Deep learning algorithms that evolve and adapt in real-time",
      features: ["Deep Learning", "Reinforcement Learning", "Neural Evolution", "Pattern Recognition"],
      color: "from-cyan-500 to-blue-600",
      accent: "text-cyan-400"
    },
    {
      id: 2,
      title: "BLOCKCHAIN",
      subtitle: "AUTOMATION",
      description: "Decentralized intelligence running on distributed networks",
      features: ["Smart Contracts", "DeFi Protocols", "DAO Governance", "Cross-Chain"],
      color: "from-green-500 to-emerald-600",
      accent: "text-green-400"
    },
    {
      id: 3,
      title: "SUPER",
      subtitle: "COMPUTER",
      description: "Massive parallel processing with infinite scalability",
      features: ["Parallel Processing", "Distributed Computing", "Edge Computing", "Cloud Integration"],
      color: "from-orange-500 to-red-600",
      accent: "text-orange-400"
    }
  ];

  const currentSection = sections[activeSection];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-green-500/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
      </div>

      {/* Matrix-style Code Rain */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 font-mono text-xs animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${currentSection.color} rounded-full opacity-30 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-bold font-mono cyberpunk-glow">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              CRYPTO AI
            </span>
            <span className="text-white ml-4">SUPERCOMPUTER</span>
          </div>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-black rounded font-mono font-bold hover:from-purple-400 hover:to-cyan-400 transition-all">
              LAUNCH AI
            </button>
            <button className="px-6 py-3 bg-gray-800 text-cyan-400 border border-cyan-400 rounded font-mono hover:bg-cyan-400 hover:text-black transition-colors">
              WHITEPAPER
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Main Content */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="mb-8">
                <div className="text-6xl md:text-8xl font-bold font-mono mb-4">
                  <span className={`bg-gradient-to-r ${currentSection.color} bg-clip-text text-transparent transition-all duration-1000`}>
                    {currentSection.title}
                  </span>
                </div>
                <div className="text-4xl md:text-5xl font-mono mb-6 text-gray-300">
                  {currentSection.subtitle}
                </div>
                <div className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed">
                  {currentSection.description}
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {currentSection.features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-${currentSection.accent.split('-')[1]}-400 transition-all duration-300`}
                  >
                    <div className={`font-mono text-sm ${currentSection.accent}`}>
                      {feature}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-black rounded-lg font-mono font-bold text-lg hover:from-purple-400 hover:to-cyan-400 transition-all transform hover:scale-105">
                  DEPLOY NOW
                </button>
                <button className="px-8 py-4 bg-gray-800 text-white border border-gray-600 rounded-lg font-mono hover:bg-gray-700 transition-all">
                  LEARN MORE
                </button>
              </div>
            </div>

            {/* Right Side - Interface Mockups */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <CryptoAIMockups />
            </div>
          </div>
        </div>
      </main>

      {/* Section Navigation */}
      <div className="relative z-10 flex justify-center space-x-4 mb-8">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setActiveSection(index);
                setIsAnimating(false);
              }, 500);
            }}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === activeSection 
                ? 'bg-cyan-400 scale-125' 
                : 'bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold font-mono text-cyan-400">99.9%</div>
              <div className="text-sm text-gray-400 font-mono">UPTIME</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold font-mono text-purple-400">∞</div>
              <div className="text-sm text-gray-400 font-mono">SCALABILITY</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold font-mono text-green-400">0.001s</div>
              <div className="text-sm text-gray-400 font-mono">LATENCY</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold font-mono text-orange-400">24/7</div>
              <div className="text-sm text-gray-400 font-mono">AUTOMATION</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-sm text-gray-400 font-mono mb-4">
            CRYPTO AI SUPERCOMPUTER • QUANTUM-POWERED • BLOCKCHAIN-NATIVE
          </div>
          <div className="flex justify-center space-x-8">
            <a href="?component=Home" className="text-cyan-400 hover:text-cyan-300 font-mono">
              HOME
            </a>
            <a href="#" className="text-cyan-400 hover:text-cyan-300 font-mono">
              DOCS
            </a>
            <a href="#" className="text-cyan-400 hover:text-cyan-300 font-mono">
              API
            </a>
            <a href="#" className="text-cyan-400 hover:text-cyan-300 font-mono">
              COMMUNITY
            </a>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(150px) translateY(-50%); }
          to { transform: rotate(360deg) translateX(150px) translateY(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CryptoAILanding;
