import { Product } from '../data/ProductCatalog'
import { ConversationState } from './ConversationFlowManager'

export interface ConversationTemplate {
  id: string
  pattern: string
  response: (context: TemplateContext) => string
  followUp?: string[]
}

interface TemplateContext {
  selectedProduct?: Product | null
  conversationState: ConversationState
  userInput: string
}

export class ConversationTemplates {
  private templates: ConversationTemplate[] = []

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    this.templates = [
      // Greeting templates
      {
        id: 'greeting_initial',
        pattern: 'hello|hi|hey|good morning|good afternoon',
        response: (context) => {
          const greetings = [
            "Hey there! Welcome to our shop! What can I help you find today?",
            "Hi! Great to see you! What brings you in today?",
            "Hello! I'm here to help you find the perfect product. What are you looking for?"
          ]
          return greetings[Math.floor(Math.random() * greetings.length)]
        },
        followUp: ["What's your budget?", "What will you use it for?", "Any specific features you need?"]
      },

      // Product inquiry templates
      {
        id: 'product_features',
        pattern: 'features|specs|specifications|what does it have',
        response: (context) => {
          if (context.selectedProduct) {
            const features = context.selectedProduct.features.slice(0, 3).join(', ')
            return `The ${context.selectedProduct.name} has some great features like ${features}. Pretty impressive, right? Want to know more about any of these?`
          }
          return "I'd love to tell you about the features! Which product are you interested in?"
        },
        followUp: ["Want to compare features?", "Any specific feature you're curious about?", "How about the price?"]
      },

      {
        id: 'product_price',
        pattern: 'price|cost|how much|expensive|cheap',
        response: (context) => {
          if (context.selectedProduct) {
            return `The ${context.selectedProduct.name} is $${context.selectedProduct.price}. Pretty good value for what you get! Want to know about any deals or financing?`
          }
          return "What's your budget? I can show you some great options that won't break the bank!"
        },
        followUp: ["Want to see cheaper options?", "Any financing available?", "What about the warranty?"]
      },

      // Comparison templates
      {
        id: 'comparison_request',
        pattern: 'compare|vs|versus|difference|better|which one',
        response: (context) => {
          if (context.conversationState.mentionedProducts.length >= 2) {
            return "Great question! Both are solid choices. What's most important to you - performance, price, or something else? I can help you decide!"
          }
          return "I'd love to help you compare! Which products are you thinking about? Or tell me what you're looking for and I'll suggest the best options!"
        },
        followUp: ["What's your priority?", "Want to see the differences?", "Which one sounds better?"]
      },

      // Policy templates
      {
        id: 'warranty_policy',
        pattern: 'warranty|guarantee|coverage',
        response: (context) => {
          return "Yep, everything comes with a 1-year manufacturer warranty. Pretty standard stuff! We also have extended warranty options if you want extra peace of mind. Anything else you're curious about?"
        },
        followUp: ["Want to know about returns?", "Any other policies?", "Ready to make a decision?"]
      },

      {
        id: 'return_policy',
        pattern: 'return|refund|exchange|take back',
        response: (context) => {
          return "We have a 30-day return policy for most items. Just keep the receipt and original packaging! Pretty hassle-free. What else can I help you with?"
        },
        followUp: ["Want to know about the warranty?", "Any other questions?", "Ready to buy?"]
      },

      // Decision templates
      {
        id: 'decision_help',
        pattern: 'decide|choose|pick|recommend|suggest',
        response: (context) => {
          if (context.conversationState.userPreferences.useCase) {
            return `Based on what you told me about using it for ${context.conversationState.userPreferences.useCase}, I'd recommend the ${context.selectedProduct?.name || 'product that fits your needs'}. What do you think?`
          }
          return "I'd be happy to help you decide! What's most important to you - performance, price, portability, or something else?"
        },
        followUp: ["What's your priority?", "Want to see the differences?", "Any other concerns?"]
      },

      // General help templates
      {
        id: 'general_help',
        pattern: 'help|what can you do|how does this work',
        response: (context) => {
          return "I'm here to help you find the perfect product! You can ask me about features, compare products, check prices, or just tell me what you're looking for. What sounds good?"
        },
        followUp: ["What are you looking for?", "Want to see our products?", "Any specific questions?"]
      }
    ]
  }

  getResponse(userInput: string, context: TemplateContext): string | null {
    const lowerInput = userInput.toLowerCase()
    
    for (const template of this.templates) {
      const regex = new RegExp(template.pattern, 'i')
      if (regex.test(lowerInput)) {
        return template.response(context)
      }
    }
    
    return null
  }

  getFollowUpQuestions(userInput: string, context: TemplateContext): string[] {
    const lowerInput = userInput.toLowerCase()
    
    for (const template of this.templates) {
      const regex = new RegExp(template.pattern, 'i')
      if (regex.test(lowerInput) && template.followUp) {
        return template.followUp
      }
    }
    
    return []
  }

  getContextualResponse(context: TemplateContext): string {
    // Generate contextual responses based on conversation state
    const { conversationState, selectedProduct } = context

    switch (conversationState.conversationStage) {
      case 'initial':
        return "Welcome! I'm here to help you find the perfect product. What are you looking for today?"
      
      case 'exploring':
        if (selectedProduct) {
          return `Great choice looking at the ${selectedProduct.name}! What would you like to know about it?`
        }
        return "What catches your eye? I can tell you all about any of our products!"
      
      case 'deciding':
        return "I can see you're comparing a few options. What's most important to you in making this decision?"
      
      case 'concluding':
        return "Sounds like you're getting close to a decision! Any final questions I can help with?"
    }

    return "How can I help you today?"
  }
}

export const conversationTemplates = new ConversationTemplates()




