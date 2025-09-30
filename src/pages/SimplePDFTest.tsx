import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import SimplePDFCarousel from '../components/SimplePDFCarousel';

const SimplePDFTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center font-mono">
          SIMPLE PDF TEST
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Preview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-mono text-green-400">
              PDF PREVIEW
            </h2>
            <div className="border-2 border-green-400 rounded-lg overflow-hidden bg-gray-900">
              <PDFViewer width="100%" height="600px">
                <SimplePDFCarousel />
              </PDFViewer>
            </div>
          </div>

          {/* Download Section */}
          <div className="space-y-6">
            <div className="bg-gray-900 border-2 border-green-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-green-400 mb-4">
                DOWNLOAD TEST
              </h3>
              
              <div className="space-y-4">
                <PDFDownloadLink
                  document={<SimplePDFCarousel />}
                  fileName="simple-cyberpunk.pdf"
                  className="block w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 px-6 rounded-lg text-center transition-colors font-mono text-lg"
                >
                  [DOWNLOAD] SIMPLE PDF
                </PDFDownloadLink>

                <div className="text-sm text-gray-300 space-y-1">
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    1200x1500px dimensions
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    12 cyberpunk slides
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Simplified design
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    No complex features
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border-2 border-pink-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-pink-400 mb-4">
                DEBUGGING INFO
              </h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p><strong>React-PDF Version:</strong> 4.3.1</p>
                <p><strong>Page Size:</strong> 1200x1500px</p>
                <p><strong>Font:</strong> Helvetica (built-in)</p>
                <p><strong>Features:</strong> Basic text and colors only</p>
              </div>
            </div>

            <div className="bg-gray-900 border-2 border-cyan-400 p-6 rounded-lg">
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-4">
                TROUBLESHOOTING
              </h3>
              <ul className="text-sm space-y-2 text-gray-300">
                <li>• Check browser console for errors</li>
                <li>• Try different browser (Chrome recommended)</li>
                <li>• Disable browser extensions</li>
                <li>• Check if download is blocked by browser</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="?component=TestPDF"
            className="bg-gray-800 hover:bg-gray-700 text-green-400 px-6 py-3 rounded-lg font-mono border border-green-400 transition-colors"
          >
            [TEST] BASIC PDF
          </a>
          <a
            href="?component=Home"
            className="bg-gray-800 hover:bg-gray-700 text-pink-400 px-6 py-3 rounded-lg font-mono border border-pink-400 transition-colors"
          >
            [BACK] TO HOME
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimplePDFTest;




