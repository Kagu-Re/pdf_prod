
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

type CarouselSlideProps = {
  headline: string
  subheading: string
  body: string
  cta: string
  color: string
}

export function CarouselSlide({ headline, subheading, body, cta, color }: CarouselSlideProps) {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`min-h-screen w-full bg-gradient-to-br ${color} flex items-center justify-center p-8`}
      data-ready={isReady}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
      
      <motion.article 
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Highlight badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8"
        >
          <span className="text-white font-medium text-lg">{cta}</span>
        </motion.div>
        
        {/* Main title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-6xl font-black text-white mb-6 leading-tight"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
        >
          {headline}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-3xl font-light text-white/90 mb-8"
        >
          {subheading}
        </motion.h2>
        
        {/* Content */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto"
        >
          {body}
        </motion.p>
        
        {/* Decorative elements */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
          className="absolute top-20 right-20 w-32 h-32 border-2 border-white/20 rounded-full"
        />
        
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: -180 }}
          transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
          className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white/20 rounded-full"
        />
      </motion.article>
    </div>
  )
}

export default CarouselSlide
