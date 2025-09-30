import React from 'react'
import FoodDeliveryInterface from './FoodDeliveryInterface'

const FoodDeliveryApp: React.FC = () => {
  const handleOrderComplete = (order: any) => {
    console.log('Order completed:', order)
    // Here you would typically send the order to your backend
    alert(`Order completed! Total: $${order.total.toFixed(2)}`)
  }

  const handleConversationUpdate = (messages: any[]) => {
    console.log('Conversation updated:', messages.length, 'messages')
  }

  return (
    <div className="h-screen">
      <FoodDeliveryInterface
        onOrderComplete={handleOrderComplete}
        onConversationUpdate={handleConversationUpdate}
      />
    </div>
  )
}

export default FoodDeliveryApp







