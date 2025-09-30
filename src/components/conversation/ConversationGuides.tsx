import React from 'react'
import { motion } from 'framer-motion'

interface ConversationGuide {
  id: string
  text: string
  category: 'product' | 'comparison' | 'policy' | 'general'
  icon: string
}

interface ConversationGuidesProps {
  selectedProduct: any
  onGuideClick: (guide: ConversationGuide) => void
  className?: string
  conversationStage?: 'initial' | 'exploring' | 'deciding' | 'concluding'
}

const conversationGuides: ConversationGuide[] = [
  {
    id: 'features',
    text: 'Tell me about the features',
    category: 'product',
    icon: '✨'
  },
  {
    id: 'price',
    text: 'What\'s the price?',
    category: 'product',
    icon: '💰'
  },
  {
    id: 'compare',
    text: 'Compare with similar products',
    category: 'comparison',
    icon: '⚖️'
  },
  {
    id: 'warranty',
    text: 'What\'s the warranty?',
    category: 'policy',
    icon: '🛡️'
  },
  {
    id: 'return',
    text: 'Return policy?',
    category: 'policy',
    icon: '↩️'
  },
  {
    id: 'recommend',
    text: 'What do you recommend?',
    category: 'general',
    icon: '👍'
  },
  {
    id: 'budget',
    text: 'Show me cheaper options',
    category: 'general',
    icon: '💸'
  },
  {
    id: 'popular',
    text: 'What\'s most popular?',
    category: 'general',
    icon: '🔥'
  }
]

export default function ConversationGuides({ 
  selectedProduct, 
  onGuideClick, 
  className = '',
  conversationStage = 'initial'
}: ConversationGuidesProps) {
  const getFilteredGuides = () => {
    let guides = conversationGuides

    // Filter based on conversation stage
    switch (conversationStage) {
      case 'initial':
        guides = guides.filter(guide => 
          guide.category === 'general' || 
          guide.id === 'recommend' ||
          guide.id === 'popular'
        )
        break
      case 'exploring':
        guides = guides.filter(guide => 
          guide.category === 'product' || 
          guide.category === 'comparison' ||
          guide.id === 'recommend'
        )
        break
      case 'deciding':
        guides = guides.filter(guide => 
          guide.category === 'comparison' || 
          guide.category === 'policy' ||
          guide.id === 'recommend'
        )
        break
      case 'concluding':
        guides = guides.filter(guide => 
          guide.category === 'policy' ||
          guide.id === 'warranty' ||
          guide.id === 'return'
        )
        break
    }

    // Additional filtering based on selected product
    if (selectedProduct) {
      guides = guides.filter(guide => 
        guide.category === 'product' || 
        guide.category === 'comparison' || 
        guide.category === 'policy' ||
        guide.id === 'recommend'
      )
    }

    return guides.slice(0, 6) // Limit to 6 guides
  }

  const filteredGuides = getFilteredGuides()

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium text-gray-600 mb-3">
        {selectedProduct ? 'Ask about this product:' : 'Quick questions:'}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {filteredGuides.map((guide) => (
          <motion.button
            key={guide.id}
            onClick={() => onGuideClick(guide)}
            className="flex items-center space-x-2 p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">{guide.icon}</span>
            <span className="text-gray-700">{guide.text}</span>
          </motion.button>
        ))}
      </div>
      
      {selectedProduct && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Pro tip:</strong> Try asking "What makes this different from the [other product]?" for detailed comparisons!
          </div>
        </div>
      )}
    </div>
  )
}
