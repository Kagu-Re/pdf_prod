import React, { useState } from 'react'
import { motion } from 'framer-motion'

export interface QuizOption {
  id: string
  label: string
  value: any
  description?: string
}

export interface QuizQuestionProps {
  question: string
  type: 'single_choice' | 'multiple_choice' | 'text' | 'budget_range' | 'priority_ranking' | 'slider' | 'rating'
  options?: QuizOption[]
  value?: any
  onChange: (value: any) => void
  required?: boolean
  min?: number
  max?: number
  step?: number
  labels?: string[]
}

export function QuizRadioGroup({ question, options = [], value, onChange, required = false }: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">{question}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-start space-x-3 p-2 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
              value === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="quiz-option"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-600 mt-1">{option.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>
      {required && !value && (
        <p className="text-sm text-red-500 mt-2">Please select an option</p>
      )}
    </motion.div>
  )
}

export function QuizCheckboxGroup({ question, options = [], value = [], onChange, required = false }: QuizQuestionProps) {
  const handleChange = (optionValue: any, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v: any) => v !== optionValue))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">{question}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-start space-x-3 p-2 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
              value.includes(option.value)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-600 mt-1">{option.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>
      {required && value.length === 0 && (
        <p className="text-sm text-red-500 mt-2">Please select at least one option</p>
      )}
    </motion.div>
  )
}

export function QuizSlider({ question, value = 0, onChange, min = 0, max = 100, step = 1, labels = [], required = false }: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800">{question}</h3>
      <div className="px-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          {labels.length > 0 ? (
            labels.map((label, index) => (
              <span key={index}>{label}</span>
            ))
          ) : (
            <>
              <span>{min}</span>
              <span className="font-medium text-blue-600">{value}</span>
              <span>{max}</span>
            </>
          )}
        </div>
      </div>
      {required && !value && (
        <p className="text-sm text-red-500 mt-2">Please select a value</p>
      )}
    </motion.div>
  )
}

export function QuizBudgetRange({ question, value = { min: 0, max: 1000 }, onChange, required = false }: QuizQuestionProps) {
  const budgetRanges = [
    { label: 'Under $500', min: 0, max: 500 },
    { label: '$500 - $1,000', min: 500, max: 1000 },
    { label: '$1,000 - $2,000', min: 1000, max: 2000 },
    { label: '$2,000 - $3,000', min: 2000, max: 3000 },
    { label: '$3,000+', min: 3000, max: 10000 },
    { label: 'Flexible', min: 0, max: 10000 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{question}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {budgetRanges.map((range) => (
          <label
            key={range.label}
            className={`flex items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
              value.min === range.min && value.max === range.max
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="budget-range"
              checked={value.min === range.min && value.max === range.max}
              onChange={() => onChange(range)}
              className="sr-only"
            />
            <span className="font-medium text-gray-900 text-center">{range.label}</span>
          </label>
        ))}
      </div>
      {required && !value && (
        <p className="text-sm text-red-500 mt-2">Please select a budget range</p>
      )}
    </motion.div>
  )
}

export function QuizPriorityRanking({ question, options = [], value = [], onChange, required = false }: QuizQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, optionId: string) => {
    setDraggedItem(optionId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const draggedIndex = value.findIndex((item: any) => item.id === draggedItem)
    if (draggedIndex === -1) return

    const newValue = [...value]
    const draggedItemData = newValue.splice(draggedIndex, 1)[0]
    newValue.splice(targetIndex, 0, draggedItemData)
    
    onChange(newValue)
    setDraggedItem(null)
  }

  const addToRanking = (option: QuizOption) => {
    if (value.length < 3 && !value.find((item: any) => item.id === option.id)) {
      onChange([...value, option])
    }
  }

  const removeFromRanking = (optionId: string) => {
    onChange(value.filter((item: any) => item.id !== optionId))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800">{question}</h3>
      
      {/* Ranking Area */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Your Top 3 (drag to reorder):</h4>
        <div className="space-y-2 min-h-[60px] p-2 border-2 border-dashed border-gray-200 rounded-lg">
          {value.map((item: any, index: number) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="flex items-center space-x-3 p-2 bg-blue-50 border border-blue-200 rounded-lg cursor-move"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1 font-medium text-gray-900">{item.label}</div>
              <button
                onClick={() => removeFromRanking(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          {value.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              Drag items here to rank them
            </div>
          )}
        </div>
      </div>

      {/* Available Options */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Available options:</h4>
        <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
          {options
            .filter(option => !value.find((item: any) => item.id === option.id))
            .map((option) => (
              <button
                key={option.id}
                onClick={() => addToRanking(option)}
                disabled={value.length >= 3}
                className="p-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-600">{option.description}</div>
                )}
              </button>
            ))}
        </div>
      </div>

      {required && value.length === 0 && (
        <p className="text-sm text-red-500 mt-2">Please rank at least one item</p>
      )}
    </motion.div>
  )
}

export function QuizTextInput({ question, value = '', onChange, required = false }: QuizQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800">{question}</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        rows={2}
      />
      {required && !value.trim() && (
        <p className="text-sm text-red-500 mt-2">Please provide an answer</p>
      )}
    </motion.div>
  )
}

export function QuizQuestionRenderer({ question, type, options, value, onChange, required, min, max, step, labels }: QuizQuestionProps) {
  switch (type) {
    case 'single_choice':
      return (
        <QuizRadioGroup
          question={question}
          options={options}
          value={value}
          onChange={onChange}
          required={required}
        />
      )
    case 'multiple_choice':
      return (
        <QuizCheckboxGroup
          question={question}
          options={options}
          value={value}
          onChange={onChange}
          required={required}
        />
      )
    case 'slider':
      return (
        <QuizSlider
          question={question}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          labels={labels}
          required={required}
        />
      )
    case 'budget_range':
      return (
        <QuizBudgetRange
          question={question}
          value={value}
          onChange={onChange}
          required={required}
        />
      )
    case 'priority_ranking':
      return (
        <QuizPriorityRanking
          question={question}
          options={options}
          value={value}
          onChange={onChange}
          required={required}
        />
      )
    case 'text':
      return (
        <QuizTextInput
          question={question}
          value={value}
          onChange={onChange}
          required={required}
        />
      )
    default:
      return null
  }
}
