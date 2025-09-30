import { ConversationState } from './ConversationFlowManager'
import { Product } from '../data/ProductCatalog'

export interface ContextualCommand {
  id: string
  text: string
  icon: string
  action: string
  category: 'product' | 'comparison' | 'policy' | 'general'
  priority: number
}

export class ContextualCommandGenerator {
  static generateCommands(
    state: ConversationState, 
    selectedProduct: Product | null, 
    userInput: string
  ): ContextualCommand[] {
    const commands: ContextualCommand[] = []
    const lowerInput = userInput.toLowerCase()

    // Product-specific commands
    if (selectedProduct) {
      commands.push(
        {
          id: 'features',
          text: 'Show features',
          icon: '✨',
          action: 'show_features',
          category: 'product',
          priority: 1
        },
        {
          id: 'specs',
          text: 'View specs',
          icon: '📋',
          action: 'show_specs',
          category: 'product',
          priority: 2
        },
        {
          id: 'compare',
          text: 'Compare with others',
          icon: '⚖️',
          action: 'compare_product',
          category: 'comparison',
          priority: 3
        },
        {
          id: 'warranty',
          text: 'Warranty info',
          icon: '🛡️',
          action: 'show_warranty',
          category: 'policy',
          priority: 4
        }
      )
    }

    // Comparison commands
    if (state.userIntent === 'comparing' || lowerInput.includes('compare')) {
      commands.push(
        {
          id: 'compare_table',
          text: 'Comparison table',
          icon: '📊',
          action: 'show_comparison_table',
          category: 'comparison',
          priority: 1
        },
        {
          id: 'differences',
          text: 'Key differences',
          icon: '🔍',
          action: 'show_differences',
          category: 'comparison',
          priority: 2
        },
        {
          id: 'recommend',
          text: 'Which is better?',
          icon: '👍',
          action: 'get_recommendation',
          category: 'comparison',
          priority: 3
        }
      )
    }

    // Budget-related commands
    if (lowerInput.includes('budget') || lowerInput.includes('price') || lowerInput.includes('cheap')) {
      commands.push(
        {
          id: 'budget_filter',
          text: 'Filter by budget',
          icon: '💰',
          action: 'filter_by_budget',
          category: 'general',
          priority: 1
        },
        {
          id: 'cheap_options',
          text: 'Show cheaper options',
          icon: '💸',
          action: 'show_cheaper_options',
          category: 'general',
          priority: 2
        }
      )
    }

    // Feature-related commands
    if (lowerInput.includes('feature') || lowerInput.includes('spec')) {
      commands.push(
        {
          id: 'all_features',
          text: 'Show all features',
          icon: '🔧',
          action: 'show_all_features',
          category: 'product',
          priority: 1
        },
        {
          id: 'compare_features',
          text: 'Compare features',
          icon: '⚡',
          action: 'compare_features',
          category: 'comparison',
          priority: 2
        }
      )
    }

    // Policy-related commands
    if (lowerInput.includes('warranty') || lowerInput.includes('return') || lowerInput.includes('policy')) {
      commands.push(
        {
          id: 'return_policy',
          text: 'Return policy',
          icon: '↩️',
          action: 'show_return_policy',
          category: 'policy',
          priority: 1
        },
        {
          id: 'shipping',
          text: 'Shipping info',
          icon: '🚚',
          action: 'show_shipping_info',
          category: 'policy',
          priority: 2
        }
      )
    }

    // General browsing commands
    if (state.conversationStage === 'initial' || lowerInput.includes('show') || lowerInput.includes('browse')) {
      commands.push(
        {
          id: 'browse_all',
          text: 'Browse all products',
          icon: '🛍️',
          action: 'browse_products',
          category: 'general',
          priority: 1
        },
        {
          id: 'recommendations',
          text: 'Get recommendations',
          icon: '🎯',
          action: 'get_recommendations',
          category: 'general',
          priority: 2
        },
        {
          id: 'categories',
          text: 'Show categories',
          icon: '📂',
          action: 'show_categories',
          category: 'general',
          priority: 3
        }
      )
    }

    // Help commands
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      commands.push(
        {
          id: 'help',
          text: 'What can you do?',
          icon: '❓',
          action: 'show_help',
          category: 'general',
          priority: 1
        },
        {
          id: 'examples',
          text: 'Show examples',
          icon: '💡',
          action: 'show_examples',
          category: 'general',
          priority: 2
        }
      )
    }

    // Sort by priority and return top 4
    return commands
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 4)
      .map((cmd, index) => ({ ...cmd, priority: index + 1 }))
  }

  static getCommandResponse(command: ContextualCommand, context: any): string {
    const responses: Record<string, string> = {
      'show_features': 'Here are the key features of this product:',
      'show_specs': 'Here are the detailed specifications:',
      'compare_product': 'Let me help you compare this with similar products:',
      'show_warranty': 'Here\'s the warranty and support information:',
      'show_comparison_table': 'Here\'s a detailed comparison table:',
      'show_differences': 'Here are the key differences between these products:',
      'get_recommendation': 'Based on your needs, here\'s my recommendation:',
      'filter_by_budget': 'Let me show you products within your budget:',
      'show_cheaper_options': 'Here are some more affordable options:',
      'show_all_features': 'Here are all the features of this product:',
      'compare_features': 'Let me compare the features for you:',
      'show_return_policy': 'Here\'s our return and exchange policy:',
      'show_shipping_info': 'Here\'s the shipping and delivery information:',
      'browse_products': 'Here are all our available products:',
      'get_recommendations': 'Let me give you some personalized recommendations:',
      'show_categories': 'Here are our product categories:',
      'show_help': 'Here\'s what I can help you with:',
      'show_examples': 'Here are some examples of what you can ask:'
    }

    return responses[command.action] || 'Let me help you with that!'
  }
}







