import { Product } from '../data/ProductCatalog'

export interface UserPreferences {
  occasion?: string
  style?: string
  brand?: string
  color?: string
  size?: string
  budget?: { min?: number; max?: number }
  useCase?: string
  priorities?: string[]
  experience?: 'beginner' | 'intermediate' | 'expert'
  timeline?: 'immediate' | 'this_week' | 'this_month' | 'flexible'
}

export interface InterviewQuestion {
  id: string
  question: string
  type: 'single_choice' | 'multiple_choice' | 'text' | 'budget_range' | 'priority_ranking' | 'slider' | 'rating'
  options?: Array<{
    id: string
    label: string
    value: any
    description?: string
  }>
  followUp?: string
  category: 'occasion' | 'style' | 'budget' | 'use_case' | 'preferences' | 'experience'
  required: boolean
  min?: number
  max?: number
  step?: number
  labels?: string[]
}

export interface InterviewState {
  currentStage: 'greeting' | 'interview' | 'recommendations' | 'exploration' | 'decision'
  currentQuestionIndex: number
  questions: InterviewQuestion[]
  answers: Record<string, any>
  preferences: UserPreferences
  isComplete: boolean
  personalizedGreeting: string
}

export class PersonalizedInterviewManager {
  private questions: InterviewQuestion[] = [
    {
      id: 'occasion',
      question: "What's the main occasion for this purchase?",
      type: 'single_choice',
      options: [
        { id: 'work', label: 'Work/Professional', value: 'work', description: 'For business and professional use' },
        { id: 'personal', label: 'Personal Use', value: 'personal', description: 'For personal daily activities' },
        { id: 'gift', label: 'Gift', value: 'gift', description: 'Purchasing as a gift for someone' },
        { id: 'travel', label: 'Travel', value: 'travel', description: 'For travel and mobility' },
        { id: 'gaming', label: 'Gaming', value: 'gaming', description: 'For gaming and entertainment' },
        { id: 'creative', label: 'Creative Work', value: 'creative', description: 'For creative projects and design' }
      ],
      category: 'occasion',
      required: true
    },
    {
      id: 'use_case',
      question: "How will you primarily use this device? (Select all that apply)",
      type: 'multiple_choice',
      options: [
        { id: 'email', label: 'Email & Web Browsing', value: 'email', description: 'Basic productivity and communication' },
        { id: 'video_calls', label: 'Video Calls', value: 'video_calls', description: 'Zoom, Teams, and video conferencing' },
        { id: 'photo_editing', label: 'Photo/Video Editing', value: 'photo_editing', description: 'Creative content creation' },
        { id: 'gaming', label: 'Gaming', value: 'gaming', description: 'Games and entertainment' },
        { id: 'programming', label: 'Programming', value: 'programming', description: 'Software development and coding' },
        { id: 'content_creation', label: 'Content Creation', value: 'content_creation', description: 'Blogging, streaming, content production' },
        { id: 'streaming', label: 'Streaming', value: 'streaming', description: 'Netflix, YouTube, media consumption' },
        { id: 'office_work', label: 'Office Work', value: 'office_work', description: 'Documents, spreadsheets, presentations' }
      ],
      category: 'use_case',
      required: true
    },
    {
      id: 'budget',
      question: "What's your budget range?",
      type: 'budget_range',
      category: 'budget',
      required: true
    },
    {
      id: 'style',
      question: "What style appeals to you most?",
      type: 'single_choice',
      options: [
        { id: 'modern', label: 'Modern & Sleek', value: 'modern', description: 'Clean, minimalist design with premium materials' },
        { id: 'classic', label: 'Classic & Professional', value: 'classic', description: 'Traditional, business-appropriate styling' },
        { id: 'gaming', label: 'Gaming-Focused', value: 'gaming', description: 'RGB lighting, aggressive design, high performance' },
        { id: 'minimalist', label: 'Minimalist', value: 'minimalist', description: 'Simple, clean, no-frills design' },
        { id: 'colorful', label: 'Colorful & Fun', value: 'colorful', description: 'Bright colors, playful design elements' },
        { id: 'rugged', label: 'Rugged & Durable', value: 'rugged', description: 'Built to last, protective design' }
      ],
      category: 'style',
      required: false
    },
    {
      id: 'brand',
      question: "Do you have any brand preferences? (Select all that apply)",
      type: 'multiple_choice',
      options: [
        { id: 'apple', label: 'Apple', value: 'apple', description: 'MacBook, iPhone, iPad ecosystem' },
        { id: 'samsung', label: 'Samsung', value: 'samsung', description: 'Galaxy phones, tablets, and laptops' },
        { id: 'microsoft', label: 'Microsoft', value: 'microsoft', description: 'Surface devices and Windows ecosystem' },
        { id: 'google', label: 'Google', value: 'google', description: 'Pixel phones and Chromebooks' },
        { id: 'dell', label: 'Dell', value: 'dell', description: 'XPS, Inspiron, and business laptops' },
        { id: 'hp', label: 'HP', value: 'hp', description: 'Pavilion, EliteBook, and Spectre series' },
        { id: 'lenovo', label: 'Lenovo', value: 'lenovo', description: 'ThinkPad, Yoga, and IdeaPad series' },
        { id: 'asus', label: 'ASUS', value: 'asus', description: 'ROG gaming, ZenBook, and VivoBook series' },
        { id: 'no_preference', label: 'No Preference', value: 'no_preference', description: 'Open to any reliable brand' }
      ],
      category: 'preferences',
      required: false
    },
    {
      id: 'priorities',
      question: "What's most important to you? (Drag to rank your top 3)",
      type: 'priority_ranking',
      options: [
        { id: 'performance', label: 'Performance', value: 'performance', description: 'Speed, processing power, multitasking' },
        { id: 'battery', label: 'Battery Life', value: 'battery', description: 'Long-lasting battery for all-day use' },
        { id: 'portability', label: 'Portability', value: 'portability', description: 'Lightweight, compact, easy to carry' },
        { id: 'price', label: 'Price', value: 'price', description: 'Good value for money, budget-friendly' },
        { id: 'camera', label: 'Camera Quality', value: 'camera', description: 'High-quality photos and videos' },
        { id: 'display', label: 'Display Quality', value: 'display', description: 'Sharp, bright, color-accurate screen' },
        { id: 'storage', label: 'Storage', value: 'storage', description: 'Lots of space for files and apps' },
        { id: 'build', label: 'Build Quality', value: 'build', description: 'Durable, well-constructed, premium feel' }
      ],
      category: 'preferences',
      required: true
    },
    {
      id: 'experience',
      question: "How would you describe your tech experience?",
      type: 'slider',
      min: 1,
      max: 5,
      step: 1,
      labels: ['Beginner', 'Somewhat Comfortable', 'Comfortable', 'Advanced', 'Expert'],
      category: 'experience',
      required: false
    },
    {
      id: 'timeline',
      question: "When do you need this?",
      type: 'single_choice',
      options: [
        { id: 'immediate', label: 'Immediately', value: 'immediate', description: 'Need it right away' },
        { id: 'this_week', label: 'This Week', value: 'this_week', description: 'Within the next 7 days' },
        { id: 'this_month', label: 'This Month', value: 'this_month', description: 'Within the next 30 days' },
        { id: 'flexible', label: 'Flexible Timing', value: 'flexible', description: 'No rush, can wait for the right deal' }
      ],
      category: 'preferences',
      required: false
    }
  ]

  private personalizedGreetings = [
    "Hi there! I'm excited to help you find the perfect device. Let me ask you a few quick questions to personalize my recommendations.",
    "Welcome! I'd love to get to know your needs better so I can suggest exactly what you're looking for.",
    "Hello! I'm here to help you find the ideal product. A quick chat will help me understand what you need.",
    "Hey! Let's find you something amazing. I'll ask a few questions to make sure I recommend the perfect fit."
  ]

  createInterviewState(): InterviewState {
    return {
      currentStage: 'greeting',
      currentQuestionIndex: 0,
      questions: this.questions,
      answers: {},
      preferences: {},
      isComplete: false,
      personalizedGreeting: this.getRandomGreeting()
    }
  }

  getCurrentQuestion(state: InterviewState): InterviewQuestion | null {
    if (state.currentStage !== 'interview') return null
    return state.questions[state.currentQuestionIndex] || null
  }

  processAnswer(state: InterviewState, answer: any): InterviewState {
    const currentQuestion = this.getCurrentQuestion(state)
    if (!currentQuestion) return state

    const newState = { ...state }
    newState.answers[currentQuestion.id] = answer

    // Update preferences based on answer
    this.updatePreferencesFromAnswer(newState, currentQuestion, answer)

    // Move to next question or complete interview
    if (state.currentQuestionIndex < state.questions.length - 1) {
      newState.currentQuestionIndex++
    } else {
      newState.isComplete = true
      newState.currentStage = 'recommendations'
    }

    return newState
  }

  private updatePreferencesFromAnswer(state: InterviewState, question: InterviewQuestion, answer: any): void {
    switch (question.id) {
      case 'occasion':
        state.preferences.occasion = answer
        break
      case 'use_case':
        state.preferences.useCase = Array.isArray(answer) ? answer.join(', ') : answer
        break
      case 'budget':
        state.preferences.budget = this.parseBudgetRange(answer)
        break
      case 'style':
        state.preferences.style = answer
        break
      case 'brand':
        state.preferences.brand = Array.isArray(answer) ? answer.join(', ') : answer
        break
      case 'priorities':
        state.preferences.priorities = Array.isArray(answer) ? answer : [answer]
        break
      case 'experience':
        state.preferences.experience = answer
        break
      case 'timeline':
        state.preferences.timeline = answer
        break
    }
  }

  private parseBudgetRange(budgetText: string): { min: number; max: number } | undefined {
    const ranges: Record<string, { min: number; max: number }> = {
      'Under $500': { min: 0, max: 500 },
      '$500-$1000': { min: 500, max: 1000 },
      '$1000-$2000': { min: 1000, max: 2000 },
      '$2000-$3000': { min: 2000, max: 3000 },
      '$3000+': { min: 3000, max: 10000 },
      'Flexible': { min: 0, max: 10000 }
    }
    return ranges[budgetText]
  }

  getPersonalizedRecommendations(state: InterviewState, products: Product[]): Product[] {
    if (!state.isComplete) return products

    let filtered = [...products]

    // Filter by budget
    if (state.preferences.budget) {
      filtered = filtered.filter(product => 
        product.price >= (state.preferences.budget!.min || 0) &&
        product.price <= (state.preferences.budget!.max || 10000)
      )
    }

    // Filter by occasion/use case
    if (state.preferences.occasion) {
      filtered = this.filterByOccasion(filtered, state.preferences.occasion)
    }

    // Filter by style
    if (state.preferences.style) {
      filtered = this.filterByStyle(filtered, state.preferences.style)
    }

    // Sort by priorities
    if (state.preferences.priorities && state.preferences.priorities.length > 0) {
      filtered = this.sortByPriorities(filtered, state.preferences.priorities)
    }

    return filtered.slice(0, 6) // Return top 6 recommendations
  }

  private filterByOccasion(products: Product[], occasion: string): Product[] {
    const occasionFilters: Record<string, string[]> = {
      'Work/Professional': ['laptop', 'tablet'],
      'Personal Use': ['laptop', 'phone', 'tablet'],
      'Gift': ['phone', 'tablet', 'accessories'],
      'Travel': ['laptop', 'phone'],
      'Gaming': ['laptop', 'phone'],
      'Creative Work': ['laptop', 'tablet']
    }

    const categories = occasionFilters[occasion] || []
    return products.filter(product => 
      categories.some(category => product.category.toLowerCase().includes(category))
    )
  }

  private filterByStyle(products: Product[], style: string): Product[] {
    // This would be more sophisticated in a real implementation
    // For now, we'll use simple keyword matching
    const styleKeywords: Record<string, string[]> = {
      'Modern & Sleek': ['pro', 'air', 'ultra'],
      'Classic & Professional': ['pro', 'business'],
      'Gaming-Focused': ['gaming', 'gamer'],
      'Minimalist': ['air', 'mini'],
      'Colorful & Fun': ['colorful', 'bright'],
      'Rugged & Durable': ['rugged', 'tough']
    }

    const keywords = styleKeywords[style] || []
    return products.filter(product => 
      keywords.some(keyword => 
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      )
    )
  }

  private sortByPriorities(products: Product[], priorities: string[]): Product[] {
    return products.sort((a, b) => {
      let scoreA = 0
      let scoreB = 0

      priorities.forEach((priority, index) => {
        const weight = priorities.length - index // Higher weight for higher priority
        scoreA += this.getProductScore(a, priority) * weight
        scoreB += this.getProductScore(b, priority) * weight
      })

      return scoreB - scoreA
    })
  }

  private getProductScore(product: Product, priority: string): number {
    // This is a simplified scoring system
    // In a real implementation, this would be more sophisticated
    const scores: Record<string, number> = {
      'Performance': product.price > 1500 ? 3 : product.price > 1000 ? 2 : 1,
      'Battery Life': product.name.toLowerCase().includes('pro') ? 3 : 2,
      'Portability': product.name.toLowerCase().includes('air') ? 3 : 2,
      'Price': product.price < 1000 ? 3 : product.price < 2000 ? 2 : 1,
      'Camera Quality': product.name.toLowerCase().includes('pro') ? 3 : 2,
      'Display Quality': product.name.toLowerCase().includes('pro') ? 3 : 2,
      'Storage': product.name.toLowerCase().includes('pro') ? 3 : 2,
      'Build Quality': product.price > 1500 ? 3 : 2
    }

    return scores[priority] || 1
  }

  generatePersonalizedResponse(state: InterviewState): string {
    if (state.currentStage === 'greeting') {
      return state.personalizedGreeting
    }

    if (state.currentStage === 'interview') {
      const currentQuestion = this.getCurrentQuestion(state)
      if (currentQuestion) {
        return this.formatQuestion(currentQuestion)
      }
    }

    if (state.currentStage === 'recommendations') {
      return this.generateRecommendationSummary(state)
    }

    return "How can I help you today?"
  }

  private formatQuestion(question: InterviewQuestion): string {
    let response = question.question

    if (question.options && question.options.length > 0) {
      response += "\n\nOptions:"
      question.options.forEach((option, index) => {
        response += `\n${index + 1}. ${option.label}`
        if (option.description) {
          response += ` - ${option.description}`
        }
      })
    }

    if (question.type === 'multiple_choice') {
      response += "\n\n(You can select multiple options)"
    }

    if (question.type === 'priority_ranking') {
      response += "\n\n(Please rank your top 3 in order of importance)"
    }

    if (question.type === 'slider') {
      response += `\n\n(Use the slider to select from ${question.min} to ${question.max})`
    }

    return response
  }

  private generateRecommendationSummary(state: InterviewState): string {
    const { preferences } = state
    let summary = "Perfect! Based on your preferences, I have some great recommendations for you.\n\n"

    if (preferences.occasion) {
      summary += `For ${preferences.occasion.toLowerCase()}, `
    }

    if (preferences.budget) {
      const budgetText = preferences.budget.max === 10000 ? 'flexible budget' : `$${preferences.budget.min}-$${preferences.budget.max} budget`
      summary += `with your ${budgetText}, `
    }

    if (preferences.priorities && preferences.priorities.length > 0) {
      summary += `focusing on ${preferences.priorities.slice(0, 2).join(' and ')}, `
    }

    summary += "here are my top picks:"

    return summary
  }

  private getRandomGreeting(): string {
    return this.personalizedGreetings[Math.floor(Math.random() * this.personalizedGreetings.length)]
  }

  shouldShowQuickActions(state: InterviewState): boolean {
    return state.currentStage === 'recommendations' || state.isComplete
  }

  getQuickActions(state: InterviewState): string[] {
    if (state.currentStage === 'greeting') {
      return ["Start Interview", "Skip to Browse", "Tell me about products"]
    }

    if (state.currentStage === 'interview') {
      return ["Skip this question", "Go back", "Skip interview"]
    }

    if (state.currentStage === 'recommendations') {
      return ["Show more options", "Compare products", "Refine preferences", "Start over"]
    }

    return ["Browse products", "Get recommendations", "Compare products", "Help"]
  }
}
