import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import PDFCarousel from '../components/PDFCarousel';

const PDFGenerator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          LinkedIn Carousel PDF Generator
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
            <div className="border-2 border-orange-500 rounded-lg overflow-hidden">
              <PDFViewer width="100%" height="600px">
                <PDFCarousel />
              </PDFViewer>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Download Options</h3>
              
              <div className="space-y-4">
                <PDFDownloadLink
                  document={<PDFCarousel />}
                  fileName="linkedin-carousel.pdf"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Download PDF for LinkedIn
                </PDFDownloadLink>

                <div className="text-sm text-gray-400">
                  <p>✅ Optimized for LinkedIn document posts</p>
                  <p>✅ 1200x1500px dimensions (LinkedIn standard)</p>
                  <p>✅ 12 slides with professional layout</p>
                  <p>✅ Orange and black theme</p>
                  <p>✅ Mobile-friendly design</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">LinkedIn Upload Tips</h3>
              <ul className="text-sm space-y-2 text-gray-300">
                <li>• File size: Under 100MB</li>
                <li>• Pages: 12 slides (under 300 limit)</li>
                <li>• Format: PDF only</li>
                <li>• Preview: Check on mobile device</li>
                <li>• Engagement: Add compelling title</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Content Overview</h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p><strong>Theme:</strong> Експлуатація досвіду</p>
                <p><strong>Slides:</strong> 12 professional slides</p>
                <p><strong>Style:</strong> Black background, orange accents</p>
                <p><strong>Language:</strong> Ukrainian</p>
                <p><strong>Target:</strong> LinkedIn professionals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.open('linkedin_carousel_story.html', '_blank')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            View HTML Version
          </button>
          <button
            onClick={() => window.open('src/components/PDFCarousel.tsx', '_blank')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Edit PDF Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;
