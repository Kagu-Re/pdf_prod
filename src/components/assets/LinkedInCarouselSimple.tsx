import React from 'react'
import { motion } from 'framer-motion'

export default function LinkedInCarouselSimple() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center text-white"
      >
        <h1 className="text-6xl font-bold mb-4">LinkedIn Carousel</h1>
        <p className="text-2xl">Simple Test Component</p>
        <p className="text-lg mt-4">If you can see this, the component is working!</p>
      </motion.div>
    </div>
  )
}








