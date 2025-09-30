import React, { useState } from 'react';

interface TypographyConfig {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
  textTransform: string;
  textAlign: string;
  color: string;
  textShadow: string;
}

const TypographyGenerator: React.FC = () => {
  const [config, setConfig] = useState<TypographyConfig>({
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 1.2,
    letterSpacing: -1,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#ffffff',
    textShadow: '2px 2px 0 #ff4500, -2px -2px 0 #666'
  });

  const [generatedCSS, setGeneratedCSS] = useState('');

  const generateCSS = () => {
    const css = `
.typography-text {
  font-family: '${config.fontFamily}', sans-serif;
  font-size: ${config.fontSize}px;
  font-weight: ${config.fontWeight};
  line-height: ${config.lineHeight};
  letter-spacing: ${config.letterSpacing}px;
  text-transform: ${config.textTransform};
  text-align: ${config.textAlign};
  color: ${config.color};
  text-shadow: ${config.textShadow};
}`;
    setGeneratedCSS(css);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('CSS copied to clipboard!');
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Typography Generator</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Font Family</label>
            <select
              value={config.fontFamily}
              onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Font Size: {config.fontSize}px</label>
            <input
              type="range"
              min="12"
              max="120"
              value={config.fontSize}
              onChange={(e) => setConfig({ ...config, fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Font Weight</label>
            <select
              value={config.fontWeight}
              onChange={(e) => setConfig({ ...config, fontWeight: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Line Height: {config.lineHeight}</label>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={config.lineHeight}
              onChange={(e) => setConfig({ ...config, lineHeight: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Letter Spacing: {config.letterSpacing}px</label>
            <input
              type="range"
              min="-5"
              max="10"
              step="0.5"
              value={config.letterSpacing}
              onChange={(e) => setConfig({ ...config, letterSpacing: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Text Transform</label>
            <select
              value={config.textTransform}
              onChange={(e) => setConfig({ ...config, textTransform: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="none">None</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="capitalize">Capitalize</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Text Align</label>
            <select
              value={config.textAlign}
              onChange={(e) => setConfig({ ...config, textAlign: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <input
              type="color"
              value={config.color}
              onChange={(e) => setConfig({ ...config, color: e.target.value })}
              className="w-full h-10 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <button
            onClick={generateCSS}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Generate CSS
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div className="bg-black p-8 rounded border-2 border-orange-500">
            <div
              style={{
                fontFamily: config.fontFamily,
                fontSize: `${config.fontSize}px`,
                fontWeight: config.fontWeight,
                lineHeight: config.lineHeight,
                letterSpacing: `${config.letterSpacing}px`,
                textTransform: config.textTransform,
                textAlign: config.textAlign,
                color: config.color,
                textShadow: config.textShadow
              }}
            >
              ЕКСПЛУАТАЦІЯ ДОСВІДУ
            </div>
          </div>
        </div>
      </div>

      {/* Generated CSS */}
      {generatedCSS && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated CSS</h3>
          <div className="relative">
            <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
              <code>{generatedCSS}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(generatedCSS)}
              className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypographyGenerator;




