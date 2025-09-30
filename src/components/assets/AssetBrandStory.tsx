import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BrandStoryData {
  headline: string
  subheadline?: string
  mainMessage: string
  supportingPoints: string[]
  cta: string
  theme: 'mission' | 'values' | 'story' | 'vision'
}

interface AssetBrandStoryProps {
  brandData: BrandStoryData
  copyData: { heading: string; description: string }
  className?: string
}

export default function AssetBrandStory({ 
  brandData, 
  copyData, 
  className = "" 
}: AssetBrandStoryProps) {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    setIsReady(true)
  }, [])

  // Export mode detection
  const urlParams = new URLSearchParams(window.location.search)
  const exportMode = urlParams.get('export') === 'true'
  const loopCount = parseInt(urlParams.get('loop') || '1')

  // Theme-based styling
  const themeConfig = {
    mission: {
      bgGradient: 'from-blue-900 via-purple-900 to-black',
      accentColor: 'text-blue-400',
      secondaryColor: 'text-purple-300',
      buttonBg: 'bg-blue-400',
      decorativeAccent: 'bg-blue-400/10',
      decorativeSecondary: 'bg-purple-300/20'
    },
    values: {
      bgGradient: 'from-green-900 via-emerald-900 to-black',
      accentColor: 'text-emerald-400',
      secondaryColor: 'text-green-300',
      buttonBg: 'bg-emerald-400',
      decorativeAccent: 'bg-emerald-400/10',
      decorativeSecondary: 'bg-green-300/20'
    },
    story: {
      bgGradient: 'from-amber-900 via-orange-900 to-black',
      accentColor: 'text-amber-400',
      secondaryColor: 'text-orange-300',
      buttonBg: 'bg-amber-400',
      decorativeAccent: 'bg-amber-400/10',
      decorativeSecondary: 'bg-orange-300/20'
    },
    vision: {
      bgGradient: 'from-indigo-900 via-blue-900 to-black',
      accentColor: 'text-indigo-400',
      secondaryColor: 'text-blue-300',
      buttonBg: 'bg-indigo-400',
      decorativeAccent: 'bg-indigo-400/10',
      decorativeSecondary: 'bg-blue-300/20'
    }
  }

  const theme = themeConfig[brandData.theme] || themeConfig.story

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
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

  const pointVariants = {
    hidden: { opacity: 0, x: -30 },
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

  if (!isReady) {
    return (
      <div className={`bg-gradient-to-br from-gray-900 to-black p-8 ${className}`}>
        <div className="text-gray-400">Loading brand story...</div>
      </div>
    )
  }

  return (
    <motion.div
      className={`
        relative w-full h-full
        bg-gradient-to-br ${theme.gradient}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent)]" />
      </div>

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col justify-center p-12">
        
        {/* Headline */}
        <motion.h1 
          className={`text-6xl font-bold text-white mb-6 leading-tight`}
          variants={textVariants}
        >
          {brandData.headline}
        </motion.h1>

        {/* Subheadline */}
        {brandData.subheadline && (
          <motion.p 
            className={`text-xl text-${theme.secondary} mb-8 max-w-2xl`}
            variants={textVariants}
          >
            {brandData.subheadline}
          </motion.p>
        )}

        {/* Main message */}
        <motion.div 
          className="mb-10"
          variants={textVariants}
        >
          <p className="text-2xl text-gray-100 leading-relaxed max-w-4xl">
            {brandData.mainMessage}
          </p>
        </motion.div>

        {/* Supporting points */}
        <motion.div 
          className="mb-12"
          variants={textVariants}
        >
          <div className="space-y-4">
            {brandData.supportingPoints.map((point: string, index: number) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4"
                variants={pointVariants}
              >
                <motion.div
                  className={`w-2 h-2 bg-${theme.accent} rounded-full mt-3 flex-shrink-0`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 1 }}
                />
                <p className="text-lg text-gray-200 leading-relaxed">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          variants={textVariants}
        >
          <motion.button
            className={`
              px-8 py-4 
              bg-${theme.accent} text-black 
              font-bold text-lg rounded-lg
              hover:bg-white hover:scale-105
              transition-all duration-300
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {brandData.cta}
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className={`absolute top-0 right-0 w-96 h-96 bg-${theme.accent}/10 rounded-full blur-3xl`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: exportMode ? loopCount - 1 : Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className={`absolute bottom-0 left-0 w-64 h-64 bg-${theme.secondary}/20 rounded-full blur-2xl`}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 5,
          repeat: exportMode ? loopCount - 1 : Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Theme indicator */}
      <div className="absolute top-4 right-4">
        <div className={`text-xs text-${theme.accent} font-medium uppercase tracking-wide`}>
          {brandData.theme}
        </div>
      </div>
    </motion.div>
  )
}
