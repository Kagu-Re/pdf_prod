import React, { useState } from 'react';

interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  columnSizes: string[];
  rowSizes: string[];
}

const GridGenerator: React.FC = () => {
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    columns: 3,
    rows: 3,
    gap: 20,
    columnSizes: ['1fr', '1fr', '1fr'],
    rowSizes: ['1fr', '1fr', '1fr']
  });

  const [generatedCSS, setGeneratedCSS] = useState('');

  const generateCSS = () => {
    const css = `
.grid-container {
  display: grid;
  grid-template-columns: ${gridConfig.columnSizes.join(' ')};
  grid-template-rows: ${gridConfig.rowSizes.join(' ')};
  gap: ${gridConfig.gap}px;
  width: 100%;
  height: 100vh;
}

.grid-item {
  background: rgba(255, 69, 0, 0.1);
  border: 1px solid rgba(255, 69, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
}
    `;
    setGeneratedCSS(css);
  };

  const updateColumnSize = (index: number, value: string) => {
    const newSizes = [...gridConfig.columnSizes];
    newSizes[index] = value;
    setGridConfig({ ...gridConfig, columnSizes: newSizes });
  };

  const updateRowSize = (index: number, value: string) => {
    const newSizes = [...gridConfig.rowSizes];
    newSizes[index] = value;
    setGridConfig({ ...gridConfig, rowSizes: newSizes });
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">CSS Grid Generator</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Columns: {gridConfig.columns}</label>
            <input
              type="range"
              min="1"
              max="6"
              value={gridConfig.columns}
              onChange={(e) => {
                const cols = parseInt(e.target.value);
                const newColumnSizes = Array(cols).fill('1fr');
                setGridConfig({ ...gridConfig, columns: cols, columnSizes: newColumnSizes });
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rows: {gridConfig.rows}</label>
            <input
              type="range"
              min="1"
              max="6"
              value={gridConfig.rows}
              onChange={(e) => {
                const rows = parseInt(e.target.value);
                const newRowSizes = Array(rows).fill('1fr');
                setGridConfig({ ...gridConfig, rows: rows, rowSizes: newRowSizes });
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gap: {gridConfig.gap}px</label>
            <input
              type="range"
              min="0"
              max="50"
              value={gridConfig.gap}
              onChange={(e) => setGridConfig({ ...gridConfig, gap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <button
            onClick={generateCSS}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Generate CSS
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div
            className="grid border-2 border-orange-500"
            style={{
              gridTemplateColumns: gridConfig.columnSizes.join(' '),
              gridTemplateRows: gridConfig.rowSizes.join(' '),
              gap: `${gridConfig.gap}px`,
              height: '300px'
            }}
          >
            {Array.from({ length: gridConfig.columns * gridConfig.rows }, (_, i) => (
              <div
                key={i}
                className="bg-orange-500 bg-opacity-20 border border-orange-500 flex items-center justify-center text-sm"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generated CSS */}
      {generatedCSS && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated CSS</h3>
          <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
            <code>{generatedCSS}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default GridGenerator;




