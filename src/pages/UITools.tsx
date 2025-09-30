import React, { useState } from 'react';
import GridGenerator from '../components/GridGenerator';
import PatternLibrary from '../components/PatternLibrary';
import TypographyGenerator from '../components/TypographyGenerator';

const UITools: React.FC = () => {
  const [activeTool, setActiveTool] = useState('grid');

  const tools = [
    { id: 'grid', name: 'Grid Generator', component: GridGenerator, description: 'Visual CSS Grid layout builder' },
    { id: 'patterns', name: 'Pattern Library', component: PatternLibrary, description: 'CSS patterns and textures' },
    { id: 'typography', name: 'Typography', component: TypographyGenerator, description: 'Advanced typography controls' }
  ];

  const ActiveComponent = tools.find(tool => tool.id === activeTool)?.component;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">UI Generation Tools</h1>
              <p className="text-sm text-gray-400 mt-1">
                Better UI tools for LinkedIn carousels
              </p>
            </div>
            <div className="text-sm text-gray-400">
              <a href="/pdf-generator" className="text-orange-400 hover:text-orange-300">
                ← Back to PDF Generator
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTool === tool.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <div>{tool.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{tool.description}</div>
                </div>
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
              Use these tools to create better LinkedIn carousel designs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UITools;




