import { ConversationState } from './ConversationFlowManager'
import { Product } from '../data/ProductCatalog'

export interface ContentAsset {
  type: 'card' | 'list' | 'table' | 'image' | 'comparison' | 'specs' | 'policies' | 'recommendations' | 'interview_question' | 'leading_question'
  data: any
  title?: string
  priority: number
}

export class ContentAssetGenerator {
  static generateAssets(
    state: ConversationState,
    selectedProduct: Product | null,
    userInput: string,
    products: Product[]
  ): ContentAsset[] {
    console.log('🔍 ContentAssetGenerator.generateAssets called with:', {
      state,
      selectedProduct: selectedProduct?.name || 'none',
      userInput,
      productsCount: products.length
    })
    
    const assets: ContentAsset[] = []
    const lowerInput = userInput.toLowerCase()

    // Product card for selected product
    if (selectedProduct) {
      assets.push({
        type: 'card',
        title: 'Product Details',
        data: {
          product: selectedProduct,
          showImage: true,
          showPrice: true,
          showFeatures: true,
          showDescription: true
        },
        priority: 1
      })
    }

    // Specifications
    if (lowerInput.includes('spec') || lowerInput.includes('specification') || lowerInput.includes('specs')) {
      if (selectedProduct && selectedProduct.specifications) {
        assets.push({
          type: 'specs',
          title: 'Specifications',
          data: { specifications: selectedProduct.specifications },
          priority: 1
        })
      }
    }

    // Features list
    if (lowerInput.includes('feature') || lowerInput.includes('features')) {
      if (selectedProduct && selectedProduct.features) {
        assets.push({
          type: 'list',
          title: 'Key Features',
          data: {
            items: selectedProduct.features.map(feature => `• ${feature}`)
          },
          priority: 2
        })
      }
    }

    // Comparison table
    if (lowerInput.includes('compare') || state.userIntent === 'comparing') {
      const comparisonProducts = state.mentionedProducts.length >= 2 
        ? products.filter(p => state.mentionedProducts.includes(p.id))
        : products.slice(0, 3) // Show top 3 if no specific products mentioned

      if (comparisonProducts.length > 1) {
        assets.push({
          type: 'comparison',
          title: 'Product Comparison',
          data: { products: comparisonProducts },
          priority: 1
        })
      }
    }

    // Policies and support
    if (lowerInput.includes('warranty') || lowerInput.includes('return') || lowerInput.includes('policy')) {
      assets.push({
        type: 'policies',
        title: 'Policies & Support',
        data: {
          items: [
            '🛡️ 1-year manufacturer warranty',
            '↩️ 30-day return policy',
            '🚚 Free shipping on orders over $50',
            '📞 24/7 customer support',
            '🔧 Extended warranty options available',
            '💳 Multiple payment options',
            '🏪 In-store pickup available'
          ]
        },
        priority: 2
      })
    }

    // Budget-based recommendations
    if (lowerInput.includes('budget') || lowerInput.includes('cheap') || lowerInput.includes('affordable')) {
      const budgetProducts = this.filterByBudget(products, state.userPreferences.budget)
      if (budgetProducts.length > 0) {
        assets.push({
          type: 'recommendations',
          title: 'Budget-Friendly Options',
          data: {
            products: budgetProducts.slice(0, 4),
            showPrice: true,
            showMatch: true
          },
          priority: 1
        })
      }
    }

    // Category-based recommendations
    if (lowerInput.includes('category') || lowerInput.includes('type') || state.userPreferences.useCase) {
      const categoryProducts = this.filterByCategory(products, state.userPreferences.useCase)
      if (categoryProducts.length > 0) {
        assets.push({
          type: 'recommendations',
          title: `${this.getCategoryTitle(state.userPreferences.useCase)} Products`,
          data: {
            products: categoryProducts.slice(0, 4),
            showPrice: true,
            showCategory: true
          },
          priority: 2
        })
      }
    }

    // General recommendations for initial stage
    if (state.conversationStage === 'initial' || lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
      const topProducts = this.getTopProducts(products, state.userPreferences)
      assets.push({
        type: 'recommendations',
        title: 'Recommended for You',
        data: {
          products: topProducts.slice(0, 3),
          showPrice: true,
          showMatch: true,
          showReason: true
        },
        priority: 1
      })
    }

    // Product list for browsing
    if (lowerInput.includes('show') || lowerInput.includes('browse') || lowerInput.includes('all')) {
      const filteredProducts = this.filterProducts(products, state.userPreferences)
      assets.push({
        type: 'list',
        title: 'Available Products',
        data: {
          items: filteredProducts.slice(0, 6).map(product => ({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image
          }))
        },
        priority: 1
      })
    }

    // Sort by priority and return top 3
    return assets
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3)
  }

  private static filterByBudget(products: Product[], budget?: { min?: number; max?: number }): Product[] {
    if (!budget) return products.slice(0, 4)
    
    return products.filter(product => {
      if (budget.min && product.price < budget.min) return false
      if (budget.max && product.price > budget.max) return false
      return true
    }).sort((a, b) => a.price - b.price)
  }

  private static filterByCategory(products: Product[], useCase?: string): Product[] {
    if (!useCase) return products.slice(0, 4)

    const categoryMap: Record<string, string[]> = {
      'work': ['Computers', 'Tablets'],
      'gaming': ['Computers', 'Phones'],
      'creative': ['Computers', 'Tablets'],
      'student': ['Computers', 'Tablets', 'Phones'],
      'business': ['Computers', 'Phones'],
      'travel': ['Phones', 'Tablets']
    }

    const allowedCategories = categoryMap[useCase] || []
    return products.filter(product => allowedCategories.includes(product.category))
  }

  private static getCategoryTitle(useCase?: string): string {
    const titles: Record<string, string> = {
      'work': 'Work & Productivity',
      'gaming': 'Gaming',
      'creative': 'Creative',
      'student': 'Student',
      'business': 'Business',
      'travel': 'Travel'
    }
    return titles[useCase || ''] || 'Recommended'
  }

  private static getTopProducts(products: Product[], preferences: any): Product[] {
    // Simple scoring based on preferences
    return products
      .map(product => ({
        ...product,
        score: this.calculateProductScore(product, preferences)
      }))
      .sort((a, b) => b.score - a.score)
  }

  private static calculateProductScore(product: Product, preferences: any): number {
    let score = 0

    // Budget scoring
    if (preferences.budget) {
      if (preferences.budget.max && product.price <= preferences.budget.max) {
        score += 10
      }
      if (preferences.budget.min && product.price >= preferences.budget.min) {
        score += 5
      }
    }

    // Category scoring
    if (preferences.useCase) {
      const categoryMap: Record<string, string[]> = {
        'work': ['Computers', 'Tablets'],
        'gaming': ['Computers', 'Phones'],
        'creative': ['Computers', 'Tablets'],
        'student': ['Computers', 'Tablets', 'Phones'],
        'business': ['Computers', 'Phones'],
        'travel': ['Phones', 'Tablets']
      }
      
      const allowedCategories = categoryMap[preferences.useCase] || []
      if (allowedCategories.includes(product.category)) {
        score += 15
      }
    }

    // Brand preference
    if (preferences.brand && product.name.toLowerCase().includes(preferences.brand.toLowerCase())) {
      score += 20
    }

    // Price preference
    if (preferences.priorities?.includes('price')) {
      score += 10 - (product.price / 100) // Lower price = higher score
    }

    // Performance preference
    if (preferences.priorities?.includes('performance')) {
      // Simple heuristic: higher price often means better performance
      score += product.price / 100
    }

    return score
  }

  private static filterProducts(products: Product[], preferences: any): Product[] {
    let filtered = [...products]

    // Budget filter
    if (preferences.budget) {
      filtered = filtered.filter(product => {
        if (preferences.budget.min && product.price < preferences.budget.min) return false
        if (preferences.budget.max && product.price > preferences.budget.max) return false
        return true
      })
    }

    // Category filter
    if (preferences.useCase) {
      const categoryMap: Record<string, string[]> = {
        'work': ['Computers', 'Tablets'],
        'gaming': ['Computers', 'Phones'],
        'creative': ['Computers', 'Tablets'],
        'student': ['Computers', 'Tablets', 'Phones'],
        'business': ['Computers', 'Phones'],
        'travel': ['Phones', 'Tablets']
      }
      
      const allowedCategories = categoryMap[preferences.useCase] || []
      if (allowedCategories.length > 0) {
        filtered = filtered.filter(product => allowedCategories.includes(product.category))
      }
    }

    // Brand filter
    if (preferences.brand) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(preferences.brand.toLowerCase())
      )
    }

    return filtered
  }

  // Interview question generation methods
  static generateInterviewQuestion(questionType: string, title: string, data: string): ContentAsset {
    const questionData = this.createInterviewQuestionData(questionType, title, data)
    
    return {
      type: 'interview_question',
      title: title,
      data: questionData,
      priority: 1
    }
  }

  // Leading question generation methods
  static generateLeadingQuestion(questionType: string, title: string, data: string): ContentAsset {
    const questionData = this.createLeadingQuestionData(questionType, title, data)
    
    return {
      type: 'leading_question',
      title: title,
      data: questionData,
      priority: 1
    }
  }

  private static createInterviewQuestionData(questionType: string, title: string, data: string): any {
    const questionMap: Record<string, any> = {
      'Budget Range': {
        id: 'budget',
        question: data || "What's your budget range?",
        type: 'budget_range',
        category: 'budget',
        required: true
      },
      'Use Case': {
        id: 'use_case',
        question: data || "What will you mainly use this for?",
        type: 'single_choice',
        options: [
          { id: 'work', label: 'Work/Professional', value: 'work', description: 'For business and professional use' },
          { id: 'personal', label: 'Personal Use', value: 'personal', description: 'For personal daily activities' },
          { id: 'gaming', label: 'Gaming', value: 'gaming', description: 'For gaming and entertainment' },
          { id: 'creative', label: 'Creative Work', value: 'creative', description: 'For creative projects and design' },
          { id: 'travel', label: 'Travel', value: 'travel', description: 'For travel and mobility' }
        ],
        category: 'use_case',
        required: true
      },
      'Style Preference': {
        id: 'style',
        question: data || "What style appeals to you most?",
        type: 'single_choice',
        options: [
          { id: 'modern', label: 'Modern & Sleek', value: 'modern', description: 'Clean, minimalist design' },
          { id: 'classic', label: 'Classic & Professional', value: 'classic', description: 'Traditional, business-appropriate styling' },
          { id: 'gaming', label: 'Gaming-Focused', value: 'gaming', description: 'RGB lighting, aggressive design' },
          { id: 'minimalist', label: 'Minimalist', value: 'minimalist', description: 'Simple, clean, no-frills design' }
        ],
        category: 'style',
        required: false
      },
      'Brand Preference': {
        id: 'brand',
        question: data || "Do you have any brand preferences?",
        type: 'multiple_choice',
        options: [
          { id: 'apple', label: 'Apple', value: 'apple', description: 'MacBook, iPhone, iPad ecosystem' },
          { id: 'samsung', label: 'Samsung', value: 'samsung', description: 'Galaxy phones, tablets, and laptops' },
          { id: 'microsoft', label: 'Microsoft', value: 'microsoft', description: 'Surface devices and Windows ecosystem' },
          { id: 'google', label: 'Google', value: 'google', description: 'Pixel phones and Chromebooks' },
          { id: 'lenovo', label: 'Lenovo', value: 'lenovo', description: 'ThinkPad and IdeaPad series' },
          { id: 'hp', label: 'HP', value: 'hp', description: 'Pavilion and EliteBook series' }
        ],
        category: 'brand',
        required: false
      },
      'Priority Ranking': {
        id: 'priorities',
        question: data || "Rank your top priorities for this purchase:",
        type: 'priority_ranking',
        options: [
          { id: 'performance', label: 'Performance', value: 'performance', description: 'Speed and processing power' },
          { id: 'battery', label: 'Battery Life', value: 'battery', description: 'Long-lasting battery' },
          { id: 'portability', label: 'Portability', value: 'portability', description: 'Lightweight and easy to carry' },
          { id: 'display', label: 'Display Quality', value: 'display', description: 'High-resolution screen' },
          { id: 'storage', label: 'Storage Space', value: 'storage', description: 'Large storage capacity' },
          { id: 'price', label: 'Price', value: 'price', description: 'Affordable pricing' }
        ],
        category: 'priorities',
        required: true
      }
    }

    return questionMap[title] || {
      id: 'custom',
      question: data || title,
      type: 'text',
      category: 'general',
      required: false
    }
  }

  private static createLeadingQuestionData(questionType: string, title: string, data: string): any {
    const questionMap: Record<string, any> = {
      'Visit Occasion': {
        id: 'visit_occasion',
        question: data || "What brings you in today?",
        type: 'single_choice',
        category: 'visit_purpose',
        required: false,
        options: [
          { id: 'browsing', label: 'Just browsing', value: 'browsing', description: 'Looking around to see what\'s available' },
          { id: 'specific', label: 'Looking for something specific', value: 'specific', description: 'I have a particular product in mind' },
          { id: 'recommendation', label: 'Need recommendations', value: 'recommendation', description: 'Help me find the right product' },
          { id: 'comparison', label: 'Comparing options', value: 'comparison', description: 'I want to see different choices' }
        ]
      },
      'Exploration Style': {
        id: 'exploration_style',
        question: data || "Would you like to explore categories or need something specific?",
        type: 'single_choice',
        category: 'exploration_style',
        required: false,
        options: [
          { id: 'categories', label: 'Explore categories', value: 'categories', description: 'Show me different product types' },
          { id: 'specific', label: 'Need something specific', value: 'specific', description: 'I know what I\'m looking for' },
          { id: 'recommendations', label: 'Get recommendations', value: 'recommendations', description: 'Help me choose the best option' },
          { id: 'compare', label: 'Compare products', value: 'compare', description: 'I want to see side-by-side comparisons' }
        ]
      },
      'Product Focus': {
        id: 'product_focus',
        question: data || "Are you looking for a specific product or want to see what's available?",
        type: 'single_choice',
        category: 'product_focus',
        required: false,
        options: [
          { id: 'specific', label: 'Looking for a specific product', value: 'specific', description: 'I have a particular model in mind' },
          { id: 'browse', label: 'Want to see what\'s available', value: 'browse', description: 'Show me all the options' },
          { id: 'recommendations', label: 'Need personalized recommendations', value: 'recommendations', description: 'Help me find the perfect match' },
          { id: 'compare', label: 'Want to compare options', value: 'compare', description: 'I want to see different choices' }
        ]
      },
      'Shop Information': {
        id: 'shop_info',
        question: data || "Would you like to know about our store policies, hours, or services?",
        type: 'single_choice',
        category: 'shop_info',
        required: false,
        options: [
          { id: 'policies', label: 'Store policies', value: 'policies', description: 'Warranty, returns, shipping info' },
          { id: 'hours', label: 'Store hours', value: 'hours', description: 'When are you open?' },
          { id: 'services', label: 'Services offered', value: 'services', description: 'What services do you provide?' },
          { id: 'contact', label: 'Contact information', value: 'contact', description: 'How can I reach you?' }
        ]
      }
    }

    return questionMap[title] || {
      id: 'custom',
      question: data || title,
      type: 'single_choice',
      category: 'general',
      required: false,
      options: [
        { id: 'yes', label: 'Yes', value: 'yes', description: 'I\'d like to know more' },
        { id: 'no', label: 'No', value: 'no', description: 'Not right now' }
      ]
    }
  }
}
