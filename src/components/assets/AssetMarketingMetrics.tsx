import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MultiMetricData, validateSchema } from '../../data/BaseSchemas'

interface AssetMarketingMetricsProps {
  brandData: MultiMetricData
  copyData: { heading: string; description: string }
  className?: string
}

export default function AssetMarketingMetrics({ 
  brandData, 
  copyData, 
  className = "" 
}: AssetMarketingMetricsProps) {
  const [isReady, setIsReady] = useState(false)
  
  // Validate data schemas
  useEffect(() => {
    try {
      validateSchema(brandData, 'MultiMetric')
      setIsReady(true)
    } catch (error) {
      console.error('Marketing Metrics validation failed:', error)
    }
  }, [brandData])

  // Export mode detection
  const urlParams = new URLSearchParams(window.location.search)
  const exportMode = urlParams.get('export') === 'true'
  const loopCount = parseInt(urlParams.get('loop') || '1')

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  }

  const metricVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    }
  }

  // Trend icon component
  const TrendIcon = ({ trend }: { trend?: 'up' | 'down' | 'neutral' }) => {
    if (!trend || trend === 'neutral') return null
    
    return (
      <motion.div
        initial={{ scale: 0, rotate: trend === 'up' ? -180 : 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 600 }}
        className={`w-4 h-4 ${
          trend === 'up' 
            ? 'text-emerald-400' 
            : 'text-red-400'
        }`}
      >
        {trend === 'up' ? '↗' : '↘'}
      </motion.div>
    )
  }

  if (!isReady) {
    return (
      <div className={`bg-gradient-to-br from-gray-900 to-black p-8 ${className}`}>
        <div className="text-gray-400">Loading marketing metrics...</div>
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
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      data-ready={isReady}
    >
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-400/5" />
      
      {/* Header section */}
      <motion.div 
        className="relative z-10 p-8 pb-6"
        variants={itemVariants}
      >
        <motion.h1 
          className="text-4xl font-bold text-white mb-2"
          variants={itemVariants}
        >
          {brandData.title}
        </motion.h1>
        {brandData.subtitle && (
          <motion.p 
            className="text-gray-300 text-lg leading-relaxed"
            variants={itemVariants}
          >
            {brandData.subtitle}
          </motion.p>
        )}
        <motion.div
          className="mt-4 text-sm text-orange-400 font-medium"
          variants={itemVariants}
        >
          {brandData.timeframe}
        </motion.div>
      </motion.div>

      {/* Metrics grid */}
      <motion.div 
        className="relative z-10 px-8 pb-8"
        variants={itemVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandData.metrics.map((metric: any, index: number) => (
            <motion.div
              key={index}
              className="
                bg-white/5 backdrop-blur-sm
                border border-white/10
                rounded-xl p-6
                hover:bg-white/10 hover:border-orange-400/30
                transition-all duration-300
                group
              "
              variants={metricVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {/* Category tag */}
              {metric.category && (
                <div className="text-xs text-orange-400 font-medium mb-2 uppercase tracking-wide">
                  {metric.category}
                </div>
              )}

              {/* Metric label */}
              <div className="text-gray-300 text-sm mb-3 group-hover:text-white transition-colors">
                {metric.label}
              </div>

              {/* Value and trend */}
              <div className="flex items-center justify-between">
                <motion.div 
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {metric.value}
                </motion.div>
                
                <div className="flex items-center space-x-2">
                  <TrendIcon trend={metric.trend} />
                  {metric.delta && (
                    <motion.div 
                      className={`text-sm font-medium ${
                        metric.trend === 'up' 
                          ? 'text-emerald-400' 
                          : metric.trend === 'down'
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                    >
                      {metric.delta}
                    </motion.div>
                  )}
                </div>
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
          repeat: exportMode ? loopCount - 1 : Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-0 left-0 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: exportMode ? loopCount - 1 : Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </motion.div>
  )
}
