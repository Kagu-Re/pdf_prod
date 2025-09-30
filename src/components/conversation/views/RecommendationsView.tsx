import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Product } from '../../../data/ProductCatalog'

interface UserPreferences {
  budget?: { min?: number; max?: number }
  useCase?: string
  occasion?: string
  style?: string
  brand?: string
  color?: string
  size?: string
  priorities?: string[]
}

interface RecommendationsViewProps {
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
  products?: Product[]
}

export default function RecommendationsView({ preferences, onPreferencesChange, products = [] }: RecommendationsViewProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generateRecommendations()
  }, [preferences, products])

  const generateRecommendations = () => {
    setIsGenerating(true)
    
    // Simulate AI recommendation generation
    setTimeout(() => {
      let filtered = [...products]
      
      // Apply budget filter
      if (preferences.budget) {
        if (preferences.budget.min) {
          filtered = filtered.filter(p => p.price >= preferences.budget!.min!)
        }
        if (preferences.budget.max) {
          filtered = filtered.filter(p => p.price <= preferences.budget!.max!)
        }
      }
      
      // Apply use case filter
      if (preferences.useCase) {
        const useCaseMap: Record<string, string[]> = {
          'work': ['Computers', 'Tablets'],
          'gaming': ['Computers', 'Phones'],
          'creative': ['Computers', 'Tablets'],
          'student': ['Computers', 'Tablets', 'Phones'],
          'business': ['Computers', 'Phones'],
          'travel': ['Phones', 'Tablets']
        }
        
        const allowedCategories = useCaseMap[preferences.useCase]
        if (allowedCategories) {
          filtered = filtered.filter(p => allowedCategories.includes(p.category))
        }
      }
      
      // Apply brand filter
      if (preferences.brand) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(preferences.brand!.toLowerCase())
        )
      }
      
      // Sort by price if budget is a priority
      if (preferences.priorities?.includes('price')) {
        filtered.sort((a, b) => a.price - b.price)
      } else {
        // Default sort by popularity (using price as proxy)
        filtered.sort((a, b) => b.price - a.price)
      }
      
      setRecommendations(filtered.slice(0, 6))
      setIsGenerating(false)
    }, 1000)
  }

  const handlePreferenceClick = (key: keyof UserPreferences, value: string) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    })
  }

  const quickQuestions = [
    { key: 'useCase', label: 'What will you use it for?', options: ['Work', 'Gaming', 'Creative', 'Student', 'Business'] },
    { key: 'occasion', label: "What's the occasion?", options: ['Gift', 'Personal', 'Business', 'Work', 'Travel'] },
    { key: 'style', label: 'Your style preference?', options: ['Modern', 'Classic', 'Minimalist', 'Professional'] },
    { key: 'budget', label: 'Budget range?', options: ['Under $500', 'Under $1000', 'Under $2000', 'No limit'] }
  ]

  return (
    <div className="h-full p-6 bg-gray-50">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Personalized Recommendations</h3>
        <p className="text-gray-600">Tell me about your preferences and I'll find the perfect products for you!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
        {/* Preference Collection */}
        <div className="space-y-6">
          {quickQuestions.map((question, index) => (
            <motion.div
              key={question.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg border"
            >
              <h4 className="text-lg font-semibold mb-4">{question.label}</h4>
              <div className="grid grid-cols-2 gap-2">
                {question.options.map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      if (question.key === 'budget') {
                        const budgetMap: Record<string, { max: number }> = {
                          'Under $500': { max: 500 },
                          'Under $1000': { max: 1000 },
                          'Under $2000': { max: 2000 },
                          'No limit': {}
                        }
                        onPreferencesChange({
                          ...preferences,
                          budget: budgetMap[option]
                        })
                      } else {
                        handlePreferenceClick(question.key as keyof UserPreferences, option.toLowerCase())
                      }
                    }}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      (question.key === 'budget' && 
                       ((option === 'Under $500' && preferences.budget?.max === 500) ||
                        (option === 'Under $1000' && preferences.budget?.max === 1000) ||
                        (option === 'Under $2000' && preferences.budget?.max === 2000) ||
                        (option === 'No limit' && !preferences.budget?.max))) ||
                      (question.key !== 'budget' && preferences[question.key as keyof UserPreferences] === option.toLowerCase())
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Recommended for You</h4>
            {isGenerating && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Finding perfect matches...</span>
              </div>
            )}
          </div>

          {isGenerating ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer"
                >
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">{product.name}</h5>
                    <p className="text-sm text-gray-600 truncate">{product.description}</p>
                    <p className="text-sm font-semibold text-blue-600">${product.price}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.floor(Math.random() * 20 + 80)}% match
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p>Answer a few questions above to get personalized recommendations!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




