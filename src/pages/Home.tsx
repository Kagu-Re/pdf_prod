import React from 'react';

const Home: React.FC = () => {
  const tools = [
           {
             name: '🚀 CAROUSEL LANDING',
             description: 'Interactive showcase with auto-play and animations!',
             url: '?component=CarouselLanding',
             icon: '🌟',
             color: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 animate-pulse'
           },
           {
             name: '🤖 CRYPTO AI LANDING',
             description: 'Futuristic crypto AI supercomputer interface!',
             url: '?component=CryptoAILanding',
             icon: '⚡',
             color: 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 animate-pulse'
           },
           {
             name: '🚀 CRYPTO AI LONG-FORM',
             description: 'Professional Ableton-style interface with detailed mockups!',
             url: '?component=CryptoAILandingLong',
             icon: '🎛️',
             color: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 animate-pulse'
           },
    {
      name: '🎨 ADVANCED CAROUSEL',
      description: 'LinkedIn PDF format with textures & typography!',
      url: '?component=AdvancedCarousel',
      icon: '🎭',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400'
    },
    {
      name: '🚀 ENHANCED CAROUSEL',
      description: 'Your favorite style - HTML + PDF versions!',
      url: '?component=EnhancedCarousel',
      icon: '⚡',
      color: 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400'
    },
    {
      name: '🎨 SURPRISE CAROUSEL',
      description: 'Cyberpunk future theme - completely unexpected!',
      url: '?component=SurpriseGenerator',
      icon: '🤖',
      color: 'bg-gradient-to-r from-green-500 to-pink-500 hover:from-green-400 hover:to-pink-400'
    },
    {
      name: '🚀 SIMPLE CAROUSEL',
      description: 'HTML version - works everywhere!',
      url: '?component=SimpleSurpriseCarousel',
      icon: '⚡',
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
    },
    {
      name: '🔧 PDF TEST',
      description: 'Debug PDF export issues',
      url: '?component=TestPDF',
      icon: '🛠️',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400'
    },
    {
      name: '📄 SIMPLE PDF',
      description: 'Simplified PDF version',
      url: '?component=SimplePDFTest',
      icon: '📋',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400'
    },
    {
      name: 'PDF Generator',
      description: 'Create LinkedIn-ready PDFs with React-PDF',
      url: '?component=PDFGenerator',
      icon: '📄',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      name: 'UI Tools',
      description: 'Grid generator, patterns, and typography',
      url: '?component=UITools',
      icon: '🎨',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'UI Dashboard',
      description: 'All tools in one dashboard',
      url: '?component=UIDashboard',
      icon: '⚡',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'Food Delivery App',
      description: 'Conversational food delivery interface',
      url: '?component=FoodDeliveryApp',
      icon: '🍕',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'LinkedIn Carousel',
      description: 'Original HTML carousel',
      url: '?component=LinkedInCarousel',
      icon: '🎠',
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      name: 'Conversation App',
      description: 'AI conversation interface',
      url: '?component=ConversationApp',
      icon: '💬',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              LinkedIn Carousel Tools
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional tools for creating LinkedIn carousels, PDFs, and interactive content.
              Choose your tool below to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <a
              key={index}
              href={tool.url}
              className={`${tool.color} text-white rounded-lg p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-4">{tool.icon}</span>
                <h3 className="text-xl font-bold">{tool.name}</h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                {tool.description}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="linkedin_carousel_story.html"
                target="_blank"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View HTML Carousel
              </a>
              <a
                href="https://github.com/your-repo"
                target="_blank"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                GitHub Repository
              </a>
              <a
                href="README-UI-Tools.md"
                target="_blank"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-400">
            <p>Built with React + TypeScript + Vite</p>
            <p className="mt-1">
              Professional tools for LinkedIn content creation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
