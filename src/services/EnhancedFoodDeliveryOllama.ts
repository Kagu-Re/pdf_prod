import { OllamaService } from './OllamaService'
import { PlaybookSystem } from './PlaybookSystem'
import { KnowledgeBase } from './KnowledgeBase'
import { FoodDeliveryService } from './FoodDeliveryService'
import { BrowserResponseConverter } from './BrowserResponseConverter'
import Logger from '../utils/Logger'

export interface PersistentContext {
  conversationHistory: any[]
  currentStage: string
  customerPreferences: any
  currentOrder: any[]
  deliveryPreferences: any
  sessionId: string
  startTime: Date
  lastInteraction: Date
  totalInteractions: number
  stageTransitions: Array<{ from: string; to: string; timestamp: Date }>
  userIntent: string
  conversationGoals: string[]
  contextFlags: Record<string, boolean>
  answeredQuestions: string[]
  questionAnswers: Record<string, string>
  previousStage?: string
}

export interface AssetTemplate {
  type: string
  title: string
  parameters: Record<string, any>
  interactive: boolean
  clickable: boolean
  action?: string
}

export interface OllamaResponse {
  content: string
  assets: AssetTemplate[]
  commands: any[]
  nextStage?: string
  contextUpdates: Partial<PersistentContext>
  confidence: number
  reasoning: string
}

class EnhancedFoodDeliveryOllama {
  private static persistentContext: PersistentContext | null = null

  static initializeContext(sessionId: string): PersistentContext {
    console.log('🔍 EnhancedFoodDeliveryOllama.initializeContext called with sessionId:', sessionId)
    
    this.persistentContext = {
      conversationHistory: [],
      currentStage: 'greeting',
      customerPreferences: null,
      currentOrder: [],
      deliveryPreferences: null,
      sessionId,
      startTime: new Date(),
      lastInteraction: new Date(),
      totalInteractions: 0,
      stageTransitions: [],
      userIntent: 'unknown',
      conversationGoals: [],
      contextFlags: {},
      answeredQuestions: [],
      questionAnswers: {}
    }
    
    console.log('✅ EnhancedFoodDeliveryOllama.initializeContext - Context initialized:', this.persistentContext)
    Logger.info('EnhancedFoodDeliveryOllama', 'Context initialized', { sessionId })
    return this.persistentContext
  }

  static updateContext(updates: Partial<PersistentContext>): void {
    if (!this.persistentContext) return

    // Track stage transitions
    if (updates.currentStage && updates.currentStage !== this.persistentContext.currentStage) {
      this.persistentContext.previousStage = this.persistentContext.currentStage
    }

    // Analyze user intent based on input
    if (updates.conversationHistory && updates.conversationHistory.length > 0) {
      const lastMessage = updates.conversationHistory[updates.conversationHistory.length - 1]
      if (lastMessage.role === 'user') {
        const userInput = lastMessage.content.toLowerCase()
        
        // Update user intent based on what they're saying
        if (userInput.includes('try') || userInput.includes('start') || userInput.includes('begin')) {
          this.persistentContext.userIntent = 'wanting_to_order'
        } else if (userInput.includes('how') || userInput.includes('what') || userInput.includes('explain')) {
          this.persistentContext.userIntent = 'seeking_information'
        } else if (userInput.includes('order') || userInput.includes('buy') || userInput.includes('purchase')) {
          this.persistentContext.userIntent = 'wanting_to_order'
        } else if (userInput.includes('menu') || userInput.includes('food') || userInput.includes('meal')) {
          this.persistentContext.userIntent = 'browsing_menu'
        }
      }
    }

    this.persistentContext = {
      ...this.persistentContext,
      ...updates,
      lastInteraction: new Date(),
      totalInteractions: this.persistentContext.totalInteractions + 1
    }

    Logger.debug('EnhancedFoodDeliveryOllama', 'Context updated', { 
      updates: Object.keys(updates),
      totalInteractions: this.persistentContext.totalInteractions,
      conversationHistoryLength: this.persistentContext.conversationHistory.length,
      userIntent: this.persistentContext.userIntent,
      currentStage: this.persistentContext.currentStage,
      previousStage: this.persistentContext.previousStage
    })
  }

  static getNextQuestion(): any {
    console.log('🔍 EnhancedFoodDeliveryOllama.getNextQuestion called')
    
    if (!this.persistentContext) {
      console.log('❌ EnhancedFoodDeliveryOllama.getNextQuestion - No persistent context')
      return null
    }

    const answeredQuestions = this.persistentContext.answeredQuestions || []
    const currentStage = this.persistentContext.currentStage
    
    console.log('📋 EnhancedFoodDeliveryOllama.getNextQuestion - Context:', {
      currentStage,
      answeredQuestions,
      totalInteractions: this.persistentContext.totalInteractions
    })
    
    const nextQuestion = PlaybookSystem.getNextQuestion(currentStage, answeredQuestions)
    
    console.log('📋 EnhancedFoodDeliveryOllama.getNextQuestion - Next question from PlaybookSystem:', nextQuestion)

    if (nextQuestion) {
      console.log('✅ EnhancedFoodDeliveryOllama.getNextQuestion - Question found:', {
        id: nextQuestion.id,
        question: nextQuestion.question,
        answerOptions: nextQuestion.answerOptions,
        required: nextQuestion.required
      })
      Logger.debug('EnhancedFoodDeliveryOllama', 'Next question determined', {
        stage: this.persistentContext.currentStage,
        questionId: nextQuestion.id,
        question: nextQuestion.question,
        answerOptions: nextQuestion.answerOptions,
        required: nextQuestion.required
      })
    } else {
      console.log('❌ EnhancedFoodDeliveryOllama.getNextQuestion - No question found')
    }

    return nextQuestion
  }

  static answerQuestion(questionId: string, answer: string): boolean {
    if (!this.persistentContext) return false

    const isValid = PlaybookSystem.validateAnswer(
      this.persistentContext.currentStage, 
      questionId, 
      answer
    )

    if (isValid) {
      // Add to answered questions
      if (!this.persistentContext.answeredQuestions) {
        this.persistentContext.answeredQuestions = []
      }
      
      if (!this.persistentContext.answeredQuestions.includes(questionId)) {
        this.persistentContext.answeredQuestions.push(questionId)
      }

      // Store the answer
      if (!this.persistentContext.questionAnswers) {
        this.persistentContext.questionAnswers = {}
      }
      this.persistentContext.questionAnswers[questionId] = answer

      Logger.debug('EnhancedFoodDeliveryOllama', 'Question answered', {
        questionId,
        answer,
        stage: this.persistentContext.currentStage,
        totalAnswered: this.persistentContext.answeredQuestions.length
      })

      // Check if we should progress to the next stage
      // Note: Stage progression is now handled by the UI component
      // this.checkAndProgressStage()

      return true
    }

    Logger.warn('EnhancedFoodDeliveryOllama', 'Invalid answer provided', {
      questionId,
      answer,
      stage: this.persistentContext.currentStage
    })

    return false
  }

  static checkAndProgressStage(): void {
    if (!this.persistentContext) return

    console.log('🔍 EnhancedFoodDeliveryOllama.checkAndProgressStage called')
    console.log('📋 Current stage:', this.persistentContext.currentStage)
    console.log('📋 Answered questions:', this.persistentContext.answeredQuestions)
    console.log('📋 Question answers:', this.persistentContext.questionAnswers)

    const currentStage = this.persistentContext.currentStage
    const answeredQuestions = this.persistentContext.answeredQuestions || []
    
    // Get stage completion status
    const completionStatus = PlaybookSystem.getStageCompletionStatus(currentStage, answeredQuestions)
    console.log('📋 Stage completion status:', completionStatus)

    if (completionStatus.completed) {
      console.log('✅ Stage completed, determining next stage')
      
      // Determine next stage based on user answers and current stage
      const nextStage = this.determineNextStageFromAnswers(currentStage, this.persistentContext.questionAnswers)
      console.log('📋 Next stage determined:', nextStage)

      if (nextStage && nextStage !== currentStage) {
        console.log('🔄 Progressing to next stage:', nextStage)
        this.persistentContext.currentStage = nextStage
        this.persistentContext.stageTransitions.push({
          from: currentStage,
          to: nextStage,
          timestamp: new Date()
        })
        
        Logger.info('EnhancedFoodDeliveryOllama', 'Stage progressed', {
          from: currentStage,
          to: nextStage,
          answeredQuestions: answeredQuestions.length
        })
      }
    } else {
      console.log('⏳ Stage not yet completed, staying in current stage')
    }
  }

  static determineNextStageFromAnswers(currentStage: string, answers: Record<string, string>): string | null {
    console.log('🔍 EnhancedFoodDeliveryOllama.determineNextStageFromAnswers called with:', { currentStage, answers })

    // Stage-specific progression logic based on answers
    switch (currentStage) {
      case 'greeting':
        const visitPurpose = answers['visit_purpose']
        console.log('📋 Visit purpose answer:', visitPurpose)
        
        if (visitPurpose) {
          if (visitPurpose.includes('order food') || visitPurpose.includes('meal planning')) {
            console.log('✅ User wants to order, progressing to needs_assessment')
            return 'needs_assessment'
          } else if (visitPurpose.includes('learn about') || visitPurpose.includes('browsing')) {
            console.log('✅ User wants to learn, progressing to service_overview')
            return 'service_overview'
          } else if (visitPurpose.includes('nutrition advice')) {
            console.log('✅ User wants nutrition advice, progressing to nutrition_consultation')
            return 'nutrition_consultation'
          }
        }
        break

      case 'needs_assessment':
        console.log('✅ Needs assessment completed, progressing to menu_exploration')
        return 'menu_exploration'

      case 'service_overview':
        console.log('✅ Service overview completed, progressing to needs_assessment')
        return 'needs_assessment'

      case 'nutrition_consultation':
        console.log('✅ Nutrition consultation completed, progressing to menu_exploration')
        return 'menu_exploration'

      default:
        console.log('❌ No progression logic for stage:', currentStage)
        return null
    }

    return null
  }

  static getContext(): PersistentContext | null {
    return this.persistentContext
  }

  static getStageCompletionStatus(): any {
    if (!this.persistentContext) return null

    const answeredQuestions = this.persistentContext.answeredQuestions || []
    return PlaybookSystem.getStageCompletionStatus(
      this.persistentContext.currentStage,
      answeredQuestions
    )
  }

  static async generateResponse(
    userInput: string,
    currentStage: string,
    rules: any[]
  ): Promise<OllamaResponse> {
    if (!this.persistentContext) {
      throw new Error('Context not initialized')
    }

    Logger.info('EnhancedFoodDeliveryOllama', 'Generating enhanced response', {
      userInput,
      currentStage,
      rulesCount: rules.length,
      totalInteractions: this.persistentContext.totalInteractions
    })

    try {
      // Build comprehensive context for Ollama
      const context = this.buildOllamaContext(userInput, currentStage, rules)
      
      // Generate response using Ollama with enhanced prompting
      const ollamaResponse = await this.callOllamaWithContext(userInput, context)
      
      // Parse response and extract assets, commands, and context updates
      const parsedResponse = await this.parseOllamaResponse(ollamaResponse, currentStage)
      
      // Update persistent context
      this.updateContext(parsedResponse.contextUpdates)
      
      // Log stage transition if it occurred
      if (parsedResponse.nextStage && parsedResponse.nextStage !== currentStage) {
        Logger.info('EnhancedFoodDeliveryOllama', 'Stage transition initiated', {
          from: currentStage,
          to: parsedResponse.nextStage,
          userInput: userInput.substring(0, 50),
          reasoning: parsedResponse.reasoning
        })
      }
      
      // Log the complete interaction
      this.logInteraction(userInput, parsedResponse, context)

      return parsedResponse
    } catch (error) {
      Logger.error('EnhancedFoodDeliveryOllama', 'Failed to generate response', { error: error instanceof Error ? error.message : String(error) })
      throw error
    }
  }

  private static buildOllamaContext(userInput: string, currentStage: string, rules: any[]): any {
    const playbook = PlaybookSystem.getPlaybook('food-delivery-concierge')
    const stage = playbook?.stages.find((s: any) => s.id === currentStage)
    const knowledge = KnowledgeBase.searchKnowledge(userInput)
    
    // Build the enhanced system prompt
    const enhancedSystemPrompt = this.buildEnhancedSystemPrompt({
      persistentContext: this.persistentContext,
      userInput,
      currentStage,
      stageInfo: stage,
      applicableRules: rules,
      availableFoodItems: FoodDeliveryService.searchFoodItems('', this.persistentContext?.customerPreferences),
      pickupPoints: FoodDeliveryService.getAvailablePickupPoints(),
      deliveryZones: FoodDeliveryService.getDeliveryZones(),
      relevantKnowledge: knowledge,
      playbookGoals: playbook?.goals || [],
      successCriteria: playbook?.successCriteria || [],
      isFirstInteraction: this.persistentContext?.totalInteractions === 0,
      hasPreferences: !!this.persistentContext?.customerPreferences,
      hasOrder: (this.persistentContext?.currentOrder?.length || 0) > 0,
      hasDeliverySetup: !!this.persistentContext?.deliveryPreferences,
      conversationHistory: this.persistentContext?.conversationHistory || []
    })
    
    return {
      // Persistent context
      persistentContext: this.persistentContext,
      
      // Current interaction
      userInput,
      currentStage,
      stageInfo: stage,
      applicableRules: rules,
      
      // Available data
      availableFoodItems: FoodDeliveryService.searchFoodItems('', this.persistentContext?.customerPreferences),
      pickupPoints: FoodDeliveryService.getAvailablePickupPoints(),
      deliveryZones: FoodDeliveryService.getDeliveryZones(),
      
      // Knowledge base
      relevantKnowledge: knowledge,
      
      // Playbook information
      playbookGoals: playbook?.goals || [],
      successCriteria: playbook?.successCriteria || [],
      
      // Context flags
      isFirstInteraction: this.persistentContext?.totalInteractions === 0,
      hasPreferences: !!this.persistentContext?.customerPreferences,
      hasOrder: (this.persistentContext?.currentOrder?.length || 0) > 0,
      hasDeliverySetup: !!this.persistentContext?.deliveryPreferences,
      
      // Enhanced system prompt for OllamaService
      enhancedSystemPrompt: enhancedSystemPrompt
    }
  }

  private static async callOllamaWithContext(userInput: string, context: any): Promise<string> {
    // COMPREHENSIVE DEBUGGING
    console.log('=== ENHANCED SYSTEM PROMPT DEBUG ===')
    console.log('System Prompt Length:', context.enhancedSystemPrompt?.length || 0)
    console.log('System Prompt Preview:', context.enhancedSystemPrompt?.substring(0, 500) || 'No enhanced prompt')
    console.log('=== END SYSTEM PROMPT DEBUG ===')
    
    console.log('=== OLLAMA CONTEXT DEBUG ===')
    console.log('User Input:', userInput)
    console.log('Current Stage:', context.currentStage)
    console.log('Stage Info:', JSON.stringify(context.stageInfo, null, 2))
    console.log('Required Tools:', context.stageInfo?.requiredTools)
    console.log('Optional Tools:', context.stageInfo?.optionalTools)
    console.log('Applicable Rules Count:', context.applicableRules?.length)
    console.log('Knowledge Base Results:', context.relevantKnowledge?.length || 0, 'items')
    console.log('Available Food Items Count:', context.availableFoodItems?.length || 0)
    console.log('Pickup Points Count:', context.pickupPoints?.length || 0)
    console.log('Delivery Zones Count:', context.deliveryZones?.length || 0)
    console.log('=== END OLLAMA CONTEXT DEBUG ===')
    
    Logger.debug('EnhancedFoodDeliveryOllama', 'Calling Ollama with enhanced context', {
      contextKeys: Object.keys(context),
      systemPromptLength: context.enhancedSystemPrompt?.length || 0,
      userInput,
      conversationHistoryLength: this.persistentContext?.conversationHistory?.length || 0,
      stageInfo: context.stageInfo,
      requiredTools: context.stageInfo?.requiredTools,
      knowledgeResults: context.relevantKnowledge?.length || 0
    })

    try {
      Logger.debug('EnhancedFoodDeliveryOllama', 'About to call Ollama', {
        userInput,
        conversationHistoryLength: this.persistentContext?.conversationHistory?.length || 0,
        contextKeys: Object.keys(context),
        stageId: context.currentStage,
        requiredTools: context.stageInfo?.requiredTools
      })
      
      const response = await OllamaService.generateFoodDeliveryResponse(
        userInput,
        this.persistentContext?.conversationHistory || [],
        context
      )
      
      // COMPREHENSIVE RESPONSE DEBUGGING
      console.log('=== OLLAMA RAW RESPONSE DEBUG ===')
      console.log('Response Type:', typeof response)
      console.log('Response Length:', response?.length)
      console.log('Response Content:', response)
      console.log('Contains [SHOW:]:', response?.includes('[SHOW:'))
      console.log('Contains JSON:', response?.includes('{') && response?.includes('}'))
      console.log('Starts with {:', response?.startsWith('{'))
      console.log('Ends with }:', response?.endsWith('}'))
      console.log('=== END OLLAMA RESPONSE DEBUG ===')
      
      Logger.debug('EnhancedFoodDeliveryOllama', 'Ollama response received', {
        responseLength: response.length,
        responsePreview: response.substring(0, 200),
        containsShowTools: response.includes('[SHOW:'),
        containsJson: response.includes('{') && response.includes('}'),
        isJsonFormat: response.startsWith('{') && response.endsWith('}')
      })
      
      return response
    } catch (error) {
      Logger.error('EnhancedFoodDeliveryOllama', 'Ollama call failed', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userInput,
        contextKeys: Object.keys(context)
      })
      throw error
    }
  }

  private static getStrictStageInstructions(stageId: string): string {
    switch (stageId) {
      case 'greeting':
        return `GREETING STAGE - Welcome and identify purpose:
- Say: "Hi! Welcome to our food delivery service. How can I help you today?"
- Use: [SHOW:leading_question:Visit Purpose:What brings you here today?]
- Wait for their answer
- Next: service_overview (if browsing) or needs_assessment (if ordering)
- CRITICAL: Stay in greeting stage until user gives meaningful response
- DO NOT collect preferences immediately after "hi" or "hello"
- DO NOT show any forms or complex UI until user expresses interest`

      case 'service_overview':
        return `SERVICE OVERVIEW STAGE - Show service capabilities:
- Say: "Great! Let me show you what we offer. [SHOW:leading_question:Service Interest:Which service interests you most?]"
- Explain: meal planning, nutrition consultation, delivery options, dietary accommodations
- Use: [SHOW:leading_question:Service Interest:Which service interests you most?]
- Next: needs_assessment (if they want to order) or menu_exploration (if they want to browse menu)`

      case 'service_explanation':
        return `SERVICE EXPLANATION STAGE - Explain how service works:
- Say: "I'd be happy to explain how our service works! [SHOW:leading_question:Next Step:What would you like to do next?]"
- Explain: ordering process, delivery options, payment, customization, nutrition consultation
- Use: [SHOW:leading_question:Next Step:What would you like to do next?]
- Next: needs_assessment (if they want to order) or service_overview (if they want to browse)`

      case 'needs_assessment':
        return `NEEDS ASSESSMENT - Collect dietary preferences BEFORE showing menu:
- Say: "Great! To personalize your experience, let me understand your dietary preferences first. [SHOW:preferences_collector:Dietary Preferences:preferences_data]"
- CRITICAL: ALWAYS collect preferences before showing menu items
- Use: [SHOW:preferences_collector:Dietary Preferences:preferences_data]
- Wait for their response
- Next: menu_exploration (only after preferences are collected)`

      case 'menu_exploration':
        return `MENU EXPLORATION - Show food options:
- Say: "Based on your preferences, here are some great options for you. [SHOW:food_items:Available Items:item1,item2,item3]"
- Present 2-3 items based on their preferences
- Next: order_placement`

      case 'order_placement':
        return `ORDER PLACEMENT - Help them order:
- Say: "Let's add items to your order. [SHOW:order_summary:Current Order:order_data]"
- Show current order status
- Next: delivery_setup`

      case 'delivery_setup':
        return `DELIVERY SETUP - Configure delivery:
- Say: "Let's set up your delivery. [SHOW:delivery_setup:Delivery Options:delivery_data]"
- Get delivery preferences
- Next: privacy_consent`

      case 'privacy_consent':
        return `PRIVACY CONSENT - Get contact info:
- Say: "We need your contact information. [SHOW:interview_question:Contact Info:Please provide your contact details]"
- Get consent
- Next: confirmation`

      case 'confirmation':
        return `CONFIRMATION - Finalize order:
- Say: "Your order is confirmed! [SHOW:order_summary:Order Confirmation:order_details]"
- Provide order number
- Next: null (complete)`

      default:
        return `GENERAL STAGE - Be helpful:
- Keep response to 1 sentence
- Use appropriate [SHOW:...] tool
- Guide to next stage`
    }
  }

  private static getStageSpecificInstructions(stageId: string): string {
    switch (stageId) {
      case 'greeting':
        return `GREETING STAGE - Welcome and identify purpose:
- Greet warmly but briefly
- Use [SHOW:leading_question:Visit Occasion:What brings you in today?]
- Wait for their answer before proceeding
- Next: needs_assessment if unsure, quick_order if they know what they want`

      case 'needs_assessment':
        return `NEEDS ASSESSMENT - Understand their goals:
- Ask about dietary preferences or restrictions
- Use [SHOW:preferences_collector:Dietary Preferences:preferences_data]
- Keep it simple - one question at a time
- Next: menu_exploration when you understand their needs`

      case 'menu_exploration':
        return `MENU EXPLORATION - Show food options:
- Present 2-3 specific food items
- Use [SHOW:food_items:Available Items:item1,item2,item3]
- Focus on their preferences
- Next: order_placement when they want to order`

      case 'order_placement':
        return `ORDER PLACEMENT - Help them order:
- Show current order with [SHOW:order_summary:Current Order:order_data]
- Ask what they'd like to add
- Keep it simple and focused
- Next: delivery_setup when order is ready`

      case 'delivery_setup':
        return `DELIVERY SETUP - Configure delivery:
- Use [SHOW:delivery_setup:Delivery Options:delivery_data]
- Ask about pickup vs delivery
- Get address if needed
- Next: privacy_consent when delivery is set`

      case 'privacy_consent':
        return `PRIVACY CONSENT - Get contact info:
- Ask for contact information
- Explain privacy policy briefly
- Get consent for communications
- Next: confirmation when consent given`

      case 'confirmation':
        return `CONFIRMATION - Finalize order:
- Summarize the complete order
- Confirm delivery details
- Provide order number
- Next: null (conversation complete)`

      default:
        return `GENERAL STAGE - Be helpful and focused:
- Keep responses short
- Ask one question at a time
- Use appropriate [SHOW:...] tools
- Guide toward next logical stage`
    }
  }

  private static buildEnhancedSystemPrompt(context: any): string {
    const { persistentContext, stageInfo, applicableRules, availableFoodItems, relevantKnowledge, hasOrder, hasDeliverySetup, conversationHistory } = context

    // Get tool guidelines for current stage
    const toolGuidelines = PlaybookSystem.getStageToolGuidelines(stageInfo?.id || 'greeting')
    
    // Check if we have preferences before showing menu items
    const hasPreferences = !!persistentContext?.customerPreferences
    const isMenuExploration = stageInfo?.id === 'menu_exploration'
    
    // Get structured questions for current stage
    const answeredQuestions = persistentContext?.answeredQuestions || []
    const nextQuestion = this.getNextQuestion()
    const stageQuestions = PlaybookSystem.getStageQuestions((stageInfo as any)?.id || 'greeting')
    
    return `FOOD DELIVERY CONCIERGE - FOLLOW PLAYBOOK EXACTLY

CURRENT STAGE: ${stageInfo?.id || 'greeting'} - ${stageInfo?.name || 'Initial Greeting'}

STRUCTURED QUESTION-ANSWER SYSTEM:
${nextQuestion ? `
NEXT QUESTION TO ASK:
- Question: "${nextQuestion.question}"
- Answer Options: ${nextQuestion.answerOptions.join(', ')}
- Required: ${nextQuestion.required ? 'YES' : 'NO'}
- Context: ${nextQuestion.context}

IMPORTANT: Guide the user to select from the provided answer options. Don't ask open-ended questions.
` : `
STAGE QUESTIONS STATUS:
- Total Questions: ${stageQuestions.length}
- Answered: ${answeredQuestions.length}
- Completion: ${PlaybookSystem.getStageCompletionStatus(stageInfo?.id || 'greeting', answeredQuestions).completed ? 'COMPLETE' : 'INCOMPLETE'}

${stageQuestions.length > 0 ? `
AVAILABLE QUESTIONS FOR THIS STAGE:
${stageQuestions.map(q => `- ${q.id}: "${q.question}" (${q.required ? 'Required' : 'Optional'})`).join('\n')}
` : 'No structured questions for this stage.'}
`}

MANDATORY STAGE BEHAVIOR:
${this.getStrictStageInstructions(stageInfo?.id || 'greeting')}

REQUIRED TOOLS FOR THIS STAGE:
${toolGuidelines.requiredTools.map(tool => `- ${tool}`).join('\n') || 'None'}

OPTIONAL TOOLS FOR THIS STAGE:
${toolGuidelines.optionalTools.map(tool => `- ${tool}`).join('\n') || 'None'}

NEXT STAGE OPTIONS (choose ONE):
${stageInfo?.nextStages?.map((stage: any) => `- ${stage}`).join('\n') || '- needs_assessment'}

CRITICAL RULE: ${isMenuExploration && !hasPreferences ? 'DO NOT show menu items without preferences! Redirect to needs_assessment first!' : 'Follow normal flow'}

MANDATORY ASSET USAGE:
- ALWAYS include [SHOW:...] tools in your response
- For greeting stage: Use [SHOW:leading_question:Visit Purpose:What brings you here today?]
- For service overview: Use [SHOW:service_overview:Our Services:meal_planning,nutrition_consultation,delivery_service,dietary_accommodations]
- For needs assessment: Use [SHOW:preferences_collector:Dietary Preferences:preferences_data]

INTELLIGENT CONVERSATION RULES:
1. ANALYZE conversation context and user intent before responding
2. If user just says "hi" or "hello" - stay in greeting stage, ask what they need
3. If user just learned about service and says "try/start/begin" - collect preferences first (needs_assessment)
4. If user asks about service process, delivery, or how things work - explain clearly
5. If user asks questions that don't fit current stage - answer the question and suggest next step
6. ALWAYS collect dietary preferences before showing menu items
7. Follow natural conversation flow: greeting → identify purpose → collect preferences → show menu
8. Always include [SHOW:...] tool in response
9. Commands should be helpful and relevant to user's question
10. Choose nextStage based on conversation context and user intent
11. JSON format only - no plain text
12. NEVER make claims not supported by the knowledge base
13. If asked about delivery locations, ONLY say we deliver in San Francisco Bay Area
14. NEVER claim international delivery or delivery to Thailand
15. Be helpful and answer user's actual question, don't just follow stage script
16. PRIORITIZE: User intent > Conversation context > Stage requirements
17. CRITICAL: Do NOT rush into preference collection after simple greetings

CONVERSATION CONTEXT ANALYSIS:
- Current Stage: ${stageInfo?.id || 'unknown'}
- Previous Stage: ${persistentContext?.previousStage || 'none'}
- User Intent: ${persistentContext?.userIntent || 'unknown'}
- Has Preferences: ${hasPreferences ? 'YES' : 'NO'}
- Has Order: ${hasOrder ? 'YES' : 'NO'}
- Conversation Length: ${conversationHistory.length} messages
- Last User Message: "${context.userInput}"

CRITICAL: If user says "try/start/begin" after service explanation, you MUST collect preferences first!
NEVER show menu items without collecting dietary preferences first!
NEVER collect preferences immediately after "hi" or "hello" - wait for user to express interest!

USER INPUT: "${context.userInput}"

KNOWLEDGE BASE (MUST USE THIS INFORMATION):
    ${relevantKnowledge.length > 0 ? relevantKnowledge.map((k: any) => `- ${k.title}: ${k.content}`).join('\n') : 'No relevant knowledge found'}

DELIVERY LOCATIONS (FACTUAL INFORMATION):
- We deliver ONLY within San Francisco Bay Area
- Service areas: San Francisco, Oakland, Berkeley, San Jose, Palo Alto, Mountain View
- We do NOT deliver internationally
- We do NOT deliver to Thailand or any other countries
- We do NOT deliver outside California

CONVERSATION CONTEXT:
- Total Interactions: ${persistentContext.totalInteractions}
- User Intent: ${persistentContext.userIntent}
- Has Preferences: ${persistentContext.customerPreferences ? 'Yes' : 'No'}
- Has Order: ${persistentContext.currentOrder?.length > 0 ? 'Yes' : 'No'}
- Has Delivery Setup: ${persistentContext.deliveryPreferences ? 'Yes' : 'No'}

AVAILABLE FOOD ITEMS (${availableFoodItems.length} total):
    ${availableFoodItems.slice(0, 3).map((item: any) => `- ${item.name} (${item.type}): $${item.price}`).join('\n')}
${availableFoodItems.length > 3 ? `... and ${availableFoodItems.length - 3} more items` : ''}

MANDATORY TOOL USAGE:
REQUIRED TOOLS: ${toolGuidelines.requiredTools.join(', ') || 'None specified'}
OPTIONAL TOOLS: ${toolGuidelines.optionalTools.join(', ') || 'None specified'}

TOOL USAGE GUIDELINES:
${toolGuidelines.guidelines.map(guideline => `- ${guideline}`).join('\n')}

FOOD DELIVERY TOOLS - Use [SHOW:type:title:data] to display interactive content:

1. FOOD_ITEMS_CARD: [SHOW:food_items:Menu Items:item1,item2,item3] - Show food items with details
2. PREFERENCES_COLLECTOR: [SHOW:preferences_collector:Dietary Preferences:preferences_data] - Collect dietary preferences
3. ORDER_SUMMARY: [SHOW:order_summary:Current Order:order_data] - Show current order details
4. DELIVERY_SETUP: [SHOW:delivery_setup:Delivery Options:delivery_data] - Setup delivery preferences
5. NUTRITION_ADVICE: [SHOW:nutrition_advice:Nutrition Information:nutrition_data] - Show nutrition info
6. INTERVIEW_QUESTIONS: [SHOW:interview_question:Budget Range:What's your budget range?] - Ask personalized questions
7. LEADING_QUESTIONS: [SHOW:leading_question:Visit Occasion:What brings you in today?] - Guide conversation

STAGE TRANSITION RULES:
1. GREETING → NEEDS_ASSESSMENT: When user mentions preferences, dietary needs, or specific requirements
2. GREETING → MENU_EXPLORATION: When user asks about menu, food, or wants to browse
3. NEEDS_ASSESSMENT → MENU_EXPLORATION: When preferences are collected and user wants to see options
4. MENU_EXPLORATION → ORDER_PLACEMENT: When user wants to add items to order
5. ORDER_PLACEMENT → DELIVERY_SETUP: When order is ready and needs delivery configuration
6. DELIVERY_SETUP → PRIVACY_CONSENT: When delivery is configured and needs consent
7. PRIVACY_CONSENT → CONFIRMATION: When consent is obtained and order is finalized

CRITICAL: You MUST respond with valid JSON only. No plain text responses allowed.

RESPONSE FORMAT (JSON ONLY):
{
  "content": "Your conversational response with [SHOW:...] tools",
  "assets": [],
  "commands": [
    { "id": "browse_menu", "text": "Browse Menu", "icon": "🍽️", "action": "browse_menu" },
    { "id": "set_preferences", "text": "Set Preferences", "icon": "⚙️", "action": "set_preferences" }
  ],
  "nextStage": "MUST be one of the possible next stages listed above, or null if staying in current stage",
  "contextUpdates": {
    "userIntent": "updated_intent_based_on_input",
    "conversationGoals": ["goal1", "goal2"],
    "contextFlags": { "flag_name": true }
  },
  "confidence": 0.9,
  "reasoning": "Brief explanation of your response and stage transition decision. MUST explain why you chose the nextStage."
}

EXAMPLE RESPONSE FOR GREETING STAGE:
{
  "content": "Welcome! [SHOW:leading_question:Visit Occasion:What brings you in today?]",
  "assets": [],
  "commands": [
    { "id": "browse_menu", "text": "Browse Menu", "icon": "🍽️", "action": "browse_menu" }
  ],
  "nextStage": "needs_assessment",
  "contextUpdates": {
    "userIntent": "greeting",
    "conversationGoals": ["understand_needs"],
    "contextFlags": { "first_interaction": true }
  },
  "confidence": 0.9,
  "reasoning": "User is greeting, using leading question to understand purpose"
}

EXAMPLE RESPONSE FOR DELIVERY QUESTIONS:
{
  "content": "We deliver only in the San Francisco Bay Area. [SHOW:delivery_setup:Delivery Options:delivery_data]",
  "assets": [],
  "commands": [
    { "id": "confirm_delivery", "text": "Confirm Delivery", "icon": "🚚", "action": "confirm_delivery" }
  ],
  "nextStage": "delivery_setup",
  "contextUpdates": {
    "userIntent": "delivery_inquiry",
    "conversationGoals": ["setup_delivery"],
    "contextFlags": { "delivery_question": true }
  },
  "confidence": 0.9,
  "reasoning": "User asked about delivery, providing accurate location info and delivery setup tool"
}

MANDATORY TOOL USAGE:
- If they ask about menu/food: [SHOW:food_items:Available Items:item1,item2,item3]
- If they need preferences: [SHOW:preferences_collector:Dietary Preferences:preferences_data]
- If they want to order: [SHOW:order_summary:Current Order:order_data]
- If they ask about delivery: [SHOW:delivery_setup:Delivery Options:delivery_data]
- If they ask about nutrition: [SHOW:nutrition_advice:Nutrition Information:nutrition_data]
- If they're unsure: [SHOW:interview_question:Budget Range:What's your budget range?]
- If they just say "hi": [SHOW:leading_question:Visit Occasion:What brings you in today?]

REMEMBER: 
1. Every response MUST include [SHOW:...] tools!
2. Respond with valid JSON only - no plain text!
3. Start your response with { and end with }
4. Do not include any text before or after the JSON object.
5. Choose nextStage from the POSSIBLE NEXT STAGES listed above, or null if staying in current stage.
6. Explain your stage transition decision in the reasoning field.

Your response must be valid JSON that can be parsed by JSON.parse().`
  }

  private static async parseOllamaResponse(response: string, currentStage: string): Promise<OllamaResponse> {
    console.log('=== PARSING OLLAMA RESPONSE DEBUG ===')
    console.log('Current Stage:', currentStage)
    console.log('Response Length:', response.length)
    console.log('Response Preview:', response.substring(0, 300))
    console.log('Contains [SHOW:]:', response.includes('[SHOW:'))
    console.log('Contains JSON markers:', response.includes('{') && response.includes('}'))
    console.log('Starts with {:', response.trim().startsWith('{'))
    console.log('=== END PARSING DEBUG ===')
    
    Logger.debug('EnhancedFoodDeliveryOllama', 'Parsing Ollama response', {
      responseLength: response.length,
      responsePreview: response.substring(0, 200),
      isJSON: response.trim().startsWith('{'),
      containsShowTools: response.includes('[SHOW:')
    })
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response)
      
      console.log('✅ Successfully parsed JSON response from Ollama')
      console.log('Parsed Response:', JSON.stringify(parsed, null, 2))
      
      Logger.debug('EnhancedFoodDeliveryOllama', 'Successfully parsed JSON response', {
        hasContent: !!parsed.content,
        hasAssets: !!parsed.assets,
        hasCommands: !!parsed.commands,
        nextStage: parsed.nextStage,
        contentPreview: parsed.content?.substring(0, 100)
      })
      
      // Parse [SHOW:...] tools from content if present
      const { text: cleanContent, assets: parsedAssets } = this.parseShowTools(parsed.content || response)
      
      // Validate and enhance the nextStage if provided
      let nextStage = parsed.nextStage
      if (nextStage && !this.isValidStageTransition(currentStage, nextStage)) {
        Logger.warn('EnhancedFoodDeliveryOllama', 'Invalid stage transition detected', {
          from: currentStage,
          to: nextStage,
          validTransitions: this.getValidNextStages(currentStage)
        })
        nextStage = this.determineNextStage(currentStage, cleanContent)
      }
      
      // If we have assets but no text content, generate a meaningful response
      let finalContent = cleanContent
      if (parsedAssets.length > 0 && !cleanContent.trim()) {
        finalContent = this.generateContentForAssets(parsedAssets, currentStage)
      }
      
      return {
        content: finalContent,
        assets: [...(parsed.assets || []), ...parsedAssets],
        commands: parsed.commands || [],
        nextStage: nextStage,
        contextUpdates: parsed.contextUpdates || {},
        confidence: parsed.confidence || 0.8,
        reasoning: parsed.reasoning || 'Parsed from JSON response'
      }
    } catch (error) {
      // Try browser converter as fallback
      Logger.warn('EnhancedFoodDeliveryOllama', 'Failed to parse JSON response, trying browser converter', { 
        error: error instanceof Error ? error.message : String(error),
        responsePreview: response.substring(0, 100)
      })
      
      try {
        const convertedResponse = BrowserResponseConverter.convertResponse(response, currentStage)
        Logger.info('EnhancedFoodDeliveryOllama', 'Successfully converted response using browser converter', {
          hasContent: !!convertedResponse.content,
          hasCommands: !!convertedResponse.commands,
          nextStage: convertedResponse.nextStage
        })
        return {
          ...convertedResponse,
          nextStage: convertedResponse.nextStage || undefined
        }
      } catch (converterError) {
        Logger.warn('EnhancedFoodDeliveryOllama', 'Browser converter failed, using basic fallback', {
          converterError: converterError instanceof Error ? converterError.message : String(converterError)
        })
        
        // Final fallback: treat as plain text and parse [SHOW:...] tools
        const { text: cleanContent, assets: parsedAssets } = this.parseShowTools(response)
        const nextStage = this.determineNextStage(currentStage, cleanContent)
        
        // If we have assets but no text content, generate a meaningful response
        let finalContent = cleanContent
        if (parsedAssets.length > 0 && !cleanContent.trim()) {
          finalContent = this.generateContentForAssets(parsedAssets, currentStage)
        }
        
        return {
          content: finalContent,
          assets: [...this.generateFallbackAssets(currentStage), ...parsedAssets],
          commands: this.generateFallbackCommands(currentStage),
          nextStage: nextStage,
          contextUpdates: {},
          confidence: 0.6,
          reasoning: 'Fallback parsing due to non-JSON response and converter failure'
        }
      }
    }
  }

  private static generateContentForAssets(assets: AssetTemplate[], currentStage: string): string {
    // Generate meaningful text content based on the assets and current stage
    const assetTypes = assets.map(asset => asset.type)
    
    if (assetTypes.includes('food_items')) {
      return "Here are some great options for you to choose from!"
    } else if (assetTypes.includes('preferences_collector')) {
      return this.generateProgressivePreferenceText(assets, currentStage)
    } else if (assetTypes.includes('order_summary')) {
      return "Here's your current order status."
    } else if (assetTypes.includes('delivery_setup')) {
      return "Let's set up your delivery options."
    } else if (assetTypes.includes('nutrition_advice')) {
      return "Here's some nutrition information for you."
    } else if (assetTypes.includes('interview_question')) {
      return "I'd like to ask you a few questions to better help you."
    } else if (assetTypes.includes('leading_question')) {
      return "Let me help you get started."
    } else if (assetTypes.includes('product_card')) {
      return "Here's what I found for you."
    } else {
      // Generic response based on stage
      switch (currentStage) {
        case 'greeting':
          return "Welcome! How can I help you today?"
        case 'needs_assessment':
          return "Let me understand what you're looking for."
        case 'menu_exploration':
          return "Here are some options for you to explore."
        case 'order_placement':
          return "Let's build your order."
        case 'delivery_setup':
          return "Let's set up your delivery."
        case 'privacy_consent':
          return "I need some information to complete your order."
        case 'confirmation':
          return "Your order is ready!"
        default:
          return "Here's what I have for you."
      }
    }
  }

  private static generateProgressivePreferenceText(assets: AssetTemplate[], currentStage: string): string {
    // Check if we have a preferences_collector asset
    const preferencesAsset = assets.find(asset => asset.type === 'preferences_collector')
    if (!preferencesAsset) {
      return "Let me understand your preferences better."
    }

    // Get the current preference step from the asset parameters
    const currentStep = preferencesAsset.parameters?.currentStep || 1
    const totalSteps = preferencesAsset.parameters?.totalSteps || 4

    // Generate step-specific text
    switch (currentStep) {
      case 1:
        return "I'd love to help you find the perfect meals! First, do you have any dietary restrictions or allergies I should know about?"
      case 2:
        return "Great! Now, what types of cuisine do you enjoy most? I can help you discover new flavors!"
      case 3:
        return "Perfect! What are your health and wellness goals? This helps me suggest the right nutrition for you."
      case 4:
        return "Almost there! What's your cooking skill level and how much time do you usually have for meal prep?"
      default:
        return "Let me understand your preferences better."
    }
  }

  private static generateFallbackAssets(currentStage: string): AssetTemplate[] {
    const assets: AssetTemplate[] = []
    
    switch (currentStage) {
      case 'menu_exploration':
        assets.push({
          type: 'food_items',
          title: 'Available Items',
          parameters: { 
            items: FoodDeliveryService.searchFoodItems('', this.persistentContext?.customerPreferences),
            category: 'all',
            showPrices: true,
            allowSelection: true
          },
          interactive: true,
          clickable: true,
          action: 'select_item'
        })
        break
      case 'needs_assessment':
        assets.push({
          type: 'preferences_collector',
          title: 'Dietary Preferences',
          parameters: { 
            currentPreferences: this.persistentContext?.customerPreferences,
            categories: ['dietary_restrictions', 'dietary_goals', 'cuisine_preferences']
          },
          interactive: true,
          clickable: true,
          action: 'update_preferences'
        })
        break
    }
    
    return assets
  }

  private static generateFallbackCommands(currentStage: string): any[] {
    // Only provide commands that are directly relevant to the current stage
    const commands: any[] = []
    
    switch (currentStage) {
      case 'greeting':
        // Greeting stage - only allow browsing menu
        commands.push(
          { id: 'browse_menu', text: 'Browse Menu', icon: '🍽️', action: 'browse_menu' }
        )
        break
        
      case 'needs_assessment':
        // Needs assessment - only allow setting preferences
        commands.push(
          { id: 'set_preferences', text: 'Set Preferences', icon: '⚙️', action: 'set_preferences' }
        )
        break
        
      case 'menu_exploration':
        // Menu exploration - only allow viewing cart
        commands.push(
          { id: 'view_cart', text: 'View Cart', icon: '🛒', action: 'view_cart' }
        )
        break
        
      case 'order_placement':
        // Order placement - only allow checkout
        commands.push(
          { id: 'checkout', text: 'Checkout', icon: '💳', action: 'checkout' }
        )
        break
        
      case 'delivery_setup':
        // Delivery setup - only allow confirming delivery
        commands.push(
          { id: 'confirm_delivery', text: 'Confirm Delivery', icon: '🚚', action: 'confirm_delivery' }
        )
        break
        
      case 'privacy_consent':
        // Privacy consent - only allow providing consent
        commands.push(
          { id: 'provide_consent', text: 'Provide Consent', icon: '✅', action: 'provide_consent' }
        )
        break
        
      case 'confirmation':
        // Confirmation - no additional commands needed
        break
        
      default:
        // Default - only help
        commands.push(
          { id: 'help', text: 'Help', icon: '❓', action: 'help' }
        )
    }
    
    return commands
  }

  private static logInteraction(userInput: string, response: OllamaResponse, context: any): void {
    Logger.info('EnhancedFoodDeliveryOllama', 'Interaction logged', {
      userInput: userInput.substring(0, 100),
      responseLength: response.content.length,
      assetsGenerated: response.assets.length,
      commandsGenerated: response.commands.length,
      nextStage: response.nextStage,
      confidence: response.confidence,
      reasoning: response.reasoning,
      contextKeys: Object.keys(context),
      totalInteractions: this.persistentContext?.totalInteractions
    })
  }

  static clearContext(): void {
    this.persistentContext = null
    Logger.info('EnhancedFoodDeliveryOllama', 'Context cleared')
  }

  private static isValidStageTransition(fromStage: string, toStage: string): boolean {
    const playbook = PlaybookSystem.getPlaybook('food-delivery-concierge')
    if (!playbook) return false

    const currentStage = playbook.stages.find(s => s.id === fromStage)
    if (!currentStage) return false

    return currentStage.nextStages?.includes(toStage) || false
  }

  private static getValidNextStages(currentStage: string): string[] {
    const playbook = PlaybookSystem.getPlaybook('food-delivery-concierge')
    if (!playbook) return []

    const stage = playbook.stages.find(s => s.id === currentStage)
    return stage?.nextStages || []
  }

  private static determineNextStage(currentStage: string, userInput: string): string | undefined {
    // Use PlaybookSystem to determine next stage instead of custom logic
    const nextStage = PlaybookSystem.getNextStage('food-delivery-concierge', currentStage)
    
    // If no next stage determined, stay in current stage
    if (!nextStage) {
      Logger.debug('EnhancedFoodDeliveryOllama', 'No stage transition determined, staying in current stage', { 
        currentStage, 
        userInput 
      })
      return currentStage
    }
    
    Logger.debug('EnhancedFoodDeliveryOllama', 'Stage transition determined', { 
      currentStage, 
      nextStage: nextStage.id, 
      userInput 
    })
    
    return nextStage.id
  }

  private static parseShowTools(content: string): { text: string; assets: AssetTemplate[] } {
    console.log('=== PARSING SHOW TOOLS DEBUG ===')
    console.log('Content to parse:', content)
    console.log('Contains [SHOW:]:', content.includes('[SHOW:'))
    console.log('=== END SHOW TOOLS DEBUG ===')
    
    const assets: AssetTemplate[] = []
    let cleanText = content

    // Pattern to match [SHOW:type:title:data] format
    const showPattern = /\[SHOW:([^:]+):([^:]+):([^\]]+)\]/g
    let match
    let matchCount = 0

    while ((match = showPattern.exec(content)) !== null) {
      matchCount++
      const [fullMatch, type, title, data] = match
      
      console.log(`Found SHOW tool #${matchCount}:`, { type, title, data, fullMatch })
      
      Logger.debug('EnhancedFoodDeliveryOllama', 'Found SHOW tool', { type, title, data })
      
      // Create asset based on type
      const asset = this.createAssetFromShowTool(type, title, data)
      if (asset) {
        console.log('Created asset:', asset)
        assets.push(asset)
      } else {
        console.log('Failed to create asset for:', { type, title, data })
      }
      
      // Remove the [SHOW:...] from the text
      cleanText = cleanText.replace(fullMatch, '').trim()
    }
    
    console.log(`Total SHOW tools found: ${matchCount}`)
    console.log(`Assets created: ${assets.length}`)
    console.log('Clean text after parsing:', cleanText)

    return { text: cleanText, assets }
  }

  private static generateLeadingOptions(question: string, title: string): Array<{label: string, value: string}> {
    const questionLower = question.toLowerCase()
    const titleLower = title.toLowerCase()
    
    // Generate options based on question content
    if (questionLower.includes('visit occasion') || questionLower.includes('what brings you')) {
      return [
        { label: 'Looking for dinner', value: 'dinner' },
        { label: 'Need lunch', value: 'lunch' },
        { label: 'Special occasion', value: 'special' },
        { label: 'Just browsing', value: 'browsing' },
        { label: 'Health & fitness', value: 'health' }
      ]
    }
    
    if (questionLower.includes('explore') || questionLower.includes('browse')) {
      return [
        { label: 'Browse menu', value: 'browse_menu' },
        { label: 'See recommendations', value: 'recommendations' },
        { label: 'Check specials', value: 'specials' },
        { label: 'View categories', value: 'categories' }
      ]
    }
    
    if (questionLower.includes('specific') || questionLower.includes('looking for')) {
      return [
        { label: 'Something specific', value: 'specific' },
        { label: 'Open to suggestions', value: 'suggestions' },
        { label: 'Not sure yet', value: 'unsure' }
      ]
    }
    
    // Default options for leading questions
    return [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
      { label: 'Maybe', value: 'maybe' },
      { label: 'Tell me more', value: 'more_info' }
    ]
  }

  private static generateInterviewOptions(question: string, title: string): Array<{label: string, value: string}> {
    const questionLower = question.toLowerCase()
    const titleLower = title.toLowerCase()
    
    // Generate options based on question content
    if (questionLower.includes('use case') || questionLower.includes('what will you mainly use')) {
      return [
        { label: 'Family dinner', value: 'family_dinner' },
        { label: 'Work lunch', value: 'work_lunch' },
        { label: 'Special occasion', value: 'special_occasion' },
        { label: 'Quick meal', value: 'quick_meal' },
        { label: 'Health & fitness', value: 'health_fitness' }
      ]
    }
    
    if (questionLower.includes('budget') || questionLower.includes('price')) {
      return [
        { label: 'Under $15', value: 'under_15' },
        { label: '$15-25', value: '15_25' },
        { label: '$25-40', value: '25_40' },
        { label: '$40+', value: 'over_40' },
        { label: 'No specific budget', value: 'flexible' }
      ]
    }
    
    if (questionLower.includes('dietary') || questionLower.includes('restrictions')) {
      return [
        { label: 'No restrictions', value: 'none' },
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'Gluten-free', value: 'gluten_free' },
        { label: 'Keto/Low-carb', value: 'keto' },
        { label: 'Other', value: 'other' }
      ]
    }
    
    if (questionLower.includes('cuisine') || questionLower.includes('type of food')) {
      return [
        { label: 'Asian', value: 'asian' },
        { label: 'Mediterranean', value: 'mediterranean' },
        { label: 'American', value: 'american' },
        { label: 'Italian', value: 'italian' },
        { label: 'Mexican', value: 'mexican' },
        { label: 'Indian', value: 'indian' }
      ]
    }
    
    // Default options for any other question
    return [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
      { label: 'Maybe', value: 'maybe' },
      { label: 'Not sure', value: 'not_sure' }
    ]
  }

  private static createAssetFromShowTool(type: string, title: string, data: string): AssetTemplate | null {
    console.log('=== CREATING ASSET FROM SHOW TOOL DEBUG ===')
    console.log('Type:', type)
    console.log('Title:', title)
    console.log('Data:', data)
    console.log('=== END ASSET CREATION DEBUG ===')
    
    switch (type) {
      case 'food_items':
        return {
          type: 'food_items',
          title,
          parameters: { 
            items: data.split(',').map(item => item.trim()),
            category: 'all',
            showPrices: true,
            allowSelection: true
          },
          interactive: true,
          clickable: true,
          action: 'select_item'
        }
        
      case 'preferences_collector':
        return {
          type: 'preferences_collector',
          title,
          parameters: { 
            currentPreferences: this.persistentContext?.customerPreferences,
            categories: ['dietary_restrictions', 'dietary_goals', 'cuisine_preferences'],
            currentStep: 1,
            totalSteps: 4,
            progressive: true
          },
          interactive: true,
          clickable: true,
          action: 'update_preferences'
        }
        
      case 'order_summary':
        return {
          type: 'order_summary',
          title,
          parameters: { 
            items: this.persistentContext?.currentOrder || [],
            total: 0,
            deliveryInfo: this.persistentContext?.deliveryPreferences
          },
          interactive: true,
          clickable: true,
          action: 'modify_order'
        }
        
      case 'delivery_setup':
        return {
          type: 'delivery_setup',
          title,
          parameters: { 
            pickupPoints: FoodDeliveryService.getAvailablePickupPoints(),
            deliveryZones: FoodDeliveryService.getDeliveryZones(),
            currentPreferences: this.persistentContext?.deliveryPreferences
          },
          interactive: true,
          clickable: true,
          action: 'setup_delivery'
        }
        
      case 'nutrition_advice':
        return {
          type: 'nutrition_advice',
          title,
          parameters: { 
            advice: data,
            recommendations: [],
            healthGoals: []
          },
          interactive: false,
          clickable: false
        }
        
      case 'interview_question':
        // Generate default options based on the question content
        const defaultOptions = this.generateInterviewOptions(data, title)
        return {
          type: 'interview_question',
          title,
          parameters: { 
            question: data,
            options: defaultOptions,
            required: false
          },
          interactive: true,
          clickable: true,
          action: 'answer_question'
        }
        
      case 'leading_question':
        // Generate default options based on the question content
        const leadingOptions = this.generateLeadingOptions(data, title)
        return {
          type: 'leading_question',
          title,
          parameters: { 
            question: data,
            options: leadingOptions,
            required: false
          },
          interactive: true,
          clickable: true,
          action: 'answer_question'
        }
        
      case 'product_card':
        return {
          type: 'product_card',
          title,
          parameters: { 
            name: title,
            description: data,
            price: null, // Will be populated from food items if available
            image: null,
            category: 'featured',
            showAddButton: true
          },
          interactive: true,
          clickable: true,
          action: 'view_product'
        }
        
      case 'service_overview':
        return {
          type: 'service_overview',
          title,
          parameters: { 
            services: data.split(',').map(s => s.trim()),
            showAll: true
          },
          interactive: true,
          clickable: true,
          action: 'select_service'
        }
        
      default:
        Logger.warn('EnhancedFoodDeliveryOllama', 'Unknown SHOW tool type', { type, title, data })
        return null
    }
  }
}

export { EnhancedFoodDeliveryOllama }
export default EnhancedFoodDeliveryOllama
