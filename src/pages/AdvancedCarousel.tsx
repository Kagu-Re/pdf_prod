import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import AdvancedCarouselSlide from '../components/AdvancedCarouselSlide';

const AdvancedCarousel: React.FC = () => {
  const [activeView, setActiveView] = useState<'preview' | 'download'>('preview');

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Advanced Header with texture effects */}
      <div className="relative bg-gray-900 border-b border-green-400 p-8 overflow-hidden">
        {/* Background texture simulation */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-cyan-400/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-mono cyberpunk-glow mb-4">
              ADVANCED CAROUSEL
            </h1>
            <p className="text-2xl text-pink-500 font-mono mb-2">
              TEXTURE & TYPOGRAPHY MASTERPIECE
            </p>
            <p className="text-lg text-gray-400 font-mono">
              LinkedIn PDF Format • 1080x1350px • Advanced Effects
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Preview */}
          <div className="space-y-6">
            <div className="bg-gray-900 border-2 border-green-400 p-6 rounded-lg">
              <h2 className="text-2xl font-bold font-mono text-green-400 mb-4">
                LIVE PREVIEW
              </h2>
              <div className="border border-green-400 rounded-lg overflow-hidden bg-gray-900">
                <PDFViewer width="100%" height="600px">
                  <AdvancedCarouselSlide />
                </PDFViewer>
              </div>
            </div>
          </div>

          {/* Controls and Info */}
          <div className="space-y-6">
            {/* Download Section */}
            <div className="bg-gray-900 border-2 border-green-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-green-400 mb-4">
                DOWNLOAD OPTIONS
              </h3>
              
              <div className="space-y-4">
                <PDFDownloadLink
                  document={<AdvancedCarouselSlide />}
                  fileName="advanced-tech-carousel.pdf"
                  className="block w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 px-6 rounded-lg text-center transition-colors font-mono text-lg"
                >
                  [DOWNLOAD] ADVANCED PDF
                </PDFDownloadLink>

                <div className="text-sm text-gray-300 space-y-1">
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    LinkedIn-optimized 1080x1350px format
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Advanced texture and typography effects
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    12 high-tech themed slides
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Professional PDF quality
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-gray-900 border-2 border-pink-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-pink-400 mb-4">
                ADVANCED FEATURES
              </h3>
              <ul className="text-sm space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-pink-400 mr-2">◆</span>
                  Simulated texture overlays and noise patterns
                </li>
                <li className="flex items-center">
                  <span className="text-pink-400 mr-2">◆</span>
                  Advanced typography with letter spacing
                </li>
                <li className="flex items-center">
                  <span className="text-pink-400 mr-2">◆</span>
                  Floating elements and visual depth
                </li>
                <li className="flex items-center">
                  <span className="text-pink-400 mr-2">◆</span>
                  Gradient backgrounds and color transitions
                </li>
                <li className="flex items-center">
                  <span className="text-pink-400 mr-2">◆</span>
                  Interactive grid layouts for data slides
                </li>
                <li className="flex items-center">
                  <span className="text-pink-400 mr-2">◆</span>
                  Code blocks with syntax highlighting
                </li>
              </ul>
            </div>

            {/* LinkedIn Optimization */}
            <div className="bg-gray-900 border-2 border-cyan-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-4">
                LINKEDIN OPTIMIZATION
              </h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p><strong className="text-cyan-400">Format:</strong> PDF-based carousel</p>
                <p><strong className="text-cyan-400">Dimensions:</strong> 1080x1350px (perfect for mobile)</p>
                <p><strong className="text-cyan-400">File Size:</strong> Optimized for smooth uploading</p>
                <p><strong className="text-cyan-400">Quality:</strong> High-resolution for crisp display</p>
                <p><strong className="text-cyan-400">Compatibility:</strong> Works on all devices</p>
              </div>
            </div>

            {/* Content Theme */}
            <div className="bg-gray-900 border-2 border-yellow-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-yellow-400 mb-4">
                CONTENT THEME
              </h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p><strong>Focus:</strong> Advanced Technology & Innovation</p>
                <p><strong>Topics:</strong> AI, Quantum Computing, Blockchain, IoT</p>
                <p><strong>Style:</strong> Cyberpunk with professional polish</p>
                <p><strong>Target:</strong> Tech professionals and innovators</p>
                <p><strong>Engagement:</strong> Thought-provoking and visually striking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setActiveView(activeView === 'preview' ? 'download' : 'preview')}
            className="bg-pink-500 hover:bg-pink-400 text-black px-6 py-3 rounded-lg font-mono font-bold transition-colors"
          >
            [TOGGLE] {activeView === 'preview' ? 'DOWNLOAD' : 'PREVIEW'}
          </button>
          <a
            href="?component=Home"
            className="bg-gray-800 hover:bg-gray-700 text-green-400 px-6 py-3 rounded-lg font-mono border border-green-400 transition-colors"
          >
            [BACK] TO HOME
          </a>
          <a
            href="?component=EnhancedCarousel"
            className="bg-gray-800 hover:bg-gray-700 text-cyan-400 px-6 py-3 rounded-lg font-mono border border-cyan-400 transition-colors"
          >
            [VIEW] ENHANCED VERSION
          </a>
        </div>
      </div>

      {/* Footer with texture */}
      <div className="relative bg-gray-900 border-t border-green-400 mt-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-cyan-400/5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-6">
          <div className="text-center text-sm text-gray-400">
            <p className="font-mono">Advanced UI Generation • Texture Effects • Typography Mastery</p>
            <p className="mt-1 font-mono">LinkedIn PDF Carousel • 1080x1350px • Professional Quality</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCarousel;




