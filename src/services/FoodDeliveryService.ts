import { foodItems, pickupPoints, deliveryZones, dietaryPreferences, cuisineTypes, mealTypes, spiceLevels } from '../data/FoodDeliveryCatalog'
import type { FoodItem, PickupPoint, DeliveryZone } from '../data/FoodDeliveryCatalog'
import { PlaybookSystem } from './PlaybookSystem'
import { KnowledgeBase } from './KnowledgeBase'
import Logger from '../utils/Logger'

export interface CustomerPreferences {
  dietaryRestrictions: string[]
  dietaryGoals: string[]
  cuisinePreferences: string[]
  spiceLevel: number
  mealTypes: string[]
  budget: {
    min: number
    max: number
  }
  healthGoals: string[]
  cookingSkill: 'beginner' | 'intermediate' | 'advanced'
  timeConstraints: string[]
  occasion: string
}

export interface OrderItem {
  item: FoodItem
  quantity: number
  customizations: string[]
  specialInstructions: string
}

export interface DeliveryPreferences {
  pickupPoint?: PickupPoint
  deliveryAddress?: string
  preferredTime: string
  specialInstructions: string
  contactMethod: 'phone' | 'email' | 'text'
}

export interface OrderSummary {
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  estimatedDeliveryTime: string
  pickupPoint?: PickupPoint
}

export class FoodDeliveryService {
  private static currentOrder: OrderItem[] = []
  private static customerPreferences: CustomerPreferences | null = null
  private static deliveryPreferences: DeliveryPreferences | null = null

  static initializeService(): void {
    Logger.info('FoodDeliveryService', 'Initializing service')
    this.currentOrder = []
    this.customerPreferences = null
    this.deliveryPreferences = null
    Logger.info('FoodDeliveryService', 'Service initialized successfully', {
      foodItemsCount: foodItems.length,
      pickupPointsCount: pickupPoints.length,
      deliveryZonesCount: deliveryZones.length
    })
  }

  static getPlaybook(): any {
    Logger.debug('FoodDeliveryService', 'Getting playbook')
    try {
      const playbook = PlaybookSystem.getPlaybook('food-delivery-concierge')
      Logger.info('FoodDeliveryService', 'Playbook retrieved', { 
        playbookId: playbook?.id,
        stagesCount: playbook?.stages?.length,
        rulesCount: playbook?.rules?.length
      })
      return playbook
    } catch (error) {
      Logger.error('FoodDeliveryService', 'Failed to get playbook', { error: error.message })
      return null
    }
  }

  static getCurrentStage(conversationHistory: any[]): any {
    Logger.debug('FoodDeliveryService', 'Getting current stage', { 
      conversationLength: conversationHistory.length
    })
    try {
      const stage = PlaybookSystem.getCurrentStage(conversationHistory)
      Logger.info('FoodDeliveryService', 'Current stage retrieved', { 
        stageId: stage?.id,
        stageName: stage?.name
      })
      return stage
    } catch (error) {
      Logger.error('FoodDeliveryService', 'Failed to get current stage', { error: error.message })
      return null
    }
  }

  static getNextStage(currentStage: string, userResponse: string): any {
    Logger.debug('FoodDeliveryService', 'Getting next stage', { currentStage, userResponseLength: userResponse.length })
    try {
      const nextStage = PlaybookSystem.getNextStage(currentStage, userResponse)
      Logger.info('FoodDeliveryService', 'Next stage determined', { 
        currentStage,
        nextStageId: nextStage?.id,
        nextStageName: nextStage?.name
      })
      return nextStage
    } catch (error) {
      Logger.error('FoodDeliveryService', 'Failed to get next stage', { error: error.message })
      return null
    }
  }

  static getApplicableRules(currentStage: string, userInput: string): any[] {
    Logger.debug('FoodDeliveryService', 'Getting applicable rules', { currentStage, userInputLength: userInput.length })
    try {
      const rules = PlaybookSystem.getApplicableRules(currentStage, userInput)
      Logger.info('FoodDeliveryService', 'Applicable rules retrieved', { 
        currentStage,
        rulesCount: rules.length,
        ruleIds: rules.map(r => r.id)
      })
      return rules
    } catch (error) {
      Logger.error('FoodDeliveryService', 'Failed to get applicable rules', { error: error.message })
      return []
    }
  }

  static searchFoodItems(query: string, preferences?: CustomerPreferences): FoodItem[] {
    const searchTerms = query.toLowerCase().split(' ')
    
    return foodItems.filter(item => {
      const searchText = (item.name + ' ' + item.description + ' ' + item.ingredients.join(' ')).toLowerCase()
      const matchesQuery = searchTerms.some(term => searchText.includes(term))
      
      if (!preferences) return matchesQuery
      
      // Filter by dietary restrictions
      const matchesDietary = preferences.dietaryRestrictions.every(restriction => 
        item.dietaryTags.includes(restriction)
      )
      
      // Filter by cuisine preferences
      const matchesCuisine = preferences.cuisinePreferences.length === 0 || 
        preferences.cuisinePreferences.includes(item.cuisine)
      
      // Filter by spice level
      const matchesSpice = item.spiceLevel <= preferences.spiceLevel
      
      // Filter by meal types
      const matchesMealType = preferences.mealTypes.length === 0 || 
        preferences.mealTypes.includes(item.category)
      
      // Filter by budget
      const matchesBudget = item.price >= preferences.budget.min && 
        item.price <= preferences.budget.max
      
      return matchesQuery && matchesDietary && matchesCuisine && 
             matchesSpice && matchesMealType && matchesBudget
    })
  }

  static getRecommendations(preferences: CustomerPreferences, limit: number = 5): FoodItem[] {
    let recommendations = [...foodItems]
    
    // Filter by dietary restrictions
    if (preferences.dietaryRestrictions.length > 0) {
      recommendations = recommendations.filter(item => 
        preferences.dietaryRestrictions.every(restriction => 
          item.dietaryTags.includes(restriction)
        )
      )
    }
    
    // Filter by cuisine preferences
    if (preferences.cuisinePreferences.length > 0) {
      recommendations = recommendations.filter(item => 
        preferences.cuisinePreferences.includes(item.cuisine)
      )
    }
    
    // Filter by spice level
    recommendations = recommendations.filter(item => 
      item.spiceLevel <= preferences.spiceLevel
    )
    
    // Filter by meal types
    if (preferences.mealTypes.length > 0) {
      recommendations = recommendations.filter(item => 
        preferences.mealTypes.includes(item.category)
      )
    }
    
    // Filter by budget
    recommendations = recommendations.filter(item => 
      item.price >= preferences.budget.min && item.price <= preferences.budget.max
    )
    
    // Sort by popularity and rating
    recommendations.sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return 0
    })
    
    return recommendations.slice(0, limit)
  }

  static addToOrder(item: FoodItem, quantity: number = 1, customizations: string[] = [], specialInstructions: string = ''): void {
    const existingItem = this.currentOrder.find(orderItem => orderItem.item.id === item.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.currentOrder.push({
        item,
        quantity,
        customizations,
        specialInstructions
      })
    }
  }

  static removeFromOrder(itemId: string): void {
    this.currentOrder = this.currentOrder.filter(orderItem => orderItem.item.id !== itemId)
  }

  static updateOrderQuantity(itemId: string, quantity: number): void {
    const orderItem = this.currentOrder.find(item => item.item.id === itemId)
    if (orderItem) {
      if (quantity <= 0) {
        this.removeFromOrder(itemId)
      } else {
        orderItem.quantity = quantity
      }
    }
  }

  static getCurrentOrder(): OrderItem[] {
    return [...this.currentOrder]
  }

  static calculateOrderTotal(deliveryZone?: DeliveryZone): OrderSummary {
    const subtotal = this.currentOrder.reduce((total, orderItem) => 
      total + (orderItem.item.price * orderItem.quantity), 0
    )
    
    const deliveryFee = deliveryZone?.deliveryFee || 0
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + deliveryFee + tax
    
    return {
      items: [...this.currentOrder],
      subtotal,
      deliveryFee,
      tax,
      total,
      estimatedDeliveryTime: deliveryZone?.estimatedDeliveryTime || '30-45 minutes',
      pickupPoint: this.deliveryPreferences?.pickupPoint
    }
  }

  static setCustomerPreferences(preferences: CustomerPreferences): void {
    this.customerPreferences = preferences
  }

  static getCustomerPreferences(): CustomerPreferences | null {
    return this.customerPreferences
  }

  static setDeliveryPreferences(preferences: DeliveryPreferences): void {
    this.deliveryPreferences = preferences
  }

  static getDeliveryPreferences(): DeliveryPreferences | null {
    return this.deliveryPreferences
  }

  static getAvailablePickupPoints(): PickupPoint[] {
    return pickupPoints.filter(point => point.isActive)
  }

  static getDeliveryZones(): DeliveryZone[] {
    return deliveryZones.filter(zone => zone.isActive)
  }

  static findDeliveryZone(zipCode: string): DeliveryZone | null {
    return deliveryZones.find(zone => 
      zone.isActive && zone.zipCodes.includes(zipCode)
    ) || null
  }

  static getNutritionRecommendations(preferences: CustomerPreferences): string[] {
    return KnowledgeBase.getNutritionRecommendations(
      preferences.dietaryRestrictions,
      preferences.healthGoals
    )
  }

  static getCookingTips(itemId: string): string[] {
    return KnowledgeBase.getCookingTips(itemId)
  }

  static getStorageInstructions(itemType: string): string[] {
    return KnowledgeBase.getStorageInstructions(itemType)
  }

  static getDeliveryPolicies(): any[] {
    return KnowledgeBase.getDeliveryPolicies()
  }

  static getDietaryOptions(): string[] {
    return dietaryPreferences
  }

  static getCuisineOptions(): string[] {
    return cuisineTypes
  }

  static getMealTypeOptions(): string[] {
    return mealTypes
  }

  static getSpiceLevelOptions(): any[] {
    return spiceLevels
  }

  static validateOrder(): { isValid: boolean, errors: string[] } {
    const errors: string[] = []
    
    if (this.currentOrder.length === 0) {
      errors.push('No items in order')
    }
    
    if (!this.deliveryPreferences) {
      errors.push('Delivery preferences not set')
    }
    
    if (this.deliveryPreferences && !this.deliveryPreferences.pickupPoint && !this.deliveryPreferences.deliveryAddress) {
      errors.push('Either pickup point or delivery address must be specified')
    }
    
    const orderTotal = this.calculateOrderTotal()
    const deliveryZone = this.findDeliveryZone(this.deliveryPreferences?.deliveryAddress?.split(' ').pop() || '')
    
    if (deliveryZone && orderTotal.subtotal < deliveryZone.minOrderAmount) {
      errors.push(`Minimum order amount is $${deliveryZone.minOrderAmount}`)
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static clearOrder(): void {
    this.currentOrder = []
    this.customerPreferences = null
    this.deliveryPreferences = null
  }
}

// Export the types for easy access
export type { FoodItem, PickupPoint, DeliveryZone }
