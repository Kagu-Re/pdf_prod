import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ollamaService, ShopkeeperContext } from '../../services/OllamaService'
import ConversationGuides from './ConversationGuides'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  features: string[]
  specifications?: Record<string, string>
}

interface Message {
  id: string
  type: 'user' | 'shopkeeper' | 'system'
  content: string
  timestamp: Date
  relatedProduct?: string
  metadata?: Record<string, any>
}

interface ConversationInterfaceProps {
  products: Product[]
  onProductSelect?: (product: Product) => void
  onConversationUpdate?: (messages: Message[]) => void
}

export default function ConversationInterface({ 
  products, 
  onProductSelect, 
  onConversationUpdate 
}: ConversationInterfaceProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationStage, setConversationStage] = useState<'initial' | 'exploring' | 'deciding' | 'concluding'>('initial')
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      content: "Welcome to our shop! I'm here to help you find the perfect product. You can ask me about any of our products, compare them, or learn about our policies and terms.",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

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
      
      // Update conversation stage based on message count and content
      if (messages.length === 0) {
        setConversationStage('initial')
      } else if (messages.length < 3) {
        setConversationStage('exploring')
      } else if (messages.length < 6) {
        setConversationStage('deciding')
      } else {
        setConversationStage('concluding')
      }
      
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleGuideClick = (guide: any) => {
    setInputValue(guide.text)
    // Auto-send the guide message
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Product Catalog */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Our Products</h2>
          <p className="text-sm text-gray-600 mt-1">Click on any product to learn more</p>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedProduct?.id === product.id 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleProductClick(product)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-semibold text-blue-600">${product.price}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Center Panel - Conversation */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Chat with Shopkeeper</h2>
          {selectedProduct && (
            <p className="text-sm text-blue-600 mt-1">
              Currently viewing: {selectedProduct.name}
            </p>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          
          {/* Conversation Guides */}
          {!isTyping && messages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <ConversationGuides
                selectedProduct={selectedProduct}
                onGuideClick={handleGuideClick}
                conversationStage={conversationStage}
              />
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about products, compare, or learn about policies..."
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

      {/* Right Panel - Product Details */}
      <div className="w-1/3 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
        </div>
        
        <div className="p-4">
          {selectedProduct ? (
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {selectedProduct.image && (
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">${selectedProduct.price}</p>
                <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                <ul className="space-y-1">
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedProduct.specifications && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <div className="text-4xl mb-4">🛍️</div>
              <p>Select a product to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

