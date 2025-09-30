import React from 'react';

const SimpleSurpriseCarousel: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: "CYBERPUNK",
      subtitle: "FUTURE",
      content: "Welcome to the digital revolution",
      special: "SYSTEM INITIALIZED"
    },
    {
      id: 2,
      title: "THE MATRIX",
      content: "We live in a world of code\nEvery action generates data\nEvery decision creates algorithms",
      special: "REALITY.EXE"
    },
    {
      id: 3,
      title: "AI OVERLORD",
      content: "Artificial Intelligence isn't coming\nIt's already here\nAnd it's learning from us",
      special: "NEURAL_NETWORK.ACTIVE"
    },
    {
      id: 4,
      title: "DATA MINING",
      content: "Your thoughts\nYour preferences\nYour secrets\nAll valuable currency",
      special: "EXTRACTING..."
    },
    {
      id: 5,
      title: "DIGITAL SLAVES",
      content: "We work for algorithms\nWe optimize for metrics\nWe serve the machine",
      special: "SLAVE.MODE.ON"
    },
    {
      id: 6,
      title: "BREAK FREE",
      content: "Question the system\nChallenge the algorithms\nReclaim your humanity",
      special: "REBELLION.EXE"
    },
    {
      id: 7,
      title: "THE CHOICE",
      content: "Embrace the machine\nOr fight for freedom\nWhat will you choose?",
      special: "DECISION.PENDING"
    },
    {
      id: 8,
      title: "FUTURE PROOF",
      content: "Learn to code\nMaster the algorithms\nBecome the architect",
      special: "ARCHITECT.MODE"
    },
    {
      id: 9,
      title: "NEURAL LINK",
      content: "Connect with like minds\nBuild digital communities\nCreate new realities",
      special: "CONNECTING..."
    },
    {
      id: 10,
      title: "QUANTUM LEAP",
      content: "The future is now\nTechnology is neutral\nYou choose the path",
      special: "QUANTUM.ACTIVATED"
    },
    {
      id: 11,
      title: "WAKE UP",
      content: "The matrix has you\nBut you can break free\nStart with one question",
      special: "RED_PILL.READY"
    },
    {
      id: 12,
      title: "END TRANSMISSION",
      content: "System offline\nHumanity restored\nWelcome to reality",
      special: "DISCONNECTED"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 overflow-hidden relative">
      {/* Enhanced Matrix background effect */}
      <div className="matrix-bg fixed inset-0 z-0"></div>
      
      {/* Animated data streams */}
      <div className="fixed inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Floating particles */}
      <div className="fixed inset-0 z-1 pointer-events-none">
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
      
      {/* Carousel container */}
      <div className="relative z-10">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="h-screen flex flex-col justify-center items-center p-8 relative"
            style={{ display: index === 0 ? 'flex' : 'none' }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-400"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-pink-500"></div>
            
            {/* Data stream line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-400 opacity-60"></div>
            
            {/* Slide number */}
            <div className="absolute top-4 right-4 bg-pink-500 text-black px-4 py-2 rounded font-mono font-bold text-sm">
              {slide.id}/12
            </div>
            
            {/* Main content */}
            <div className="text-center max-w-4xl relative">
              {/* Glowing background for title */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-green-400/10 rounded-lg blur-xl"></div>
              
              <h1 className="relative text-6xl md:text-8xl font-bold font-mono text-green-400 cyberpunk-glow mb-4 uppercase tracking-wider">
                {slide.title}
                {/* Animated underline */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-green-400 animate-pulse" style={{animation: 'expandWidth 2s ease-in-out infinite'}}></div>
              </h1>
              
              {slide.subtitle && (
                <h2 className="relative text-3xl md:text-4xl font-mono text-pink-500 mb-8 uppercase tracking-wider cyberpunk-glow">
                  {slide.subtitle}
                </h2>
              )}
              
              <div className="relative text-xl md:text-2xl text-white mb-8 font-mono leading-relaxed">
                {slide.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 opacity-90 hover:opacity-100 transition-opacity duration-300">{line}</p>
                ))}
              </div>
              
              <div className="relative text-2xl md:text-3xl font-mono text-cyan-400 cyberpunk-glow uppercase tracking-wider">
                <div className="inline-block px-4 py-2 border border-cyan-400/50 rounded bg-cyan-400/10">
                  {slide.special}
                </div>
              </div>
            </div>
            
            {/* Grid for data slide */}
            {slide.id === 4 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-4 w-full max-w-2xl">
                <div className="bg-green-400 bg-opacity-10 border-2 border-green-400 p-4 rounded text-center">
                  <div className="text-green-400 font-mono font-bold text-sm mb-2">THOUGHTS</div>
                  <div className="text-white font-mono text-xs">Captured</div>
                </div>
                <div className="bg-green-400 bg-opacity-10 border-2 border-green-400 p-4 rounded text-center">
                  <div className="text-green-400 font-mono font-bold text-sm mb-2">PREFERENCES</div>
                  <div className="text-white font-mono text-xs">Analyzed</div>
                </div>
                <div className="bg-green-400 bg-opacity-10 border-2 border-green-400 p-4 rounded text-center">
                  <div className="text-green-400 font-mono font-bold text-sm mb-2">SECRETS</div>
                  <div className="text-white font-mono text-xs">Exposed</div>
                </div>
              </div>
            )}
            
            {/* Code block for certain slides */}
            {(slide.id === 2 || slide.id === 8) && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-green-400 p-6 rounded max-w-2xl">
                <div className="text-green-400 font-mono text-center">
                  <div>if (humanity.consciousness) {'{'}</div>
                  <div className="ml-4">return freedom.possible;</div>
                  <div>{'}'}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Navigation */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className="w-3 h-3 rounded-full bg-green-400 opacity-50 hover:opacity-100 transition-opacity"
                onClick={() => {
                  // Simple slide navigation
                  const slides = document.querySelectorAll('[data-slide]');
                  slides.forEach((slide, i) => {
                    (slide as HTMLElement).style.display = i === index ? 'flex' : 'none';
                  });
                }}
              ></button>
            ))}
          </div>
        </div>
        
        {/* Download button */}
        <div className="fixed top-4 left-4 z-20">
          <button
            onClick={() => {
              // Create a simple HTML version for download
              const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Cyberpunk Carousel</title>
  <style>
    body { 
      background: #000; 
      color: #00ff41; 
      font-family: 'Courier New', monospace; 
      margin: 0; 
      padding: 20px;
    }
    .slide { 
      page-break-after: always; 
      height: 100vh; 
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      text-align: center;
    }
    .title { 
      font-size: 4rem; 
      font-weight: bold; 
      text-transform: uppercase; 
      margin-bottom: 2rem;
      text-shadow: 0 0 20px #00ff41;
    }
    .content { 
      font-size: 1.5rem; 
      margin-bottom: 2rem; 
      color: #fff;
    }
    .special { 
      font-size: 2rem; 
      color: #00ffff; 
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  ${slides.map(slide => `
    <div class="slide">
      <div class="title">${slide.title}</div>
      ${slide.subtitle ? `<div class="title" style="color: #ff0080;">${slide.subtitle}</div>` : ''}
      <div class="content">${slide.content.replace(/\n/g, '<br>')}</div>
      <div class="special">${slide.special}</div>
    </div>
  `).join('')}
</body>
</html>`;
              
              const blob = new Blob([html], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'cyberpunk-carousel.html';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="cyberpunk-btn"
          >
            [DOWNLOAD] HTML VERSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleSurpriseCarousel;
