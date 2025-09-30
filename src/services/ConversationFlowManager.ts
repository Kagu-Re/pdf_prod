import { Product } from '../data/ProductCatalog'

export interface ConversationState {
  currentTopic: 'greeting' | 'product_inquiry' | 'comparison' | 'policies' | 'general'
  userIntent: 'browsing' | 'comparing' | 'purchasing' | 'support'
  conversationStage: 'initial' | 'exploring' | 'deciding' | 'concluding'
  mentionedProducts: string[]
  userPreferences: {
    budget?: { min?: number; max?: number }
    useCase?: string
    occasion?: string
    style?: string
    brand?: string
    color?: string
    size?: string
    priorities?: string[]
  }
}

export class ConversationFlowManager {
  private state: ConversationState

  constructor() {
    this.state = {
      currentTopic: 'greeting',
      userIntent: 'browsing',
      conversationStage: 'initial',
      mentionedProducts: [],
      userPreferences: {}
    }
  }

  analyzeUserInput(input: string, selectedProduct: Product | null): ConversationState {
    const lowerInput = input.toLowerCase()
    
    // Update mentioned products
    if (selectedProduct && !this.state.mentionedProducts.includes(selectedProduct.id)) {
      this.state.mentionedProducts.push(selectedProduct.id)
    }

    // Detect topic
    if (lowerInput.includes('compare') || lowerInput.includes('vs') || lowerInput.includes('difference')) {
      this.state.currentTopic = 'comparison'
    } else if (lowerInput.includes('warranty') || lowerInput.includes('return') || lowerInput.includes('policy')) {
      this.state.currentTopic = 'policies'
    } else if (lowerInput.includes('feature') || lowerInput.includes('spec') || selectedProduct) {
      this.state.currentTopic = 'product_inquiry'
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('help')) {
      this.state.currentTopic = 'greeting'
    } else {
      this.state.currentTopic = 'general'
    }

    // Detect intent
    if (lowerInput.includes('buy') || lowerInput.includes('purchase') || lowerInput.includes('order')) {
      this.state.userIntent = 'purchasing'
    } else if (lowerInput.includes('compare') || lowerInput.includes('vs')) {
      this.state.userIntent = 'comparing'
    } else if (lowerInput.includes('problem') || lowerInput.includes('issue') || lowerInput.includes('support')) {
      this.state.userIntent = 'support'
    } else {
      this.state.userIntent = 'browsing'
    }

    // Detect conversation stage
    if (this.state.mentionedProducts.length === 0) {
      this.state.conversationStage = 'initial'
    } else if (this.state.mentionedProducts.length === 1) {
      this.state.conversationStage = 'exploring'
    } else if (this.state.mentionedProducts.length >= 2) {
      this.state.conversationStage = 'deciding'
    }

    // Extract preferences
    this.extractPreferences(input)

    return { ...this.state }
  }

  private extractPreferences(input: string) {
    const lowerInput = input.toLowerCase()
    
    // Budget detection
    const budgetMatch = lowerInput.match(/\$?(\d+)(?:-|\s+to\s+|\s+and\s+)\$?(\d+)/)
    if (budgetMatch) {
      this.state.userPreferences.budget = {
        min: parseInt(budgetMatch[1]),
        max: parseInt(budgetMatch[2])
      }
    } else if (lowerInput.includes('cheap') || lowerInput.includes('budget')) {
      this.state.userPreferences.budget = { max: 1000 }
    } else if (lowerInput.includes('expensive') || lowerInput.includes('premium')) {
      this.state.userPreferences.budget = { min: 2000 }
    }

    // Use case detection
    const useCases = ['work', 'gaming', 'creative', 'student', 'business', 'travel', 'home']
    for (const useCase of useCases) {
      if (lowerInput.includes(useCase)) {
        this.state.userPreferences.useCase = useCase
        break
      }
    }

    // Occasion detection
    const occasions = ['gift', 'personal', 'business', 'work', 'travel', 'school', 'home']
    for (const occasion of occasions) {
      if (lowerInput.includes(occasion)) {
        this.state.userPreferences.occasion = occasion
        break
      }
    }

    // Style detection
    const styles = ['modern', 'classic', 'minimalist', 'professional', 'casual', 'elegant', 'sporty']
    for (const style of styles) {
      if (lowerInput.includes(style)) {
        this.state.userPreferences.style = style
        break
      }
    }

    // Brand detection
    const brands = ['apple', 'samsung', 'microsoft', 'google', 'dell', 'hp', 'lenovo']
    for (const brand of brands) {
      if (lowerInput.includes(brand)) {
        this.state.userPreferences.brand = brand
        break
      }
    }

    // Color detection
    const colors = ['black', 'white', 'silver', 'gold', 'blue', 'red', 'green', 'gray', 'space gray']
    for (const color of colors) {
      if (lowerInput.includes(color)) {
        this.state.userPreferences.color = color
        break
      }
    }

    // Size detection
    const sizes = ['small', 'medium', 'large', 'compact', 'portable', 'big', 'huge']
    for (const size of sizes) {
      if (lowerInput.includes(size)) {
        this.state.userPreferences.size = size
        break
      }
    }

    // Priority detection
    const priorities = ['performance', 'battery', 'portability', 'price', 'camera', 'display', 'storage', 'speed']
    this.state.userPreferences.priorities = priorities.filter(priority => 
      lowerInput.includes(priority)
    )
  }

  getContextualPrompt(state: ConversationState, selectedProduct: Product | null, allProducts: Product[]): string {
    let contextPrompt = ""

    // Add conversation stage context
    switch (state.conversationStage) {
      case 'initial':
        contextPrompt += "The customer just started browsing. Be welcoming and help them discover products.\n"
        break
      case 'exploring':
        contextPrompt += "The customer is exploring a specific product. Provide detailed, helpful information.\n"
        break
      case 'deciding':
        contextPrompt += "The customer is comparing products. Help them make a decision with clear comparisons.\n"
        break
      case 'concluding':
        contextPrompt += "The customer seems ready to make a decision. Offer final assistance and next steps.\n"
        break
    }

    // Add intent context
    switch (state.userIntent) {
      case 'browsing':
        contextPrompt += "The customer is browsing. Suggest products and ask what they're looking for.\n"
        break
      case 'comparing':
        contextPrompt += "The customer wants to compare products. Focus on differences and help them choose.\n"
        break
      case 'purchasing':
        contextPrompt += "The customer is ready to buy. Provide purchase information and next steps.\n"
        break
      case 'support':
        contextPrompt += "The customer needs support. Be helpful and solution-oriented.\n"
        break
    }

    // Add preferences context
    if (state.userPreferences.budget) {
      contextPrompt += `Customer budget: $${state.userPreferences.budget.min || 0} - $${state.userPreferences.budget.max || 'unlimited'}\n`
    }
    if (state.userPreferences.useCase) {
      contextPrompt += `Customer use case: ${state.userPreferences.useCase}\n`
    }
    if (state.userPreferences.priorities?.length) {
      contextPrompt += `Customer priorities: ${state.userPreferences.priorities.join(', ')}\n`
    }

    // Add mentioned products context
    if (state.mentionedProducts.length > 0) {
      contextPrompt += `Products mentioned: ${state.mentionedProducts.join(', ')}\n`
    }

    return contextPrompt
  }

  getSuggestedQuestions(state: ConversationState, selectedProduct: Product | null): string[] {
    const suggestions: string[] = []

    switch (state.conversationStage) {
      case 'initial':
        suggestions.push("What are you looking for today?")
        suggestions.push("What's your budget range?")
        suggestions.push("What will you mainly use it for?")
        break
      case 'exploring':
        if (selectedProduct) {
          suggestions.push(`What do you think about the ${selectedProduct.name}?`)
          suggestions.push("Want to compare it with something else?")
          suggestions.push("Any specific features you're curious about?")
        }
        break
      case 'deciding':
        suggestions.push("Which one sounds better to you?")
        suggestions.push("What's most important to you?")
        suggestions.push("Ready to make a decision?")
        break
    }

    return suggestions
  }

  reset() {
    this.state = {
      currentTopic: 'greeting',
      userIntent: 'browsing',
      conversationStage: 'initial',
      mentionedProducts: [],
      userPreferences: {}
    }
  }
}
