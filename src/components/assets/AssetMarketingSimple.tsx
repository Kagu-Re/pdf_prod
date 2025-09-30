import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SimpleMarketingData {
  title: string
  subtitle?: string
  timeframe: string
  metrics: Array<{
    label: string
    value: string
    delta?: string
    category?: string
  }>
}

interface AssetMarketingSimpleProps {
  brandData: SimpleMarketingData
  copyData: { heading: string; description: string }
  className?: string
}

export default function AssetMarketingSimple({ 
  brandData, 
  copyData, 
  className = "" 
}: AssetMarketingSimpleProps) {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    // Simple validation
    if (brandData?.title && brandData?.metrics?.length > 0) {
      setIsReady(true)
    }
  }, [brandData])

  // Export mode detection
  const urlParams = new URLSearchParams(window.location.search)
  const exportMode = urlParams.get('export') === 'true'

  if (!isReady) {
    return (
      <div className={`bg-gradient-to-br from-gray-900 to-black p-8 ${className}`}>
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <motion.div
      className={`
        relative w-full h-full
        bg-gradient-to-br from-gray-900 via-gray-800 to-black
        overflow-hidden
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-ready={isReady}
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-400/5" />
      
      {/* Header */}
      <motion.div 
        className="relative z-10 p-8 pb-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          {brandData.title}
        </h1>
        {brandData.subtitle && (
          <p className="text-gray-300 text-lg leading-relaxed">
            {brandData.subtitle}
          </p>
        )}
        <div className="mt-4 text-sm text-orange-400 font-medium">
          {brandData.timeframe}
        </div>
      </motion.div>

      {/* Metrics grid */}
      <motion.div 
        className="relative z-10 px-8 pb-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandData.metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="
                bg-white/5 backdrop-blur-sm
                border border-white/10
                rounded-xl p-6
                hover:bg-white/10 hover:border-orange-400/30
                transition-all duration-300
              "
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {/* Category */}
              {metric.category && (
                <div className="text-xs text-orange-400 font-medium mb-2 uppercase tracking-wide">
                  {metric.category}
                </div>
              )}

              {/* Label */}
              <div className="text-gray-300 text-sm mb-3">
                {metric.label}
              </div>

              {/* Value */}
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">
                  {metric.value}
                </div>
                
                {metric.delta && (
                  <div className="text-sm font-medium text-emerald-400">
                    {metric.delta}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: exportMode ? 1 : Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}
