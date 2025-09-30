export interface KnowledgeItem {
  id: string
  category: string
  title: string
  content: string
  tags: string[]
  priority: number
  lastUpdated: Date
}

export interface NutritionInfo {
  id: string
  name: string
  benefits: string[]
  sources: string[]
  dailyRecommendation: string
  deficiencySymptoms: string[]
  excessSymptoms: string[]
}

export interface DeliveryPolicy {
  id: string
  title: string
  description: string
  conditions: string[]
  exceptions: string[]
  contactInfo: string
}

export class KnowledgeBase {
  private static nutritionInfo: NutritionInfo[] = [
    {
      id: 'protein',
      name: 'Protein',
      benefits: [
        'Builds and repairs muscle tissue',
        'Supports immune function',
        'Helps maintain healthy skin and hair',
        'Provides satiety and helps with weight management',
        'Essential for enzyme and hormone production'
      ],
      sources: ['Chicken breast', 'Salmon', 'Greek yogurt', 'Quinoa', 'Lentils', 'Eggs'],
      dailyRecommendation: '0.8g per kg body weight (1.2-1.6g for active individuals)',
      deficiencySymptoms: ['Muscle weakness', 'Slow wound healing', 'Frequent infections', 'Hair loss'],
      excessSymptoms: ['Kidney strain', 'Dehydration', 'Weight gain', 'Digestive issues']
    },
    {
      id: 'omega3',
      name: 'Omega-3 Fatty Acids',
      benefits: [
        'Supports heart health',
        'Reduces inflammation',
        'Improves brain function',
        'Supports eye health',
        'May reduce depression and anxiety'
      ],
      sources: ['Salmon', 'Mackerel', 'Sardines', 'Walnuts', 'Flaxseeds', 'Chia seeds'],
      dailyRecommendation: '250-500mg EPA and DHA combined',
      deficiencySymptoms: ['Dry skin', 'Poor memory', 'Mood swings', 'Joint pain'],
      excessSymptoms: ['Bleeding risk', 'Low blood pressure', 'Digestive upset']
    },
    {
      id: 'fiber',
      name: 'Dietary Fiber',
      benefits: [
        'Supports digestive health',
        'Helps regulate blood sugar',
        'Promotes satiety',
        'Supports heart health',
        'Feeds beneficial gut bacteria'
      ],
      sources: ['Quinoa', 'Sweet potatoes', 'Broccoli', 'Berries', 'Oats', 'Legumes'],
      dailyRecommendation: '25-35g per day',
      deficiencySymptoms: ['Constipation', 'Blood sugar spikes', 'Hunger between meals'],
      excessSymptoms: ['Bloating', 'Gas', 'Digestive discomfort']
    }
  ]

  private static deliveryPolicies: DeliveryPolicy[] = [
    {
      id: 'delivery_locations',
      title: 'Delivery Locations',
      description: 'Where we currently deliver',
      conditions: [
        'We currently deliver ONLY within the San Francisco Bay Area',
        'Service areas include: San Francisco, Oakland, Berkeley, San Jose, Palo Alto, Mountain View',
        'We do NOT deliver internationally',
        'We do NOT deliver to Thailand or any other countries',
        'We do NOT deliver outside California'
      ],
      exceptions: [
        'We are planning to expand to other US cities in 2024',
        'International delivery is not available'
      ],
      contactInfo: 'Call (555) 123-4567 for delivery questions'
    },
    {
      id: 'delivery_process',
      title: 'Delivery Process',
      description: 'How our delivery system works',
      conditions: [
        'Orders must be placed at least 2 hours in advance',
        'Minimum order amount varies by zone',
        'Delivery fee applies based on location',
        'Fresh items delivered within 30-60 minutes',
        'Frozen items can be scheduled for specific times'
      ],
      exceptions: [
        'Emergency orders may have shorter lead times for additional fee',
        'Catering orders require 24-hour notice'
      ],
      contactInfo: 'Call (555) 123-4567 for delivery questions'
    },
    {
      id: 'pickup_points',
      title: 'Pickup Points',
      description: 'Available pickup locations and hours',
      conditions: [
        'Pickup available at all our kitchen locations',
        'Orders ready 15 minutes after preparation time',
        'Valid ID required for pickup',
        'Orders held for 2 hours after ready time'
      ],
      exceptions: [
        'Holiday hours may vary',
        'Weather conditions may affect availability'
      ],
      contactInfo: 'Check individual location hours on our website'
    },
    {
      id: 'delivery_failures',
      title: 'Delivery Failures',
      description: 'What happens when items cannot be delivered',
      conditions: [
        'If no one is available, we will attempt delivery twice',
        'After second attempt, order will be returned to kitchen',
        'Refund will be processed within 24 hours',
        'Alternative delivery arrangements can be made'
      ],
      exceptions: [
        'Weather-related delays may extend hold time',
        'Perishable items may be donated to local food bank'
      ],
      contactInfo: 'Call (555) 123-4567 immediately if delivery fails'
    },
    {
      id: 'food_safety',
      title: 'Food Safety',
      description: 'How we ensure food safety and quality',
      conditions: [
        'All items prepared in certified commercial kitchens',
        'Temperature-controlled storage and transport',
        'HACCP protocols followed for all preparations',
        'Allergen information clearly labeled'
      ],
      exceptions: [
        'Cross-contamination possible in shared facilities',
        'Customers with severe allergies should contact us directly'
      ],
      contactInfo: 'Email safety@fooddelivery.com for allergen concerns'
    }
  ]

  private static generalKnowledge: KnowledgeItem[] = [
    {
      id: 'service_overview',
      category: 'service',
      title: 'Service Overview',
      content: 'We are a premium food delivery service specializing in both cooked meals and fresh ingredients. Our mission is to make healthy, delicious food accessible through convenient delivery and pickup options.',
      tags: ['service', 'overview', 'mission'],
      priority: 1,
      lastUpdated: new Date()
    },
    {
      id: 'service_process',
      category: 'service',
      title: 'How Our Service Works',
      content: 'Our food delivery service works in 4 simple steps: 1) Tell us your dietary preferences and health goals, 2) Browse our curated menu of fresh, healthy meals, 3) Customize your order with special instructions, 4) Choose delivery or pickup and we handle the rest. We offer meal planning, nutrition consultation, and flexible delivery options.',
      tags: ['service', 'process', 'how-it-works', 'steps'],
      priority: 1,
      lastUpdated: new Date()
    },
    {
      id: 'ordering_process',
      category: 'service',
      title: 'Ordering Process',
      content: 'To place an order: 1) Set your dietary preferences and restrictions, 2) Browse our menu filtered for your needs, 3) Add items to your cart with customizations, 4) Choose delivery time and location, 5) Complete payment and confirmation. You can modify orders up to 2 hours before delivery.',
      tags: ['service', 'ordering', 'process', 'steps'],
      priority: 1,
      lastUpdated: new Date()
    },
    {
      id: 'cooked_vs_raw',
      category: 'products',
      title: 'Cooked Meals vs Raw Ingredients',
      content: 'Cooked meals are ready-to-eat dishes prepared by our professional chefs. Raw ingredients are fresh, high-quality components for home cooking. Both options maintain our commitment to quality and nutrition.',
      tags: ['products', 'cooked', 'raw', 'ingredients'],
      priority: 2,
      lastUpdated: new Date()
    },
    {
      id: 'nutrition_consultation',
      category: 'nutrition',
      title: 'Nutrition Consultation',
      content: 'Our nutrition experts can help you choose meals and ingredients that align with your health goals. We consider dietary restrictions, preferences, and nutritional needs to provide personalized recommendations.',
      tags: ['nutrition', 'consultation', 'health', 'personalized'],
      priority: 3,
      lastUpdated: new Date()
    },
    {
      id: 'privacy_policy',
      category: 'privacy',
      title: 'Privacy and Data Protection',
      content: 'We collect only necessary information for order processing and delivery. Your data is protected and never shared with third parties without consent. We use your information to improve service and provide personalized recommendations.',
      tags: ['privacy', 'data', 'protection', 'consent'],
      priority: 4,
      lastUpdated: new Date()
    },
    {
      id: 'allergen_management',
      category: 'safety',
      title: 'Allergen Management',
      content: 'We clearly label all allergens and take precautions to prevent cross-contamination. However, we cannot guarantee allergen-free preparation in shared facilities. Customers with severe allergies should contact us directly.',
      tags: ['allergens', 'safety', 'cross-contamination', 'labeling'],
      priority: 5,
      lastUpdated: new Date()
    }
  ]

  static getNutritionInfo(nutrientId?: string): NutritionInfo[] {
    if (nutrientId) {
      return this.nutritionInfo.filter(item => item.id === nutrientId)
    }
    return this.nutritionInfo
  }

  static getDeliveryPolicies(policyId?: string): DeliveryPolicy[] {
    if (policyId) {
      return this.deliveryPolicies.filter(policy => policy.id === policyId)
    }
    return this.deliveryPolicies
  }

  static searchKnowledge(query: string, category?: string): KnowledgeItem[] {
    const searchTerms = query.toLowerCase().split(' ')
    
    let results = this.generalKnowledge
    
    if (category) {
      results = results.filter(item => item.category === category)
    }
    
    return results.filter(item => {
      const content = (item.title + ' ' + item.content + ' ' + item.tags.join(' ')).toLowerCase()
      return searchTerms.some(term => content.includes(term))
    }).sort((a, b) => b.priority - a.priority)
  }

  static getKnowledgeByTags(tags: string[]): KnowledgeItem[] {
    return this.generalKnowledge.filter(item => 
      tags.some(tag => item.tags.includes(tag))
    ).sort((a, b) => b.priority - a.priority)
  }

  static getNutritionRecommendations(dietaryTags: string[], healthGoals: string[]): string[] {
    const recommendations: string[] = []
    
    if (dietaryTags.includes('high-protein')) {
      recommendations.push('Focus on lean proteins like chicken breast and salmon for muscle building and recovery')
    }
    
    if (dietaryTags.includes('keto')) {
      recommendations.push('Choose high-fat, low-carb options like our avocado mousse and grilled salmon')
    }
    
    if (dietaryTags.includes('vegan')) {
      recommendations.push('Our quinoa Buddha bowl and roasted vegetables provide complete plant-based nutrition')
    }
    
    if (healthGoals.includes('weight_loss')) {
      recommendations.push('Opt for high-fiber, low-calorie options like our mixed greens and roasted vegetables')
    }
    
    if (healthGoals.includes('muscle_gain')) {
      recommendations.push('Include protein-rich items like grilled salmon and organic chicken breast in your meals')
    }
    
    if (healthGoals.includes('heart_health')) {
      recommendations.push('Choose omega-3 rich foods like salmon and incorporate plenty of vegetables')
    }
    
    return recommendations
  }

  static getDeliveryRecommendations(orderType: string, location: string): string[] {
    const recommendations: string[] = []
    
    if (orderType === 'cooked') {
      recommendations.push('Cooked meals are best consumed within 2 hours of preparation for optimal taste and safety')
      recommendations.push('Consider our hot meal delivery for immediate consumption')
    }
    
    if (orderType === 'raw_ingredient') {
      recommendations.push('Raw ingredients should be refrigerated immediately upon delivery')
      recommendations.push('Use within recommended shelf life for best quality and nutrition')
    }
    
    if (location.includes('downtown')) {
      recommendations.push('Downtown deliveries typically take 30-45 minutes during peak hours')
      recommendations.push('Consider pickup at our Downtown Kitchen Hub for faster service')
    }
    
    return recommendations
  }

  static getCookingTips(ingredientId: string): string[] {
    const tips: { [key: string]: string[] } = {
      'organic-chicken-breast': [
        'Bring to room temperature before cooking for even cooking',
        'Use a meat thermometer - internal temperature should reach 165°F',
        'Let rest for 5 minutes after cooking to retain juices',
        'Marinate for at least 30 minutes for better flavor'
      ],
      'wild-caught-salmon-fillet': [
        'Cook skin-side down first for crispy skin',
        'Don\'t overcook - salmon should be slightly pink in center',
        'Season with salt and pepper before cooking',
        'Use high heat for searing, then finish in oven if needed'
      ],
      'quinoa-grain': [
        'Rinse quinoa before cooking to remove bitter coating',
        'Use 2:1 water to quinoa ratio',
        'Cook covered for 15 minutes, then let steam for 5 minutes',
        'Fluff with fork before serving'
      ]
    }
    
    return tips[ingredientId] || []
  }

  static getStorageInstructions(itemType: string): string[] {
    const instructions: { [key: string]: string[] } = {
      'cooked': [
        'Refrigerate immediately upon delivery',
        'Consume within 2-3 days',
        'Reheat to 165°F before eating',
        'Store in airtight containers'
      ],
      'raw_ingredient': [
        'Refrigerate perishables immediately',
        'Store dry goods in cool, dry place',
        'Check individual item shelf life',
        'Freeze items if not using within recommended time'
      ],
      'frozen': [
        'Keep frozen until ready to use',
        'Thaw in refrigerator, not at room temperature',
        'Use within 24 hours of thawing',
        'Do not refreeze after thawing'
      ]
    }
    
    return instructions[itemType] || []
  }
}


