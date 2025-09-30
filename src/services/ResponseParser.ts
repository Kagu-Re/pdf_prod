import { Product } from '../data/ProductCatalog'

export interface AssetInstruction {
  type: 'product_card' | 'card' | 'list' | 'table' | 'comparison' | 'specs' | 'policies' | 'recommendations' | 'interview_question' | 'leading_question'
  title?: string
  data: any
  interactive?: boolean
  clickable?: boolean
  action?: string
}

export interface ParsedResponse {
  text: string
  assets: AssetInstruction[]
  contextualCommands?: string[]
}

// Persistent logging
class Logger {
  private static logs: string[] = []
  
  static log(message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data) : ''}`
    this.logs.push(logEntry)
    console.log(logEntry)
  }
  
  static getLogs(): string[] {
    return [...this.logs]
  }
  
  static clearLogs() {
    this.logs = []
  }
}

export class ResponseParser {
  static parseResponse(response: string, products: Product[], selectedProduct?: Product | null): ParsedResponse {
      console.log('🔍 ResponseParser.parseResponse called with:', {
        responseLength: response.length,
        productsCount: products.length,
        selectedProduct: selectedProduct?.name || 'None',
        containsShowPattern: response.includes('[SHOW:'),
        responsePreview: response.substring(0, 200) + '...'
      })
      
      Logger.log('ResponseParser: Starting to parse response', { 
        responseLength: response.length, 
        productsCount: products.length,
        selectedProduct: selectedProduct?.name || 'None',
        containsShowPattern: response.includes('[SHOW:'),
        responsePreview: response.substring(0, 200) + '...'
      })
    
    try {
      const assets: AssetInstruction[] = []
      let cleanText = response

      // Parse asset instructions from response
    const assetPatterns = [
      /\[SHOW:product_card:([^:]+):([^\]]+)\]/g,
      /\[SHOW:card:([^:]+):([^\]]+)\]/g, // Keep old format for backward compatibility
      /\[SHOW:list:([^:]+):([^\]]+)\]/g,
      /\[SHOW:comparison:([^:]+):([^\]]+)\]/g,
      /\[SHOW:table:([^:]+):([^\]]+)\]/g, // Keep old format for backward compatibility
      /\[SHOW:specs:([^:]+):([^\]]+)\]/g,
      /\[SHOW:recommendations:([^:]+):([^\]]+)\]/g,
      /\[SHOW:policies:([^:]+):([^\]]+)\]/g,
      /\[SHOW:policies:([^:]+)\]/g, // Keep old format for backward compatibility
      /\[SHOW:interview_question:([^:]+):([^\]]+)\]/g,
      /\[SHOW:leading_question:([^:]+):([^\]]+)\]/g,
      /\[SHOW:food_items:([^:]+):([^\]]+)\]/g,
      /\[SHOW:preferences_collector:([^:]+):([^\]]+)\]/g,
      /\[SHOW:order_summary:([^:]+):([^\]]+)\]/g,
      /\[SHOW:delivery_setup:([^:]+):([^\]]+)\]/g,
      /\[SHOW:nutrition_advice:([^:]+):([^\]]+)\]/g,
      /\[SHOW:service_overview:([^:]+):([^\]]+)\]/g
    ]

      // Process each pattern
      assetPatterns.forEach((pattern, index) => {
        try {
          const matches = [...response.matchAll(pattern)]
          Logger.log(`ResponseParser: Processing pattern ${index}`, { 
            pattern: pattern.toString(), 
            matchesFound: matches.length,
            response: response.substring(0, 200) + '...'
          })
          
          matches.forEach(match => {
            const [fullMatch, type, title, data] = match
            const assetType = type as AssetInstruction['type']
            
            Logger.log(`ResponseParser: Found asset instruction`, { 
              fullMatch, 
              type, 
              title, 
              data,
              assetType 
            })
            
            // Remove the instruction from the text
            cleanText = cleanText.replace(fullMatch, '').trim()
            
            // Generate asset based on type and data
            const asset = this.generateAsset(assetType, title, data, products, selectedProduct)
            if (asset) {
              assets.push(asset)
              Logger.log(`ResponseParser: Generated asset`, { type: asset.type, title: asset.title })
            } else {
              Logger.log(`ResponseParser: Failed to generate asset`, { type, title, data })
            }
          })
        } catch (patternError) {
          Logger.log('ResponseParser: Error processing pattern', { error: patternError.message, patternIndex: index })
        }
      })

      // Auto-generate assets based on content analysis
      const autoAssets = this.autoGenerateAssets(response, products, selectedProduct)
      assets.push(...autoAssets)
      Logger.log('ResponseParser: Auto-generated assets', { count: autoAssets.length })

      // Extract contextual commands from response
      const contextualCommands = this.extractContextualCommands(response)
      Logger.log('ResponseParser: Extracted contextual commands', { count: contextualCommands.length })

      const result = {
        text: cleanText,
        assets,
        contextualCommands
      }
      
      Logger.log('ResponseParser: Parsing completed successfully', { 
        finalTextLength: cleanText.length,
        totalAssets: assets.length,
        commands: contextualCommands.length
      })

      return result
    } catch (error) {
      Logger.log('ResponseParser: Error parsing response', { error: error.message, stack: error.stack })
      return {
        text: response,
        assets: [],
        contextualCommands: []
      }
    }
  }

  private static generateAsset(
    type: AssetInstruction['type'], 
    title: string, 
    data: string, 
    products: Product[], 
    selectedProduct?: Product | null
  ): AssetInstruction | null {
    try {
      Logger.log('ResponseParser: Generating asset', { type, title, data })
      
      switch (type) {
        case 'product_card':
        case 'card':
          const product = this.findProductById(data, products) || selectedProduct
          if (product) {
            return {
              type: 'product_card',
              title,
              data: { product },
              interactive: true,
              clickable: true,
              action: 'select_product'
            }
          }
          break

        case 'list':
          const items = data.split(',').map((item: string) => item.trim())
          return {
            type: 'list',
            title,
            data: { items },
            interactive: true,
            clickable: true,
            action: 'select_item'
          }

        case 'comparison':
        case 'table':
          const productIds = data.split(',').map((id: string) => id.trim())
          const tableProducts = productIds.map(id => this.findProductById(id, products)).filter(Boolean)
          if (tableProducts.length > 0) {
            return {
              type: 'comparison',
              title,
              data: { products: tableProducts },
              interactive: true,
              clickable: true,
              action: 'compare_products'
            }
          }
          break

        case 'specs':
          const specProduct = this.findProductById(data, products) || selectedProduct
          if (specProduct && specProduct.specifications) {
            return {
              type: 'specs',
              title,
              data: { specifications: specProduct.specifications },
              interactive: true,
              clickable: true,
              action: 'view_specs'
            }
          }
          break

        case 'recommendations':
          const budget = data.includes('budget_') ? parseInt(data.split('_')[1]) : undefined
          const recommendedProducts = this.getRecommendedProducts(products, budget)
          return {
            type: 'recommendations',
            title,
            data: { 
              products: recommendedProducts,
              showMatch: true,
              showPrice: true
            },
            interactive: true,
            clickable: true,
            action: 'select_recommendation'
          }

        case 'policies':
          return {
            type: 'policies',
            title,
            data: {
              items: [
                '🛡️ 1-year manufacturer warranty',
                '↩️ 30-day return policy',
                '🚚 Free shipping on orders over $50',
                '📞 24/7 customer support',
                '🔧 Extended warranty options available'
              ]
            },
            interactive: true,
            clickable: true,
            action: 'view_policies'
          }

        case 'interview_question':
          return {
            type: 'interview_question',
            title,
            data: {
              question: data,
              type: this.determineQuestionType(title),
              category: this.determineQuestionCategory(title),
              required: true
            },
            interactive: true,
            clickable: true,
            action: 'interview_answer'
          }

        case 'leading_question':
          return {
            type: 'leading_question',
            title,
            data: {
              question: data,
              type: 'single_choice',
              category: this.determineLeadingQuestionCategory(title),
              required: false,
              options: this.createLeadingQuestionOptions(title)
            },
            interactive: true,
            clickable: true,
            action: 'leading_answer'
          }
        
        case 'food_items':
          return {
            type: 'food_items',
            title,
            data: this.createFoodItemsData(title, data),
            priority: 1
          }
        
        case 'preferences_collector':
          return {
            type: 'preferences_collector',
            title,
            data: this.createPreferencesCollectorData(title, data),
            priority: 1
          }
        
        case 'order_summary':
          return {
            type: 'order_summary',
            title,
            data: this.createOrderSummaryData(title, data),
            priority: 1
          }
        
        case 'delivery_setup':
          return {
            type: 'delivery_setup',
            title,
            data: this.createDeliverySetupData(title, data),
            priority: 1
          }
        
        case 'nutrition_advice':
          return {
            type: 'nutrition_advice',
            title,
            data: this.createNutritionAdviceData(title, data),
            priority: 1
          }
        
        case 'service_overview':
          return {
            type: 'service_overview',
            title,
            data: this.createServiceOverviewData(title, data),
            priority: 1
          }
        
        default:
          Logger.warn('ResponseParser', 'Unknown asset type', { type, title, data })
          return null
      }

      Logger.log('ResponseParser: Could not generate asset', { type, title, data })
      return null
    } catch (error) {
      Logger.log('ResponseParser: Error generating asset', { error: error.message, type, title, data })
      return null
    }
  }

  private static autoGenerateAssets(response: string, products: Product[], selectedProduct?: Product | null): AssetInstruction[] {
    try {
      Logger.log('ResponseParser: Starting auto-generate assets')
      const assets: AssetInstruction[] = []
      const lowerResponse = response.toLowerCase()

      // Auto-generate product card if product is mentioned
      if (selectedProduct && (lowerResponse.includes(selectedProduct.name.toLowerCase()) || lowerResponse.includes('this product'))) {
        assets.push({
          type: 'product_card',
          title: 'Product Details',
          data: { product: selectedProduct },
          interactive: true,
          clickable: true,
          action: 'select_product'
        })
        Logger.log('ResponseParser: Auto-generated product card', { product: selectedProduct.name })
      }

      // Auto-generate comparison if multiple products mentioned
      const mentionedProducts = products.filter(p => 
        lowerResponse.includes(p.name.toLowerCase()) || 
        lowerResponse.includes(p.category.toLowerCase())
      )
      
      if (mentionedProducts.length >= 2) {
        assets.push({
          type: 'comparison',
          title: 'Product Comparison',
          data: { products: mentionedProducts.slice(0, 4) },
          interactive: true,
          clickable: true,
          action: 'compare_products'
        })
        Logger.log('ResponseParser: Auto-generated comparison', { products: mentionedProducts.map(p => p.name) })
      }

      // Auto-generate recommendations if asking for suggestions
      if (lowerResponse.includes('recommend') || lowerResponse.includes('suggest') || lowerResponse.includes('best')) {
        const recommendedProducts = this.getRecommendedProducts(products)
        assets.push({
          type: 'recommendations',
          title: 'Recommended for You',
          data: { 
            products: recommendedProducts.slice(0, 3),
            showMatch: true,
            showPrice: true
          },
          interactive: true,
          clickable: true,
          action: 'select_recommendation'
        })
        Logger.log('ResponseParser: Auto-generated recommendations', { count: recommendedProducts.length })
      }

      // Auto-generate policies if asking about warranty/returns
      if (lowerResponse.includes('warranty') || lowerResponse.includes('return') || lowerResponse.includes('policy')) {
        assets.push({
          type: 'policies',
          title: 'Policies & Support',
          data: {
            items: [
              '🛡️ 1-year manufacturer warranty',
              '↩️ 30-day return policy',
              '🚚 Free shipping on orders over $50',
              '📞 24/7 customer support'
            ]
          },
          interactive: true,
          clickable: true,
          action: 'view_policies'
        })
        Logger.log('ResponseParser: Auto-generated policies')
      }

      Logger.log('ResponseParser: Auto-generate completed', { assetsGenerated: assets.length })
      return assets
    } catch (error) {
      Logger.log('ResponseParser: Error in autoGenerateAssets', { error: error.message })
      return []
    }
  }

  private static extractContextualCommands(response: string): string[] {
    try {
      Logger.log('ResponseParser: Extracting contextual commands')
      const commands: string[] = []
      const lowerResponse = response.toLowerCase()

      // Extract suggested actions from response
      if (lowerResponse.includes('compare') || lowerResponse.includes('comparison')) {
        commands.push('Compare products')
      }
      if (lowerResponse.includes('feature') || lowerResponse.includes('specification')) {
        commands.push('Show features')
      }
      if (lowerResponse.includes('price') || lowerResponse.includes('cost')) {
        commands.push('View pricing')
      }
      if (lowerResponse.includes('recommend') || lowerResponse.includes('suggest')) {
        commands.push('Get recommendations')
      }
      if (lowerResponse.includes('warranty') || lowerResponse.includes('return')) {
        commands.push('View policies')
      }

      const result = commands.slice(0, 4) // Limit to 4 commands
      Logger.log('ResponseParser: Extracted commands', { commands: result })
      return result
    } catch (error) {
      Logger.log('ResponseParser: Error extracting commands', { error: error.message })
      return []
    }
  }

  private static findProductById(id: string, products: Product[]): Product | null {
    return products.find(p => p.id === id) || null
  }

  private static getRecommendedProducts(products: Product[], budget?: number): Product[] {
    let filtered = [...products]
    
    if (budget) {
      filtered = filtered.filter(p => p.price <= budget)
    }
    
    // Sort by price and return top products
    return filtered.sort((a, b) => a.price - b.price).slice(0, 4)
  }

  // Static method to get logs
  static getLogs(): string[] {
    return Logger.getLogs()
  }

  // Static method to clear logs
  static clearLogs(): void {
    Logger.clearLogs()
  }

  private static determineQuestionType(title: string): string {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('budget') || titleLower.includes('price')) {
      return 'budget_range'
    } else if (titleLower.includes('style') || titleLower.includes('design')) {
      return 'single_choice'
    } else if (titleLower.includes('brand') || titleLower.includes('preference')) {
      return 'multiple_choice'
    } else if (titleLower.includes('priority') || titleLower.includes('rank')) {
      return 'priority_ranking'
    } else if (titleLower.includes('use') || titleLower.includes('purpose')) {
      return 'single_choice'
    } else {
      return 'text'
    }
  }

  private static determineQuestionCategory(title: string): string {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('budget') || titleLower.includes('price')) {
      return 'budget'
    } else if (titleLower.includes('style') || titleLower.includes('design')) {
      return 'style'
    } else if (titleLower.includes('brand')) {
      return 'brand'
    } else if (titleLower.includes('priority') || titleLower.includes('rank')) {
      return 'priorities'
    } else if (titleLower.includes('use') || titleLower.includes('purpose')) {
      return 'use_case'
    } else {
      return 'general'
    }
  }

  private static determineLeadingQuestionCategory(title: string): string {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('visit') || titleLower.includes('occasion')) {
      return 'visit_purpose'
    } else if (titleLower.includes('exploration') || titleLower.includes('style')) {
      return 'exploration_style'
    } else if (titleLower.includes('product') || titleLower.includes('focus')) {
      return 'product_focus'
    } else if (titleLower.includes('shop') || titleLower.includes('information')) {
      return 'shop_info'
    } else {
      return 'general'
    }
  }

  private static createLeadingQuestionOptions(title: string): any[] {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('visit') || titleLower.includes('occasion')) {
      return [
        { id: 'browsing', label: 'Just browsing', value: 'browsing', description: 'Looking around to see what\'s available' },
        { id: 'specific', label: 'Looking for something specific', value: 'specific', description: 'I have a particular product in mind' },
        { id: 'recommendation', label: 'Need recommendations', value: 'recommendation', description: 'Help me find the right product' },
        { id: 'comparison', label: 'Comparing options', value: 'comparison', description: 'I want to see different choices' }
      ]
    } else if (titleLower.includes('exploration') || titleLower.includes('style')) {
      return [
        { id: 'categories', label: 'Explore categories', value: 'categories', description: 'Show me different product types' },
        { id: 'specific', label: 'Need something specific', value: 'specific', description: 'I know what I\'m looking for' },
        { id: 'recommendations', label: 'Get recommendations', value: 'recommendations', description: 'Help me choose the best option' },
        { id: 'compare', label: 'Compare products', value: 'compare', description: 'I want to see side-by-side comparisons' }
      ]
    } else if (titleLower.includes('product') || titleLower.includes('focus')) {
      return [
        { id: 'specific', label: 'Looking for a specific product', value: 'specific', description: 'I have a particular model in mind' },
        { id: 'browse', label: 'Want to see what\'s available', value: 'browse', description: 'Show me all the options' },
        { id: 'recommendations', label: 'Need personalized recommendations', value: 'recommendations', description: 'Help me find the perfect match' },
        { id: 'compare', label: 'Want to compare options', value: 'compare', description: 'I want to see different choices' }
      ]
    } else if (titleLower.includes('shop') || titleLower.includes('information')) {
      return [
        { id: 'policies', label: 'Store policies', value: 'policies', description: 'Warranty, returns, shipping info' },
        { id: 'hours', label: 'Store hours', value: 'hours', description: 'When are you open?' },
        { id: 'services', label: 'Services offered', value: 'services', description: 'What services do you provide?' },
        { id: 'contact', label: 'Contact information', value: 'contact', description: 'How can I reach you?' }
      ]
    } else {
      return [
        { id: 'yes', label: 'Yes', value: 'yes', description: 'I\'d like to know more' },
        { id: 'no', label: 'No', value: 'no', description: 'Not right now' }
      ]
    }
  }

  private createFoodItemsData(title: string, data: string): any {
    const items = data.split(',').map(item => item.trim())
    return {
      items,
      category: 'all',
      showPrices: true,
      allowSelection: true,
      layout: 'grid'
    }
  }

  private createPreferencesCollectorData(title: string, data: string): any {
    return {
      currentPreferences: {},
      categories: ['dietary_restrictions', 'dietary_goals', 'cuisine_preferences'],
      allowMultiple: true,
      required: false
    }
  }

  private createOrderSummaryData(title: string, data: string): any {
    return {
      items: [],
      total: 0,
      deliveryInfo: null,
      allowModification: true,
      showCheckout: true
    }
  }

  private createDeliverySetupData(title: string, data: string): any {
    return {
      pickupPoints: [],
      deliveryZones: [],
      currentPreferences: null,
      allowCustomAddress: true,
      showTimeSlots: true
    }
  }

  private createNutritionAdviceData(title: string, data: string): any {
    return {
      advice: data,
      recommendations: [],
      healthGoals: [],
      showCalories: true,
      showMacros: true
    }
  }

  private createServiceOverviewData(title: string, data: string): any {
    return {
      title,
      services: data.split(',').map(s => s.trim()),
      showAll: true,
      timestamp: new Date().toISOString()
    }
  }
}