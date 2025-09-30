import React, { useState } from 'react'
import { motion } from 'framer-motion'

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

interface FilterViewProps {
  products: any[]
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
}

export default function FilterView({ products, preferences, onPreferencesChange }: FilterViewProps) {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences)

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const newPrefs = { ...localPrefs, [key]: value }
    setLocalPrefs(newPrefs)
    onPreferencesChange(newPrefs)
  }

  const handleBudgetChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined
    const newPrefs = {
      ...localPrefs,
      budget: {
        ...localPrefs.budget,
        [type]: numValue
      }
    }
    setLocalPrefs(newPrefs)
    onPreferencesChange(newPrefs)
  }

  const useCases = ['Work', 'Gaming', 'Creative', 'Student', 'Business', 'Travel', 'Home']
  const occasions = ['Gift', 'Personal', 'Business', 'Work', 'Travel', 'School']
  const styles = ['Modern', 'Classic', 'Minimalist', 'Professional', 'Casual', 'Elegant']
  const brands = ['Apple', 'Samsung', 'Microsoft', 'Google', 'Dell', 'HP', 'Lenovo']
  const colors = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Gray']
  const sizes = ['Small', 'Medium', 'Large', 'Compact', 'Portable']
  const priorities = ['Performance', 'Battery', 'Portability', 'Price', 'Camera', 'Display', 'Storage']

  return (
    <div className="h-full p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Filter Products</h3>
        <button 
          onClick={() => onPreferencesChange({})}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
        {/* Budget Range */}
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Budget Range</h4>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={localPrefs.budget?.min || ''}
                  onChange={(e) => handleBudgetChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={localPrefs.budget?.max || ''}
                  onChange={(e) => handleBudgetChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {[500, 1000, 2000, 5000].map(amount => (
                <button
                  key={amount}
                  onClick={() => handleBudgetChange('max', amount.toString())}
                  className={`px-3 py-1 text-sm rounded ${
                    localPrefs.budget?.max === amount
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Under ${amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Use Case */}
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Use Case</h4>
          <div className="grid grid-cols-2 gap-2">
            {useCases.map(useCase => (
              <button
                key={useCase}
                onClick={() => handlePreferenceChange('useCase', useCase.toLowerCase())}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  localPrefs.useCase === useCase.toLowerCase()
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {useCase}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Occasion</h4>
          <div className="grid grid-cols-2 gap-2">
            {occasions.map(occasion => (
              <button
                key={occasion}
                onClick={() => handlePreferenceChange('occasion', occasion.toLowerCase())}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  localPrefs.occasion === occasion.toLowerCase()
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {occasion}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Style Preference</h4>
          <div className="grid grid-cols-2 gap-2">
            {styles.map(style => (
              <button
                key={style}
                onClick={() => handlePreferenceChange('style', style.toLowerCase())}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  localPrefs.style === style.toLowerCase()
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">Brand</h4>
          <div className="grid grid-cols-2 gap-2">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => handlePreferenceChange('brand', brand.toLowerCase())}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  localPrefs.brand === brand.toLowerCase()
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">What's Most Important?</h4>
          <div className="space-y-2">
            {priorities.map(priority => (
              <label key={priority} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localPrefs.priorities?.includes(priority.toLowerCase()) || false}
                  onChange={(e) => {
                    const currentPriorities = localPrefs.priorities || []
                    const newPriorities = e.target.checked
                      ? [...currentPriorities, priority.toLowerCase()]
                      : currentPriorities.filter(p => p !== priority.toLowerCase())
                    handlePreferenceChange('priorities', newPriorities)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{priority}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}




