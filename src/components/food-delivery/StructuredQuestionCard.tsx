import React, { useState } from 'react'
import { motion } from 'framer-motion'

export interface StructuredQuestion {
  id: string
  question: string
  answerOptions: string[]
  followUpQuestions?: string[]
  context?: string
  required: boolean
}

interface StructuredQuestionCardProps {
  question: StructuredQuestion
  onAnswer: (questionId: string, answer: string) => void
  onSkip?: () => void
  initialAnswer?: string
}

export const StructuredQuestionCard: React.FC<StructuredQuestionCardProps> = ({
  question,
  onAnswer,
  onSkip,
  initialAnswer
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(initialAnswer || '')
  const [isAnswered, setIsAnswered] = useState<boolean>(!!initialAnswer)

  // Debug: Log the question data
  console.log('🔍 StructuredQuestionCard - Component rendered with question:', question)
  console.log('📋 StructuredQuestionCard - answerOptions from question:', question?.answerOptions)
  console.log('📋 StructuredQuestionCard - answerOptions length:', question?.answerOptions?.length)
  console.log('📋 StructuredQuestionCard - question type:', typeof question)
  console.log('📋 StructuredQuestionCard - question keys:', question ? Object.keys(question) : 'question is null/undefined')

  // Fallback answer options if none provided
  const fallbackOptions = [
    'I want to order food',
    'I\'m looking for meal planning',
    'I need nutrition advice',
    'I want to learn about your services',
    'I\'m just browsing'
  ]

  const answerOptions = question?.answerOptions && question.answerOptions.length > 0 
    ? question.answerOptions 
    : fallbackOptions

  console.log('✅ StructuredQuestionCard - Using answer options:', answerOptions)
  console.log('📋 StructuredQuestionCard - Final answer options count:', answerOptions.length)



  const handleAnswerSelect = (answer: string) => {
    console.log('🔍 StructuredQuestionCard.handleAnswerSelect called with:', { answer, questionId: question.id })
    setSelectedAnswer(answer)
    setIsAnswered(true)
    console.log('✅ StructuredQuestionCard.handleAnswerSelect - Calling onAnswer callback')
    onAnswer(question.id, answer)
  }

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswer(question.id, selectedAnswer)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {question.question}
          </h3>
          {question.required && (
            <span className="text-sm text-red-500 font-medium">Required</span>
          )}
        </div>
        
        {question.context && (
          <p className="text-sm text-gray-600 mb-4">{question.context}</p>
        )}
      </div>

      <div className="space-y-3">
        {answerOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 bg-white'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-900">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {question.followUpQuestions && question.followUpQuestions.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium mb-2">
            Follow-up questions:
          </p>
          <ul className="text-sm text-yellow-700 space-y-1">
            {question.followUpQuestions.map((followUp, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-yellow-500 rounded-full mr-2"></span>
                {followUp}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600 font-medium">
          {question.required ? 'Please select an answer to continue' : 'Optional question'}
        </div>
        
        <div className="flex space-x-3">
          {onSkip && !question.required && (
            <button
              onClick={onSkip}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip
            </button>
          )}
          
          {isAnswered && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default StructuredQuestionCard
