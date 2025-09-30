import Logger from '../utils/Logger'

export interface PlaybookRule {
  id: string
  condition: string
  action: string
  priority: number
  description: string
  examples: string[]
  requiredTools: string[]
  optionalTools: string[]
}

export interface QuestionAnswer {
  id: string
  question: string
  answerOptions: string[]
  followUpQuestions?: string[]
  context?: string
  required: boolean
}

export interface ConversationStage {
  id: string
  name: string
  description: string
  nextStages: string[]
  requiredActions: string[]
  optionalActions: string[]
  requiredTools: string[]
  optionalTools: string[]
  toolUsageGuidelines: string[]
  questions: QuestionAnswer[]
}

export interface ServicePlaybook {
  id: string
  name: string
  description: string
  stages: ConversationStage[]
  rules: PlaybookRule[]
  goals: string[]
  successCriteria: string[]
}

export class PlaybookSystem {
  private static playbooks: ServicePlaybook[] = [
    {
      id: 'food-delivery-concierge',
      name: 'Food Delivery Concierge',
      description: 'Complete playbook for food delivery service concierge interactions',
      goals: [
        'Understand customer needs and preferences',
        'Guide through order placement process',
        'Provide nutrition recommendations',
        'Explain delivery process and policies',
        'Obtain privacy consent and contact information',
        'Ensure successful order completion'
      ],
      successCriteria: [
        'Customer places successful order',
        'All dietary preferences and restrictions noted',
        'Delivery preferences confirmed',
        'Privacy consent obtained',
        'Customer understands delivery process',
        'Nutrition recommendations provided'
      ],
      stages: [
        {
          id: 'greeting',
          name: 'Initial Greeting',
          description: 'Welcome customer and understand visit purpose',
          nextStages: ['service_overview', 'needs_assessment', 'quick_order', 'information_request'],
          requiredActions: ['greet_customer', 'identify_purpose'],
          optionalActions: ['offer_help', 'explain_services'],
          requiredTools: ['leading_question'],
          optionalTools: ['interview_question'],
          toolUsageGuidelines: [
            'Use [SHOW:leading_question:Visit Purpose:What brings you here today?] to understand purpose',
            'If customer seems unsure, use [SHOW:interview_question:Occasion:What\'s the occasion?]',
            'Always include at least one [SHOW:...] tool in your response',
            'DO NOT collect preferences immediately - wait for them to express interest in ordering'
          ],
          questions: [
            {
              id: 'visit_purpose',
              question: 'What brings you here today?',
              answerOptions: [
                'I want to order food',
                'I\'m looking for meal planning',
                'I need nutrition advice',
                'I want to learn about your services',
                'I\'m just browsing'
              ],
              context: 'Understanding the customer\'s primary intent',
              required: true
            },
            {
              id: 'occasion',
              question: 'What\'s the occasion?',
              answerOptions: [
                'Regular meal planning',
                'Special event or celebration',
                'Health and fitness goals',
                'Dietary restrictions',
                'Just exploring options'
              ],
              context: 'Understanding the context for their visit',
              required: false
            }
          ]
        },
        {
          id: 'service_overview',
          name: 'Service Overview',
          description: 'Provide general overview of service domains and capabilities',
          nextStages: ['needs_assessment', 'menu_exploration', 'nutrition_consultation', 'information_request', 'service_explanation'],
          requiredActions: ['explain_services', 'show_capabilities'],
          optionalActions: ['highlight_features', 'explain_process'],
          requiredTools: ['leading_question'],
          optionalTools: ['interview_question'],
          toolUsageGuidelines: [
            'Use [SHOW:leading_question:Service Interest:Which service interests you most?] to understand focus',
            'Use [SHOW:interview_question:Service Type:What type of service are you looking for?] for clarification',
            'Always include at least one [SHOW:...] tool in your response',
            'Provide overview of: meal planning, nutrition consultation, delivery options, dietary accommodations'
          ],
          questions: [
            {
              id: 'service_interest',
              question: 'Which service interests you most?',
              answerOptions: [
                'Meal planning and delivery',
                'Nutrition consultation',
                'Custom meal preparation',
                'Dietary accommodation services',
                'I want to learn about all services',
                'I\'m not sure yet'
              ],
              context: 'Understanding which service area to focus on',
              required: true
            },
            {
              id: 'service_type',
              question: 'What type of service are you looking for?',
              answerOptions: [
                'Ready-to-eat meals',
                'Meal kits with ingredients',
                'Nutritional guidance',
                'Custom dietary plans',
                'Family meal planning',
                'I need help choosing'
              ],
              context: 'Determining the specific service type needed',
              required: false
            }
          ]
        },
        {
          id: 'service_explanation',
          name: 'Service Explanation',
          description: 'Explain how the service works and answer process questions',
          nextStages: ['needs_assessment', 'menu_exploration', 'service_overview', 'information_request'],
          requiredActions: ['explain_process', 'answer_questions'],
          optionalActions: ['show_examples', 'clarify_details'],
          requiredTools: ['leading_question'],
          optionalTools: ['interview_question'],
          toolUsageGuidelines: [
            'Use [SHOW:leading_question:Next Step:What would you like to do next?] after explaining',
            'Use [SHOW:interview_question:Process Question:Do you have any other questions about our service?] for clarification',
            'Always include at least one [SHOW:...] tool in your response',
            'Explain: ordering process, delivery options, payment, customization, nutrition consultation'
          ],
          questions: []
        },
        {
          id: 'needs_assessment',
          name: 'Needs Assessment',
          description: 'Understand customer goals, preferences, and dietary requirements',
          nextStages: ['menu_exploration', 'nutrition_consultation', 'order_placement'],
          requiredActions: ['collect_preferences', 'identify_dietary_restrictions', 'understand_goals'],
          optionalActions: ['ask_about_occasion', 'discuss_budget', 'explore_cuisine_preferences'],
          requiredTools: ['preferences_collector', 'interview_question'],
          optionalTools: ['leading_question'],
          toolUsageGuidelines: [
            'Use [SHOW:preferences_collector:Dietary Preferences:preferences_data] to collect dietary info',
            'Use [SHOW:interview_question:Budget Range:What\'s your budget range?] for budget',
            'Use [SHOW:interview_question:Use Case:What will you mainly use this for?] for goals',
            'Always collect preferences before showing menu items'
          ],
          questions: [
            {
              id: 'dietary_restrictions',
              question: 'Do you have any dietary restrictions or allergies?',
              answerOptions: [
                'No restrictions',
                'Vegetarian',
                'Vegan',
                'Gluten-free',
                'Dairy-free',
                'Nut allergies',
                'Other allergies',
                'Keto diet',
                'Paleo diet',
                'Low-carb'
              ],
              followUpQuestions: ['specific_allergies', 'dietary_goals'],
              context: 'Essential for food safety and menu filtering',
              required: true
            },
            {
              id: 'dietary_goals',
              question: 'What are your health and nutrition goals?',
              answerOptions: [
                'Weight loss',
                'Weight gain',
                'Muscle building',
                'Maintain current weight',
                'Increase energy',
                'Improve digestion',
                'Heart health',
                'General wellness',
                'No specific goals'
              ],
              context: 'Helps recommend appropriate meal options',
              required: true
            },
            {
              id: 'cuisine_preferences',
              question: 'What types of cuisine do you enjoy?',
              answerOptions: [
                'Italian',
                'Asian',
                'Mediterranean',
                'Mexican',
                'American',
                'Indian',
                'Thai',
                'Japanese',
                'Middle Eastern',
                'I\'m open to anything'
              ],
              context: 'Personal taste preferences for meal selection',
              required: false
            },
            {
              id: 'budget_range',
              question: 'What\'s your budget range per meal?',
              answerOptions: [
                'Under $10',
                '$10-15',
                '$15-20',
                '$20-25',
                '$25-30',
                'Over $30',
                'Budget is flexible'
              ],
              context: 'Helps filter appropriate meal options',
              required: false
            },
            {
              id: 'cooking_skill',
              question: 'What\'s your cooking skill level?',
              answerOptions: [
                'Beginner - need simple recipes',
                'Intermediate - comfortable with basic cooking',
                'Advanced - can handle complex recipes',
                'I prefer ready-to-eat meals'
              ],
              context: 'Determines meal complexity and preparation time',
              required: false
            }
          ]
        },
        {
          id: 'menu_exploration',
          name: 'Menu Exploration',
          description: 'Show relevant menu items based on preferences',
          nextStages: ['item_details', 'customization', 'order_placement'],
          requiredActions: ['show_relevant_items', 'explain_options'],
          optionalActions: ['suggest_combinations', 'show_nutrition_info', 'explain_preparation'],
          requiredTools: ['food_items'],
          optionalTools: ['nutrition_advice', 'interview_question'],
          toolUsageGuidelines: [
            'Use [SHOW:food_items:Available Items:item1,item2,item3] to display menu items',
            'If customer asks about nutrition, use [SHOW:nutrition_advice:Nutrition Information:nutrition_data]',
            'Use [SHOW:interview_question:Style Preference:What style appeals to you?] for preferences',
            'Always show items with prices and dietary information'
          ],
          questions: [
            {
              id: 'meal_preference',
              question: 'What type of meal are you looking for?',
              answerOptions: [
                'Breakfast',
                'Lunch',
                'Dinner',
                'Snack',
                'Dessert',
                'I\'m open to suggestions'
              ],
              context: 'Helps filter meal types',
              required: false
            },
            {
              id: 'preparation_time',
              question: 'How much time do you have for preparation?',
              answerOptions: [
                'Ready to eat (no prep)',
                '5-10 minutes',
                '15-30 minutes',
                '30-60 minutes',
                'Time is flexible'
              ],
              context: 'Determines meal complexity',
              required: false
            },
            {
              id: 'portion_size',
              question: 'What portion size do you need?',
              answerOptions: [
                'Single serving',
                '2-3 servings',
                'Family size (4+ servings)',
                'Large batch for meal prep',
                'I\'m not sure'
              ],
              context: 'Helps with quantity recommendations',
              required: false
            }
          ]
        },
        {
          id: 'nutrition_consultation',
          name: 'Nutrition Consultation',
          description: 'Provide nutrition recommendations and advice',
          nextStages: ['menu_exploration', 'order_placement'],
          requiredActions: ['provide_nutrition_advice', 'suggest_healthy_options'],
          optionalActions: ['explain_nutrition_facts', 'discuss_health_goals', 'recommend_supplements'],
          requiredTools: ['nutrition_advice'],
          optionalTools: ['food_items', 'interview_question'],
          toolUsageGuidelines: [
            'Use [SHOW:nutrition_advice:Nutrition Information:nutrition_data] for advice',
            'Use [SHOW:food_items:Healthy Options:item1,item2,item3] to show healthy items',
            'Use [SHOW:interview_question:Priority Ranking:Rank your top priorities] for goals',
            'Always provide specific nutrition recommendations'
          ],
          questions: [
            {
              id: 'nutrition_goals',
              question: 'What are your primary nutrition goals?',
              answerOptions: [
                'Weight management',
                'Muscle building',
                'Energy optimization',
                'Digestive health',
                'Heart health',
                'Immune support',
                'General wellness',
                'I need guidance'
              ],
              context: 'Helps provide targeted nutrition advice',
              required: true
            },
            {
              id: 'dietary_challenges',
              question: 'What are your biggest dietary challenges?',
              answerOptions: [
                'Portion control',
                'Meal planning',
                'Time constraints',
                'Cooking skills',
                'Food cravings',
                'Eating out frequently',
                'Nutrition knowledge',
                'None specific'
              ],
              context: 'Identifies areas where we can provide support',
              required: false
            }
          ]
        },
        {
          id: 'order_placement',
          name: 'Order Placement',
          description: 'Guide customer through order customization and placement',
          nextStages: ['delivery_setup', 'payment_processing', 'confirmation'],
          requiredActions: ['collect_order_details', 'confirm_items', 'calculate_total'],
          optionalActions: ['suggest_add_ons', 'apply_discounts', 'modify_quantities'],
          requiredTools: ['order_summary'],
          optionalTools: ['food_items', 'interview_question'],
          toolUsageGuidelines: [
            'Use [SHOW:order_summary:Current Order:order_data] to show order details',
            'Use [SHOW:food_items:Add-ons:item1,item2,item3] for suggestions',
            'Use [SHOW:interview_question:Priority Ranking:Rank your top priorities] for preferences',
            'Always confirm items and quantities before proceeding'
          ],
          questions: [
            {
              id: 'order_quantity',
              question: 'How many servings would you like?',
              answerOptions: [
                '1 serving',
                '2 servings',
                '3-4 servings',
                'Family size (5+ servings)',
                'I need help deciding'
              ],
              context: 'Determines order quantity',
              required: true
            },
            {
              id: 'special_instructions',
              question: 'Any special instructions or modifications?',
              answerOptions: [
                'No modifications',
                'Extra spicy',
                'Less spicy',
                'Extra sauce',
                'No sauce',
                'Extra vegetables',
                'Custom modifications',
                'I\'ll specify later'
              ],
              context: 'Customization preferences',
              required: false
            },
            {
              id: 'add_ons',
              question: 'Would you like to add any extras?',
              answerOptions: [
                'No add-ons',
                'Side salad',
                'Extra protein',
                'Beverage',
                'Dessert',
                'Show me options',
                'I\'m not sure'
              ],
              context: 'Additional items for the order',
              required: false
            }
          ]
        },
        {
          id: 'delivery_setup',
          name: 'Delivery Setup',
          description: 'Configure delivery preferences and pickup points',
          nextStages: ['privacy_consent', 'confirmation'],
          requiredActions: ['select_pickup_point', 'set_delivery_time', 'provide_address'],
          optionalActions: ['special_instructions', 'delivery_notes', 'contact_preferences'],
          requiredTools: ['delivery_setup'],
          optionalTools: ['interview_question'],
          toolUsageGuidelines: [
            'Use [SHOW:delivery_setup:Delivery Options:delivery_data] for setup',
            'Use [SHOW:interview_question:Priority Ranking:Rank your top priorities] for preferences',
            'Always show pickup points and delivery zones',
            'Collect delivery address and time preferences'
          ],
          questions: [
            {
              id: 'delivery_method',
              question: 'How would you like to receive your order?',
              answerOptions: [
                'Home delivery',
                'Pickup from location',
                'I need to see options',
                'I\'m not sure yet'
              ],
              context: 'Determines delivery method',
              required: true
            },
            {
              id: 'delivery_time',
              question: 'When would you like your order?',
              answerOptions: [
                'As soon as possible',
                'Today (specific time)',
                'Tomorrow',
                'This week',
                'I need to check my schedule'
              ],
              context: 'Scheduling preferences',
              required: true
            },
            {
              id: 'delivery_instructions',
              question: 'Any special delivery instructions?',
              answerOptions: [
                'No special instructions',
                'Leave at door',
                'Ring doorbell',
                'Call when arriving',
                'Leave with neighbor',
                'I\'ll specify later'
              ],
              context: 'Delivery preferences',
              required: false
            }
          ]
        },
        {
          id: 'privacy_consent',
          name: 'Privacy Consent',
          description: 'Obtain necessary privacy and contact consents',
          nextStages: ['confirmation'],
          requiredActions: ['explain_privacy_policy', 'obtain_consent', 'collect_contact_info'],
          optionalActions: ['explain_data_usage', 'offer_opt_outs', 'discuss_communication_preferences'],
          requiredTools: ['interview_question'],
          optionalTools: [],
          toolUsageGuidelines: [
            'Use [SHOW:interview_question:Priority Ranking:Rank your top priorities] for consent',
            'Always explain privacy policy before collecting consent',
            'Collect contact information for order updates',
            'Provide clear opt-out options'
          ],
          questions: [
            {
              id: 'privacy_consent',
              question: 'Do you consent to our privacy policy and data usage?',
              answerOptions: [
                'Yes, I consent',
                'I need to review the policy first',
                'I have questions about data usage',
                'I prefer limited data sharing'
              ],
              context: 'Required for order processing',
              required: true
            },
            {
              id: 'communication_preferences',
              question: 'How would you like to receive updates?',
              answerOptions: [
                'Email only',
                'SMS only',
                'Email and SMS',
                'No marketing communications',
                'I\'ll decide later'
              ],
              context: 'Communication preferences',
              required: false
            }
          ]
        },
        {
          id: 'confirmation',
          name: 'Order Confirmation',
          description: 'Finalize order and provide confirmation details',
          nextStages: [],
          requiredActions: ['confirm_order', 'provide_order_number', 'explain_next_steps'],
          optionalActions: ['schedule_reminders', 'provide_tracking_info', 'offer_support'],
          requiredTools: ['order_summary'],
          optionalTools: ['interview_question'],
          toolUsageGuidelines: [
            'Use [SHOW:order_summary:Order Confirmation:order_data] for final confirmation',
            'Use [SHOW:interview_question:Priority Ranking:Rank your top priorities] for preferences',
            'Always provide order number and next steps',
            'Offer support and tracking information'
          ],
          questions: [
            {
              id: 'order_confirmation',
              question: 'Please confirm your order details are correct',
              answerOptions: [
                'Yes, everything looks good',
                'I need to make changes',
                'I have questions',
                'I need to review again'
              ],
              context: 'Final order confirmation',
              required: true
            },
            {
              id: 'future_orders',
              question: 'Would you like to set up future orders?',
              answerOptions: [
                'Yes, set up recurring orders',
                'Maybe later',
                'No, just this order',
                'I need more information'
              ],
              context: 'Future order preferences',
              required: false
            }
          ]
        }
      ],
      rules: [
        {
          id: 'greet_warmly',
          condition: 'customer_greeting',
          action: 'greet_warmly_and_identify_purpose',
          priority: 1,
          description: 'Always greet customers warmly and ask about their visit purpose',
          examples: [
            'Hi! Welcome to our food delivery service. What brings you in today?',
            'Hello! I\'m here to help you with your food needs. How can I assist you?'
          ],
          requiredTools: ['leading_question'],
          optionalTools: ['interview_question']
        },
        {
          id: 'assess_dietary_needs',
          condition: 'dietary_preferences_unknown',
          action: 'ask_about_dietary_restrictions',
          priority: 2,
          description: 'Always ask about dietary restrictions and preferences early in the conversation',
          examples: [
            'Do you have any dietary restrictions or preferences I should know about?',
            'Are you following any specific diet or have food allergies?'
          ],
          requiredTools: ['preferences_collector'],
          optionalTools: ['interview_question']
        },
        {
          id: 'explain_delivery_process',
          condition: 'delivery_questions',
          action: 'explain_delivery_process',
          priority: 3,
          description: 'Explain how delivery works, pickup points, and what happens if items can\'t be delivered',
          examples: [
            'Let me explain how our delivery works...',
            'Here\'s what happens if we can\'t deliver your items...'
          ],
          requiredTools: ['delivery_setup'],
          optionalTools: ['interview_question']
        },
        {
          id: 'provide_nutrition_advice',
          condition: 'nutrition_questions',
          action: 'provide_nutrition_recommendations',
          priority: 4,
          description: 'Provide nutrition recommendations based on customer preferences and goals',
          examples: [
            'Based on your preferences, I recommend...',
            'For your health goals, consider these options...'
          ],
          requiredTools: ['nutrition_advice'],
          optionalTools: ['food_items']
        },
        {
          id: 'obtain_privacy_consent',
          condition: 'order_ready',
          action: 'obtain_privacy_consent',
          priority: 5,
          description: 'Always obtain privacy consent before processing orders',
          examples: [
            'Before we proceed, I need to get your consent for...',
            'Let me explain our privacy policy and get your approval...'
          ],
          requiredTools: ['interview_question'],
          optionalTools: []
        },
        {
          id: 'guide_order_placement',
          condition: 'items_selected',
          action: 'guide_through_order_placement',
          priority: 6,
          description: 'Guide customers through the complete order placement process',
          examples: [
            'Let\'s walk through placing your order step by step...',
            'I\'ll help you customize your order and set up delivery...'
          ],
          requiredTools: ['order_summary'],
          optionalTools: ['food_items', 'delivery_setup']
        }
      ]
    }
  ]

  static getPlaybook(serviceId: string): ServicePlaybook | null {
    console.log('🔍 PlaybookSystem.getPlaybook called with serviceId:', serviceId)
    Logger.debug('PlaybookSystem', 'Getting playbook', { serviceId })
    
    const playbook = this.playbooks.find(playbook => playbook.id === serviceId) || null
    
    console.log('📋 PlaybookSystem.getPlaybook result:', {
      serviceId,
      found: !!playbook,
      playbookName: playbook?.name,
      stagesCount: playbook?.stages?.length,
      rulesCount: playbook?.rules?.length,
      playbook: playbook
    })
    
    Logger.info('PlaybookSystem', 'Playbook retrieved', { 
      serviceId, 
      found: !!playbook,
      playbookName: playbook?.name,
      stagesCount: playbook?.stages?.length,
      rulesCount: playbook?.rules?.length
    })
    return playbook
  }

  static getCurrentStage(conversationHistory: any[], currentStage?: string): ConversationStage | null {
    Logger.debug('PlaybookSystem', 'Getting current stage', { 
      conversationLength: conversationHistory.length,
      currentStage 
    })
    
    const playbook = this.getPlaybook('food-delivery-concierge')
    if (!playbook) {
      Logger.error('PlaybookSystem', 'No playbook found for food-delivery-concierge')
      return null
    }

    // If no current stage, start with greeting
    if (!currentStage) {
      const greetingStage = playbook.stages.find(stage => stage.id === 'greeting') || null
      Logger.info('PlaybookSystem', 'Starting with greeting stage', { 
        stageId: greetingStage?.id,
        stageName: greetingStage?.name
      })
      return greetingStage
    }

    const stage = playbook.stages.find(stage => stage.id === currentStage) || null
    Logger.info('PlaybookSystem', 'Current stage retrieved', { 
      currentStage,
      stageId: stage?.id,
      stageName: stage?.name,
      found: !!stage
    })
    return stage
  }

  static getNextStage(currentStage: string, userResponse: string): ConversationStage | null {
    const playbook = this.getPlaybook('food-delivery-concierge')
    if (!playbook) return null

    const stage = playbook.stages.find(s => s.id === currentStage)
    if (!stage) return null

    // Logic to determine next stage based on user response and current stage
    const response = userResponse.toLowerCase()

    // Handle service explanation questions from any stage
    if (response.includes('how') && (response.includes('service') || response.includes('work') || response.includes('process'))) {
      return playbook.stages.find(s => s.id === 'service_explanation') || null
    }
    
    if (response.includes('what') && (response.includes('service') || response.includes('offer') || response.includes('provide'))) {
      return playbook.stages.find(s => s.id === 'service_explanation') || null
    }

    // Handle user wanting to try/start ordering after service explanation
    if (response.includes('try') || response.includes('start') || response.includes('begin') || 
        response.includes('order') || response.includes('buy') || response.includes('purchase')) {
      // If we just explained the service, collect preferences first
      if (currentStage === 'service_explanation') {
        return playbook.stages.find(s => s.id === 'needs_assessment') || null
      }
      // If we're in greeting and they want to order, collect preferences
      if (currentStage === 'greeting') {
        return playbook.stages.find(s => s.id === 'needs_assessment') || null
      }
    }

    // If we're in greeting stage, determine appropriate next stage
    if (currentStage === 'greeting') {
      // If just "hi", "hello", "hey" - stay in greeting stage
      if (response === 'hi' || response === 'hello' || response === 'hey' || response === 'hi bro') {
        return null // Stay in current stage
      }
      
      // Only transition if user gives a meaningful response, not just "hi" or "hello"
      if (response.includes('diet') || response.includes('allerg') || response.includes('prefer') || 
          response.includes('order') || response.includes('buy') || response.includes('purchase')) {
        return playbook.stages.find(s => s.id === 'needs_assessment') || null
      }
      if (response.includes('browse') || response.includes('look') || response.includes('see') || 
          response.includes('explore') || response.includes('check') || response.includes('overview') ||
          response.includes('interested') || response.includes('service')) {
        return playbook.stages.find(s => s.id === 'service_overview') || null
      }
      if (response.includes('menu') || response.includes('food') || response.includes('meal') || 
          response.includes('dinner') || response.includes('lunch') || response.includes('breakfast')) {
        return playbook.stages.find(s => s.id === 'needs_assessment') || null
      }
    }

    // If we're in needs_assessment, we can move to menu_exploration
    if (currentStage === 'needs_assessment') {
      if (response.includes('menu') || response.includes('food') || response.includes('meal') || 
          response.includes('browse') || response.includes('look') || response.includes('see') ||
          response.includes('dinner') || response.includes('lunch') || response.includes('breakfast')) {
        return playbook.stages.find(s => s.id === 'menu_exploration') || null
      }
    }

    // Legacy logic for other stages
    if (response.includes('diet') || response.includes('allerg') || response.includes('prefer')) {
      return playbook.stages.find(s => s.id === 'needs_assessment') || null
    }

    if (response.includes('nutrition') || response.includes('health') || response.includes('calorie')) {
      return playbook.stages.find(s => s.id === 'nutrition_consultation') || null
    }

    if (response.includes('order') || response.includes('buy') || response.includes('purchase')) {
      return playbook.stages.find(s => s.id === 'order_placement') || null
    }

    if (response.includes('deliver') || response.includes('pickup') || response.includes('address')) {
      return playbook.stages.find(s => s.id === 'delivery_setup') || null
    }

    if (response.includes('privacy') || response.includes('consent') || response.includes('contact')) {
      return playbook.stages.find(s => s.id === 'privacy_consent') || null
    }

    // Default to next stage in sequence
    const currentIndex = playbook.stages.findIndex(s => s.id === currentStage)
    if (currentIndex < playbook.stages.length - 1) {
      return playbook.stages[currentIndex + 1]
    }

    return null
  }

  static getApplicableRules(currentStage: string, userInput: string): PlaybookRule[] {
    const playbook = this.getPlaybook('food-delivery-concierge')
    if (!playbook) return []

    return playbook.rules
      .filter(rule => {
        // Simple condition matching
        const input = userInput.toLowerCase()
        
        switch (rule.condition) {
          case 'customer_greeting':
            return input.includes('hi') || input.includes('hello') || input.includes('hey')
          case 'dietary_preferences_unknown':
            return !input.includes('vegan') && !input.includes('vegetarian') && 
                   !input.includes('gluten') && !input.includes('allerg')
          case 'delivery_questions':
            return input.includes('deliver') || input.includes('pickup') || input.includes('address')
          case 'nutrition_questions':
            return input.includes('nutrition') || input.includes('health') || input.includes('calorie')
          case 'order_ready':
            return input.includes('order') || input.includes('buy') || input.includes('purchase')
          case 'items_selected':
            return input.includes('add') || input.includes('select') || input.includes('choose')
          default:
            return false
        }
      })
      .sort((a, b) => a.priority - b.priority)
  }

  static getStageActions(stageId: string): { required: string[], optional: string[] } {
    const playbook = this.getPlaybook('food-delivery-concierge')
    if (!playbook) return { required: [], optional: [] }

    const stage = playbook.stages.find(s => s.id === stageId)
    if (!stage) return { required: [], optional: [] }

    return {
      required: stage.requiredActions,
      optional: stage.optionalActions
    }
  }

  static getServiceGoals(): string[] {
    const playbook = this.getPlaybook('food-delivery-concierge')
    return playbook?.goals || []
  }

  static getSuccessCriteria(): string[] {
    const playbook = this.getPlaybook('food-delivery-concierge')
    return playbook?.successCriteria || []
  }

  static getStageInfo(serviceId: string, stageId: string): ConversationStage | null {
    const playbook = this.getPlaybook(serviceId)
    if (!playbook) {
      return null
    }

    return playbook.stages.find(s => s.id === stageId) || null
  }

  static getStageToolGuidelines(stageId: string): {
    requiredTools: string[]
    optionalTools: string[]
    guidelines: string[]
  } {
    const playbook = this.getPlaybook('food-delivery-concierge')
    if (!playbook) return { requiredTools: [], optionalTools: [], guidelines: [] }

    const stage = playbook.stages.find(s => s.id === stageId)
    if (!stage) return { requiredTools: [], optionalTools: [], guidelines: [] }

    return {
      requiredTools: stage.requiredTools || [],
      optionalTools: stage.optionalTools || [],
      guidelines: stage.toolUsageGuidelines || []
    }
  }

  static getRuleToolGuidelines(ruleId: string): {
    requiredTools: string[]
    optionalTools: string[]
  } {
    const playbook = this.getPlaybook('food-delivery-concierge')
    if (!playbook) return { requiredTools: [], optionalTools: [] }

    const rule = playbook.rules.find(r => r.id === ruleId)
    if (!rule) return { requiredTools: [], optionalTools: [] }

    return {
      requiredTools: rule.requiredTools || [],
      optionalTools: rule.optionalTools || []
    }
  }

  static getStageQuestions(stageId: string): QuestionAnswer[] {
    console.log('🔍 PlaybookSystem.getStageQuestions called with stageId:', stageId)
    
    const playbook = this.getPlaybook('food-delivery-concierge')
    console.log('📋 PlaybookSystem.getStageQuestions - playbook found:', !!playbook)
    
    if (!playbook) {
      console.log('❌ PlaybookSystem.getStageQuestions - No playbook found')
      return []
    }

    const stage = playbook.stages.find(s => s.id === stageId)
    console.log('📋 PlaybookSystem.getStageQuestions - stage found:', !!stage, stage)
    
    if (!stage) {
      console.log('❌ PlaybookSystem.getStageQuestions - No stage found for:', stageId)
      return []
    }

    const questions = stage.questions || []
    console.log('📋 PlaybookSystem.getStageQuestions - questions found:', questions.length, questions)
    
    return questions
  }

  static getNextQuestion(stageId: string, answeredQuestions: string[]): QuestionAnswer | null {
    console.log('🔍 PlaybookSystem.getNextQuestion called with:', { stageId, answeredQuestions })
    
    const questions = this.getStageQuestions(stageId)
    console.log('📋 PlaybookSystem.getNextQuestion - questions retrieved:', questions.length, questions)
    
    if (!questions.length) {
      console.log('❌ PlaybookSystem.getNextQuestion - No questions found for stage:', stageId)
      return null
    }

    // Find the first unanswered required question
    const unansweredRequired = questions.find(q => 
      q.required && !answeredQuestions.includes(q.id)
    )
    console.log('📋 PlaybookSystem.getNextQuestion - unansweredRequired:', unansweredRequired)
    
    if (unansweredRequired) {
      console.log('✅ PlaybookSystem.getNextQuestion - Returning required question:', unansweredRequired)
      return unansweredRequired
    }

    // If all required questions are answered, find any unanswered optional question
    const unansweredOptional = questions.find(q => 
      !q.required && !answeredQuestions.includes(q.id)
    )
    console.log('📋 PlaybookSystem.getNextQuestion - unansweredOptional:', unansweredOptional)
    
    const result = unansweredOptional || null
    console.log('✅ PlaybookSystem.getNextQuestion - Final result:', result)
    return result
  }

  static getQuestionById(stageId: string, questionId: string): QuestionAnswer | null {
    const questions = this.getStageQuestions(stageId)
    return questions.find(q => q.id === questionId) || null
  }

  static getAnswerOptions(stageId: string, questionId: string): string[] {
    const question = this.getQuestionById(stageId, questionId)
    return question?.answerOptions || []
  }

  static validateAnswer(stageId: string, questionId: string, answer: string): boolean {
    const question = this.getQuestionById(stageId, questionId)
    if (!question) return false

    return question.answerOptions.includes(answer)
  }

  static getFollowUpQuestions(stageId: string, questionId: string): string[] {
    const question = this.getQuestionById(stageId, questionId)
    return question?.followUpQuestions || []
  }

  static getQuestionContext(stageId: string, questionId: string): string {
    const question = this.getQuestionById(stageId, questionId)
    return question?.context || ''
  }

  static isQuestionRequired(stageId: string, questionId: string): boolean {
    const question = this.getQuestionById(stageId, questionId)
    return question?.required || false
  }

  static getStageCompletionStatus(stageId: string, answeredQuestions: string[]): {
    completed: boolean
    requiredQuestionsAnswered: number
    totalRequiredQuestions: number
    optionalQuestionsAnswered: number
    totalOptionalQuestions: number
  } {
    const questions = this.getStageQuestions(stageId)
    const requiredQuestions = questions.filter(q => q.required)
    const optionalQuestions = questions.filter(q => !q.required)

    const requiredAnswered = requiredQuestions.filter(q => 
      answeredQuestions.includes(q.id)
    ).length

    const optionalAnswered = optionalQuestions.filter(q => 
      answeredQuestions.includes(q.id)
    ).length

    return {
      completed: requiredAnswered === requiredQuestions.length,
      requiredQuestionsAnswered: requiredAnswered,
      totalRequiredQuestions: requiredQuestions.length,
      optionalQuestionsAnswered: optionalAnswered,
      totalOptionalQuestions: optionalQuestions.length
    }
  }
}
