import React, { useState } from 'react';
import PDFCarousel from './PDFCarousel';
import GridGenerator from './GridGenerator';
import PatternLibrary from './PatternLibrary';
import TypographyGenerator from './TypographyGenerator';

const UIDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pdf');

  const tabs = [
    { id: 'pdf', name: 'PDF Generator', component: PDFCarousel },
    { id: 'grid', name: 'Grid Generator', component: GridGenerator },
    { id: 'patterns', name: 'Pattern Library', component: PatternLibrary },
    { id: 'typography', name: 'Typography', component: TypographyGenerator }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">UI Generation Dashboard</h1>
            <div className="text-sm text-gray-400">
              Better UI tools for LinkedIn carousels
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {ActiveComponent && <ActiveComponent />}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-400">
            <p>Generated with React + TypeScript</p>
            <p className="mt-1">
              Fork these components for your LinkedIn carousel project
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIDashboard;




