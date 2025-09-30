import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { QuizQuestionRenderer, QuizQuestionProps } from './QuizComponents'
import { InterviewQuestion } from '../../services/PersonalizedInterviewManager'

interface QuizQuestionCardProps {
  question: InterviewQuestion
  onAnswer: (value: any) => void
  onSkip: () => void
  onSkipInterview: () => void
  currentIndex: number
  totalQuestions: number
}

export default function QuizQuestionCard({
  question,
  onAnswer,
  onSkip,
  onSkipInterview,
  currentIndex,
  totalQuestions
}: QuizQuestionCardProps) {
  const [value, setValue] = useState<any>(question.type === 'multiple_choice' ? [] : question.type === 'priority_ranking' ? [] : '')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleAnswer = (answerValue: any) => {
    setValue(answerValue)
    setIsSubmitting(true)
    // Add a small delay to show the selection before processing
    setTimeout(() => {
      onAnswer(answerValue)
      setIsSubmitting(false)
    }, 300)
  }

  const handleSkip = () => {
    onSkip()
  }

  const handleSkipInterview = () => {
    onSkipInterview()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm max-w-4xl mx-auto"
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
        <QuizQuestionRenderer
          question={question.question}
          type={question.type}
          options={question.options}
          value={value}
          onChange={handleAnswer}
          required={question.required}
          min={question.min}
          max={question.max}
          step={question.step}
          labels={question.labels}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleSkip}
            disabled={isSubmitting}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Skip Question
          </button>
          <button
            onClick={handleSkipInterview}
            disabled={isSubmitting}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            Skip Interview
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {isSubmitting && (
            <div className="flex items-center space-x-1 text-blue-500">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Processing...</span>
            </div>
          )}
          <div className="text-xs text-gray-500">
            {question.required ? 'Required' : 'Optional'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
