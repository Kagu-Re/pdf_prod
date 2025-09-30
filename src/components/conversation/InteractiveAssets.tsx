import React from 'react'
import { motion } from 'framer-motion'
import { Product } from '../../data/ProductCatalog'

export interface InteractiveAssetProps {
  asset: {
    type: 'card' | 'list' | 'table' | 'comparison' | 'specs' | 'policies' | 'recommendations'
    title?: string
    data: any
    interactive?: boolean
    clickable?: boolean
    action?: string
  }
  onAssetClick: (action: string, data: any) => void
  onProductSelect: (product: Product) => void
}

export function InteractiveProductCard({ asset, onAssetClick, onProductSelect }: InteractiveAssetProps) {
  const { product } = asset.data

  const handleClick = () => {
    if (asset.clickable) {
      onAssetClick(asset.action || 'select_product', { product })
      onProductSelect(product)
    }
  }

  return (
    <motion.div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${
        asset.clickable ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''
      } transition-all duration-200`}
      onClick={handleClick}
      whileHover={asset.clickable ? { scale: 1.02 } : {}}
      whileTap={asset.clickable ? { scale: 0.98 } : {}}
    >
      <div className="flex items-start space-x-4">
        {product.image && (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">${product.price}</p>
          <p className="text-gray-600 mt-2">{product.description}</p>
          {product.features && product.features.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {product.features.slice(0, 3).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {asset.clickable && (
            <div className="mt-3 text-xs text-blue-600 font-medium">
              Click to view details →
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function InteractiveList({ asset, onAssetClick }: InteractiveAssetProps) {
  const { items } = asset.data

  const handleItemClick = (item: string, index: number) => {
    if (asset.clickable) {
      onAssetClick(asset.action || 'select_item', { item, index })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {asset.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{asset.title}</h3>}
      <ul className="space-y-2">
        {items.map((item: string, index: number) => (
          <motion.li
            key={index}
            className={`flex items-center text-sm text-gray-700 ${
              asset.clickable ? 'cursor-pointer hover:bg-gray-50 p-2 rounded' : ''
            } transition-colors`}
            onClick={() => handleItemClick(item, index)}
            whileHover={asset.clickable ? { x: 4 } : {}}
          >
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
            {item}
            {asset.clickable && (
              <span className="ml-auto text-xs text-blue-600">→</span>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export function InteractiveComparison({ asset, onAssetClick, onProductSelect }: InteractiveAssetProps) {
  const { products } = asset.data

  const handleProductClick = (product: Product) => {
    if (asset.clickable) {
      onAssetClick('select_product', { product })
      onProductSelect(product)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {asset.title && <h3 className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">{asset.title}</h3>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Key Features</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product: Product) => (
              <motion.tr
                key={product.id}
                className={`${asset.clickable ? 'cursor-pointer hover:bg-blue-50' : ''} transition-colors`}
                onClick={() => handleProductClick(product)}
                whileHover={asset.clickable ? { scale: 1.01 } : {}}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-lg font-semibold text-blue-600">${product.price}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.features.slice(0, 2).join(', ')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {asset.clickable && (
        <div className="p-3 bg-gray-50 text-xs text-gray-600 text-center">
          Click on any product to view details
        </div>
      )}
    </div>
  )
}

export function InteractiveSpecs({ asset, onAssetClick }: InteractiveAssetProps) {
  const { specifications } = asset.data

  const handleSpecClick = (key: string, value: string) => {
    if (asset.clickable) {
      onAssetClick('view_spec', { key, value })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {asset.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{asset.title}</h3>}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(specifications).map(([key, value]) => (
          <motion.div
            key={key}
            className={`flex justify-between py-2 border-b border-gray-100 ${
              asset.clickable ? 'cursor-pointer hover:bg-gray-50 px-2 rounded' : ''
            } transition-colors`}
            onClick={() => handleSpecClick(key, value as string)}
            whileHover={asset.clickable ? { x: 4 } : {}}
          >
            <span className="text-gray-600">{key}:</span>
            <span className="text-gray-900 font-medium">{value as string}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function InteractivePolicies({ asset, onAssetClick }: InteractiveAssetProps) {
  const { items } = asset.data

  const handlePolicyClick = (item: string, index: number) => {
    if (asset.clickable) {
      onAssetClick('view_policy', { item, index })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {asset.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{asset.title}</h3>}
      <div className="space-y-3">
        {items.map((item: string, index: number) => (
          <motion.div
            key={index}
            className={`flex items-center text-sm text-gray-700 ${
              asset.clickable ? 'cursor-pointer hover:bg-gray-50 p-2 rounded' : ''
            } transition-colors`}
            onClick={() => handlePolicyClick(item, index)}
            whileHover={asset.clickable ? { x: 4 } : {}}
          >
            <span className="text-lg mr-3">{item.split(' ')[0]}</span>
            <span>{item.substring(item.indexOf(' ') + 1)}</span>
            {asset.clickable && (
              <span className="ml-auto text-xs text-blue-600">→</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function InteractiveRecommendations({ asset, onAssetClick, onProductSelect }: InteractiveAssetProps) {
  const { products, showMatch, showPrice } = asset.data

  const handleProductClick = (product: Product) => {
    if (asset.clickable) {
      onAssetClick('select_recommendation', { product })
      onProductSelect(product)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {asset.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{asset.title}</h3>}
      <div className="space-y-3">
        {products.map((product: Product, index: number) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg ${
              asset.clickable ? 'cursor-pointer hover:border-blue-300 hover:bg-blue-50' : ''
            } transition-colors`}
            onClick={() => handleProductClick(product)}
            whileHover={asset.clickable ? { scale: 1.02 } : {}}
            whileTap={asset.clickable ? { scale: 0.98 } : {}}
          >
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
              <p className="text-sm text-gray-600 truncate">{product.description}</p>
              <div className="flex items-center justify-between mt-1">
                {showPrice && (
                  <span className="text-sm font-semibold text-blue-600">${product.price}</span>
                )}
                {showMatch && (
                  <span className="text-xs text-gray-500">
                    {Math.floor(Math.random() * 20 + 80)}% match
                  </span>
                )}
              </div>
            </div>
            {asset.clickable && (
              <div className="text-xs text-blue-600">→</div>
            )}
          </motion.div>
        ))}
      </div>
      {asset.clickable && (
        <div className="mt-3 text-xs text-gray-600 text-center">
          Click on any product to view details
        </div>
      )}
    </div>
  )
}







