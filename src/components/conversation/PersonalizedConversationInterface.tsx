import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PersonalizedInterviewManager, InterviewState, UserPreferences } from '../../services/PersonalizedInterviewManager'
import { Product } from '../../data/ProductCatalog'
import { 
  InteractiveProductCard, 
  InteractiveList, 
  InteractiveComparison, 
  InteractiveSpecs, 
  InteractivePolicies, 
  InteractiveRecommendations 
} from './InteractiveAssets'

interface Message {
  id: string
  type: 'user' | 'shopkeeper' | 'system'
  content: string
  timestamp: Date
  assets?: any[]
  contextualCommands?: ContextualCommand[]
  isQuestion?: boolean
  questionId?: string
}

interface ContextualCommand {
  id: string
  text: string
  icon: string
  action: string
  category: 'general' | 'interview' | 'recommendations'
}

interface PersonalizedConversationInterfaceProps {
  products: Product[]
  onConversationUpdate?: (messages: Message[]) => void
}

export default function PersonalizedConversationInterface({ 
  products, 
  onConversationUpdate 
}: PersonalizedConversationInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [interviewState, setInterviewState] = useState<InterviewState | null>(null)
  const [showDebug, setShowDebug] = useState<boolean>(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const interviewManager = useRef(new PersonalizedInterviewManager())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addDebugLog = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data) : ''}`
    setDebugLogs(prev => [...prev, logEntry])
    console.log(logEntry)
  }

  const clearDebugLogs = () => {
    setDebugLogs([])
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize interview
  useEffect(() => {
    if (!interviewState) {
      const newInterviewState = interviewManager.current.createInterviewState()
      setInterviewState(newInterviewState)
      
      // Add initial greeting
      const greetingMessage: Message = {
        id: 'greeting',
        type: 'shopkeeper',
        content: newInterviewState.personalizedGreeting,
        timestamp: new Date(),
        isQuestion: true,
        contextualCommands: [
          { id: 'start_interview', text: 'Start Interview', icon: '🎯', action: 'start_interview', category: 'interview' },
          { id: 'skip_interview', text: 'Skip to Browse', icon: '🛍️', action: 'skip_interview', category: 'general' }
        ]
      }
      setMessages([greetingMessage])
    }
  }, [interviewState])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !interviewState) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      addDebugLog('Processing user input', { input: inputValue, stage: interviewState.currentStage })

      let response: string
      let newInterviewState = interviewState
      let assets: any[] = []
      let commands: ContextualCommand[] = []

      if (interviewState.currentStage === 'greeting') {
        if (inputValue.toLowerCase().includes('start') || inputValue.toLowerCase().includes('interview')) {
          newInterviewState = { ...interviewState, currentStage: 'interview' }
          response = interviewManager.current.generatePersonalizedResponse(newInterviewState)
          commands = [
            { id: 'answer_question', text: 'Answer Question', icon: '💬', action: 'answer_question', category: 'interview' },
            { id: 'skip_question', text: 'Skip Question', icon: '⏭️', action: 'skip_question', category: 'interview' }
          ]
        } else {
          response = "I'd love to help you find the perfect product! Would you like to start with a quick interview to personalize my recommendations, or would you prefer to browse our products directly?"
          commands = [
            { id: 'start_interview', text: 'Start Interview', icon: '🎯', action: 'start_interview', category: 'interview' },
            { id: 'browse_products', text: 'Browse Products', icon: '🛍️', action: 'browse_products', category: 'general' }
          ]
        }
      } else if (interviewState.currentStage === 'interview') {
        // Process interview answer
        newInterviewState = interviewManager.current.processAnswer(interviewState, inputValue)
        
        if (newInterviewState.isComplete) {
          response = interviewManager.current.generatePersonalizedResponse(newInterviewState)
          
          // Generate personalized recommendations
          const recommendations = interviewManager.current.getPersonalizedRecommendations(newInterviewState, products)
          assets = [{
            type: 'recommendations',
            title: 'Personalized Recommendations',
            data: { 
              products: recommendations,
              showMatch: true,
              showPrice: true
            },
            interactive: true,
            clickable: true,
            action: 'select_recommendation'
          }]

          commands = [
            { id: 'show_more', text: 'Show More Options', icon: '➕', action: 'show_more', category: 'recommendations' },
            { id: 'compare_products', text: 'Compare Products', icon: '⚖️', action: 'compare_products', category: 'recommendations' },
            { id: 'refine_preferences', text: 'Refine Preferences', icon: '⚙️', action: 'refine_preferences', category: 'recommendations' }
          ]
        } else {
          response = interviewManager.current.generatePersonalizedResponse(newInterviewState)
          commands = [
            { id: 'answer_question', text: 'Answer Question', icon: '💬', action: 'answer_question', category: 'interview' },
            { id: 'skip_question', text: 'Skip Question', icon: '⏭️', action: 'skip_question', category: 'interview' }
          ]
        }
      } else {
        // Handle other conversation stages
        response = "I'm here to help! What would you like to know about our products?"
        commands = [
          { id: 'browse_products', text: 'Browse Products', icon: '🛍️', action: 'browse_products', category: 'general' },
          { id: 'get_recommendations', text: 'Get Recommendations', icon: '⭐', action: 'get_recommendations', category: 'general' },
          { id: 'compare_products', text: 'Compare Products', icon: '⚖️', action: 'compare_products', category: 'general' }
        ]
      }

      const shopkeeperMessage: Message = {
        id: `shopkeeper-${Date.now()}`,
        type: 'shopkeeper',
        content: response,
        timestamp: new Date(),
        assets: assets.length > 0 ? assets : undefined,
        contextualCommands: commands,
        isQuestion: newInterviewState.currentStage === 'interview' && !newInterviewState.isComplete
      }

      setMessages(prev => [...prev, shopkeeperMessage])
      setInterviewState(newInterviewState)
      onConversationUpdate?.(messages)

    } catch (error) {
      addDebugLog('Error processing message', { error: error.message })
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'shopkeeper',
        content: "I'm having some technical difficulties, but I can still help you! Let me try a different approach.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleCommandClick = (command: ContextualCommand) => {
    let commandInput = ''
    
    switch (command.action) {
      case 'start_interview':
        commandInput = 'Start the interview'
        break
      case 'skip_interview':
        commandInput = 'Skip to browse products'
        break
      case 'answer_question':
        commandInput = 'I\'ll answer the question'
        break
      case 'skip_question':
        commandInput = 'Skip this question'
        break
      case 'browse_products':
        commandInput = 'Show me all products'
        break
      case 'get_recommendations':
        commandInput = 'Give me recommendations'
        break
      case 'compare_products':
        commandInput = 'Help me compare products'
        break
      case 'show_more':
        commandInput = 'Show me more options'
        break
      case 'refine_preferences':
        commandInput = 'I want to refine my preferences'
        break
      default:
        commandInput = command.text
    }
    
    setInputValue(commandInput)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const handleAssetClick = async (action: string, data: any) => {
    addDebugLog('Asset clicked', { action, data })
    
    let responseInput = ''
    
    switch (action) {
      case 'select_recommendation':
        responseInput = `I'm interested in the ${data.product.name}`
        break
      case 'select_product':
        responseInput = `Tell me more about the ${data.product.name}`
        break
      case 'compare_products':
        responseInput = 'Show me a detailed comparison'
        break
      default:
        responseInput = 'Tell me more about this'
    }
    
    setInputValue(responseInput)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Personalized Shop Assistant</h1>
            <p className="text-gray-600">Let me get to know you to find the perfect products!</p>
          </div>
          <div className="flex items-center space-x-4">
            {interviewState && (
              <div className="text-sm text-gray-600">
                <div className="font-medium">Interview Progress</div>
                <div className="text-xs">
                  {interviewState.currentStage === 'greeting' && 'Getting started...'}
                  {interviewState.currentStage === 'interview' && `Question ${interviewState.currentQuestionIndex + 1} of ${interviewState.questions.length}`}
                  {interviewState.currentStage === 'recommendations' && 'Personalized recommendations ready!'}
                </div>
              </div>
            )}
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
            >
              {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.isQuestion
                      ? 'bg-yellow-50 border-2 border-yellow-200 text-gray-800'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Content Assets */}
                  {message.assets && message.assets.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.assets.map((asset, index) => (
                        <ContentRenderer 
                          key={index} 
                          asset={asset} 
                          onProductSelect={() => {}}
                          onAssetClick={handleAssetClick}
                        />
                      ))}
                    </div>
                  )}

                  {/* Contextual Commands */}
                  {message.contextualCommands && message.contextualCommands.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-2">
                        Quick actions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.contextualCommands.map((command) => (
                          <button
                            key={command.id}
                            onClick={() => handleCommandClick(command)}
                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            {command.icon} {command.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Debug Panel */}
      {showDebug && (
        <div className="border-t border-gray-200 bg-gray-100 p-4 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Debug Logs</h3>
            <button
              onClick={clearDebugLogs}
              className="px-2 py-1 text-xs bg-red-200 hover:bg-red-300 rounded"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1 text-xs font-mono">
            {debugLogs.length === 0 ? (
              <div className="text-gray-500">No debug logs yet. Send a message to see logs.</div>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} className="text-gray-700 break-all">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              interviewState?.currentStage === 'interview' 
                ? "Answer the question above..." 
                : "Type your message..."
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

// Content Renderer Component
interface ContentRendererProps {
  asset: any
  onProductSelect: (product: Product) => void
  onAssetClick: (action: string, data: any) => void
}

function ContentRenderer({ asset, onProductSelect, onAssetClick }: ContentRendererProps) {
  switch (asset.type) {
    case 'card':
      return <InteractiveProductCard asset={asset} onAssetClick={onAssetClick} onProductSelect={onProductSelect} />
    case 'list':
      return <InteractiveList asset={asset} onAssetClick={onAssetClick} onProductSelect={onProductSelect} />
    case 'table':
    case 'comparison':
      return <InteractiveComparison asset={asset} onAssetClick={onAssetClick} onProductSelect={onProductSelect} />
    case 'specs':
      return <InteractiveSpecs asset={asset} onAssetClick={onAssetClick} onProductSelect={onProductSelect} />
    case 'policies':
      return <InteractivePolicies asset={asset} onAssetClick={onAssetClick} onProductSelect={onProductSelect} />
    case 'recommendations':
      return <InteractiveRecommendations asset={asset} onAssetClick={onAssetClick} onProductSelect={onProductSelect} />
    default:
      return null
  }
}







