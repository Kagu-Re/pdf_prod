import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { enhancedOllamaService, ShopkeeperContext } from '../../services/EnhancedOllamaService'
import { ollamaService as fallbackOllamaService } from '../../services/OllamaService'
import { ResponseParser } from '../../services/ResponseParser'
import { ConversationFlowManager, ConversationState } from '../../services/ConversationFlowManager'
import { ContextualCommandGenerator } from '../../services/ContextualCommandGenerator'
import { ContentAssetGenerator } from '../../services/ContentAssetGenerator'
import QuizQuestionCard from './QuizQuestionCard'
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
}

interface ContentAsset {
  type: 'card' | 'list' | 'table' | 'image' | 'comparison' | 'specs'
  data: any
  title?: string
}

interface ContextualCommand {
  id: string
  text: string
  icon: string
  action: string
  category: 'product' | 'comparison' | 'policy' | 'general'
}

interface SingleWindowInterfaceProps {
  products: Product[]
  onProductSelect?: (product: Product) => void
  onConversationUpdate?: (messages: Message[]) => void
}

export default function SingleWindowInterface({ 
  products, 
  onProductSelect, 
  onConversationUpdate 
}: SingleWindowInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationState, setConversationState] = useState<ConversationState>({
    currentTopic: 'greeting',
    userIntent: 'browsing',
    conversationStage: 'initial',
    mentionedProducts: [],
    userPreferences: {}
  })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [ollamaConnected, setOllamaConnected] = useState<boolean>(true)
  const [showDebug, setShowDebug] = useState<boolean>(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const flowManager = useRef(new ConversationFlowManager())

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement
      if (chatContainer) {
        const isNearBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 100
        if (isNearBottom || force) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const addDebugLog = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data) : ''}`
    setDebugLogs(prev => [...prev, logEntry])
    console.log(logEntry)
  }

  const clearDebugLogs = () => {
    setDebugLogs([])
    ResponseParser.clearLogs()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  // Log when assets are rendered
  useEffect(() => {
    const messagesWithAssets = messages.filter(msg => msg.assets && msg.assets.length > 0)
    if (messagesWithAssets.length > 0) {
      const latestMessage = messagesWithAssets[messagesWithAssets.length - 1]
      addDebugLog('Rendering assets', { 
        count: latestMessage.assets?.length || 0,
        types: latestMessage.assets?.map(a => a.type) || []
      })
    }
  }, [messages])

  // Add welcome message with sample assets
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'shopkeeper',
        content: "Welcome to our smart shop! I can help you find the perfect products. Would you like to start with a quick personalized interview to get tailored recommendations, or browse our products directly?",
        timestamp: new Date(),
        assets: [
          {
            type: 'recommendations',
            title: 'Popular Products',
            data: { 
              products: products.slice(0, 3),
              showPrice: true
            },
            interactive: true,
            clickable: true,
            action: 'select_recommendation'
          }
        ],
        contextualCommands: [
          { id: 'get_recommendations', text: 'Get Recommendations', icon: '⭐', action: 'get_recommendations', category: 'general' as const },
          { id: 'browse_products', text: 'Browse Products', icon: '🛍️', action: 'browse_products', category: 'general' as const },
          { id: 'compare_products', text: 'Compare Products', icon: '⚖️', action: 'compare_products', category: 'general' as const },
          { id: 'show_help', text: 'What can you do?', icon: '❓', action: 'show_help', category: 'general' as const }
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [products])

  // Interview system is now integrated into conversation flow

  const generateContextualCommands = (state: ConversationState, selectedProduct: Product | null, userInput: string): ContextualCommand[] => {
    return ContextualCommandGenerator.generateCommands(state, selectedProduct, userInput)
  }

  const generateContentAssets = (state: ConversationState, selectedProduct: Product | null, userInput: string): ContentAsset[] => {
    return ContentAssetGenerator.generateAssets(state, selectedProduct, userInput, products)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

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
      // Check Ollama connection first
      const isConnected = await fallbackOllamaService.checkOllamaConnection()
      setOllamaConnected(isConnected)
      addDebugLog('Ollama connection check', { isConnected })
      
      // Interview questions are now handled as regular conversation assets

      // Analyze conversation flow
      const newConversationState = flowManager.current.analyzeUserInput(inputValue, selectedProduct)
      setConversationState(newConversationState)

      // Update filtered products based on preferences
      const filtered = filterProductsByPreferences(products, newConversationState.userPreferences)
      setFilteredProducts(filtered)

      // Convert messages to chat format for ollama
      const chatHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))

      const context: ShopkeeperContext = {
        selectedProduct,
        allProducts: products,
        conversationHistory: chatHistory
      }

      addDebugLog('Starting message generation', { input: inputValue, selectedProduct: context.selectedProduct?.name })
      
      let parsedResponse
      
      // Try enhanced service first for dynamic assets
      addDebugLog('Trying enhanced service for dynamic assets')
      try {
        parsedResponse = await enhancedOllamaService.generateShopkeeperResponse(inputValue, context)
        addDebugLog('Enhanced response received', { 
          responseLength: parsedResponse.text.length, 
          preview: parsedResponse.text.substring(0, 100),
          assetsCount: parsedResponse.assets.length,
          commandsCount: parsedResponse.contextualCommands?.length || 0,
          hasAssets: parsedResponse.assets.length > 0
        })
      } catch (enhancedError) {
        addDebugLog('Enhanced service failed, falling back to basic', { error: enhancedError.message, stack: enhancedError.stack })
        
        // Fallback to basic service
        try {
          const basicResponse = await fallbackOllamaService.generateShopkeeperResponse(inputValue, context)
          parsedResponse = {
            text: basicResponse,
            assets: [],
            contextualCommands: []
          }
          addDebugLog('Basic fallback response received', { responseLength: basicResponse.length, preview: basicResponse.substring(0, 100) })
        } catch (basicError) {
          addDebugLog('Both services failed', { error: basicError.message })
          throw basicError
        }
      }
      
      const shopkeeperMessage: Message = {
        id: `shopkeeper-${Date.now()}`,
        type: 'shopkeeper',
        content: parsedResponse.text,
        timestamp: new Date(),
        assets: parsedResponse.assets.length > 0 ? parsedResponse.assets : undefined,
        contextualCommands: parsedResponse.contextualCommands?.map(cmd => ({
          id: cmd.toLowerCase().replace(/\s+/g, '_'),
          text: cmd,
          icon: '🔧',
          action: cmd.toLowerCase().replace(/\s+/g, '_'),
          category: 'general' as const
        }))
      }

      setMessages(prev => [...prev, shopkeeperMessage])
      onConversationUpdate?.(messages)
    } catch (error) {
      addDebugLog('Error generating response', { error: error.message, stack: error.stack })
      setOllamaConnected(false)
      
      // Try to provide a more helpful error message
      let errorContent = "I'm having some technical difficulties, but I can still help you! Let me try a different approach."
      
      if (error.message.includes('Ollama API error')) {
        errorContent = "I'm having trouble connecting to my AI brain right now, but I can still help you with basic information!"
        addDebugLog('Ollama API error detected')
      } else if (error.message.includes('fetch')) {
        errorContent = "I'm having network issues, but I can still show you our products and answer basic questions!"
        addDebugLog('Network error detected')
      } else {
        addDebugLog('Unknown error type', { errorType: typeof error, message: error.message })
      }
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'shopkeeper',
        content: errorContent,
        timestamp: new Date(),
        contextualCommands: generateContextualCommands(conversationState, selectedProduct, inputValue)
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const filterProductsByPreferences = (products: Product[], preferences: any): Product[] => {
    return products.filter(product => {
      if (preferences.budget) {
        if (preferences.budget.min && product.price < preferences.budget.min) return false
        if (preferences.budget.max && product.price > preferences.budget.max) return false
      }
      return true
    })
  }

  const handleCommandClick = (command: ContextualCommand) => {
    let commandInput = ''
    
    switch (command.action) {
      case 'browse_products':
        commandInput = 'Show me all products'
        break
      case 'get_recommendations':
        commandInput = 'Give me personalized recommendations'
        break
      case 'compare_products':
        commandInput = 'Help me compare products'
        break
      case 'show_features':
        commandInput = 'Tell me about the features'
        break
      case 'show_specs':
        commandInput = 'Show me the specifications'
        break
      case 'show_warranty':
        commandInput = 'What is the warranty policy?'
        break
      case 'show_help':
        commandInput = 'What can you help me with?'
        break
      default:
        commandInput = command.text
    }
    
    setInputValue(commandInput)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleAssetClick = async (action: string, data: any) => {
    console.log('Asset clicked:', action, data)
    
    // Handle interview question interactions
    if (action.startsWith('interview_')) {
      if (action === 'interview_answer') {
        // Process interview answer as regular conversation
        addDebugLog('Processing interview answer', { value: data.value })
        const answerMessage: Message = {
          id: `interview-answer-${Date.now()}`,
          type: 'user',
          content: `Answer: ${data.value}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, answerMessage])
        
        // Continue conversation with the answer
        setTimeout(() => {
          setInputValue(`I answered: ${data.value}`)
          handleSendMessage()
        }, 500)
        return
      } else if (action === 'interview_skip') {
        // Skip this question
        addDebugLog('Skipped interview question')
        const skipMessage: Message = {
          id: `interview-skip-${Date.now()}`,
          type: 'user',
          content: "I'll skip this question",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, skipMessage])
        return
      } else if (action === 'interview_skip_all') {
        // Skip all interview questions
        addDebugLog('Skipped all interview questions')
        const skipAllMessage: Message = {
          id: `interview-skip-all-${Date.now()}`,
          type: 'user',
          content: "I'd prefer to browse products directly",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, skipAllMessage])
        return
      }
      return
    }

    // Handle leading question interactions
    if (action.startsWith('leading_')) {
      if (action === 'leading_answer') {
        // Process leading question answer as regular conversation
        addDebugLog('Processing leading question answer', { value: data.value })
        const answerMessage: Message = {
          id: `leading-answer-${Date.now()}`,
          type: 'user',
          content: `I chose: ${data.value}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, answerMessage])
        
        // Continue conversation with the answer
        setTimeout(() => {
          setInputValue(`I chose: ${data.value}`)
          handleSendMessage()
        }, 500)
        return
      } else if (action === 'leading_skip') {
        // Skip this leading question
        addDebugLog('Skipped leading question')
        const skipMessage: Message = {
          id: `leading-skip-${Date.now()}`,
          type: 'user',
          content: "I'll skip this question",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, skipMessage])
        return
      } else if (action === 'leading_skip_all') {
        // Skip all leading questions
        addDebugLog('Skipped all leading questions')
        const skipAllMessage: Message = {
          id: `leading-skip-all-${Date.now()}`,
          type: 'user',
          content: "I'd prefer to browse products directly",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, skipAllMessage])
        return
      }
      return
    }
    
    // Handle other asset interactions
    let responseInput = ''
    
    switch (action) {
      case 'select_product':
        responseInput = `Tell me more about the ${data.product.name}`
        setSelectedProduct(data.product)
        break
      case 'select_recommendation':
        responseInput = `I'm interested in the ${data.product.name}`
        setSelectedProduct(data.product)
        break
      case 'compare_products':
        responseInput = 'Show me a detailed comparison of these products'
        break
      case 'view_specs':
        responseInput = 'Show me the detailed specifications'
        break
      case 'view_policy':
        responseInput = 'Tell me more about this policy'
        break
      case 'select_item':
        responseInput = `Tell me more about ${data.item}`
        break
      default:
        responseInput = 'Tell me more about this'
    }
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: responseInput,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Generate response for the asset click
      const chatHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))

      const context: ShopkeeperContext = {
        selectedProduct: data.product || selectedProduct,
        allProducts: products,
        conversationHistory: chatHistory
      }

      const parsedResponse = await enhancedOllamaService.generateShopkeeperResponse(responseInput, context)
      
      const shopkeeperMessage: Message = {
        id: `shopkeeper-${Date.now()}`,
        type: 'shopkeeper',
        content: parsedResponse.text,
        timestamp: new Date(),
        assets: parsedResponse.assets.length > 0 ? parsedResponse.assets : undefined,
        contextualCommands: parsedResponse.contextualCommands?.map(cmd => ({
          id: cmd.toLowerCase().replace(/\s+/g, '_'),
          text: cmd,
          icon: '🔧',
          action: cmd.toLowerCase().replace(/\s+/g, '_'),
          category: 'general' as const
        }))
      }

      setMessages(prev => [...prev, shopkeeperMessage])
    } catch (error) {
      console.error('Error generating response for asset click:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'shopkeeper',
        content: "I'm having some technical difficulties, but I can still help you!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">Smart Shop Assistant</h1>
            <p className="text-sm sm:text-base text-gray-600 truncate">Ask me anything about our products!</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                {ollamaConnected ? 'AI Connected' : 'Enhanced Mode'}
              </span>
            </div>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
            >
              {showDebug ? 'Hide' : 'Debug'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 min-h-0 max-h-full">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-4xl ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                {/* Message Bubble */}
                <div
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.type === 'system'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  }`}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {/* Content Assets */}
                {message.assets && message.assets.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.assets.map((asset, index) => (
                      <ContentRenderer 
                        key={index} 
                        asset={asset} 
                        onProductSelect={setSelectedProduct}
                        onAssetClick={handleAssetClick}
                      />
                    ))}
                  </div>
                )}

                {/* Contextual Commands */}
                {message.contextualCommands && message.contextualCommands.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-2">
                      {selectedProduct ? 'Ask about this product:' : 'Quick actions:'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {message.contextualCommands.map((command) => (
                        <motion.button
                          key={command.id}
                          onClick={() => handleCommandClick(command)}
                          className="flex items-center space-x-2 p-2 sm:p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-lg">{command.icon}</span>
                          <span className="text-gray-700">{command.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white text-gray-800 px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Debug Panel */}
      {showDebug && (
        <div className="border-t border-gray-200 bg-gray-100 p-4 max-h-48 overflow-y-auto flex-shrink-0">
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

      {/* Input Area - Fixed at bottom */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
        <div className="flex space-x-2 sm:space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about products..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Send</span>
            <span className="sm:hidden">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Content Renderer Component
interface ContentRendererProps {
  asset: ContentAsset
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
    case 'interview_question':
      return (
        <div className="w-full max-w-full overflow-hidden">
          <QuizQuestionCard
            question={asset.data}
            onAnswer={(value) => onAssetClick('interview_answer', { value })}
            onSkip={() => onAssetClick('interview_skip', {})}
            onSkipInterview={() => onAssetClick('interview_skip_all', {})}
            currentIndex={0}
            totalQuestions={1}
          />
        </div>
      )
    case 'leading_question':
      return (
        <div className="w-full max-w-full overflow-hidden">
          <QuizQuestionCard
            question={asset.data}
            onAnswer={(value) => onAssetClick('leading_answer', { value })}
            onSkip={() => onAssetClick('leading_skip', {})}
            onSkipInterview={() => onAssetClick('leading_skip_all', {})}
            currentIndex={0}
            totalQuestions={1}
          />
        </div>
      )
    default:
      return null
  }
}

// Content Components
const ProductCard = ({ data, onProductSelect }: { data: any, onProductSelect: (product: Product) => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <div className="flex items-start space-x-4">
      {data.product.image && (
        <img 
          src={data.product.image} 
          alt={data.product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{data.product.name}</h3>
        <p className="text-2xl font-bold text-blue-600 mt-1">${data.product.price}</p>
        <p className="text-gray-600 mt-2">{data.product.description}</p>
        {data.showFeatures && data.product.features && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {data.product.features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
)

const ListContent = ({ data, title }: { data: any, title?: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    {title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>}
    <ul className="space-y-2">
      {data.items.map((item: any, index: number) => (
        <li key={index} className="flex items-center text-sm text-gray-700">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
          {typeof item === 'string' ? item : `${item.name} - $${item.price}`}
        </li>
      ))}
    </ul>
  </div>
)

const TableContent = ({ data, title }: { data: any, title?: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    {title && <h3 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">{title}</h3>}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {data.headers.map((header: string, index: number) => (
              <th key={index} className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.rows.map((row: any[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: any, cellIndex: number) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const ComparisonContent = ({ data, title }: { data: any, title?: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    {title && <h3 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">{title}</h3>}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Key Features</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.products.map((product: Product) => (
            <tr key={product.id}>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-lg font-semibold text-blue-600">${product.price}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {product.features.slice(0, 2).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const SpecsContent = ({ data, title }: { data: any, title?: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    {title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>}
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(data.specifications).map(([key, value]) => (
        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">{key}:</span>
          <span className="text-gray-900 font-medium">{value as string}</span>
        </div>
      ))}
    </div>
  </div>
)

const PoliciesContent = ({ data, title }: { data: any, title?: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    {title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>}
    <div className="space-y-3">
      {data.items.map((item: string, index: number) => (
        <div key={index} className="flex items-center text-sm text-gray-700">
          <span className="text-lg mr-3">{item.split(' ')[0]}</span>
          <span>{item.substring(item.indexOf(' ') + 1)}</span>
        </div>
      ))}
    </div>
  </div>
)

const RecommendationsContent = ({ data, title, onProductSelect }: { data: any, title?: string, onProductSelect: (product: Product) => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    {title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>}
    <div className="space-y-3">
      {data.products.map((product: Product, index: number) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onProductSelect(product)}
          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
        >
          {product.image && (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
            <p className="text-sm text-gray-600 truncate">{product.description}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-semibold text-blue-600">${product.price}</span>
              {data.showMatch && (
                <span className="text-xs text-gray-500">
                  {Math.floor(Math.random() * 20 + 80)}% match
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
)
