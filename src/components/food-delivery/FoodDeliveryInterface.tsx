import React, { useState, useEffect, useRef } from 'react'
import { FoodDeliveryService } from '../../services/FoodDeliveryService'
import { PlaybookSystem } from '../../services/PlaybookSystem'
import { KnowledgeBase } from '../../services/KnowledgeBase'
import { OllamaService } from '../../services/OllamaService'
import { EnhancedFoodDeliveryOllama } from '../../services/EnhancedFoodDeliveryOllama'
import Logger from '../../utils/Logger'
import { FoodItem, PickupPoint, DeliveryZone } from '../../data/FoodDeliveryCatalog'
import { CustomerPreferences, OrderItem, DeliveryPreferences, OrderSummary } from '../../services/FoodDeliveryService'
import { FoodItemCard, OrderSummary as OrderSummaryComponent, PreferencesCollector, ProgressivePreferencesCollector, DeliverySetup, ServiceOverview } from './FoodDeliveryTools'
import { StructuredQuestionCard, StructuredQuestion } from './StructuredQuestionCard'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  assets?: any[]
  contextualCommands?: any[]
}

interface FoodDeliveryInterfaceProps {
  onOrderComplete?: (order: OrderSummary) => void
  onConversationUpdate?: (messages: Message[]) => void
}

export const FoodDeliveryInterface: React.FC<FoodDeliveryInterfaceProps> = ({
  onOrderComplete,
  onConversationUpdate
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStage, setCurrentStage] = useState<string>('greeting')
  const [showDebug, setShowDebug] = useState(false)
  const [debugLogs, setDebugLogs] = useState<any[]>([])
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([])
  const [customerPreferences, setCustomerPreferences] = useState<CustomerPreferences | null>(null)
  const [deliveryPreferences, setDeliveryPreferences] = useState<DeliveryPreferences | null>(null)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showDeliverySetup, setShowDeliverySetup] = useState(false)
  const [preferencesStep, setPreferencesStep] = useState(1)
  const [preferencesData, setPreferencesData] = useState<CustomerPreferences>({})
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [ollamaConnected, setOllamaConnected] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<StructuredQuestion | null>(null)
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([])
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({})
  const [welcomeMessageGenerated, setWelcomeMessageGenerated] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatAreaRef = useRef<HTMLDivElement>(null)

  // Initialize service and enhanced Ollama context
  useEffect(() => {
    Logger.info('FoodDeliveryInterface', 'Initializing component with enhanced Ollama')
    try {
      FoodDeliveryService.initializeService()
      
      // Initialize enhanced Ollama context
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      EnhancedFoodDeliveryOllama.initializeContext(sessionId)
      
      addDebugLog('Food Delivery Service and Enhanced Ollama initialized')
      Logger.info('FoodDeliveryInterface', 'Service initialization completed')
      
      // Check Ollama connection
      checkOllamaConnection()
    } catch (error) {
      Logger.error('FoodDeliveryInterface', 'Failed to initialize service', { error: error.message })
      addDebugLog('Failed to initialize service', { error: error.message })
    }
  }, [])

  const checkOllamaConnection = async () => {
    try {
      const isConnected = await OllamaService.checkOllamaConnection()
      setOllamaConnected(isConnected)
      Logger.info('FoodDeliveryInterface', 'Ollama connection check', { isConnected })
      addDebugLog('Ollama connection check', { isConnected })
    } catch (error) {
      Logger.error('FoodDeliveryInterface', 'Failed to check Ollama connection', { error: error.message })
      addDebugLog('Failed to check Ollama connection', { error: error.message })
    }
  }

  // Get next required question for order placement
  const getNextQuestion = () => {
    console.log('🔍 FoodDeliveryInterface.getNextQuestion called')
    
    // Check if we already have enough info for order
    if (hasEnoughInfoForOrder()) {
      console.log('✅ Already have enough info for order, generating summary')
      generateOrderSummary()
      return
    }

    // Get the next required question
    const nextRequiredQuestion = getNextRequiredQuestion()
    console.log('📋 Next required question:', nextRequiredQuestion)
    
    if (nextRequiredQuestion) {
      const question = getQuestionById(nextRequiredQuestion)
      if (question) {
        console.log('✅ Setting next required question:', question)
        setCurrentQuestion(question)
        Logger.debug('FoodDeliveryInterface', 'Next required question retrieved', {
          questionId: question.id,
          question: question.question,
          answerOptions: question.answerOptions
        })
      } else {
        console.log('❌ Question not found:', nextRequiredQuestion)
        setCurrentQuestion(null)
      }
    } else {
      console.log('❌ No more questions needed')
      setCurrentQuestion(null)
    }
  }

  // Handle question answer
  const handleQuestionAnswer = (questionId: string, answer: string) => {
    console.log('🔍 FoodDeliveryInterface.handleQuestionAnswer called with:', { questionId, answer })
    
    // Use our simple validation instead of PlaybookSystem
    const isValid = validateSimpleAnswer(questionId, answer)
    console.log('📋 FoodDeliveryInterface.handleQuestionAnswer - Answer validation result:', isValid)
    
    if (isValid) {
      console.log('✅ FoodDeliveryInterface.handleQuestionAnswer - Answer accepted, updating state')
      setAnsweredQuestions(prev => [...prev, questionId])
      setQuestionAnswers(prev => ({ ...prev, [questionId]: answer }))
      
      // Also update the context for Ollama
      const context = EnhancedFoodDeliveryOllama.getContext()
      if (context) {
        if (!context.questionAnswers) {
          context.questionAnswers = {}
        }
        context.questionAnswers[questionId] = answer
        EnhancedFoodDeliveryOllama.updateContext({
          questionAnswers: context.questionAnswers
        })
      }
      
      Logger.info('FoodDeliveryInterface', 'Question answered', {
        questionId,
        answer,
        totalAnswered: answeredQuestions.length + 1
      })

      // Check if we have enough information to place an order
      if (hasEnoughInfoForOrder()) {
        console.log('🎉 All required information collected! Ready to place order.')
        setCurrentQuestion(null)
        
        // Generate order summary using Ollama
        generateOrderSummary()
      } else {
        // Get the next required question
        const nextRequiredQuestion = getNextRequiredQuestion()
        console.log('📋 Next required question:', nextRequiredQuestion)
        
        if (nextRequiredQuestion) {
          // Get the question from our simple system
          const question = getQuestionById(nextRequiredQuestion)
          if (question) {
            console.log('✅ Setting next required question:', question)
            setCurrentQuestion(question)
          } else {
            console.log('❌ Question not found:', nextRequiredQuestion)
            setCurrentQuestion(null)
          }
        } else {
          console.log('❌ No more questions needed')
          setCurrentQuestion(null)
        }
      }
    } else {
      console.log('❌ FoodDeliveryInterface.handleQuestionAnswer - Invalid answer provided')
      Logger.warn('FoodDeliveryInterface', 'Invalid answer provided', {
        questionId,
        answer
      })
    }
  }

  // Simple validation for our required questions
  const validateSimpleAnswer = (questionId: string, answer: string): boolean => {
    console.log('🔍 Validating simple answer:', { questionId, answer })
    
    // Define valid answers for each question
    const validAnswers = {
      'visit_purpose': [
        'I want to order food',
        'I\'m looking for meal planning',
        'I need nutrition advice',
        'I want to learn about your services',
        'I\'m just browsing'
      ],
      'dietary_restrictions': [
        'No restrictions',
        'Vegetarian',
        'Vegan',
        'Gluten-free',
        'Dairy-free',
        'Nut allergies',
        'Other allergies',
        'I\'m not sure'
      ],
      'order_quantity': [
        '1 serving',
        '2 servings',
        '3-4 servings',
        'Family size (5+ servings)',
        'I need help deciding'
      ],
      'delivery_address': [
        'San Francisco, CA',
        'Oakland, CA',
        'Berkeley, CA',
        'San Jose, CA',
        'I prefer pickup',
        'I\'ll provide address later'
      ]
    }

    const validOptions = validAnswers[questionId as keyof typeof validAnswers]
    if (!validOptions) {
      console.log('❌ Unknown question ID:', questionId)
      return false
    }

    const isValid = validOptions.includes(answer)
    console.log('📋 Validation result:', { questionId, answer, isValid, validOptions })
    return isValid
  }

  // Handle question skip
  const handleQuestionSkip = () => {
    if (currentQuestion && !currentQuestion.required) {
      Logger.info('FoodDeliveryInterface', 'Question skipped', {
        questionId: currentQuestion.id
      })
      getNextQuestion()
    }
  }

  // Check if we have enough information to place an order
  const hasEnoughInfoForOrder = (): boolean => {
    const context = EnhancedFoodDeliveryOllama.getContext()
    if (!context) return false

    const answers = context.questionAnswers || {}
    console.log('🔍 Checking if we have enough info for order:', answers)

    // Required information for order placement
    const requiredInfo = [
      'visit_purpose',      // What they want
      'dietary_restrictions', // Safety requirement
      'order_quantity',     // How many servings
      'delivery_address'    // Where to deliver
    ]

    const hasAllRequired = requiredInfo.every(key => answers[key])
    console.log('📋 Has all required info for order:', hasAllRequired)
    
    return hasAllRequired
  }

  // Get the next question needed for order placement
  const getNextRequiredQuestion = (): string | null => {
    const context = EnhancedFoodDeliveryOllama.getContext()
    if (!context) return null

    const answers = context.questionAnswers || {}
    console.log('🔍 Getting next required question. Current answers:', answers)

    // Check what information we still need
    if (!answers['visit_purpose']) {
      console.log('📋 Need visit purpose')
      return 'visit_purpose'
    }
    
    if (!answers['dietary_restrictions']) {
      console.log('📋 Need dietary restrictions')
      return 'dietary_restrictions'
    }
    
    if (!answers['order_quantity']) {
      console.log('📋 Need order quantity')
      return 'order_quantity'
    }
    
    if (!answers['delivery_address']) {
      console.log('📋 Need delivery address')
      return 'delivery_address'
    }

    console.log('✅ All required information collected!')
    return null
  }

  // Get question by ID from playbook
  const getQuestionById = (questionId: string): any => {
    console.log('🔍 Getting question by ID:', questionId)
    
    // Define the required questions with their data
    const requiredQuestions = {
      'visit_purpose': {
        id: 'visit_purpose',
        question: 'What would you like to order today?',
        answerOptions: [
          'I want to order food',
          'I\'m looking for meal planning',
          'I need nutrition advice',
          'I want to learn about your services',
          'I\'m just browsing'
        ],
        context: 'Understanding what you need',
        required: true
      },
      'dietary_restrictions': {
        id: 'dietary_restrictions',
        question: 'Do you have any dietary restrictions or allergies?',
        answerOptions: [
          'No restrictions',
          'Vegetarian',
          'Vegan',
          'Gluten-free',
          'Dairy-free',
          'Nut allergies',
          'Other allergies',
          'I\'m not sure'
        ],
        context: 'Important for your safety and preferences',
        required: true
      },
      'order_quantity': {
        id: 'order_quantity',
        question: 'How many servings would you like?',
        answerOptions: [
          '1 serving',
          '2 servings',
          '3-4 servings',
          'Family size (5+ servings)',
          'I need help deciding'
        ],
        context: 'Determines order quantity',
        required: true
      },
      'delivery_address': {
        id: 'delivery_address',
        question: 'Where should we deliver your order?',
        answerOptions: [
          'San Francisco, CA',
          'Oakland, CA',
          'Berkeley, CA',
          'San Jose, CA',
          'I prefer pickup',
          'I\'ll provide address later'
        ],
        context: 'Required for delivery or pickup location',
        required: true
      }
    }

    const question = requiredQuestions[questionId as keyof typeof requiredQuestions]
    console.log('📋 Found question:', question)
    return question
  }

  // Generate order summary using Ollama
  const generateOrderSummary = async () => {
    console.log('🔍 Generating order summary with collected information')
    
    try {
      const context = EnhancedFoodDeliveryOllama.getContext()
      if (!context) return

      const answers = context.questionAnswers || {}
      console.log('📋 Collected answers for order summary:', answers)

      // Create a prompt for Ollama to generate order summary
      const prompt = `Based on the collected information, create a personalized order summary:

Customer Information:
- What they want: ${answers['visit_purpose'] || 'Not specified'}
- Dietary restrictions: ${answers['dietary_restrictions'] || 'Not specified'}
- Quantity: ${answers['order_quantity'] || 'Not specified'}
- Delivery location: ${answers['delivery_address'] || 'Not specified'}

Please create a helpful response that:
1. Acknowledges their preferences
2. Suggests appropriate food items based on their dietary needs
3. Confirms the order details
4. Asks if they're ready to proceed with the order

Keep it friendly and helpful.`

      // Generate response using Ollama
      const response = await EnhancedFoodDeliveryOllama.generateResponse(
        prompt,
        'order_summary',
        []
      )

      console.log('📋 Generated order summary:', response)

      // Create assistant message with the response
      const orderMessage: Message = {
        id: `order_summary_${Date.now()}`,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        assets: response.assets || [],
        contextualCommands: response.commands || []
      }

      setMessages(prev => [...prev, orderMessage])
      
      Logger.info('FoodDeliveryInterface', 'Order summary generated', {
        answers,
        responseLength: response.content.length
      })

    } catch (error) {
      console.log('❌ Error generating order summary:', error)
      Logger.error('FoodDeliveryInterface', 'Failed to generate order summary', { 
        error: error.message
      })
    }
  }

  // Generate response for new stage
  const generateStageResponse = async (stage: string, userAnswer: string) => {
    console.log('🔍 FoodDeliveryInterface.generateStageResponse called with:', { stage, userAnswer })
    
    try {
      // Update current stage in both UI and EnhancedFoodDeliveryOllama context
      setCurrentStage(stage)
      EnhancedFoodDeliveryOllama.updateContext({ currentStage: stage })
      
      // Create a simple stage transition message
      const stageMessage: Message = {
        id: `stage_${Date.now()}`,
        type: 'assistant',
        content: `Great! Based on your answer "${userAnswer}", let me help you with the next step.`,
        timestamp: new Date(),
        assets: [],
        contextualCommands: []
      }

      setMessages(prev => [...prev, stageMessage])
      
      // Get the next question for the new stage
      console.log('🔄 FoodDeliveryInterface.generateStageResponse - Getting next question for stage:', stage)
      getNextQuestion()
      
      Logger.info('FoodDeliveryInterface', 'Stage response generated', {
        stage,
        userAnswer
      })

    } catch (error) {
      console.log('❌ FoodDeliveryInterface.generateStageResponse - Error:', error)
      Logger.error('FoodDeliveryInterface', 'Failed to generate stage response', { 
        error: error.message,
        stage,
        userAnswer
      })
    }
  }

  // Generate enhanced welcome message
  useEffect(() => {
    const generateWelcomeMessage = async () => {
      if (welcomeMessageGenerated || messages.length > 0) return
      
      try {
        setWelcomeMessageGenerated(true)
        
        // Use simple welcome message without Ollama to avoid conflicting assets
        const welcomeMessage: Message = {
          id: 'welcome',
          type: 'assistant',
          content: 'Hi! Welcome to our food delivery service. How can I help you today?',
          timestamp: new Date(),
          assets: [],
          contextualCommands: [
            { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' },
            { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' },
            { id: 'delivery_info', text: 'Delivery Info', icon: '🚚', action: 'delivery_info' }
          ]
        }
        setMessages([welcomeMessage])
        
        Logger.info('FoodDeliveryInterface', 'Welcome message generated', {
          messageId: welcomeMessage.id,
          content: welcomeMessage.content
        })
      } catch (error) {
        Logger.error('FoodDeliveryInterface', 'Welcome message generation failed', { error: error.message })
        addDebugLog('Welcome message generation failed', { error: error.message })
      }
    }

    generateWelcomeMessage()
  }, [welcomeMessageGenerated, messages.length])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Get next question when stage changes or after welcome message
  useEffect(() => {
    if (messages.length >= 1) { // After welcome message is generated
      getNextQuestion()
    }
  }, [currentStage, messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addDebugLog = (message: string, data?: any) => {
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      data
    }
    setDebugLogs(prev => [...prev, log])
  }

  const clearDebugLogs = () => {
    setDebugLogs([])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    Logger.info('FoodDeliveryInterface', 'User message received', { 
      input: inputValue,
      currentStage,
      isTyping
    })

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
      // Update conversation history in persistent context BEFORE calling Ollama
      const updatedMessages = [...messages, userMessage]
      EnhancedFoodDeliveryOllama.updateContext({
        conversationHistory: updatedMessages,
        currentStage: currentStage
      })

      // Get current stage and applicable rules
      Logger.debug('FoodDeliveryInterface', 'Getting playbook stage and rules')
      const stage = PlaybookSystem.getCurrentStage(updatedMessages, currentStage)
      const rules = PlaybookSystem.getApplicableRules('food-delivery-concierge', currentStage, inputValue)
      
      Logger.info('FoodDeliveryInterface', 'Stage and rules retrieved', {
        stageId: stage?.id,
        stageName: stage?.name,
        rulesCount: rules.length,
        ruleIds: rules.map(r => r.id)
      })
      
      addDebugLog('Processing message', { 
        currentStage, 
        rulesCount: rules.length,
        userInput: inputValue 
      })

      // Process with Enhanced Ollama if connected, otherwise use playbook system
      let response
      if (ollamaConnected) {
        Logger.info('FoodDeliveryInterface', 'Using Enhanced Ollama for response generation')
        try {
          const enhancedResponse = await EnhancedFoodDeliveryOllama.generateResponse(inputValue, currentStage, rules)
          response = {
            content: enhancedResponse.content,
            assets: enhancedResponse.assets,
            commands: enhancedResponse.commands,
            nextStage: enhancedResponse.nextStage
          }
          Logger.info('FoodDeliveryInterface', 'Enhanced Ollama response generated', {
            content: response.content,
            assetsCount: response.assets?.length || 0,
            commandsCount: response.commands?.length || 0,
            confidence: enhancedResponse.confidence,
            reasoning: enhancedResponse.reasoning
          })
        } catch (error) {
          Logger.error('FoodDeliveryInterface', 'Enhanced Ollama response failed, falling back to playbook', { error: error.message })
          response = await processStageResponse(inputValue, stage, rules)
        }
      } else {
        Logger.info('FoodDeliveryInterface', 'Using playbook system for response generation')
        response = await processStageResponse(inputValue, stage, rules)
      }
      
      Logger.info('FoodDeliveryInterface', 'Response generated', {
        content: response.content,
        assetsCount: response.assets?.length || 0,
        commandsCount: response.commands?.length || 0,
        nextStage: response.nextStage,
        usingOllama: ollamaConnected
      })
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        assets: response.assets,
        contextualCommands: response.commands
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update stage if needed
      if (response.nextStage && response.nextStage !== currentStage) {
        Logger.info('FoodDeliveryInterface', 'Stage transition executed', {
          from: currentStage,
          to: response.nextStage,
          userInput: inputValue.substring(0, 50),
          usingOllama: ollamaConnected
        })
        setCurrentStage(response.nextStage)
        addDebugLog('Stage transition', { 
          from: currentStage, 
          to: response.nextStage,
          reason: 'User intent analysis',
          usingOllama: ollamaConnected
        })
      }

      // Update conversation history in persistent context with assistant response
      const finalMessages = [...updatedMessages, assistantMessage]
      EnhancedFoodDeliveryOllama.updateContext({
        conversationHistory: finalMessages,
        currentStage: response.nextStage || currentStage
      })

    } catch (error) {
      addDebugLog('Error processing message', { error: error.message })
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Let me help you in a different way. What would you like to do?',
        timestamp: new Date(),
        contextualCommands: [
          { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' },
          { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' },
          { id: 'start_over', text: 'Start Over', icon: '🔄', action: 'start_over' }
        ]
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateOllamaResponse = async (input: string, stage: any, rules: any[]): Promise<{
    content: string
    assets?: any[]
    commands?: any[]
    nextStage?: string
  }> => {
    Logger.debug('FoodDeliveryInterface', 'Generating Ollama response', {
      input,
      currentStage,
      stageId: stage?.id,
      stageName: stage?.name,
      rulesCount: rules.length
    })

    try {
      // Build context for Ollama
      const context = {
        currentStage: stage?.id || currentStage,
        stageName: stage?.name || 'Unknown',
        rules: rules.map(r => ({ id: r.id, description: r.description })),
        customerPreferences,
        currentOrder: currentOrder.length,
        availableFoodItems: FoodDeliveryService.searchFoodItems('', customerPreferences).length,
        pickupPoints: FoodDeliveryService.getPickupPoints().length
      }

      // Generate response using Ollama
      const ollamaResponse = await OllamaService.generateShopkeeperResponse(
        input,
        messages,
        context
      )

      // Parse the response to extract assets and commands
      const response = {
        content: ollamaResponse,
        assets: [], // Will be populated by parsing
        commands: [], // Will be populated by parsing
        nextStage: determineNextStage(input, stage, rules)
      }

      Logger.info('FoodDeliveryInterface', 'Ollama response generated successfully', {
        contentLength: response.content.length,
        nextStage: response.nextStage
      })

      return response
    } catch (error) {
      Logger.error('FoodDeliveryInterface', 'Failed to generate Ollama response', { error: error.message })
      throw error
    }
  }

  const determineNextStage = (input: string, stage: any, rules: any[]): string | undefined => {
    const inputLower = input.toLowerCase()
    const currentStageId = stage?.id || currentStage

    // Simple stage transition logic
    if (currentStageId === 'greeting' && (inputLower.includes('menu') || inputLower.includes('food') || inputLower.includes('order'))) {
      return 'menu_exploration'
    }
    if (currentStageId === 'menu_exploration' && (inputLower.includes('prefer') || inputLower.includes('diet'))) {
      return 'needs_assessment'
    }
    if (currentStageId === 'needs_assessment' && (inputLower.includes('nutrition') || inputLower.includes('health'))) {
      return 'nutrition_consultation'
    }
    if (currentStageId === 'menu_exploration' && (inputLower.includes('order') || inputLower.includes('add'))) {
      return 'order_placement'
    }

    return undefined
  }

  const processStageResponse = async (input: string, stage: any, rules: any[]): Promise<{
    content: string
    assets?: any[]
    commands?: any[]
    nextStage?: string
  }> => {
    Logger.debug('FoodDeliveryInterface', 'Processing stage response', {
      input,
      currentStage,
      stageId: stage?.id,
      stageName: stage?.name,
      rulesCount: rules.length
    })
    
    const inputLower = input.toLowerCase()
    
    // Stage-specific processing
    switch (currentStage) {
      case 'greeting':
        return processGreetingStage(input, stage, rules)
      case 'needs_assessment':
        return processNeedsAssessmentStage(input, stage, rules)
      case 'menu_exploration':
        return processMenuExplorationStage(input, stage, rules)
      case 'nutrition_consultation':
        return processNutritionConsultationStage(input, stage, rules)
      case 'order_placement':
        return processOrderPlacementStage(input, stage, rules)
      case 'delivery_setup':
        return processDeliverySetupStage(input, stage, rules)
      case 'privacy_consent':
        return processPrivacyConsentStage(input, stage, rules)
      case 'confirmation':
        return processConfirmationStage(input, stage, rules)
      default:
        return {
          content: 'I\'m here to help you with your food delivery needs. What would you like to do?',
          commands: [
            { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' },
            { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' }
          ]
        }
    }
  }

  const processGreetingStage = (input: string, stage: any, rules: any[]) => {
    const inputLower = input.toLowerCase()
    
    // Handle service explanation questions
    if (inputLower.includes('how') && (inputLower.includes('service') || inputLower.includes('work') || inputLower.includes('process'))) {
      return {
        content: 'I\'d be happy to explain how our service works! Our food delivery service works in 4 simple steps: 1) Tell us your dietary preferences and health goals, 2) Browse our curated menu of fresh, healthy meals, 3) Customize your order with special instructions, 4) Choose delivery or pickup and we handle the rest. We offer meal planning, nutrition consultation, and flexible delivery options.',
        assets: [{
          type: 'leading_question',
          title: 'Next Step',
          data: 'What would you like to do next?',
          interactive: true,
          clickable: true,
          action: 'leading_answer'
        }],
        commands: [
          { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' },
          { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' },
          { id: 'delivery_info', text: 'Delivery Info', icon: '🚚', action: 'delivery_info' }
        ],
        nextStage: 'service_explanation'
      }
    }
    
    if (inputLower.includes('menu') || inputLower.includes('food') || inputLower.includes('browse')) {
      return {
        content: 'Great! Let me show you our menu. We have both cooked meals and fresh ingredients available.',
        assets: [{
          type: 'menu_explorer',
          title: 'Menu Explorer',
          data: { items: FoodDeliveryService.searchFoodItems('', customerPreferences) }
        }],
        commands: [
          { id: 'cooked_meals', text: 'Cooked Meals', icon: '🍽️', action: 'show_cooked_meals' },
          { id: 'raw_ingredients', text: 'Raw Ingredients', icon: '🥬', action: 'show_raw_ingredients' },
          { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' }
        ],
        nextStage: 'menu_exploration'
      }
    }
    
    if (inputLower.includes('prefer') || inputLower.includes('diet') || inputLower.includes('restriction')) {
      return {
        content: 'I\'d love to learn about your preferences and dietary needs to recommend the best options for you.',
        assets: [{
          type: 'preferences_collector',
          title: 'Preferences Collector',
          data: { currentPreferences: customerPreferences }
        }],
        commands: [
          { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' },
          { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' }
        ],
        nextStage: 'needs_assessment'
      }
    }
    
    // For simple greetings like "hi", "hello" - stay in greeting stage
    if (inputLower === 'hi' || inputLower === 'hello' || inputLower === 'hey') {
      return {
        content: 'Hello! I\'m here to help you with your food delivery needs. What would you like to do?',
        assets: [{
          type: 'leading_question',
          title: 'Visit Purpose',
          data: 'What brings you here today?',
          interactive: true,
          clickable: true,
          action: 'leading_answer'
        }],
        commands: [
          { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' },
          { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' },
          { id: 'delivery_info', text: 'Delivery Info', icon: '🚚', action: 'delivery_info' }
        ]
      }
    }
    
    return {
      content: 'I\'m here to help you with your food delivery needs. What would you like to do?',
      commands: [
        { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' },
        { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' },
        { id: 'delivery_info', text: 'Delivery Info', icon: '🚚', action: 'delivery_info' }
      ]
    }
  }

  const processNeedsAssessmentStage = (input: string, stage: any, rules: any[]) => {
    return {
      content: 'Let me help you set up your preferences so I can recommend the perfect meals and ingredients for you.',
      assets: [{
        type: 'preferences_collector',
        title: 'Preferences Collector',
        data: { currentPreferences: customerPreferences }
      }],
      commands: [
        { id: 'save_preferences', text: 'Save Preferences', icon: '💾', action: 'save_preferences' },
        { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' }
      ]
    }
  }

  const processMenuExplorationStage = (input: string, stage: any, rules: any[]) => {
    Logger.debug('FoodDeliveryInterface', 'Processing menu exploration stage', {
      input,
      inputLower: input.toLowerCase(),
      stageId: stage?.id
    })
    
    const inputLower = input.toLowerCase()
    
    if (inputLower.includes('cooked') || inputLower.includes('meal')) {
      Logger.info('FoodDeliveryInterface', 'User requested cooked meals')
      const cookedItems = FoodDeliveryService.searchFoodItems('cooked', customerPreferences)
      return {
        content: 'Here are our delicious cooked meals, ready to enjoy!',
        assets: [{
          type: 'food_items',
          title: 'Cooked Meals',
          data: { items: cookedItems }
        }],
        commands: [
          { id: 'raw_ingredients', text: 'Raw Ingredients', icon: '🥬', action: 'show_raw_ingredients' },
          { id: 'add_to_order', text: 'Add to Order', icon: '➕', action: 'add_to_order' }
        ]
      }
    }
    
    if (inputLower.includes('raw') || inputLower.includes('ingredient')) {
      Logger.info('FoodDeliveryInterface', 'User requested raw ingredients')
      const rawItems = FoodDeliveryService.searchFoodItems('raw', customerPreferences)
      return {
        content: 'Here are our fresh, high-quality ingredients for your home cooking!',
        assets: [{
          type: 'food_items',
          title: 'Raw Ingredients',
          data: { items: rawItems }
        }],
        commands: [
          { id: 'cooked_meals', text: 'Cooked Meals', icon: '🍽️', action: 'show_cooked_meals' },
          { id: 'add_to_order', text: 'Add to Order', icon: '➕', action: 'add_to_order' }
        ]
      }
    }
    
    // Default menu exploration - show both options
    Logger.info('FoodDeliveryInterface', 'User wants to order - showing menu options')
    const cookedItems = FoodDeliveryService.searchFoodItems('cooked', customerPreferences)
    const rawItems = FoodDeliveryService.searchFoodItems('raw', customerPreferences)
    
    return {
      content: 'Great! I\'d love to help you place an order. What would you prefer?',
      assets: [
        {
          type: 'food_items',
          title: 'Cooked Meals (Ready to Eat)',
          data: { items: cookedItems.slice(0, 3) } // Show first 3 items
        },
        {
          type: 'food_items', 
          title: 'Fresh Ingredients (For Cooking)',
          data: { items: rawItems.slice(0, 3) } // Show first 3 items
        }
      ],
      commands: [
        { id: 'cooked_meals', text: 'Browse Cooked Meals', icon: '🍽️', action: 'show_cooked_meals' },
        { id: 'raw_ingredients', text: 'Browse Ingredients', icon: '🥬', action: 'show_raw_ingredients' },
        { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' }
      ]
    }
  }

  const processNutritionConsultationStage = (input: string, stage: any, rules: any[]) => {
    if (!customerPreferences) {
      return {
        content: 'I\'d be happy to provide nutrition advice! First, let me learn about your dietary preferences and health goals.',
        assets: [{
          type: 'preferences_collector',
          title: 'Preferences Collector',
          data: { currentPreferences: customerPreferences }
        }],
        commands: [
          { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' }
        ]
      }
    }
    
    const recommendations = FoodDeliveryService.getNutritionRecommendations(customerPreferences)
    return {
      content: 'Based on your preferences, here are some nutrition recommendations:',
      assets: [{
        type: 'nutrition_recommendations',
        title: 'Nutrition Recommendations',
        data: { recommendations }
      }],
      commands: [
        { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' },
        { id: 'add_to_order', text: 'Add to Order', icon: '➕', action: 'add_to_order' }
      ]
    }
  }

  const processOrderPlacementStage = (input: string, stage: any, rules: any[]) => {
    const orderSummary = FoodDeliveryService.calculateOrderTotal()
    
    if (currentOrder.length === 0) {
      return {
        content: 'Your order is empty. Let me show you some great options to add!',
        assets: [{
          type: 'food_items',
          title: 'Recommended Items',
          data: { items: FoodDeliveryService.getRecommendations(customerPreferences || {} as CustomerPreferences) }
        }],
        commands: [
          { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' },
          { id: 'add_to_order', text: 'Add to Order', icon: '➕', action: 'add_to_order' }
        ]
      }
    }
    
    return {
      content: 'Here\'s your current order. Ready to proceed with delivery setup?',
      assets: [{
        type: 'order_summary',
        title: 'Order Summary',
        data: { orderSummary }
      }],
      commands: [
        { id: 'setup_delivery', text: 'Setup Delivery', icon: '🚚', action: 'setup_delivery' },
        { id: 'add_more', text: 'Add More Items', icon: '➕', action: 'add_more_items' },
        { id: 'modify_order', text: 'Modify Order', icon: '✏️', action: 'modify_order' }
      ],
      nextStage: 'delivery_setup'
    }
  }

  const processDeliverySetupStage = (input: string, stage: any, rules: any[]) => {
    return {
      content: 'Let\'s set up your delivery preferences. You can choose pickup or delivery.',
      assets: [{
        type: 'delivery_setup',
        title: 'Delivery Setup',
        data: { 
          pickupPoints: FoodDeliveryService.getAvailablePickupPoints(),
          deliveryZones: FoodDeliveryService.getDeliveryZones(),
          currentPreferences: deliveryPreferences
        }
      }],
      commands: [
        { id: 'save_delivery', text: 'Save Delivery', icon: '💾', action: 'save_delivery' },
        { id: 'back_to_order', text: 'Back to Order', icon: '⬅️', action: 'back_to_order' }
      ]
    }
  }

  const processPrivacyConsentStage = (input: string, stage: any, rules: any[]) => {
    return {
      content: 'Before we finalize your order, I need to get your consent for our privacy policy and collect your contact information.',
      assets: [{
        type: 'privacy_consent',
        title: 'Privacy Consent',
        data: { 
          privacyPolicy: KnowledgeBase.searchKnowledge('privacy policy')[0],
          deliveryPolicies: KnowledgeBase.getDeliveryPolicies()
        }
      }],
      commands: [
        { id: 'give_consent', text: 'Give Consent', icon: '✅', action: 'give_consent' },
        { id: 'review_policy', text: 'Review Policy', icon: '📄', action: 'review_policy' }
      ]
    }
  }

  const processConfirmationStage = (input: string, stage: any, rules: any[]) => {
    const orderSummary = FoodDeliveryService.calculateOrderTotal()
    const validation = FoodDeliveryService.validateOrder()
    
    if (!validation.isValid) {
      return {
        content: `I need to fix a few things before we can complete your order: ${validation.errors.join(', ')}`,
        commands: [
          { id: 'fix_issues', text: 'Fix Issues', icon: '🔧', action: 'fix_issues' },
          { id: 'back_to_order', text: 'Back to Order', icon: '⬅️', action: 'back_to_order' }
        ]
      }
    }
    
    return {
      content: 'Perfect! Your order is ready. Here\'s your confirmation:',
      assets: [{
        type: 'order_confirmation',
        title: 'Order Confirmation',
        data: { orderSummary, orderNumber: `FD-${Date.now()}` }
      }],
      commands: [
        { id: 'complete_order', text: 'Complete Order', icon: '✅', action: 'complete_order' },
        { id: 'modify_order', text: 'Modify Order', icon: '✏️', action: 'modify_order' }
      ]
    }
  }

  const handleCommandClick = (action: string) => {
    addDebugLog('Command clicked', { action })
    
    switch (action) {
      case 'browse_menu':
        setCurrentStage('menu_exploration')
        handleSendMessage()
        break
      case 'set_preferences':
        setShowPreferences(true)
        break
      case 'view_order':
        setShowOrderSummary(true)
        break
      case 'delivery_info':
        // Show delivery information
        break
      case 'save_preferences':
        setShowPreferences(false)
        break
      case 'setup_delivery':
        setShowDeliverySetup(true)
        break
      case 'save_delivery':
        setShowDeliverySetup(false)
        break
      case 'complete_order':
        const orderSummary = FoodDeliveryService.calculateOrderTotal()
        onOrderComplete?.(orderSummary)
        break
      default:
        addDebugLog('Unknown command', { action })
    }
  }

  const handleAssetClick = (action: string, data: any) => {
    addDebugLog('Asset clicked', { action, data })
    
    switch (action) {
      case 'add_to_order':
        if (data.item) {
          FoodDeliveryService.addToOrder(data.item, data.quantity || 1, data.customizations || [], data.specialInstructions || '')
          setCurrentOrder(FoodDeliveryService.getCurrentOrder())
        }
        break
      case 'remove_from_order':
        if (data.itemId) {
          FoodDeliveryService.removeFromOrder(data.itemId)
          setCurrentOrder(FoodDeliveryService.getCurrentOrder())
        }
        break
      case 'update_quantity':
        if (data.itemId && data.quantity) {
          FoodDeliveryService.updateOrderQuantity(data.itemId, data.quantity)
          setCurrentOrder(FoodDeliveryService.getCurrentOrder())
        }
        break
      case 'interview_answer':
        if (data.question && data.answer) {
          addDebugLog('Interview question answered', { question: data.question, answer: data.answer })
          // Process the answer and potentially move to next stage
          const answerMessage = `I answered: ${data.answer}`
          setInputValue(answerMessage)
          handleSendMessage()
        }
        break
      case 'leading_answer':
        if (data.question && data.answer) {
          addDebugLog('Leading question answered', { question: data.question, answer: data.answer })
          // Process the answer and potentially move to next stage
          const answerMessage = `I answered: ${data.answer}`
          setInputValue(answerMessage)
          handleSendMessage()
        }
        break
      case 'select_item':
        if (data.item) {
          addDebugLog('Item selected', { item: data.item })
          // Process item selection
          const selectionMessage = `I'm interested in: ${data.item}`
          setInputValue(selectionMessage)
          handleSendMessage()
        }
        break
      case 'update_preferences':
        addDebugLog('Update preferences requested', { data })
        setShowPreferences(true)
        break
      case 'modify_order':
        addDebugLog('Modify order requested', { data })
        // Show order modification interface
        break
      case 'setup_delivery':
        addDebugLog('Setup delivery requested', { data })
        setShowDeliverySetup(true)
        break
      case 'answer_question':
        if (data.question && data.answer) {
          addDebugLog('Question answered', { question: data.question, answer: data.answer })
          const answerMessage = `I answered: ${data.answer}`
          setInputValue(answerMessage)
          handleSendMessage()
        }
        break
      case 'interact':
        addDebugLog('Asset interaction', { data })
        // Handle generic asset interaction
        break
      case 'select_service':
        addDebugLog('Service selected', { action, data })
        // Handle service selection - could transition to appropriate stage
        if (data.service === 'meal_planning' || data.service === 'delivery_service') {
          setCurrentStage('needs_assessment')
          handleSendMessage()
        } else if (data.service === 'nutrition_consultation') {
          setCurrentStage('nutrition_consultation')
          handleSendMessage()
        }
        break
      default:
        addDebugLog('Unknown asset action', { action, data })
    }
  }

  const handlePreferencesSet = (preferences: CustomerPreferences) => {
    setCustomerPreferences(preferences)
    FoodDeliveryService.setCustomerPreferences(preferences)
    setShowPreferences(false)
    addDebugLog('Preferences set', { preferences })
  }

  const handlePreferencesStepComplete = (step: number, data: any) => {
    setPreferencesData(prev => ({ ...prev, ...data }))
    if (step < 4) {
      setPreferencesStep(step + 1)
    } else {
      setCustomerPreferences(preferencesData)
      setPreferencesStep(1)
      addDebugLog('Progressive preferences completed', { step, data })
    }
  }

  const handleDeliverySet = (preferences: DeliveryPreferences) => {
    setDeliveryPreferences(preferences)
    FoodDeliveryService.setDeliveryPreferences(preferences)
    setShowDeliverySetup(false)
    addDebugLog('Delivery preferences set', { preferences })
  }

  const renderEnhancedAsset = (asset: any) => {
    const { type, title, parameters, interactive, clickable, action } = asset
    
    switch (type) {
      case 'food_items':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {parameters.items?.map((item: FoodItem, index: number) => (
              <FoodItemCard
                key={item.id || `item-${index}`}
                item={item}
                onAddToOrder={(item, quantity, customizations, specialInstructions) => 
                  handleAssetClick(action || 'add_to_order', { item, quantity, customizations, specialInstructions })
                }
                onViewDetails={(item) => console.log('View details:', item)}
              />
            ))}
          </div>
        )
        case 'preferences_collector':
          return (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
              <ProgressivePreferencesCollector
                onPreferencesSet={handlePreferencesSet}
                onStepComplete={handlePreferencesStepComplete}
                currentStep={preferencesStep}
                totalSteps={parameters.totalSteps || 4}
                initialPreferences={parameters.currentPreferences}
              />
            </div>
          )
      case 'order_summary':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <OrderSummaryComponent
              items={parameters.items}
              subtotal={parameters.subtotal}
              deliveryFee={parameters.deliveryFee}
              tax={parameters.tax}
              total={parameters.total}
              onUpdateQuantity={(itemId, quantity) => 
                handleAssetClick('update_quantity', { itemId, quantity })
              }
              onRemoveItem={(itemId) => 
                handleAssetClick('remove_from_order', { itemId })
              }
            />
          </div>
        )
      case 'delivery_setup':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <DeliverySetup
              pickupPoints={parameters.pickupPoints}
              deliveryZones={parameters.deliveryZones}
              onDeliverySet={handleDeliverySet}
              initialPreferences={parameters.currentPreferences}
            />
          </div>
        )
      case 'nutrition_advice':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">{title}</h3>
            <p className="text-green-700 mb-3">{parameters.advice}</p>
            {parameters.recommendations && (
              <ul className="list-disc list-inside text-green-600 space-y-1">
                {parameters.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            )}
          </div>
        )
      case 'service_overview':
        return (
          <ServiceOverview
            onServiceSelected={(service) => handleAssetClick('select_service', { service })}
          />
        )
      case 'interview_question':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">{title}</h3>
            <p className="text-blue-700 mb-3">{parameters.question}</p>
            {parameters.options && parameters.options.length > 0 ? (
              <div className="space-y-2">
                {parameters.options.map((option: any, index: number) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 bg-white border border-blue-200 rounded hover:bg-blue-50"
                    onClick={() => handleAssetClick('interview_answer', { question: title, answer: option.value || option })}
                  >
                    {option.label || option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  className="w-full text-left px-4 py-2 bg-white border border-blue-200 rounded hover:bg-blue-50"
                  onClick={() => handleAssetClick('interview_answer', { question: title, answer: 'answered' })}
                >
                  Click to answer
                </button>
              </div>
            )}
          </div>
        )
      case 'leading_question':
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">{title}</h3>
            <p className="text-purple-700 mb-3">{parameters.question}</p>
            {parameters.options && parameters.options.length > 0 ? (
              <div className="space-y-2">
                {parameters.options.map((option: any, index: number) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 bg-white border border-purple-200 rounded hover:bg-purple-50"
                    onClick={() => handleAssetClick('leading_answer', { question: title, answer: option.value || option })}
                  >
                    {option.label || option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  className="w-full text-left px-4 py-2 bg-white border border-purple-200 rounded hover:bg-purple-50"
                  onClick={() => handleAssetClick('leading_answer', { question: title, answer: 'answered' })}
                >
                  Click to answer
                </button>
              </div>
            )}
          </div>
        )
      case 'product_card':
        return (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-orange-800">{parameters.name || title}</h3>
              {parameters.price && (
                <span className="text-lg font-semibold text-orange-600">${parameters.price}</span>
              )}
            </div>
            <p className="text-orange-700 mb-4 leading-relaxed">{parameters.description}</p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                onClick={() => handleAssetClick('add_to_order', { product: parameters.name, description: parameters.description })}
              >
                Add to Order
              </button>
              <button
                className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
                onClick={() => handleAssetClick('view_product', { product: parameters.name })}
              >
                View Details
              </button>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">Enhanced asset type: {type}</p>
            {interactive && (
              <button 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleAssetClick(action || 'interact', { asset })}
              >
                {clickable ? 'Click to interact' : 'View details'}
              </button>
            )}
          </div>
        )
    }
  }

  const renderAsset = (asset: any) => {
    // Handle enhanced asset templates with parameters
    if (asset.parameters) {
      return renderEnhancedAsset(asset)
    }
    
    // Fallback to legacy asset format
    switch (asset.type) {
      case 'food_items':
        return (
          <div className="space-y-4">
            {(asset.data?.items || asset.parameters?.items || []).map((item: FoodItem, index: number) => (
              <FoodItemCard
                key={item.id || `item-${index}`}
                item={item}
                onAddToOrder={(item, quantity, customizations, specialInstructions) => 
                  handleAssetClick('add_to_order', { item, quantity, customizations, specialInstructions })
                }
                onViewDetails={(item) => console.log('View details:', item)}
              />
            ))}
          </div>
        )
      case 'order_summary':
        const orderData = asset.data?.orderSummary || asset.parameters
        return (
          <OrderSummaryComponent
            items={orderData.items}
            subtotal={orderData.subtotal}
            deliveryFee={orderData.deliveryFee}
            tax={orderData.tax}
            total={orderData.total}
            onUpdateQuantity={(itemId, quantity) => 
              handleAssetClick('update_quantity', { itemId, quantity })
            }
            onRemoveItem={(itemId) => 
              handleAssetClick('remove_from_order', { itemId })
            }
          />
        )
      case 'preferences_collector':
        return (
          <div>
            {asset.parameters?.progressive ? (
              <ProgressivePreferencesCollector
                onPreferencesSet={handlePreferencesSet}
                onStepComplete={handlePreferencesStepComplete}
                currentStep={preferencesStep}
                totalSteps={asset.parameters?.totalSteps || 4}
                initialPreferences={asset.data?.currentPreferences || asset.parameters?.currentPreferences}
              />
            ) : (
              <ProgressivePreferencesCollector
                onPreferencesSet={handlePreferencesSet}
                onStepComplete={handlePreferencesStepComplete}
                currentStep={preferencesStep}
                totalSteps={4}
                initialPreferences={asset.data?.currentPreferences || asset.parameters?.currentPreferences}
              />
            )}
          </div>
        )
      case 'delivery_setup':
        return (
          <DeliverySetup
            pickupPoints={asset.data?.pickupPoints || asset.parameters?.pickupPoints}
            deliveryZones={asset.data?.deliveryZones || asset.parameters?.deliveryZones}
            onDeliverySet={handleDeliverySet}
            initialPreferences={asset.data?.currentPreferences || asset.parameters?.currentPreferences}
          />
        )
      case 'nutrition_advice':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">{asset.title || 'Nutrition Information'}</h3>
            <p className="text-green-700 mb-3">{asset.data?.advice || asset.parameters?.advice}</p>
            {(asset.data?.recommendations || asset.parameters?.recommendations) && (
              <ul className="list-disc list-inside text-green-600 space-y-1">
                {(asset.data?.recommendations || asset.parameters?.recommendations).map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            )}
          </div>
        )
      case 'service_overview':
        return (
          <ServiceOverview
            onServiceSelected={(service) => handleAssetClick('select_service', { service })}
          />
        )
      case 'interview_question':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">{asset.title || 'Question'}</h3>
            <p className="text-blue-700 mb-3">{asset.data?.question || asset.parameters?.question}</p>
            {asset.data?.options && (
              <div className="space-y-2">
                {asset.data.options.map((option: any, index: number) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 bg-white border border-blue-200 rounded hover:bg-blue-50"
                    onClick={() => handleAssetClick('interview_answer', { question: asset.title, answer: option.value || option })}
                  >
                    {option.label || option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      case 'leading_question':
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">{asset.title || 'Question'}</h3>
            <p className="text-purple-700 mb-3">{asset.data?.question || asset.parameters?.question}</p>
            {asset.data?.options && (
              <div className="space-y-2">
                {asset.data.options.map((option: any, index: number) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 bg-white border border-purple-200 rounded hover:bg-purple-50"
                    onClick={() => handleAssetClick('leading_answer', { question: asset.title, answer: option.value || option })}
                  >
                    {option.label || option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Food Delivery Concierge</h1>
            <p className="text-gray-600">Your personal assistant for premium food delivery</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-600">
                {ollamaConnected ? 'Ollama Connected' : 'Playbook Mode'}
              </span>
            </div>
            <button
              onClick={checkOllamaConnection}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
            >
              Check Ollama
            </button>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              {showDebug ? 'Hide' : 'Debug'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  
                  {/* Render Assets */}
                  {message.assets?.map((asset, index) => (
                    <div key={index} className="mt-4">
                      {renderAsset(asset)}
                    </div>
                  ))}
                  
                  {/* Render Contextual Commands */}
                  {message.contextualCommands && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.contextualCommands.map((command) => (
                        <button
                          key={command.id}
                          onClick={() => handleCommandClick(command.action)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 flex items-center space-x-1"
                        >
                          <span>{command.icon}</span>
                          <span>{command.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Structured Question Card */}
            {currentQuestion && (
              <div className="flex justify-start">
                <div className="max-w-3xl w-full">
                  {console.log('🔍 FoodDeliveryInterface - Rendering StructuredQuestionCard with question:', currentQuestion)}
                  <StructuredQuestionCard
                    question={currentQuestion}
                    onAnswer={handleQuestionAnswer}
                    onSkip={handleQuestionSkip}
                  />
                </div>
              </div>
            )}
            {!currentQuestion && console.log('❌ FoodDeliveryInterface - No currentQuestion, not rendering StructuredQuestionCard')}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about our menu, set preferences, or place an order..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <div className="w-96 bg-gray-100 border-l border-gray-200 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Debug Logs</h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearDebugLogs}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Clear UI
                </button>
                <button
                  onClick={() => Logger.clearLogs()}
                  className="px-2 py-1 bg-red-200 text-red-700 rounded text-sm hover:bg-red-300"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            {/* Enhanced Ollama Context */}
            <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
              <div className="font-medium mb-1">Enhanced Ollama Context:</div>
              {(() => {
                const context = EnhancedFoodDeliveryOllama.getContext()
                if (!context) return <div>No context available</div>
                return (
                  <div>
                    <div>Session: {context.sessionId}</div>
                    <div>Stage: {context.currentStage}</div>
                    <div>Interactions: {context.totalInteractions}</div>
                    <div>Intent: {context.userIntent}</div>
                    <div>Has Preferences: {context.customerPreferences ? 'Yes' : 'No'}</div>
                    <div>Has Order: {context.currentOrder?.length > 0 ? 'Yes' : 'No'}</div>
                    <div>Has Delivery: {context.deliveryPreferences ? 'Yes' : 'No'}</div>
                    <div>Goals: {context.conversationGoals.join(', ') || 'None'}</div>
                  </div>
                )
              })()}
            </div>

            {/* Logger Stats */}
            <div className="mb-4 p-2 bg-white rounded text-xs">
              <div className="font-medium mb-1">Logger Stats:</div>
              <div>{Logger.getStats().total} total logs</div>
              <div>Errors: {Logger.getStats().byLevel.error || 0}</div>
              <div>Warnings: {Logger.getStats().byLevel.warn || 0}</div>
            </div>

            {/* Recent Logs */}
            <div className="space-y-2">
              <div className="font-medium text-sm">Recent Logs:</div>
              {Logger.getRecentLogs(20).map((log, index) => (
                <div key={index} className={`p-2 rounded text-xs ${
                  log.level === 'error' ? 'bg-red-50 border-l-2 border-red-400' :
                  log.level === 'warn' ? 'bg-yellow-50 border-l-2 border-yellow-400' :
                  log.level === 'debug' ? 'bg-blue-50 border-l-2 border-blue-400' :
                  'bg-white'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-gray-900">
                      [{log.timestamp.split('T')[1].split('.')[0]}] [{log.level.toUpperCase()}] [{log.category}]
                    </div>
                    <div className="text-gray-500 text-xs">{log.message}</div>
                  </div>
                  {log.data && (
                    <pre className="mt-1 text-gray-600 overflow-x-auto text-xs">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Set Your Preferences</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ProgressivePreferencesCollector
                onPreferencesSet={handlePreferencesSet}
                onStepComplete={handlePreferencesStepComplete}
                currentStep={preferencesStep}
                totalSteps={4}
                initialPreferences={customerPreferences || undefined}
              />
            </div>
          </div>
        </div>
      )}

      {showDeliverySetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Delivery Setup</h2>
                <button
                  onClick={() => setShowDeliverySetup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <DeliverySetup
                pickupPoints={FoodDeliveryService.getAvailablePickupPoints()}
                deliveryZones={FoodDeliveryService.getDeliveryZones()}
                onDeliverySet={handleDeliverySet}
                initialPreferences={deliveryPreferences || undefined}
              />
            </div>
          </div>
        </div>
      )}

      {showOrderSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <button
                  onClick={() => setShowOrderSummary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <OrderSummaryComponent
                items={currentOrder}
                subtotal={FoodDeliveryService.calculateOrderTotal().subtotal}
                deliveryFee={FoodDeliveryService.calculateOrderTotal().deliveryFee}
                tax={FoodDeliveryService.calculateOrderTotal().tax}
                total={FoodDeliveryService.calculateOrderTotal().total}
                onUpdateQuantity={(itemId, quantity) => 
                  handleAssetClick('update_quantity', { itemId, quantity })
                }
                onRemoveItem={(itemId) => 
                  handleAssetClick('remove_from_order', { itemId })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodDeliveryInterface
