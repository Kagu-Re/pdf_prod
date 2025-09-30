import Logger from '../utils/Logger'

export interface ConvertedResponse {
  content: string
  assets: any[]
  commands: Array<{
    id: string
    text: string
    icon: string
    action: string
  }>
  nextStage: string | null
  contextUpdates: {
    userIntent: string
    conversationGoals: string[]
    contextFlags: Record<string, any>
  }
  confidence: number
  reasoning: string
}

export class BrowserResponseConverter {
  private static foodDeliveryContext = {
    serviceType: "food_delivery",
    availableTools: [
      "food_items", "preferences_collector", "order_summary", 
      "delivery_setup", "nutrition_advice", "interview_question", 
      "leading_question"
    ],
    stages: [
      "greeting", "needs_assessment", "menu_exploration", 
      "nutrition_consultation", "order_placement", "delivery_setup", 
      "privacy_consent", "confirmation"
    ]
  }

  /**
   * Convert Ollama's plain text response to structured JSON
   */
  static convertResponse(
    ollamaResponse: string, 
    currentStage: string = 'greeting'
  ): ConvertedResponse {
    Logger.debug('BrowserResponseConverter', 'Converting Ollama response', {
      responseLength: ollamaResponse.length,
      currentStage,
      responsePreview: ollamaResponse.substring(0, 100)
    })

    try {
      // Extract [SHOW:...] tools from the response
      const showTools = this.extractShowTools(ollamaResponse)
      
      // Determine the next stage based on content and current stage
      const nextStage = this.determineNextStage(ollamaResponse, currentStage)
      
      // Generate appropriate commands based on stage and content
      const commands = this.generateCommands(currentStage, nextStage)
      
      // Create context updates based on the response
      const contextUpdates = this.createContextUpdates(ollamaResponse, currentStage)
      
      // Clean the content (remove any non-tool text that shouldn't be in content)
      const cleanContent = this.cleanContent(ollamaResponse)
      
      // Build the structured response
      const structuredResponse: ConvertedResponse = {
        content: cleanContent,
        assets: [], // Will be populated by the frontend
        commands: commands,
        nextStage: nextStage,
        contextUpdates: contextUpdates,
        confidence: 0.8,
        reasoning: `Converted from Ollama response for ${currentStage} stage`
      }

      Logger.info('BrowserResponseConverter', 'Successfully converted response', {
        hasContent: !!structuredResponse.content,
        hasCommands: !!structuredResponse.commands,
        nextStage: structuredResponse.nextStage
      })

      return structuredResponse
      
    } catch (error) {
      Logger.error('BrowserResponseConverter', 'Failed to convert response', { 
        error: error.message,
        responsePreview: ollamaResponse.substring(0, 100)
      })
      
      // Fallback response if conversion fails
      return this.createFallbackResponse(ollamaResponse, currentStage)
    }
  }

  private static extractShowTools(response: string): Array<{type: string, title: string, data: string}> {
    const showPattern = /\[SHOW:([^:]+):([^:]+):([^\]]+)\]/g
    const tools: Array<{type: string, title: string, data: string}> = []
    let match

    while ((match = showPattern.exec(response)) !== null) {
      tools.push({
        type: match[1].trim(),
        title: match[2].trim(),
        data: match[3].trim()
      })
    }

    return tools
  }

  private static determineNextStage(response: string, currentStage: string): string | null {
    const responseLower = response.toLowerCase()
    
    // Stage transition logic
    if (currentStage === "greeting") {
      if (this.containsAny(responseLower, ["menu", "food", "items", "browse"])) {
        return "menu_exploration"
      } else if (this.containsAny(responseLower, ["preferences", "dietary", "allergies"])) {
        return "needs_assessment"
      } else {
        return "needs_assessment"
      }
    }
    
    if (currentStage === "needs_assessment") {
      if (this.containsAny(responseLower, ["menu", "food", "items", "browse"])) {
        return "menu_exploration"
      } else if (this.containsAny(responseLower, ["order", "add", "cart"])) {
        return "order_placement"
      } else {
        return "menu_exploration"
      }
    }
    
    if (currentStage === "menu_exploration") {
      if (this.containsAny(responseLower, ["order", "add", "cart", "checkout"])) {
        return "order_placement"
      } else if (this.containsAny(responseLower, ["nutrition", "health", "calories"])) {
        return "nutrition_consultation"
      } else {
        return "order_placement"
      }
    }
    
    if (currentStage === "order_placement") {
      if (this.containsAny(responseLower, ["delivery", "pickup", "address"])) {
        return "delivery_setup"
      } else {
        return "delivery_setup"
      }
    }
    
    if (currentStage === "delivery_setup") {
      if (this.containsAny(responseLower, ["privacy", "consent", "agree"])) {
        return "privacy_consent"
      } else {
        return "privacy_consent"
      }
    }
    
    if (currentStage === "privacy_consent") {
      return "confirmation"
    }
    
    // Default fallback
    return null
  }

  private static containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword))
  }

  private static generateCommands(currentStage: string, nextStage: string | null): Array<{id: string, text: string, icon: string, action: string}> {
    const commands: Array<{id: string, text: string, icon: string, action: string}> = []
    
    // Only provide commands that are directly relevant to the current stage
    switch (currentStage) {
      case 'greeting':
        commands.push(
          { id: "browse_menu", text: "Browse Menu", icon: "🍽️", action: "browse_menu" }
        )
        break
        
      case 'needs_assessment':
        commands.push(
          { id: "set_preferences", text: "Set Preferences", icon: "⚙️", action: "set_preferences" }
        )
        break
        
      case 'menu_exploration':
        commands.push(
          { id: "view_cart", text: "View Cart", icon: "🛒", action: "view_cart" }
        )
        break
        
      case 'order_placement':
        commands.push(
          { id: "checkout", text: "Checkout", icon: "💳", action: "checkout" }
        )
        break
        
      case 'delivery_setup':
        commands.push(
          { id: "confirm_delivery", text: "Confirm Delivery", icon: "🚚", action: "confirm_delivery" }
        )
        break
        
      case 'privacy_consent':
        commands.push(
          { id: "provide_consent", text: "Provide Consent", icon: "✅", action: "provide_consent" }
        )
        break
        
      case 'confirmation':
        // No commands needed for confirmation
        break
        
      default:
        commands.push(
          { id: "help", text: "Help", icon: "❓", action: "help" }
        )
    }
    
    return commands
  }

  private static createContextUpdates(response: string, currentStage: string): {
    userIntent: string
    conversationGoals: string[]
    contextFlags: Record<string, any>
  } {
    const responseLower = response.toLowerCase()
    
    const updates = {
      userIntent: "unknown",
      conversationGoals: [] as string[],
      contextFlags: {} as Record<string, any>
    }
    
    // Determine user intent
    if (this.containsAny(responseLower, ["menu", "food", "items", "browse"])) {
      updates.userIntent = "browse_menu"
      updates.conversationGoals.push("explore_options")
    } else if (this.containsAny(responseLower, ["order", "add", "cart", "buy"])) {
      updates.userIntent = "place_order"
      updates.conversationGoals.push("complete_order")
    } else if (this.containsAny(responseLower, ["preferences", "dietary", "allergies", "restrictions"])) {
      updates.userIntent = "set_preferences"
      updates.conversationGoals.push("understand_needs")
    } else if (this.containsAny(responseLower, ["delivery", "pickup", "address", "location"])) {
      updates.userIntent = "setup_delivery"
      updates.conversationGoals.push("configure_delivery")
    } else if (this.containsAny(responseLower, ["nutrition", "health", "calories", "diet"])) {
      updates.userIntent = "nutrition_advice"
      updates.conversationGoals.push("provide_guidance")
    }
    
    // Set context flags
    if (currentStage === "greeting") {
      updates.contextFlags.first_interaction = true
    }
    
    if (this.containsAny(responseLower, ["urgent", "asap", "quick", "fast"])) {
      updates.contextFlags.urgent_order = true
    }
    
    return updates
  }

  private static cleanContent(response: string): string {
    // Remove any leading/trailing whitespace
    let cleaned = response.trim()
    
    // If the response is just [SHOW:...] tools, add some context
    if (cleaned.startsWith('[SHOW:') && !cleaned.match(/[!\.\?]/)) {
      cleaned = "Let me help you with that! " + cleaned
    }
    
    return cleaned
  }

  private static createFallbackResponse(response: string, currentStage: string): ConvertedResponse {
    return {
      content: response,
      assets: [],
      commands: [
        { id: "browse_menu", text: "Browse Menu", icon: "🍽️", action: "browse_menu" },
        { id: "help", text: "Help", icon: "❓", action: "help" }
      ],
      nextStage: currentStage,
      contextUpdates: {
        userIntent: "unknown",
        conversationGoals: ["understand_needs"],
        contextFlags: { fallback_response: true }
      },
      confidence: 0.5,
      reasoning: "Fallback response due to conversion error"
    }
  }

  /**
   * Test the converter with a sample response
   */
  static testConverter(): void {
    try {
      const testResponse = "Welcome to our food delivery service! [SHOW:leading_question:Visit Occasion:What brings you in today?]"
      const result = this.convertResponse(testResponse, 'greeting')
      
      Logger.info('BrowserResponseConverter', 'Converter test successful', {
        content: result.content,
        commandsCount: result.commands.length,
        nextStage: result.nextStage
      })
      
      console.log('✅ Browser Response Converter Test Results:')
      console.log(JSON.stringify(result, null, 2))
    } catch (error) {
      Logger.error('BrowserResponseConverter', 'Converter test failed', { error: error.message })
      console.error('❌ Browser Response Converter Test Failed:', error.message)
    }
  }
}
