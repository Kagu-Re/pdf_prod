import React, { useState } from 'react'
import { FoodItemCard, OrderSummary, PreferencesCollector, DeliverySetup } from './FoodDeliveryTools'
import { FoodItem, PickupPoint, DeliveryZone } from '../../data/FoodDeliveryCatalog'
import { CustomerPreferences, OrderItem, DeliveryPreferences } from '../../services/FoodDeliveryService'

export const ToolTester: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  // Initialize test results on mount
  React.useEffect(() => {
    addResult('ToolTester initialized - ready for testing')
  }, [])

  // Test data
  const testFoodItem: FoodItem = {
    id: 'test-1',
    name: 'Test Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection',
    price: 18.99,
    type: 'cooked',
    category: 'main_course',
    preparationTime: 25,
    servingSize: 1,
    spiceLevel: 1,
    dietaryTags: ['gluten-free', 'high-protein', 'keto-friendly'],
    cuisineType: 'american',
    mealType: 'dinner',
    image: '/api/placeholder/200/200'
  }

  const testOrderItems: OrderItem[] = [
    {
      id: 'order-1',
      item: testFoodItem,
      quantity: 2,
      customizations: ['extra sauce'],
      specialInstructions: 'No onions',
      subtotal: 37.98
    }
  ]

  const testPickupPoints: PickupPoint[] = [
    {
      id: 'pickup-1',
      name: 'Downtown Location',
      address: '123 Main St, Downtown',
      hours: '9:00 AM - 9:00 PM',
      phone: '(555) 123-4567'
    }
  ]

  const testDeliveryZones: DeliveryZone[] = [
    {
      id: 'zone-1',
      name: 'Downtown',
      deliveryFee: 2.99,
      estimatedTime: '30-45 minutes',
      coverage: 'Downtown area within 5 miles'
    }
  ]

  const testPreferences: CustomerPreferences = {
    dietaryRestrictions: ['gluten-free'],
    dietaryGoals: ['weight_loss'],
    cuisinePreferences: ['american', 'mediterranean'],
    spiceLevel: 2,
    budgetRange: { min: 15, max: 30 }
  }

  const testDeliveryPrefs: DeliveryPreferences = {
    pickupPointId: 'pickup-1',
    deliveryTime: '2024-01-15T18:00:00Z',
    specialInstructions: 'Leave at door',
    contactPhone: '(555) 987-6543'
  }

  const testFoodItems = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Food Items Test</h3>
        <FoodItemCard
          item={testFoodItem}
          onAddToOrder={(item, quantity, customizations, specialInstructions) => {
            addResult(`Add to order: ${item.name} x${quantity}`)
          }}
          onViewDetails={(item) => {
            addResult(`View details: ${item.name}`)
          }}
        />
      </div>
    )
  }

  const testOrderSummary = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Summary Test</h3>
        <OrderSummary
          items={testOrderItems}
          subtotal={37.98}
          deliveryFee={2.99}
          tax={3.28}
          total={44.25}
          onUpdateQuantity={(itemId, quantity) => {
            addResult(`Update quantity: ${itemId} to ${quantity}`)
          }}
          onRemoveItem={(itemId) => {
            addResult(`Remove item: ${itemId}`)
          }}
        />
      </div>
    )
  }

  const testPreferencesCollector = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Preferences Collector Test</h3>
        <PreferencesCollector
          onPreferencesSet={(preferences) => {
            addResult(`Preferences set: ${JSON.stringify(preferences)}`)
          }}
          initialPreferences={testPreferences}
        />
      </div>
    )
  }

  const testDeliverySetup = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Setup Test</h3>
        <DeliverySetup
          pickupPoints={testPickupPoints}
          deliveryZones={testDeliveryZones}
          onDeliverySet={(preferences) => {
            addResult(`Delivery set: ${JSON.stringify(preferences)}`)
          }}
          initialPreferences={testDeliveryPrefs}
        />
      </div>
    )
  }

  const testAssetRendering = () => {
    const testAssets = [
      {
        type: 'food_items',
        title: 'Test Food Items',
        data: { items: [testFoodItem] }
      },
      {
        type: 'order_summary',
        title: 'Test Order Summary',
        data: { 
          items: testOrderItems,
          subtotal: 37.98,
          deliveryFee: 2.99,
          tax: 3.28,
          total: 44.25
        }
      },
      {
        type: 'preferences_collector',
        title: 'Test Preferences',
        data: { currentPreferences: testPreferences }
      },
      {
        type: 'delivery_setup',
        title: 'Test Delivery Setup',
        data: { 
          pickupPoints: testPickupPoints,
          deliveryZones: testDeliveryZones,
          currentPreferences: testDeliveryPrefs
        }
      },
      {
        type: 'nutrition_advice',
        title: 'Test Nutrition Advice',
        data: {
          advice: 'This salmon is high in omega-3 fatty acids and protein.',
          recommendations: ['Great for heart health', 'High protein content', 'Low in carbs']
        }
      },
      {
        type: 'interview_question',
        title: 'Test Interview Question',
        data: {
          question: 'What\'s your budget range?',
          options: [
            { id: 'low', label: 'Under $15', value: 'low' },
            { id: 'medium', label: '$15-30', value: 'medium' },
            { id: 'high', label: 'Over $30', value: 'high' }
          ]
        }
      },
      {
        type: 'leading_question',
        title: 'Test Leading Question',
        data: {
          question: 'What brings you in today?',
          options: [
            { id: 'browsing', label: 'Just browsing', value: 'browsing' },
            { id: 'specific', label: 'Looking for something specific', value: 'specific' },
            { id: 'recommendation', label: 'Need recommendations', value: 'recommendation' }
          ]
        }
      }
    ]

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Asset Rendering Test</h3>
        {testAssets.map((asset, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">{asset.title}</h4>
            <div className="text-sm text-gray-600 mb-2">Type: {asset.type}</div>
            <div className="bg-gray-50 p-2 rounded text-xs">
              {JSON.stringify(asset.data, null, 2)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Food Delivery Tools Tester</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testFoodItems()}
        {testOrderSummary()}
        {testPreferencesCollector()}
        {testDeliverySetup()}
      </div>

      {testAssetRendering()}

      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Test Results</h3>
        <div className="max-h-64 overflow-y-auto">
          {testResults.map((result, index) => (
            <div key={index} className="text-sm text-gray-700 py-1">
              {result}
            </div>
          ))}
        </div>
        <button
          onClick={() => setTestResults([])}
          className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>
    </div>
  )
}
