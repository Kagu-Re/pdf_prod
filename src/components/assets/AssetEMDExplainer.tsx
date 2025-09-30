import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cinematicStagger, dramaticReveal, slideFromLeft, slideFromRight } from '../../animations/variants'

type Stat = { label: string; value: string }
type Node = { id: string; label: string }
type Edge = { from: string; to: string }

type Props = {
  title: string
  subtitle: string
  painStats: Stat[]
  diagram: { nodes: Node[]; edges: Edge[] }
  cta: string
}

export default function AssetEMDExplainer({ title, subtitle, painStats, diagram, cta }: Props) {
  // Track when asset is ready for export
  const [isReady, setIsReady] = useState(false)
  
  // Set ready state after initial animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 2000) // 2 second delay for animations to complete
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className="w-[1080px] h-[1350px] bg-gradient-to-b from-gray-50 to-gray-100 text-gray-950 relative overflow-hidden"
      data-ready={isReady}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,53,0.1),transparent_50%)]" />
      
      <motion.section 
        initial="hidden" 
        animate="visible" 
        variants={cinematicStagger}
        className="relative z-10 p-20 h-full flex flex-col"
      >
        {/* Header with dramatic entrance */}
        <motion.header variants={dramaticReveal} className="mb-16">
          <h1 className="text-display font-display font-black text-gray-900 leading-none mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-600 font-light tracking-wide max-w-2xl">
            {subtitle}
          </p>
          {/* Accent line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-brand-primary to-brand-accent mt-6"
          />
        </motion.header>
        
        {/* Pain stats with alternating slide animations */}
        <motion.div variants={cinematicStagger} className="grid grid-cols-3 gap-8 mb-16">
          {painStats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
              className="group"
            >
              <div className="bg-white border border-gray-200 p-8 transition-all duration-300 hover:shadow-dramatic hover:border-brand-primary/20">
                <div className="text-sm font-mono text-gray-500 mb-3 uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-4xl font-display font-bold text-gray-900 group-hover:text-brand-primary transition-colors duration-300">
                  {stat.value}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Diagram nodes with minimalist design */}
        <motion.div variants={cinematicStagger} className="grid grid-cols-3 gap-6 mb-auto">
          {diagram.nodes.map((node, i) => (
            <motion.div 
              key={node.id} 
              variants={dramaticReveal}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="bg-gray-900 text-white p-6 border-l-4 border-brand-primary hover:border-brand-accent transition-all duration-300">
                <div className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                  Node {i + 1}
                </div>
                <div className="text-lg font-medium text-gray-100">
                  {node.label}
                </div>
              </div>
              {/* Connection indicator */}
              {i < diagram.nodes.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.2 }}
                  className="absolute -right-3 top-1/2 w-6 h-0.5 bg-gradient-to-r from-brand-primary to-transparent"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA with dramatic styling */}
        <motion.footer 
          variants={dramaticReveal}
          className="mt-auto"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white px-10 py-4 font-medium text-lg cursor-pointer shadow-dramatic hover:shadow-xl transition-all duration-300"
          >
            <span>{cta}</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xl"
            >
              →
            </motion.div>
          </motion.div>
        </motion.footer>
      </motion.section>
    </div>
  )
}
