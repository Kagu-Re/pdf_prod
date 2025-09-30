import React, { useState } from 'react'
import { FoodItem, PickupPoint, DeliveryZone } from '../../data/FoodDeliveryCatalog'
import { CustomerPreferences, OrderItem, DeliveryPreferences } from '../../services/FoodDeliveryService'

// Food Item Card Component
export const FoodItemCard: React.FC<{
  item: FoodItem
  onAddToOrder: (item: FoodItem, quantity: number, customizations: string[], specialInstructions: string) => void
  onViewDetails: (item: FoodItem) => void
  showAddButton?: boolean
}> = ({ item, onAddToOrder, onViewDetails, showAddButton = true }) => {
  const [quantity, setQuantity] = useState(1)
  const [customizations, setCustomizations] = useState<string[]>([])
  const [specialInstructions, setSpecialInstructions] = useState('')

  const handleAddToOrder = () => {
    onAddToOrder(item, quantity, customizations, specialInstructions)
    setQuantity(1)
    setCustomizations([])
    setSpecialInstructions('')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <span className="text-2xl font-bold text-blue-600">${item.price}</span>
          </div>
          
          <p className="text-gray-600 mt-1">{item.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {(item.dietaryTags || []).slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mt-3 flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {item.preparationTime > 0 ? `${item.preparationTime} min` : 'Raw ingredient'}
            </span>
            <span className="text-sm text-gray-500">{item.servingSize}</span>
            <span className="text-sm text-gray-500">
              {item.spiceLevel > 0 ? `🌶️`.repeat(item.spiceLevel) : 'Mild'}
            </span>
          </div>
          
          {showAddButton && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Special Instructions:</label>
                <input
                  type="text"
                  placeholder="Any special requests?"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleAddToOrder}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                  Add to Order
                </button>
                <button
                  onClick={() => onViewDetails(item)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Order Summary Component
export const OrderSummary: React.FC<{
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
}> = ({ items, subtotal, deliveryFee, tax, total, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        {items.map((orderItem) => (
          <div key={orderItem.item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{orderItem.item.name}</h4>
              <p className="text-sm text-gray-600">${orderItem.item.price} each</p>
              {orderItem.specialInstructions && (
                <p className="text-xs text-gray-500 italic">Note: {orderItem.specialInstructions}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="10"
                value={orderItem.quantity}
                onChange={(e) => onUpdateQuantity(orderItem.item.id, parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-sm font-medium text-gray-900">
                ${(orderItem.item.price * orderItem.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => onRemoveItem(orderItem.item.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery Fee:</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

// Progressive Preferences Collection Component
export const ProgressivePreferencesCollector: React.FC<{
  onPreferencesSet: (preferences: CustomerPreferences) => void
  onStepComplete: (step: number, data: any) => void
  currentStep?: number
  totalSteps?: number
  initialPreferences?: Partial<CustomerPreferences>
}> = ({ onPreferencesSet, onStepComplete, currentStep = 1, totalSteps = 4, initialPreferences }) => {
  const [preferences, setPreferences] = useState<CustomerPreferences>({
    dietaryRestrictions: initialPreferences?.dietaryRestrictions || [],
    dietaryGoals: initialPreferences?.dietaryGoals || [],
    cuisinePreferences: initialPreferences?.cuisinePreferences || [],
    spiceLevel: initialPreferences?.spiceLevel || 2,
    mealTypes: initialPreferences?.mealTypes || [],
    budget: initialPreferences?.budget || { min: 0, max: 100 },
    healthGoals: initialPreferences?.healthGoals || [],
    cookingSkill: initialPreferences?.cookingSkill || 'intermediate',
    timeConstraints: initialPreferences?.timeConstraints || [],
    occasion: initialPreferences?.occasion || ''
  })

  const [currentStepData, setCurrentStepData] = useState<any>({})

  const dietaryOptions = [
    'vegan', 'vegetarian', 'gluten-free', 'keto', 'paleo', 'low-carb', 
    'high-protein', 'dairy-free', 'nut-free', 'soy-free', 'low-sodium', 'high-fiber'
  ]

  const cuisineOptions = [
    'italian', 'mexican', 'asian', 'indian', 'mediterranean', 'american', 
    'thai', 'chinese', 'japanese', 'french', 'middle-eastern', 'latin-american'
  ]

  const healthGoalOptions = [
    'weight-loss', 'weight-gain', 'muscle-building', 'maintenance', 
    'energy-boost', 'digestive-health', 'heart-health', 'immune-support'
  ]

  const handleToggleArray = (currentArray: string[], item: string, setter: (newArray: string[]) => void) => {
    if (currentArray.includes(item)) {
      setter(currentArray.filter(i => i !== item))
    } else {
      setter([...currentArray, item])
    }
  }

  const handleStepComplete = () => {
    // Get the current step's data based on the step number
    let stepData = {}
    switch (currentStep) {
      case 1:
        stepData = { dietaryRestrictions: preferences.dietaryRestrictions }
        break
      case 2:
        stepData = { cuisinePreferences: preferences.cuisinePreferences }
        break
      case 3:
        stepData = { healthGoals: preferences.healthGoals }
        break
      case 4:
        stepData = { 
          cookingSkill: preferences.cookingSkill,
          timeConstraints: preferences.timeConstraints
        }
        break
      default:
        stepData = {}
    }
    
    onStepComplete(currentStep, stepData)
    if (currentStep < totalSteps) {
      setCurrentStepData({})
    } else {
      onPreferencesSet(preferences)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Dietary Restrictions & Allergies</h3>
            <p className="text-gray-600">Do you have any specific dietary needs or allergies?</p>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.slice(0, 8).map(option => (
                <button
                  key={option}
                  onClick={() => handleToggleArray(preferences.dietaryRestrictions, option, 
                    (newArray) => setPreferences({...preferences, dietaryRestrictions: newArray}))}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    preferences.dietaryRestrictions.includes(option)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Cuisine Preferences</h3>
            <p className="text-gray-600">What types of food do you enjoy most?</p>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleToggleArray(preferences.cuisinePreferences, option,
                    (newArray) => setPreferences({...preferences, cuisinePreferences: newArray}))}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    preferences.cuisinePreferences.includes(option)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Health Goals</h3>
            <p className="text-gray-600">What are your health and fitness goals?</p>
            <div className="flex flex-wrap gap-2">
              {healthGoalOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleToggleArray(preferences.healthGoals, option,
                    (newArray) => setPreferences({...preferences, healthGoals: newArray}))}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    preferences.healthGoals.includes(option)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Cooking & Time</h3>
            <p className="text-gray-600">What's your cooking skill level and time availability?</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Skill Level</label>
                <div className="flex space-x-4">
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <button
                      key={level}
                      onClick={() => setPreferences({...preferences, cookingSkill: level as any})}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        preferences.cookingSkill === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return <div>Step {currentStep} of {totalSteps}</div>
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {renderStepContent()}
      
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleStepComplete}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {currentStep < totalSteps ? 'Next Step' : 'Complete Setup'}
        </button>
      </div>
    </div>
  )
}

// Original Preferences Collection Component (kept for backward compatibility)
export const PreferencesCollector: React.FC<{
  onPreferencesSet: (preferences: CustomerPreferences) => void
  initialPreferences?: Partial<CustomerPreferences>
}> = ({ onPreferencesSet, initialPreferences }) => {
  const [preferences, setPreferences] = useState<CustomerPreferences>({
    dietaryRestrictions: initialPreferences?.dietaryRestrictions || [],
    dietaryGoals: initialPreferences?.dietaryGoals || [],
    cuisinePreferences: initialPreferences?.cuisinePreferences || [],
    spiceLevel: initialPreferences?.spiceLevel || 2,
    mealTypes: initialPreferences?.mealTypes || [],
    budget: initialPreferences?.budget || { min: 0, max: 100 },
    healthGoals: initialPreferences?.healthGoals || [],
    cookingSkill: initialPreferences?.cookingSkill || 'intermediate',
    timeConstraints: initialPreferences?.timeConstraints || [],
    occasion: initialPreferences?.occasion || ''
  })

  const dietaryOptions = [
    'vegan', 'vegetarian', 'gluten-free', 'keto', 'paleo', 'low-carb', 
    'high-protein', 'dairy-free', 'nut-free', 'soy-free', 'low-sodium', 'high-fiber'
  ]

  const cuisineOptions = [
    'American', 'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean', 
    'Middle Eastern', 'Thai', 'Chinese', 'Japanese', 'Korean', 'French'
  ]

  const mealTypeOptions = [
    'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer', 'side_dish', 'main_dish'
  ]

  const healthGoalOptions = [
    'weight_loss', 'muscle_gain', 'heart_health', 'energy_boost', 'digestive_health', 'immune_support'
  ]

  const handleToggleArray = (array: string[], value: string, setter: (value: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value))
    } else {
      setter([...array, value])
    }
  }

  const handleSubmit = () => {
    onPreferencesSet(preferences)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tell us about your preferences</h3>
      
      <div className="space-y-6">
        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Restrictions & Preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map(option => (
              <button
                key={option}
                onClick={() => handleToggleArray(preferences.dietaryRestrictions, option, 
                  (value) => setPreferences({...preferences, dietaryRestrictions: value}))}
                className={`px-3 py-1 rounded-full text-sm ${
                  preferences.dietaryRestrictions.includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuisine Preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map(option => (
              <button
                key={option}
                onClick={() => handleToggleArray(preferences.cuisinePreferences, option,
                  (value) => setPreferences({...preferences, cuisinePreferences: value}))}
                className={`px-3 py-1 rounded-full text-sm ${
                  preferences.cuisinePreferences.includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Spice Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spice Level: {preferences.spiceLevel}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            value={preferences.spiceLevel}
            onChange={(e) => setPreferences({...preferences, spiceLevel: parseInt(e.target.value)})}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mild</span>
            <span>Extreme</span>
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range: ${preferences.budget.min} - ${preferences.budget.max}
          </label>
          <div className="flex space-x-4">
            <div>
              <label className="text-sm text-gray-600">Min:</label>
              <input
                type="number"
                min="0"
                value={preferences.budget.min}
                onChange={(e) => setPreferences({
                  ...preferences, 
                  budget: {...preferences.budget, min: parseInt(e.target.value) || 0}
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm ml-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Max:</label>
              <input
                type="number"
                min="0"
                value={preferences.budget.max}
                onChange={(e) => setPreferences({
                  ...preferences, 
                  budget: {...preferences.budget, max: parseInt(e.target.value) || 100}
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm ml-1"
              />
            </div>
          </div>
        </div>

        {/* Health Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Health Goals
          </label>
          <div className="flex flex-wrap gap-2">
            {healthGoalOptions.map(option => (
              <button
                key={option}
                onClick={() => handleToggleArray(preferences.healthGoals, option,
                  (value) => setPreferences({...preferences, healthGoals: value}))}
                className={`px-3 py-1 rounded-full text-sm ${
                  preferences.healthGoals.includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Cooking Skill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cooking Skill Level
          </label>
          <div className="flex space-x-4">
            {['beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                onClick={() => setPreferences({...preferences, cookingSkill: level as any})}
                className={`px-4 py-2 rounded text-sm ${
                  preferences.cookingSkill === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}

// Service Overview Component
export const ServiceOverview: React.FC<{
  onServiceSelected: (service: string) => void
}> = ({ onServiceSelected }) => {
  const services = [
    {
      id: 'meal_planning',
      title: 'Meal Planning',
      description: 'Personalized meal plans based on your dietary needs and preferences',
      icon: '🍽️',
      features: ['Custom meal plans', 'Dietary accommodations', 'Nutritional balance']
    },
    {
      id: 'nutrition_consultation',
      title: 'Nutrition Consultation',
      description: 'Expert nutrition advice and health recommendations',
      icon: '🥗',
      features: ['Health assessments', 'Nutritional guidance', 'Wellness tips']
    },
    {
      id: 'delivery_service',
      title: 'Delivery Service',
      description: 'Convenient delivery and pickup options for your meals',
      icon: '🚚',
      features: ['Flexible delivery', 'Pickup locations', 'Scheduled orders']
    },
    {
      id: 'dietary_accommodations',
      title: 'Dietary Accommodations',
      description: 'Specialized options for allergies, restrictions, and preferences',
      icon: '🌱',
      features: ['Allergy-safe options', 'Diet-specific meals', 'Custom modifications']
    }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Services</h3>
      <p className="text-gray-600 mb-6">Here's what we can help you with:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div
            key={service.id}
            onClick={() => onServiceSelected(service.id)}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{service.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Click on any service to learn more or get started</p>
      </div>
    </div>
  )
}

// Delivery Setup Component
export const DeliverySetup: React.FC<{
  pickupPoints: PickupPoint[]
  deliveryZones: DeliveryZone[]
  onDeliverySet: (preferences: DeliveryPreferences) => void
  initialPreferences?: Partial<DeliveryPreferences>
}> = ({ pickupPoints, deliveryZones, onDeliverySet, initialPreferences }) => {
  const [preferences, setPreferences] = useState<DeliveryPreferences>({
    pickupPoint: initialPreferences?.pickupPoint,
    deliveryAddress: initialPreferences?.deliveryAddress || '',
    preferredTime: initialPreferences?.preferredTime || '',
    specialInstructions: initialPreferences?.specialInstructions || '',
    contactMethod: initialPreferences?.contactMethod || 'phone'
  })

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')

  const handleSubmit = () => {
    onDeliverySet(preferences)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Setup</h3>
      
      <div className="space-y-6">
        {/* Delivery Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Method
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setDeliveryType('pickup')}
              className={`px-4 py-2 rounded text-sm ${
                deliveryType === 'pickup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pickup
            </button>
            <button
              onClick={() => setDeliveryType('delivery')}
              className={`px-4 py-2 rounded text-sm ${
                deliveryType === 'delivery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delivery
            </button>
          </div>
        </div>

        {/* Pickup Point Selection */}
        {deliveryType === 'pickup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Pickup Point
            </label>
            <select
              value={preferences.pickupPoint?.id || ''}
              onChange={(e) => {
                const point = pickupPoints.find(p => p.id === e.target.value)
                setPreferences({...preferences, pickupPoint: point})
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Select a pickup point</option>
              {pickupPoints.map(point => (
                <option key={point.id} value={point.id}>
                  {point.name} - {point.address}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Delivery Address */}
        {deliveryType === 'delivery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address
            </label>
            <textarea
              value={preferences.deliveryAddress}
              onChange={(e) => setPreferences({...preferences, deliveryAddress: e.target.value})}
              placeholder="Enter your full delivery address"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              rows={3}
            />
          </div>
        )}

        {/* Preferred Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Time
          </label>
          <input
            type="datetime-local"
            value={preferences.preferredTime}
            onChange={(e) => setPreferences({...preferences, preferredTime: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            value={preferences.specialInstructions}
            onChange={(e) => setPreferences({...preferences, specialInstructions: e.target.value})}
            placeholder="Any special delivery instructions?"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            rows={2}
          />
        </div>

        {/* Contact Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Contact Method
          </label>
          <div className="flex space-x-4">
            {['phone', 'email', 'text'].map(method => (
              <button
                key={method}
                onClick={() => setPreferences({...preferences, contactMethod: method as any})}
                className={`px-4 py-2 rounded text-sm ${
                  preferences.contactMethod === method
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          Set Delivery Preferences
        </button>
      </div>
    </div>
  )
}


