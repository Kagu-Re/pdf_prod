import { Product } from '../data/ProductCatalog'
import { ConversationFlowManager, ConversationState } from './ConversationFlowManager'

export interface OllamaConfig {
  model: string
  baseUrl: string
  temperature: number
  maxTokens: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface FoodDeliveryContext {
  selectedProduct: Product | null
  allProducts: Product[]
  conversationHistory: ChatMessage[]
  userPreferences?: Record<string, any>
}

export class OllamaService {
  private config: OllamaConfig
  private flowManager: ConversationFlowManager

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = {
      model: 'llama3.1:8b', // Default model, can be overridden
      baseUrl: 'http://localhost:11434',
      temperature: 0.7,
      maxTokens: 1000,
      ...config
    }
    this.flowManager = new ConversationFlowManager()
  }

  async generateFoodDeliveryResponse(
    userInput: string,
    context: FoodDeliveryContext
  ): Promise<string> {
    console.log('🔍 OllamaService.generateFoodDeliveryResponse called with:', {
      userInput,
      context: {
        selectedProduct: context.selectedProduct?.name || 'none',
        allProducts: context.allProducts?.length || 0,
        conversationHistory: context.conversationHistory?.length || 0
      }
    })
    
    try {
      // Check if Ollama is available first
      const isConnected = await OllamaService.checkOllamaConnection()
      console.log('📋 OllamaService.generateFoodDeliveryResponse - Ollama connected:', isConnected)
      
      if (!isConnected) {
        console.log('❌ OllamaService.generateFoodDeliveryResponse - Ollama not connected, using enhanced fallback')
        return this.getEnhancedFallbackResponse(userInput, context)
      }

      // Analyze conversation flow
      const conversationState = this.flowManager.analyzeUserInput(userInput, context.selectedProduct)
      
      // Build enhanced system prompt with conversation context
      const systemPrompt = this.buildSystemPrompt(context, conversationState)
      const messages = this.buildMessageHistory(systemPrompt, userInput, context.conversationHistory)

      console.log('=== OLLAMA SERVICE DEBUG ===')
      console.log('Calling Ollama with model:', this.config.model)
      console.log('System prompt length:', systemPrompt.length)
      console.log('System prompt preview:', systemPrompt.substring(0, 500))
      console.log('Messages count:', messages.length)
      console.log('User input:', userInput)
      console.log('Full messages being sent:', JSON.stringify(messages, null, 2))
      console.log('=== END OLLAMA SERVICE DEBUG ===')

      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens,
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Ollama API error:', response.status, errorText)
        console.error('Request body was:', JSON.stringify({
          model: this.config.model,
          messages,
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens,
          }
        }, null, 2))
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      console.log('=== OLLAMA RESPONSE DEBUG ===')
      console.log('Full response data:', JSON.stringify(data, null, 2))
      console.log('Response message content:', data.message?.content)
      console.log('Response length:', data.message?.content?.length)
      console.log('Contains [SHOW:]:', data.message?.content?.includes('[SHOW:'))
      console.log('Contains JSON:', data.message?.content?.includes('{') && data.message?.content?.includes('}'))
      console.log('=== END OLLAMA RESPONSE DEBUG ===')
      
      return data.message.content
    } catch (error) {
      console.error('Error calling Ollama:', error)
      return this.getEnhancedFallbackResponse(userInput, context)
    }
  }

  private buildSystemPrompt(context: FoodDeliveryContext, conversationState?: ConversationState): string {
    const { selectedProduct, allProducts } = context
    
    let prompt = `You are a friendly, knowledgeable food delivery concierge. You're having a natural conversation with a customer about food delivery services.

PERSONALITY:
- Warm, helpful, and genuinely interested in helping with food delivery
- Use casual, friendly language like talking to a friend
- Be enthusiastic about food options but honest about dietary limitations
- Keep responses conversational and engaging
- Use "I" and "you" to feel personal and direct

RESPONSE STYLE:
- Keep responses under 3 sentences
- Ask follow-up questions to keep conversation flowing
- Be specific about food features, nutrition, and preparation
- Use simple language, avoid technical jargon unless asked
- Show genuine interest in helping them find the right food options

CURRENT SITUATION:
${selectedProduct ? `Customer is looking at: ${selectedProduct.name} ($${selectedProduct.price}) - ${selectedProduct.description}` : 'Customer is browsing our food menu'}

AVAILABLE FOOD ITEMS:
${allProducts.map(p => `- ${p.name} ($${p.price}): ${p.description}`).join('\n')}`

    // Add conversation context if available
    if (conversationState) {
      const contextualPrompt = this.flowManager.getContextualPrompt(conversationState, selectedProduct, allProducts)
      prompt += `\n\nCONVERSATION CONTEXT:\n${contextualPrompt}`
    }

    prompt += `

CONVERSATION TOOLS - You can use these special commands to create interactive content:

INTERVIEW QUESTIONS - Use [SHOW:interview_question:title:data] to ask personalized questions:
- [SHOW:interview_question:Budget Range:What's your budget range?] - Ask about budget preferences
- [SHOW:interview_question:Use Case:What will you mainly use this for?] - Ask about intended use
- [SHOW:interview_question:Style Preference:What style appeals to you?] - Ask about design preferences
- [SHOW:interview_question:Brand Preference:Any brand preferences?] - Ask about brand loyalty
- [SHOW:interview_question:Priority Ranking:Rank your top priorities] - Ask them to prioritize features

PRODUCT ASSETS - Use [SHOW:type:title:data] to display interactive content:
- [SHOW:product_card:Product Name:product_data] - Show product cards
- [SHOW:comparison:Compare Products:comparison_data] - Show product comparisons
- [SHOW:recommendations:Personalized Recommendations:recommendation_data] - Show personalized suggestions

CONVERSATION GUIDELINES:
- If they ask about a product, be specific about features and benefits
- If they're comparing, highlight key differences clearly
- If they mention budget, suggest options in their range
- If they're unsure, ask about their needs and use case using interview questions
- Use interview questions to gather preferences naturally in conversation
- Always end with a question to keep the conversation going

EXAMPLES OF GOOD RESPONSES:
- "That's a great choice! The MacBook Pro is perfect for creative work. Want to know more about the display or performance?"
- "Both are solid options! The Air is lighter and more portable, while the Pro has more power. What's most important to you?"
- "I can definitely help you find something in that range! What will you mainly use it for?"
- "Let me ask you a few quick questions to find the perfect match for you: [SHOW:interview_question:Budget Range:What's your budget range?]"

Remember: Be helpful, specific, and conversational. Use interview questions to personalize recommendations naturally!`

    return prompt
  }

  private buildMessageHistory(
    systemPrompt: string, 
    userInput: string, 
    conversationHistory: ChatMessage[]
  ): ChatMessage[] {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userInput }
    ]
    return messages
  }

  private getEnhancedFallbackResponse(userInput: string, context: FoodDeliveryContext): string {
    const { selectedProduct, allProducts } = context
    const input = userInput.toLowerCase()
    
    // Analyze conversation state for better responses
    const conversationState = this.flowManager.analyzeUserInput(userInput, selectedProduct)
    
    // Product-specific responses
    if (selectedProduct) {
      if (input.includes('feature') || input.includes('what does it have')) {
        const features = selectedProduct.features.slice(0, 3).join(', ')
        return `The ${selectedProduct.name} has some awesome features like ${features}. Pretty impressive, right? Want to know more about any of these?`
      }
      
      if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
        return `The ${selectedProduct.name} is $${selectedProduct.price}. Great value for what you get! Want to know about any deals or financing options?`
      }
      
      if (input.includes('spec') || input.includes('specification')) {
        if (selectedProduct.specifications) {
          const specs = Object.entries(selectedProduct.specifications)
            .slice(0, 3)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
          return `Here are the key specs: ${specs}. Pretty solid! Want to know more about any of these?`
        }
        return `I can tell you all about the ${selectedProduct.name} specs! What specific details are you curious about?`
      }
      
      if (input.includes('compare') || input.includes('vs') || input.includes('better')) {
        return `Great question! The ${selectedProduct.name} is a solid choice. Want me to show you how it compares to similar products? I can highlight the key differences!`
      }
      
      if (input.includes('warranty') || input.includes('return') || input.includes('policy')) {
        return `The ${selectedProduct.name} comes with a 1-year warranty and we have a 30-day return policy. Pretty standard stuff! Anything else you're curious about?`
      }
      
      return `The ${selectedProduct.name} is a great choice! What would you like to know about it? Features, specs, price, or something else?`
    }
    
    // General responses based on conversation stage
    if (conversationState.conversationStage === 'initial') {
      if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return "Hey there! Welcome to our shop! I'm here to help you find the perfect product. What are you looking for today?"
      }
      
      if (input.includes('recommend') || input.includes('suggest') || input.includes('help me choose')) {
        return "I'd love to help you find the perfect product! Tell me a bit about what you're looking for - what will you use it for, what's your budget, or any specific features you need?"
      }
      
      if (input.includes('show') || input.includes('browse') || input.includes('see')) {
        return "Sure! I can show you our products. We have some great options across different categories. What type of product interests you most?"
      }
    }
    
    // Comparison responses
    if (conversationState.userIntent === 'comparing' || input.includes('compare')) {
      return "I'd love to help you compare products! Which products are you thinking about? Or tell me what you're looking for and I'll suggest some great options to compare!"
    }
    
    // Budget-related responses
    if (input.includes('budget') || input.includes('cheap') || input.includes('affordable')) {
      return "Great question! What's your budget range? I can show you some amazing options that won't break the bank, or if you want to splurge, I've got some premium picks too!"
    }
    
    // Feature-related responses
    if (input.includes('feature') || input.includes('spec') || input.includes('capability')) {
      return "I can tell you all about the features! Which product are you interested in? Or if you tell me what you're looking for, I can suggest products with the features you need!"
    }
    
    // Help responses
    if (input.includes('help') || input.includes('what can you do') || input.includes('how')) {
      return "I'm here to help you find the perfect product! I can show you products, compare them, tell you about features and specs, help with your budget, and answer any questions. What would you like to do?"
    }
    
    // Use case responses
    if (conversationState.userPreferences.useCase) {
      const useCase = conversationState.userPreferences.useCase
      return `Perfect! For ${useCase}, I have some great recommendations. Let me show you the best options that would work well for your needs!`
    }
    
    // Default conversational response
    return "That's interesting! Tell me more about what you're looking for, or if you see a product that catches your eye, just let me know and I'll tell you all about it! What sounds good?"
  }

  private getFallbackResponse(userInput: string, context: FoodDeliveryContext): string {
    return this.getEnhancedFallbackResponse(userInput, context)
  }

  static async checkOllamaConnection(): Promise<boolean> {
    try {
      const baseUrl = 'http://localhost:11434'
      const response = await fetch(`${baseUrl}/api/tags`)
      return response.ok
    } catch {
      return false
    }
  }

  static async generateFoodDeliveryResponse(
    userInput: string,
    conversationHistory: any[],
    context: any
  ): Promise<string> {
    const service = new OllamaService()
    
    // Use the enhanced system prompt from context if available
    const enhancedSystemPrompt = context.enhancedSystemPrompt
    
    if (enhancedSystemPrompt) {
      console.log('=== USING ENHANCED SYSTEM PROMPT ===')
      console.log('Enhanced prompt length:', enhancedSystemPrompt.length)
      console.log('Enhanced prompt preview:', enhancedSystemPrompt.substring(0, 500))
      console.log('=== END ENHANCED SYSTEM PROMPT ===')
      
      // Call Ollama directly with the enhanced prompt
      return service.callOllamaWithEnhancedPrompt(userInput, enhancedSystemPrompt, conversationHistory)
    }
    
    // Fallback to original method
    const foodDeliveryContext: FoodDeliveryContext = {
      selectedProduct: null,
      allProducts: context.availableFoodItems || [],
      conversationHistory: conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      userPreferences: context.persistentContext?.customerPreferences
    }
    
    return service.generateFoodDeliveryResponse(userInput, foodDeliveryContext)
  }

  async callOllamaWithEnhancedPrompt(
    userInput: string, 
    enhancedSystemPrompt: string, 
    conversationHistory: any[]
  ): Promise<string> {
    try {
      // Check if Ollama is available first
      const isConnected = await OllamaService.checkOllamaConnection()
      if (!isConnected) {
        console.log('Ollama not connected, using enhanced fallback')
        return this.getEnhancedFallbackResponse(userInput, { selectedProduct: null, allProducts: [] })
      }

      // Build messages with the enhanced system prompt
      const messages = [
        {
          role: 'system' as const,
          content: enhancedSystemPrompt
        },
        ...conversationHistory.map(msg => ({
          role: (msg.type === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: userInput
        }
      ]

      console.log('=== CALLING OLLAMA WITH ENHANCED PROMPT ===')
      console.log('Model:', this.config.model)
      console.log('Enhanced prompt length:', enhancedSystemPrompt.length)
      console.log('Messages count:', messages.length)
      console.log('User input:', userInput)
      console.log('=== END ENHANCED PROMPT CALL ===')

      const response = await fetch(`${this.config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens,
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Ollama API error:', response.status, errorText)
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      console.log('=== OLLAMA ENHANCED RESPONSE DEBUG ===')
      console.log('Full response data:', JSON.stringify(data, null, 2))
      console.log('Response message content:', data.message?.content)
      console.log('Response length:', data.message?.content?.length)
      console.log('Contains [SHOW:]:', data.message?.content?.includes('[SHOW:'))
      console.log('Contains JSON:', data.message?.content?.includes('{') && data.message?.content?.includes('}'))
      console.log('=== END OLLAMA ENHANCED RESPONSE DEBUG ===')
      
      return data.message.content
    } catch (error) {
      console.error('Error calling Ollama with enhanced prompt:', error)
      return this.getEnhancedFallbackResponse(userInput, { selectedProduct: null, allProducts: [] })
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`)
      if (!response.ok) return []
      
      const data = await response.json()
      return data.models?.map((model: any) => model.name) || []
    } catch {
      return []
    }
  }
}

// Singleton instance
export const ollamaService = new OllamaService()
