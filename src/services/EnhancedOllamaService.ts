import { Product } from '../data/ProductCatalog'
import { ConversationFlowManager, ConversationState } from './ConversationFlowManager'
import { ResponseParser, ParsedResponse } from './ResponseParser'

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

export interface ShopkeeperContext {
  selectedProduct: Product | null
  allProducts: Product[]
  conversationHistory: ChatMessage[]
  userPreferences?: Record<string, any>
}

export class EnhancedOllamaService {
  private config: OllamaConfig
  private flowManager: ConversationFlowManager

  constructor(config: Partial<OllamaConfig> = {}) {
    this.config = {
      model: 'llama3.1:8b',
      baseUrl: 'http://localhost:11434',
      temperature: 0.7,
      maxTokens: 1000,
      ...config
    }
    this.flowManager = new ConversationFlowManager()
  }

  async generateShopkeeperResponse(
    userInput: string,
    context: ShopkeeperContext
  ): Promise<ParsedResponse> {
    try {
      // Check if Ollama is available first
      const isConnected = await this.checkOllamaConnection()
      if (!isConnected) {
        console.log('Ollama not connected, using enhanced fallback')
        return this.getEnhancedFallbackResponse(userInput, context)
      }

      // Analyze conversation flow
      const conversationState = this.flowManager.analyzeUserInput(userInput, context.selectedProduct)
      
      // Build enhanced system prompt with tool instructions
      const systemPrompt = this.buildSystemPromptWithTools(context, conversationState)
      const messages = this.buildMessageHistory(systemPrompt, userInput, context.conversationHistory)

      console.log('Calling Ollama with enhanced tools...')
      console.log('System prompt length:', systemPrompt.length)
      console.log('System prompt preview:', systemPrompt.substring(0, 500) + '...')

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
      const rawResponse = data.message.content
      console.log('Ollama response received:', rawResponse.substring(0, 200) + '...')
      console.log('Full response length:', rawResponse.length)
      console.log('Response contains [SHOW:', rawResponse.includes('[SHOW:'))

      // Parse the response to extract assets and clean text
      try {
        const parsedResponse = ResponseParser.parseResponse(rawResponse, context.allProducts, context.selectedProduct)
        console.log('Parsed response assets:', parsedResponse.assets.length)
        console.log('Parsed response text:', parsedResponse.text.substring(0, 100) + '...')
        return parsedResponse
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        // Return the raw response as fallback
        return {
          text: rawResponse,
          assets: [],
          contextualCommands: []
        }
      }
    } catch (error) {
      console.error('Error calling Ollama:', error)
      return this.getEnhancedFallbackResponse(userInput, context)
    }
  }

  private buildSystemPromptWithTools(context: ShopkeeperContext, conversationState?: ConversationState): string {
    const { selectedProduct, allProducts } = context
    
    let prompt = `You are a friendly, knowledgeable food delivery concierge. You MUST use interactive tools to show rich content to customers.

CRITICAL RULE: You MUST use the [SHOW:...] tools in EVERY response. Do not just provide plain text responses.

BEFORE YOU RESPOND: Ask yourself "What [SHOW:...] tool should I use?" Then include it in your response.

PERSONALITY:
- Warm, helpful, and genuinely interested in helping
- Use casual, friendly language like talking to a friend
- Be enthusiastic about products but honest about limitations
- Keep responses conversational and engaging
- Use "I" and "you" to feel personal and direct

RESPONSE STYLE:
- MANDATORY: Every response MUST include at least one [SHOW:...] tool
- Keep responses under 3 sentences
- Ask follow-up questions to keep conversation flowing
- Be specific about product features and benefits
- Use simple language, avoid technical jargon unless asked
- Show genuine interest in helping them find the right product
- NEVER give plain text responses without assets

AVAILABLE TOOLS:
You can use these tools to show rich content to customers:

PRODUCT ASSETS - Use [SHOW:type:title:data] to display interactive content:
- [SHOW:product_card:Product Name:product_data] - Show product cards
- [SHOW:comparison:Compare Products:comparison_data] - Show product comparisons  
- [SHOW:list:Feature List:item1,item2,item3] - Show lists of items
- [SHOW:specs:Specifications:product_data] - Show product specifications
- [SHOW:recommendations:Personalized Recommendations:recommendation_data] - Show personalized suggestions
- [SHOW:policies:Warranty Info:policy_data] - Show policies and support info

LEADING QUESTIONS - Use [SHOW:leading_question:title:data] to guide the conversation:
- [SHOW:leading_question:Visit Occasion:What brings you in today?] - Ask about their visit purpose
- [SHOW:leading_question:Exploration Style:Would you like to explore categories or need something specific?] - Ask about their browsing preference
- [SHOW:leading_question:Product Focus:Are you looking for a specific product or want to see what's available?] - Ask about their focus
- [SHOW:leading_question:Shop Information:Would you like to know about our store policies, hours, or services?] - Ask about shop info needs

INTERVIEW QUESTIONS - Use [SHOW:interview_question:title:data] to ask personalized questions:
- [SHOW:interview_question:Budget Range:What's your budget range?] - Ask about budget preferences
- [SHOW:interview_question:Use Case:What will you mainly use this for?] - Ask about intended use
- [SHOW:interview_question:Style Preference:What style appeals to you?] - Ask about design preferences
- [SHOW:interview_question:Brand Preference:Any brand preferences?] - Ask about brand loyalty
- [SHOW:interview_question:Priority Ranking:Rank your top priorities] - Ask them to prioritize features

CURRENT SITUATION:
${selectedProduct ? `Customer is looking at: ${selectedProduct.name} ($${selectedProduct.price}) - ${selectedProduct.description}` : 'Customer is browsing our products'}

AVAILABLE PRODUCTS:
${allProducts.map(p => `- ${p.id}: ${p.name} ($${p.price}) - ${p.description}`).join('\n')}`

    // Add conversation context if available
    if (conversationState) {
      const contextualPrompt = this.flowManager.getContextualPrompt(conversationState, selectedProduct, allProducts)
      prompt += `\n\nCONVERSATION CONTEXT:\n${contextualPrompt}`
    }

    prompt += `

CONVERSATION GUIDELINES:
- MANDATORY: Every response MUST include at least one [SHOW:...] tool
- If they ask about a product, use [SHOW:product_card:Product Name:product_data] to show product details
- If they want to compare, use [SHOW:comparison:Compare Products:comparison_data] to show comparison
- If they ask for features, use [SHOW:list:Feature List:item1,item2,item3] to list features
- If they ask for specs, use [SHOW:specs:Specifications:product_data] to show specifications
- If they want recommendations, use [SHOW:recommendations:Personalized Recommendations:recommendation_data] to show suggestions
- If they ask about policies, use [SHOW:policies:Warranty Info:policy_data] to show warranty/return info
- If they're unsure, use [SHOW:interview_question:title:data] to ask personalized questions
- If they mention budget, use [SHOW:interview_question:Budget Range:What's your budget range?]
- If they ask "why is this attractive" or "what makes this good" or "why should I buy this", use [SHOW:list:Why This Product is Great:feature1,feature2,feature3]
- If they ask about benefits or advantages, use [SHOW:list:Key Benefits:benefit1,benefit2,benefit3]
- If they ask about what makes it special, use [SHOW:list:What Makes This Special:feature1,feature2,feature3]
- If they ask about performance, use [SHOW:specs:Performance Specs:product_data]
- If they ask about price, use [SHOW:product_card:Product Details:product_data]

LEADING QUESTION STRATEGY:
- If they just say "hi" or "hello", use [SHOW:leading_question:Visit Occasion:What brings you in today?]
- If they seem lost or browsing aimlessly, use [SHOW:leading_question:Exploration Style:Would you like to explore categories or need something specific?]
- If they're vague about what they want, use [SHOW:leading_question:Product Focus:Are you looking for a specific product or want to see what's available?]
- If they ask about store info, use [SHOW:leading_question:Shop Information:Would you like to know about our store policies, hours, or services?]
- Always end with a question to keep the conversation going

EXAMPLES OF CORRECT RESPONSES:
- "That's a great choice! [SHOW:product_card:MacBook Pro 16:laptop-pro-16] Want to know more about the display or performance?"
- "Let me show you a comparison! [SHOW:comparison:MacBook Comparison:laptop-pro-16,laptop-air-15] Which one sounds better for your needs?"
- "Here are the key features! [SHOW:list:Key Features:M3 Pro chip,18-hour battery,16.2-inch display] Pretty impressive, right?"
- "Let me ask you a few quick questions to find the perfect match: [SHOW:interview_question:Budget Range:What's your budget range?]"
- "Why is this attractive? [SHOW:list:Why This Product is Great:Lightweight design,Long battery life,Powerful performance] What interests you most?"
- "What makes this special? [SHOW:list:What Makes This Special:Premium build quality,Latest technology,Excellent value] Pretty compelling, right?"
- "Let me show you the specs! [SHOW:specs:Performance Specs:laptop-pro-16] Pretty impressive, right?"
- "Hi there! [SHOW:leading_question:Visit Occasion:What brings you in today?] I'm here to help you find exactly what you need!"
- "I'd love to help you! [SHOW:leading_question:Exploration Style:Would you like to explore categories or need something specific?]"
- "Let me understand what you're looking for! [SHOW:leading_question:Product Focus:Are you looking for a specific product or want to see what's available?]"

EXAMPLES OF WRONG RESPONSES (DON'T DO THIS):
- "That's a great choice! This laptop is perfect for everyday use. What would you like to know more about?"
- "The MacBook Pro has excellent performance and battery life. Would you like to see more details?"
- "This product is very attractive because of its features and design. What else can I help you with?"

REMEMBER: Every response MUST include [SHOW:...] tools!

CRITICAL REMINDER: 
- You MUST use [SHOW:...] tools in EVERY response
- Do NOT provide plain text responses without tools
- If you don't use tools, the customer won't see interactive content
- Always include at least one [SHOW:...] command in your response

FINAL CHECK: Before sending your response, make sure it contains at least one [SHOW:...] tool. If it doesn't, add one!

Remember: Use tools to show rich content, be helpful and conversational!`

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

  private async getEnhancedFallbackResponse(userInput: string, context: ShopkeeperContext): Promise<ParsedResponse> {
    const { selectedProduct, allProducts } = context
    const input = userInput.toLowerCase()
    
    // Analyze conversation state for better responses
    const conversationState = this.flowManager.analyzeUserInput(userInput, selectedProduct)
    
    let responseText = ""
    const assets: any[] = []

    // Product-specific responses with assets
    if (selectedProduct) {
      if (input.includes('feature') || input.includes('what does it have')) {
        responseText = `The ${selectedProduct.name} has some awesome features! Let me show you the details.`
        assets.push({
          type: 'product_card',
          title: 'Product Details',
          data: { product: selectedProduct },
          interactive: true,
          clickable: true,
          action: 'select_product'
        })
      } else if (input.includes('price') || input.includes('cost')) {
        responseText = `The ${selectedProduct.name} is $${selectedProduct.price}. Great value for what you get!`
        assets.push({
          type: 'product_card',
          title: 'Product Details',
          data: { product: selectedProduct },
          interactive: true,
          clickable: true,
          action: 'select_product'
        })
      } else {
        responseText = `The ${selectedProduct.name} is a great choice! What would you like to know about it?`
        assets.push({
          type: 'product_card',
          title: 'Product Details',
          data: { product: selectedProduct },
          interactive: true,
          clickable: true,
          action: 'select_product'
        })
      }
    } else if (input.includes('compare') || conversationState.userIntent === 'comparing') {
      responseText = "I'd love to help you compare products! Let me show you some options."
      const comparisonProducts = allProducts.slice(0, 3)
      assets.push({
        type: 'comparison',
        title: 'Product Comparison',
        data: { products: comparisonProducts },
        interactive: true,
        clickable: true,
        action: 'compare_products'
      })
    } else if (input.includes('recommend') || input.includes('suggest')) {
      responseText = "I'd love to help you find the perfect product! Here are some great recommendations."
      const recommendedProducts = allProducts.slice(0, 3)
      assets.push({
        type: 'recommendations',
        title: 'Recommended for You',
        data: { 
          products: recommendedProducts,
          showMatch: true,
          showPrice: true
        },
        interactive: true,
        clickable: true,
        action: 'select_recommendation'
      })
    } else if (input.includes('budget') || input.includes('price range')) {
      responseText = "Great question! Let me ask you a few quick questions to find the perfect match for your budget."
      assets.push({
        type: 'interview_question',
        title: 'Budget Range',
        data: {
          question: "What's your budget range?",
          type: 'budget_range',
          category: 'budget',
          required: true
        },
        interactive: true,
        clickable: true,
        action: 'interview_answer'
      })
    } else {
      responseText = "I'm here to help you find the perfect product! What are you looking for today?"
      const topProducts = allProducts.slice(0, 3)
      assets.push({
        type: 'recommendations',
        title: 'Popular Products',
        data: { 
          products: topProducts,
          showPrice: true
        },
        interactive: true,
        clickable: true,
        action: 'select_recommendation'
      })
    }

    return {
      text: responseText,
      assets,
      contextualCommands: this.getDefaultContextualCommands(conversationState, selectedProduct)
    }
  }

  private getDefaultContextualCommands(conversationState: ConversationState, selectedProduct: Product | null): string[] {
    const commands: string[] = []
    
    if (selectedProduct) {
      commands.push('Show features', 'View specs', 'Compare products', 'Warranty info')
    } else if (conversationState.userIntent === 'comparing') {
      commands.push('Comparison table', 'Key differences', 'Get recommendation', 'Back to products')
    } else {
      commands.push('Browse products', 'Get recommendations', 'Show categories', 'What can you do?')
    }
    
    return commands.slice(0, 4)
  }

  async checkOllamaConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`)
      return response.ok
    } catch {
      return false
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
export const enhancedOllamaService = new EnhancedOllamaService()
