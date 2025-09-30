import React, { useState, useEffect } from 'react'
import PersonalizedConversationInterface from './PersonalizedConversationInterface'
import { Product } from '../../data/ProductCatalog'

export default function PersonalizedConversationApp() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load product data
    const loadProducts = async () => {
      try {
        // Import the product data
        const { products: productData } = await import('../../data/ProductCatalog')
        setProducts(productData)
      } catch (error) {
        console.error('Error loading products:', error)
        // Fallback to empty array if loading fails
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading personalized shop assistant...</p>
        </div>
      </div>
    )
  }

  return (
    <PersonalizedConversationInterface 
      products={products}
      onConversationUpdate={(messages) => {
        // Handle conversation updates if needed
        console.log('Conversation updated:', messages.length, 'messages')
      }}
    />
  )
}







