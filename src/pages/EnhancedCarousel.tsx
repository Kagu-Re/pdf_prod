import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import EnhancedPDFCarousel from '../components/EnhancedPDFCarousel';
import SimpleSurpriseCarousel from '../components/SimpleSurpriseCarousel';

const EnhancedCarousel: React.FC = () => {
  const [activeView, setActiveView] = useState<'html' | 'pdf'>('html');

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Header */}
      <div className="bg-gray-900 border-b border-green-400 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold font-mono cyberpunk-glow">
                ENHANCED CYBERPUNK CAROUSEL
              </h1>
              <p className="text-lg text-gray-400 mt-2 font-mono">
                HTML animations + PDF export with matching style
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('html')}
                className={`px-6 py-3 rounded font-mono font-bold transition-colors ${
                  activeView === 'html'
                    ? 'bg-green-400 text-black'
                    : 'bg-gray-800 text-green-400 border border-green-400 hover:bg-green-400 hover:text-black'
                }`}
              >
                HTML VIEW
              </button>
              <button
                onClick={() => setActiveView('pdf')}
                className={`px-6 py-3 rounded font-mono font-bold transition-colors ${
                  activeView === 'pdf'
                    ? 'bg-green-400 text-black'
                    : 'bg-gray-800 text-green-400 border border-green-400 hover:bg-green-400 hover:text-black'
                }`}
              >
                PDF VIEW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeView === 'html' ? (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-green-400 p-6 rounded-lg">
              <h2 className="text-2xl font-bold font-mono text-green-400 mb-4">
                INTERACTIVE HTML VERSION
              </h2>
              <p className="text-gray-300 mb-4">
                Experience the full cyberpunk animations, effects, and interactivity.
                Perfect for web viewing and social media sharing.
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>✓ Animated data streams and particles</p>
                <p>✓ Glowing text effects and neon colors</p>
                <p>✓ Interactive slide navigation</p>
                <p>✓ Responsive design for all devices</p>
                <p>✓ Download as HTML file</p>
              </div>
            </div>
            <SimpleSurpriseCarousel />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-green-400 p-6 rounded-lg">
              <h2 className="text-2xl font-bold font-mono text-green-400 mb-4">
                PDF VERSION
              </h2>
              <p className="text-gray-300 mb-4">
                Professional PDF optimized for LinkedIn with the same cyberpunk style.
                Static but maintains the visual impact.
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>✓ 1200x1500px LinkedIn-optimized dimensions</p>
                <p>✓ Same cyberpunk colors and typography</p>
                <p>✓ Corner accents and data stream lines</p>
                <p>✓ Grid layouts and code blocks</p>
                <p>✓ Professional PDF quality</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PDF Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-mono text-green-400">
                  PDF PREVIEW
                </h3>
                <div className="border-2 border-green-400 rounded-lg overflow-hidden bg-gray-900">
                  <PDFViewer width="100%" height="600px">
                    <EnhancedPDFCarousel />
                  </PDFViewer>
                </div>
              </div>

              {/* Download Section */}
              <div className="space-y-6">
                <div className="bg-gray-900 border-2 border-green-400 p-6 rounded-lg">
                  <h3 className="text-xl font-bold font-mono text-green-400 mb-4">
                    DOWNLOAD PDF
                  </h3>
                  
                  <div className="space-y-4">
                    <PDFDownloadLink
                      document={<EnhancedPDFCarousel />}
                      fileName="enhanced-cyberpunk-carousel.pdf"
                      className="block w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 px-6 rounded-lg text-center transition-colors font-mono text-lg"
                    >
                      [DOWNLOAD] ENHANCED PDF
                    </PDFDownloadLink>

                    <div className="text-sm text-gray-300 space-y-1">
                      <p className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        Matches HTML visual style
                      </p>
                      <p className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        1200x1500px LinkedIn dimensions
                      </p>
                      <p className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        Cyberpunk colors and effects
                      </p>
                      <p className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        Professional PDF quality
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 border-2 border-pink-500 p-6 rounded-lg">
                  <h3 className="text-xl font-bold font-mono text-pink-400 mb-4">
                    STYLE FEATURES
                  </h3>
                  <ul className="text-sm space-y-2 text-gray-300">
                    <li>• Neon green, pink, and cyan colors</li>
                    <li>• Monospace typography (Helvetica-Bold)</li>
                    <li>• Corner accent borders</li>
                    <li>• Data stream horizontal lines</li>
                    <li>• Grid layouts for data slides</li>
                    <li>• Code block elements</li>
                    <li>• Cyberpunk slide numbering</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-green-400 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="?component=Home"
              className="bg-gray-800 hover:bg-gray-700 text-green-400 px-6 py-3 rounded-lg font-mono border border-green-400 transition-colors"
            >
              [BACK] TO HOME
            </a>
            <button
              onClick={() => setActiveView(activeView === 'html' ? 'pdf' : 'html')}
              className="bg-pink-500 hover:bg-pink-400 text-black px-6 py-3 rounded-lg font-mono font-bold transition-colors"
            >
              [SWITCH] TO {activeView === 'html' ? 'PDF' : 'HTML'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCarousel;




