import React, { useState } from 'react';

interface Pattern {
  name: string;
  css: string;
  description: string;
}

const patterns: Pattern[] = [
  {
    name: "Diagonal Stripes",
    css: `
background: repeating-linear-gradient(
  45deg,
  transparent,
  transparent 10px,
  rgba(255, 69, 0, 0.1) 10px,
  rgba(255, 69, 0, 0.1) 20px
);`,
    description: "Diagonal stripes pattern"
  },
  {
    name: "Dots",
    css: `
background-image: radial-gradient(
  circle,
  rgba(255, 69, 0, 0.2) 1px,
  transparent 1px
);
background-size: 20px 20px;`,
    description: "Dot pattern"
  },
  {
    name: "Waves",
    css: `
background: 
  radial-gradient(ellipse at 20% 20%, rgba(255, 69, 0, 0.1) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 80%, rgba(200, 200, 200, 0.1) 0%, transparent 50%);`,
    description: "Wave-like radial gradients"
  },
  {
    name: "Grid",
    css: `
background-image: 
  linear-gradient(rgba(255, 69, 0, 0.1) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 69, 0, 0.1) 1px, transparent 1px);
background-size: 20px 20px;`,
    description: "Grid pattern"
  },
  {
    name: "Noise",
    css: `
background: 
  linear-gradient(45deg, transparent 30%, rgba(255, 69, 0, 0.05) 50%, transparent 70%),
  linear-gradient(-45deg, transparent 30%, rgba(200, 200, 200, 0.05) 50%, transparent 70%);`,
    description: "Noise-like texture"
  },
  {
    name: "Fire",
    css: `
background: 
  radial-gradient(ellipse at 30% 70%, rgba(255, 69, 0, 0.2) 0%, transparent 60%),
  radial-gradient(ellipse at 70% 30%, rgba(255, 140, 0, 0.15) 0%, transparent 50%),
  repeating-linear-gradient(25deg, transparent 0px, transparent 15px, rgba(255, 69, 0, 0.1) 15px, rgba(255, 69, 0, 0.1) 30px);`,
    description: "Fire-like texture"
  }
];

const PatternLibrary: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(patterns[0]);
  const [customCSS, setCustomCSS] = useState('');

  const applyPattern = (pattern: Pattern) => {
    setSelectedPattern(pattern);
    setCustomCSS(pattern.css);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('CSS copied to clipboard!');
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">CSS Patterns Library</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Pattern Selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose Pattern</h3>
          <div className="space-y-2">
            {patterns.map((pattern, index) => (
              <button
                key={index}
                onClick={() => applyPattern(pattern)}
                className={`w-full p-3 text-left rounded border ${
                  selectedPattern === pattern
                    ? 'border-orange-500 bg-orange-500 bg-opacity-20'
                    : 'border-gray-600 hover:border-orange-400'
                }`}
              >
                <div className="font-medium">{pattern.name}</div>
                <div className="text-sm text-gray-400">{pattern.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div
            className="w-full h-64 border-2 border-orange-500 rounded"
            style={{
              background: '#000',
              ...(selectedPattern ? eval(`({${selectedPattern.css}})`).background : {})
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{selectedPattern.name}</div>
                <div className="text-sm opacity-75">{selectedPattern.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Code */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">CSS Code</h3>
        <div className="relative">
          <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
            <code>{customCSS}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(customCSS)}
            className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternLibrary;




