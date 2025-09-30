import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import AdvancedCarouselSlide from './AdvancedCarouselSlide';

const DirectCarouselViewer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 12);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoPlay]);

  const slides = [
    { id: 1, title: "NEURAL", subtitle: "ARCHITECTURE" },
    { id: 2, title: "QUANTUM", subtitle: "COMPUTING" },
    { id: 3, title: "BIOMETRIC", subtitle: "AUTHENTICATION" },
    { id: 4, title: "EDGE", subtitle: "COMPUTING" },
    { id: 5, title: "BLOCKCHAIN", subtitle: "REVOLUTION" },
    { id: 6, title: "AUGMENTED", subtitle: "REALITY" },
    { id: 7, title: "MACHINE", subtitle: "LEARNING" },
    { id: 8, title: "CYBERSECURITY", subtitle: "FRONTLINE" },
    { id: 9, title: "CLOUD", subtitle: "NATIVE" },
    { id: 10, title: "IOT", subtitle: "ECOSYSTEM" },
    { id: 11, title: "FUTURE", subtitle: "TECHNOLOGY" },
    { id: 12, title: "INNOVATION", subtitle: "CONTINUES" }
  ];

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex space-x-2">
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`px-4 py-2 rounded font-mono text-sm ${
            autoPlay ? 'bg-green-400 text-black' : 'bg-gray-800 text-green-400 border border-green-400'
          }`}
        >
          {autoPlay ? 'PAUSE' : 'AUTO'}
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-4 py-2 rounded font-mono text-sm bg-gray-800 text-green-400 border border-green-400"
        >
          {isFullscreen ? 'EXIT' : 'FULL'}
        </button>
        <a
          href="?component=AdvancedCarousel"
          className="px-4 py-2 rounded font-mono text-sm bg-gray-800 text-green-400 border border-green-400"
        >
          DOWNLOAD
        </a>
      </div>

      {/* Slide Counter */}
      <div className="fixed top-4 right-4 z-50 bg-gray-900 px-4 py-2 rounded font-mono text-sm">
        {currentSlide + 1}/12
      </div>

      {/* Main Carousel */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-40' : 'min-h-screen'} flex items-center justify-center p-8`}>
        <div className="relative w-full max-w-4xl">
          {/* PDF Viewer */}
          <div className="border-2 border-green-400 rounded-lg overflow-hidden bg-gray-900">
            <PDFViewer width="100%" height="600px">
              <AdvancedCarouselSlide />
            </PDFViewer>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-6 space-x-4">
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
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-green-400' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setCurrentSlide(Math.min(11, currentSlide + 1))}
              className="px-6 py-3 bg-gray-800 text-green-400 border border-green-400 rounded font-mono hover:bg-green-400 hover:text-black transition-colors"
            >
              NEXT →
            </button>
          </div>

          {/* Slide Info */}
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold font-mono text-green-400">
              {slides[currentSlide].title}
            </h2>
            <p className="text-lg text-pink-500 font-mono">
              {slides[currentSlide].subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-30" onClick={() => setIsFullscreen(false)} />
      )}
    </div>
  );
};

export default DirectCarouselViewer;




