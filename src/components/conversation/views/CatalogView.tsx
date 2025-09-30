import React from 'react'
import { motion } from 'framer-motion'
import { Product } from '../../../data/ProductCatalog'

interface CatalogViewProps {
  products: Product[]
  onProductClick: (product: Product) => void
  selectedProduct?: Product | null
}

export default function CatalogView({ products, onProductClick, selectedProduct }: CatalogViewProps) {
  return (
    <div className="h-full p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Our Products</h3>
        <div className="text-sm text-gray-600">
          {products.length} products available
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full overflow-y-auto">
        {products.map((product) => (
          <motion.div
            key={product.id}
            onClick={() => onProductClick(product)}
            className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedProduct?.id === product.id 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {product.image && (
              <div className="aspect-square mb-3 rounded-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">${product.price}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}




