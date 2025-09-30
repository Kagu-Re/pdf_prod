import React, { useState, useMemo } from 'react';
import { CardFactory } from './CardFactory';
import { templateCategories, allTemplates, templateUtils, CardTemplate } from '../../data/CardTemplates';
import { AnyCardData } from './CardFactory';

interface TemplateManagerProps {
  onTemplateSelect?: (template: CardTemplate) => void;
  onCardGenerate?: (cardData: AnyCardData) => void;
}

export default function TemplateManager({ onTemplateSelect, onCardGenerate }: TemplateManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    let templates = allTemplates;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      templates = templateUtils.getTemplatesByCategory(selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      templates = templateUtils.searchTemplates(searchQuery);
    }
    
    return templates;
  }, [selectedCategory, searchQuery]);

  const handleTemplateSelect = (template: CardTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
    onTemplateSelect?.(template);
  };

  const handleGenerateCard = () => {
    if (selectedTemplate) {
      onCardGenerate?.(selectedTemplate.data);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="w-full h-full bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Card Templates</h2>
          
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {templateCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-2">
                    <div className={`w-3 h-3 rounded-full ${
                      template.data.type === 'hero' ? 'bg-blue-500' :
                      template.data.type === 'content' ? 'bg-green-500' :
                      template.data.type === 'metric' ? 'bg-purple-500' :
                      template.data.type === 'process' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} title={template.data.type} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm">No templates found</div>
              <div className="text-gray-400 text-xs mt-1">
                Try adjusting your search or category filter
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedTemplate && showPreview ? (
          <>
            {/* Preview Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateCard}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Generate Card
                  </button>
                  <button
                    onClick={handleClosePreview}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <CardFactory data={selectedTemplate.data} />
              </div>
            </div>

            {/* Template Info */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Template Details</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div><span className="font-medium">Type:</span> {selectedTemplate.data.type}</div>
                    <div><span className="font-medium">Category:</span> {selectedTemplate.category}</div>
                    <div><span className="font-medium">Tags:</span> {selectedTemplate.tags.join(', ')}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">JSON Data</h4>
                  <div className="bg-gray-100 rounded p-2 max-h-32 overflow-y-auto">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(selectedTemplate.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Template</h3>
              <p className="text-gray-600 text-sm">
                Choose a template from the sidebar to preview and generate your card
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
