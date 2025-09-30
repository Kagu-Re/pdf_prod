import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { dramaticReveal, impactNumber, subtlePulse } from '../../animations/variants'

type Props = {
  metricName: string
  value: string
  delta: string
  timeframe: string
  note?: string
}

export function AssetMetricSnapshot({ metricName, value, delta, timeframe, note }: Props) {
  // Check if we're in export mode (for video/gif generation)
  const isExportMode = new URLSearchParams(window.location.search).get('export') === 'true'
  const loopCount = parseInt(new URLSearchParams(window.location.search).get('loop') || '1')
  
  // Track when asset is ready for export
  const [isReady, setIsReady] = useState(false)
  
  // Set ready state after initial animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, isExportMode ? 2500 : 1800) // Longer delay for export mode
    
    return () => clearTimeout(timer)
  }, [isExportMode])
  
  // Enhanced animation variants for export
  const exportDramaticReveal = {
    ...dramaticReveal,
    visible: {
      ...dramaticReveal.visible,
      transition: {
        ...dramaticReveal.visible.transition,
        repeat: isExportMode && loopCount > 1 ? loopCount - 1 : 0,
        repeatType: "reverse" as const,
        repeatDelay: 0.5
      }
    }
  }
  
  const exportImpactNumber = {
    ...impactNumber,
    visible: {
      ...impactNumber.visible,
      transition: {
        ...impactNumber.visible.transition,
        repeat: isExportMode && loopCount > 1 ? loopCount - 1 : 0,
        repeatType: "reverse" as const,
        repeatDelay: 0.8
      }
    }
  }

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-8"
      data-ready={isReady}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.1),transparent_70%)]" />
      
      <motion.article 
        initial="hidden" 
        animate="visible" 
        variants={isExportMode ? exportDramaticReveal : dramaticReveal}
        className="relative z-10 h-full flex flex-col justify-center items-start p-20"
      >
        {/* Metric name with subtle animation */}
        <motion.header 
          variants={isExportMode ? exportDramaticReveal : dramaticReveal}
          className="text-2xl font-display text-gray-100 mb-8 tracking-wide uppercase opacity-80"
        >
          {metricName}
        </motion.header>
        
        {/* Hero number with dramatic impact */}
        <motion.div 
          variants={isExportMode ? exportImpactNumber : impactNumber}
          className="relative mb-12"
        >
          <motion.div 
            {...(isExportMode ? {} : subtlePulse)}
            className="text-hero font-display font-black text-brand-primary leading-none tracking-tighter"
            style={{ textShadow: '0 4px 20px rgba(255,107,53,0.3)' }}
          >
            {value}
          </motion.div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 text-hero font-display font-black text-brand-primary opacity-20 blur-sm leading-none tracking-tighter">
            {value}
          </div>
        </motion.div>
        
        {/* Delta and timeframe with minimalist styling */}
        <motion.div 
          variants={isExportMode ? exportDramaticReveal : dramaticReveal}
          className="text-xl text-gray-300 mb-auto"
        >
          <span className="text-brand-accent font-medium">{delta}</span>
          <span className="text-gray-400 ml-2">in {timeframe}</span>
        </motion.div>
        
        {/* Note with subtle emphasis */}
        {note && (
          <motion.footer 
            variants={isExportMode ? exportDramaticReveal : dramaticReveal}
            className="text-sm text-gray-400 font-mono tracking-wide mt-auto border-l-2 border-brand-primary pl-4 opacity-60"
          >
            {note}
          </motion.footer>
        )}
        
        {/* Decorative minimal line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ 
            delay: 1.5, 
            duration: 0.8,
            repeat: isExportMode && loopCount > 1 ? loopCount - 1 : 0,
            repeatType: "reverse",
            repeatDelay: 0.3
          }}
          className="absolute bottom-20 right-20 h-0.5 bg-gradient-to-r from-brand-primary to-transparent"
        />
        
        {/* Export mode indicator */}
        {isExportMode && (
          <div className="absolute top-4 right-4 text-xs text-gray-500 font-mono">
            Export Mode {loopCount > 1 && `(${loopCount}x)`}
          </div>
        )}
      </motion.article>
    </div>
  )
}

export default AssetMetricSnapshot
