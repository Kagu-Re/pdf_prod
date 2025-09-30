import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import SurpriseCarousel from '../components/SurpriseCarousel';

const SurpriseGenerator: React.FC = () => {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      {/* Cyberpunk Header */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold mb-4 font-mono text-green-400 animate-pulse">
          CYBERPUNK CAROUSEL
        </div>
        <div className="text-2xl text-pink-500 font-mono">
          SYSTEM INITIALIZED
        </div>
        <div className="text-sm text-gray-400 mt-2">
          Neural network activated • Matrix loaded • Reality.exe running
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-mono text-green-400">
                NEURAL PREVIEW
              </h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="bg-pink-500 hover:bg-pink-600 text-black px-4 py-2 rounded font-mono text-sm font-bold transition-colors"
              >
                {showPreview ? 'HIDE' : 'SHOW'} PREVIEW
              </button>
            </div>
            
            {showPreview && (
              <div className="border-2 border-green-400 rounded-lg overflow-hidden bg-gray-900">
                <PDFViewer width="100%" height="600px">
                  <SurpriseCarousel />
                </PDFViewer>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Download Section */}
            <div className="bg-gray-900 border-2 border-green-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-green-400 mb-4">
                DOWNLOAD PROTOCOL
              </h3>
              
              <div className="space-y-4">
                <PDFDownloadLink
                  document={<SurpriseCarousel />}
                  fileName="cyberpunk-future-carousel.pdf"
                  className="block w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 px-6 rounded-lg text-center transition-colors font-mono text-lg"
                >
                  [DOWNLOAD] CYBERPUNK CAROUSEL
                </PDFDownloadLink>

                <div className="text-sm text-gray-300 space-y-1">
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Neural network optimized for LinkedIn
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    1200x1500px dimensions (LinkedIn standard)
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    12 slides of digital revolution
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Cyberpunk aesthetic activated
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Matrix-compatible design
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Info */}
            <div className="bg-gray-900 border-2 border-pink-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-pink-400 mb-4">
                THEME: CYBERPUNK FUTURE
              </h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p><strong className="text-green-400">Concept:</strong> The future of work and AI</p>
                <p><strong className="text-pink-400">Style:</strong> Cyberpunk, neon, digital</p>
                <p><strong className="text-blue-400">Colors:</strong> Green, pink, black, cyan</p>
                <p><strong className="text-yellow-400">Fonts:</strong> Orbitron, Rajdhani</p>
                <p><strong className="text-purple-400">Mood:</strong> Futuristic, rebellious, tech</p>
              </div>
            </div>

            {/* Special Features */}
            <div className="bg-gray-900 border-2 border-cyan-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-4">
                SPECIAL FEATURES
              </h3>
              <ul className="text-sm space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">◆</span>
                  Neon text effects with glow
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">◆</span>
                  Cyberpunk corner accents
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">◆</span>
                  Data stream visual elements
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">◆</span>
                  Code block integrations
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">◆</span>
                  Grid layouts for data slides
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-2">◆</span>
                  Matrix-style typography
                </li>
              </ul>
            </div>

            {/* Content Overview */}
            <div className="bg-gray-900 border-2 border-yellow-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-yellow-400 mb-4">
                CONTENT MATRIX
              </h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p><strong>Slides 1-2:</strong> Introduction to cyberpunk reality</p>
                <p><strong>Slides 3-5:</strong> AI and data mining warnings</p>
                <p><strong>Slides 6-7:</strong> Call to action and choice</p>
                <p><strong>Slides 8-9:</strong> Solutions and community</p>
                <p><strong>Slides 10-12:</strong> Future vision and awakening</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.open('?component=Home', '_self')}
            className="bg-gray-800 hover:bg-gray-700 text-green-400 px-6 py-3 rounded-lg font-mono border border-green-400 transition-colors"
          >
            [BACK] TO MAIN MENU
          </button>
          <button
            onClick={() => window.open('?component=PDFGenerator', '_self')}
            className="bg-gray-800 hover:bg-gray-700 text-pink-400 px-6 py-3 rounded-lg font-mono border border-pink-400 transition-colors"
          >
            [VIEW] ORIGINAL CAROUSEL
          </button>
          <button
            onClick={() => window.open('?component=UITools', '_self')}
            className="bg-gray-800 hover:bg-gray-700 text-cyan-400 px-6 py-3 rounded-lg font-mono border border-cyan-400 transition-colors"
          >
            [ACCESS] UI TOOLS
          </button>
        </div>

        {/* Cyberpunk Footer */}
        <div className="mt-12 text-center">
          <div className="text-sm text-gray-500 font-mono">
            <p>NEURAL NETWORK STATUS: ACTIVE</p>
            <p className="mt-1">MATRIX VERSION: 2024.1</p>
            <p className="mt-1">REALITY.EXE: RUNNING</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurpriseGenerator;
