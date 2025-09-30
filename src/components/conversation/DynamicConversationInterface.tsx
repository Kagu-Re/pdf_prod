import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ollamaService, ShopkeeperContext } from '../../services/OllamaService'
import { ConversationFlowManager, ConversationState } from '../../services/ConversationFlowManager'
import { conversationTemplates } from '../../services/ConversationTemplates'
import { Product } from '../../data/ProductCatalog'
import CatalogView from './views/CatalogView'
import FilterView from './views/FilterView'
import RecommendationsView from './views/RecommendationsView'

interface Message {
  id: string
  type: 'user' | 'shopkeeper' | 'system'
  content: string
  timestamp: Date
  relatedProduct?: string
  metadata?: Record<string, any>
}

interface ConversationHistory {
  messages: Message[]
  state: ConversationState
  selectedProduct?: Product | null
  userPreferences: UserPreferences
}

interface UserPreferences {
  budget?: { min?: number; max?: number }
  useCase?: string
  occasion?: string
  style?: string
  priorities?: string[]
  brand?: string
  color?: string
  size?: string
}

interface DynamicConversationInterfaceProps {
  products: Product[]
  onProductSelect?: (product: Product) => void
  onConversationUpdate?: (messages: Message[]) => void
}

type TopSectionMode = 'catalog' | 'filters' | 'context' | 'order' | 'recommendations' | 'comparison'

export default function DynamicConversationInterface({ 
  products, 
  onProductSelect, 
  onConversationUpdate 
}: DynamicConversationInterfaceProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({})
  const [topSectionMode, setTopSectionMode] = useState<TopSectionMode>('catalog')
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const flowManager = useRef(new ConversationFlowManager())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'shopkeeper',
      content: "Hey there! I'm here to help you find the perfect product. Tell me what you're looking for, or I can ask you a few questions to give you personalized recommendations!",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
    setTopSectionMode('recommendations')
  }, [])

  const saveConversationState = () => {
    const newHistory: ConversationHistory = {
      messages: [...messages],
      state: { ...conversationState },
      selectedProduct,
      userPreferences: { ...userPreferences }
    }
    
    setConversationHistory(prev => {
      const newHistoryArray = [...prev.slice(0, currentHistoryIndex + 1), newHistory]
      setCurrentHistoryIndex(newHistoryArray.length - 1)
      return newHistoryArray
    })
  }

  const goBackInHistory = () => {
    if (currentHistoryIndex > 0) {
      const prevState = conversationHistory[currentHistoryIndex - 1]
      setMessages(prevState.messages)
      setConversationState(prevState.state)
      setSelectedProduct(prevState.selectedProduct || null)
      setUserPreferences(prevState.userPreferences)
      setCurrentHistoryIndex(currentHistoryIndex - 1)
    }
  }

  const goForwardInHistory = () => {
    if (currentHistoryIndex < conversationHistory.length - 1) {
      const nextState = conversationHistory[currentHistoryIndex + 1]
      setMessages(nextState.messages)
      setConversationState(nextState.state)
      setSelectedProduct(nextState.selectedProduct || null)
      setUserPreferences(nextState.userPreferences)
      setCurrentHistoryIndex(currentHistoryIndex + 1)
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    onProductSelect?.(product)
    
    const productMessage: Message = {
      id: `product-${product.id}-${Date.now()}`,
      type: 'system',
      content: `You're now viewing: ${product.name}`,
      timestamp: new Date(),
      relatedProduct: product.id
    }
    
    setMessages(prev => [...prev, productMessage])
    setTopSectionMode('context')
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Save current state before processing
    saveConversationState()

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
      // Analyze conversation flow
      const newConversationState = flowManager.current.analyzeUserInput(inputValue, selectedProduct)
      setConversationState(newConversationState)

      // Update user preferences
      const updatedPreferences = { ...userPreferences, ...newConversationState.userPreferences }
      setUserPreferences(updatedPreferences)

      // Determine top section mode based on intent
      const newTopSectionMode = determineTopSectionMode(newConversationState, inputValue)
      setTopSectionMode(newTopSectionMode)

      // Filter products based on preferences
      const filtered = filterProductsByPreferences(products, updatedPreferences)
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

      const response = await ollamaService.generateShopkeeperResponse(inputValue, context)
      
      const shopkeeperMessage: Message = {
        id: `shopkeeper-${Date.now()}`,
        type: 'shopkeeper',
        content: response,
        timestamp: new Date(),
        relatedProduct: selectedProduct?.id
      }

      setMessages(prev => [...prev, shopkeeperMessage])
      onConversationUpdate?.(messages)
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'shopkeeper',
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const determineTopSectionMode = (state: ConversationState, input: string): TopSectionMode => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('compare') || lowerInput.includes('vs') || state.userIntent === 'comparing') {
      return 'comparison'
    }
    if (lowerInput.includes('filter') || lowerInput.includes('show me') || lowerInput.includes('budget')) {
      return 'filters'
    }
    if (lowerInput.includes('order') || lowerInput.includes('buy') || lowerInput.includes('purchase')) {
      return 'order'
    }
    if (state.conversationStage === 'initial' || lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
      return 'recommendations'
    }
    if (selectedProduct || state.currentTopic === 'product_inquiry') {
      return 'context'
    }
    
    return 'catalog'
  }

  const filterProductsByPreferences = (products: Product[], preferences: UserPreferences): Product[] => {
    return products.filter(product => {
      // Budget filter
      if (preferences.budget) {
        if (preferences.budget.min && product.price < preferences.budget.min) return false
        if (preferences.budget.max && product.price > preferences.budget.max) return false
      }

      // Brand filter
      if (preferences.brand && !product.name.toLowerCase().includes(preferences.brand.toLowerCase())) {
        return false
      }

      // Category filter based on use case
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
        if (allowedCategories && !allowedCategories.includes(product.category)) {
          return false
        }
      }

      return true
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderTopSection = () => {
    switch (topSectionMode) {
      case 'catalog':
        return <CatalogView products={filteredProducts} onProductClick={handleProductClick} selectedProduct={selectedProduct} />
      case 'filters':
        return <FilterView products={products} preferences={userPreferences} onPreferencesChange={setUserPreferences} />
      case 'context':
        return <ContextView product={selectedProduct} />
      case 'order':
        return <OrderView product={selectedProduct} />
      case 'recommendations':
        return <RecommendationsView preferences={userPreferences} onPreferencesChange={setUserPreferences} products={products} />
      case 'comparison':
        return <ComparisonView products={filteredProducts} selectedProduct={selectedProduct} />
      default:
        return <CatalogView products={filteredProducts} onProductClick={handleProductClick} selectedProduct={selectedProduct} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Section - Dynamic Content */}
      <div className="flex-1 overflow-hidden">
        {renderTopSection()}
      </div>

      {/* Bottom Section - Conversation */}
      <div className="h-80 border-t border-gray-200 bg-white flex flex-col">
        {/* Conversation Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Chat with Shopkeeper</h2>
            {selectedProduct && (
              <p className="text-sm text-blue-600">
                Currently viewing: {selectedProduct.name}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goBackInHistory}
              disabled={currentHistoryIndex <= 0}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={goForwardInHistory}
              disabled={currentHistoryIndex >= conversationHistory.length - 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.type === 'system'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
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
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
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
        
        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about products, get recommendations, or tell me what you need..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Additional view components
const ContextView = ({ product }: { product: Product | null }) => (
  <div className="h-full p-6 bg-gray-50">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Product Details</h3>
    {product ? (
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {product.image && (
            <div className="aspect-square">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <div className="space-y-6">
            <div>
              <h4 className="text-3xl font-bold text-gray-900">{product.name}</h4>
              <p className="text-4xl font-bold text-blue-600 mt-2">${product.price}</p>
              <p className="text-gray-600 mt-4 text-lg">{product.description}</p>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div>
                <h5 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h5>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {product.specifications && (
              <div>
                <h5 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h5>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{key}:</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📱</div>
        <p className="text-xl text-gray-500">Select a product to view detailed information</p>
      </div>
    )}
  </div>
)

const OrderView = ({ product }: { product: Product | null }) => (
  <div className="h-full p-6 bg-gray-50">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Place Your Order</h3>
    {product ? (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <div className="flex items-start space-x-6">
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900">{product.name}</h4>
              <p className="text-3xl font-bold text-blue-600 mt-2">${product.price}</p>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
              <span className="text-lg font-medium">Subtotal</span>
              <span className="text-xl font-bold">${product.price}</span>
            </div>
            
            <div className="flex items-center justify-between py-4">
              <span className="text-lg font-medium">Shipping</span>
              <span className="text-lg text-green-600">FREE</span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <button className="w-full px-6 py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-colors">
              Add to Cart
            </button>
            <button className="w-full px-6 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors">
              Buy Now
            </button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>✓ 30-day return policy</p>
            <p>✓ 1-year warranty included</p>
            <p>✓ Free shipping on orders over $50</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-xl text-gray-500">Select a product to place an order</p>
      </div>
    )}
  </div>
)

const ComparisonView = ({ products, selectedProduct }: { products: Product[], selectedProduct: Product | null }) => (
  <div className="h-full p-6 bg-gray-50">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Compare Products</h3>
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Features</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.slice(0, 4).map((product, index) => (
              <tr key={product.id} className={selectedProduct?.id === product.id ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-lg font-semibold text-blue-600">${product.price}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {product.features.slice(0, 2).join(', ')}
                    {product.features.length > 2 && '...'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
