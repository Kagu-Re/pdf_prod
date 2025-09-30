import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ProcessStep {
  id: string
  title: string
  description: string
  duration?: string
  status?: 'completed' | 'active' | 'pending'
}

interface ProcessFlowData {
  title: string
  subtitle?: string
  steps: ProcessStep[]
  flowType: 'linear' | 'circular' | 'branched'
}

interface AssetProcessFlowProps {
  brandData: ProcessFlowData
  copyData: { heading: string; description: string }
  className?: string
}

export default function AssetProcessFlow({ 
  brandData, 
  copyData, 
  className = "" 
}: AssetProcessFlowProps) {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    setIsReady(true)
  }, [])

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
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  }

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 30
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  }

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  // Status styling
  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-400',
          text: 'text-emerald-400',
          icon: '✓'
        }
      case 'active':
        return {
          bg: 'bg-orange-500/20',
          border: 'border-orange-400',
          text: 'text-orange-400',
          icon: '◯'
        }
      case 'pending':
        return {
          bg: 'bg-gray-500/20',
          border: 'border-gray-400',
          text: 'text-gray-400',
          icon: '○'
        }
      default:
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-400',
          text: 'text-blue-400',
          icon: '●'
        }
    }
  }

  if (!isReady) {
    return (
      <div className={`bg-gradient-to-br from-gray-900 to-black p-8 ${className}`}>
        <div className="text-gray-400">Loading process flow...</div>
      </div>
    )
  }

  return (
    <motion.div
      className={`
        relative w-full h-full
        bg-gradient-to-br from-slate-900 via-gray-900 to-black
        overflow-hidden
        ${className}
      `}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      data-ready={isReady}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10 p-8 pb-6"
        variants={stepVariants}
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          {brandData.title}
        </h1>
        {brandData.subtitle && (
          <p className="text-gray-300 text-lg">
            {brandData.subtitle}
          </p>
        )}
      </motion.div>

      {/* Process steps */}
      <div className="relative z-10 px-8 pb-8">
        <div className="space-y-6">
          {brandData.steps.map((step: ProcessStep, index: number) => {
            const styles = getStatusStyles(step.status)
            const isLast = index === brandData.steps.length - 1
            
            return (
              <div key={step.id} className="relative">
                {/* Step container */}
                <motion.div
                  className="flex items-start space-x-6"
                  variants={stepVariants}
                >
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`
                        w-12 h-12 rounded-full 
                        ${styles.bg} ${styles.border} border-2
                        flex items-center justify-center
                        font-bold text-lg ${styles.text}
                      `}
                      whileHover={{ scale: 1.1 }}
                    >
                      {styles.icon}
                    </motion.div>
                    
                    {/* Connecting line */}
                    {!isLast && (
                      <motion.div
                        className="w-0.5 h-16 bg-gradient-to-b from-gray-400 to-gray-600 mt-2"
                        variants={lineVariants}
                        style={{ originY: 0 }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      className={`
                        ${styles.bg} ${styles.border} border
                        rounded-xl p-6
                        hover:bg-white/5 transition-colors duration-300
                      `}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-white">
                          {step.title}
                        </h3>
                        {step.duration && (
                          <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                            {step.duration}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed">
                        {step.description}
                      </p>

                      {step.status && (
                        <div className="mt-3">
                          <span className={`text-xs font-medium uppercase tracking-wide ${styles.text}`}>
                            {step.status}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Flow type indicator */}
      <div className="absolute bottom-4 right-4">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {brandData.flowType} flow
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
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
        className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: exportMode ? loopCount - 1 : Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
    </motion.div>
  )
}
