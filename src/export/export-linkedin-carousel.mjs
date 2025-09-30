#!/usr/bin/env node
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'path'
import { spawn } from 'node:child_process'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i+1] : fallback
}

// LinkedIn carousel configuration
const carouselSlides = [
  {
    id: 'slide-1',
    title: 'Agile Tunnel',
    subtitle: 'Dynamic Asset Generation System',
    content: 'React-based platform for creating animated, professional visual assets',
    highlight: '🎬 Cinematic Animations',
    color: 'from-purple-900 to-blue-900'
  },
  {
    id: 'slide-2', 
    title: 'Template System',
    subtitle: 'JSON-Driven Design',
    content: 'Preset-based configurations with schema validation using Zod',
    highlight: '⚡ Lightning Fast',
    color: 'from-blue-900 to-indigo-900'
  },
  {
    id: 'slide-3',
    title: 'Multi-Format Export',
    subtitle: 'PNG • PDF • Video • GIF',
    content: 'Automated export pipeline with Puppeteer and FFmpeg integration',
    highlight: '🚀 Production Ready',
    color: 'from-indigo-900 to-purple-900'
  },
  {
    id: 'slide-4',
    title: 'Social Media Ready',
    subtitle: 'Perfect Dimensions',
    content: '1080x1350 optimized for Instagram Stories, LinkedIn, and Facebook',
    highlight: '📱 Mobile First',
    color: 'from-purple-900 to-pink-900'
  },
  {
    id: 'slide-5',
    title: 'MVP Complete',
    subtitle: 'AssetMetricSnapshot Template',
    content: 'Dark gradient backgrounds with orange accents and dramatic animations',
    highlight: '✅ Ready to Ship',
    color: 'from-pink-900 to-red-900'
  }
]

const outDir = 'out/social/linkedin/carousel'
const duration = 4000 // 4 seconds per slide
const fps = 30

// Ensure output directory exists
fs.mkdirSync(outDir, { recursive: true })

console.log('🎠 LinkedIn Carousel Export')
console.log('==========================')
console.log(`📊 Slides: ${carouselSlides.length}`)
console.log(`⏱️  Duration per slide: ${duration}ms`)
console.log(`🎬 FPS: ${fps}`)
console.log(`📁 Output: ${outDir}`)
console.log('')

// Start Vite dev server
let viteProcess = null

function startViteServer() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5173')
            .then(() => {
                console.log('✅ Vite server already running')
                resolve()
            })
            .catch(() => {
                console.log('🚀 Starting Vite dev server...')
                viteProcess = spawn('npm', ['run', 'dev'], {
                    cwd: process.cwd(),
                    stdio: ['ignore', 'pipe', 'pipe'],
                    shell: true
                })
                
                let output = ''
                
                viteProcess.stdout.on('data', (data) => {
                    output += data.toString()
                    if (output.includes('Local:   http://localhost:5173')) {
                        console.log('✅ Vite server started')
                        setTimeout(resolve, 2000)
                    }
                })
                
                viteProcess.on('error', (error) => {
                    reject(error)
                })
                
                setTimeout(() => {
                    reject(new Error('Vite server startup timeout'))
                }, 60000)
            })
    })
}

function stopViteServer() {
    if (viteProcess) {
        console.log('🛑 Stopping Vite server...')
        viteProcess.kill()
        viteProcess = null
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Create carousel slide component
const carouselComponent = `
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

type CarouselSlideProps = {
  title: string
  subtitle: string
  content: string
  highlight: string
  color: string
}

export function CarouselSlide({ title, subtitle, content, highlight, color }: CarouselSlideProps) {
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={\`min-h-screen w-full bg-gradient-to-br \${color} flex items-center justify-center p-8\`}
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
          <span className="text-white font-medium text-lg">{highlight}</span>
        </motion.div>
        
        {/* Main title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-6xl font-black text-white mb-6 leading-tight"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
        >
          {title}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-3xl font-light text-white/90 mb-8"
        >
          {subtitle}
        </motion.h2>
        
        {/* Content */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto"
        >
          {content}
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
`

// Write the carousel component
fs.writeFileSync('src/components/assets/CarouselSlide.tsx', carouselComponent)

// Update Render.tsx to include carousel component
const renderContent = fs.readFileSync('src/Render.tsx', 'utf-8')
if (!renderContent.includes('CarouselSlide')) {
  const updatedRender = renderContent.replace(
    "import AssetMarketingSimple from './components/assets/AssetMarketingSimple'",
    "import AssetMarketingSimple from './components/assets/AssetMarketingSimple'\nimport CarouselSlide from './components/assets/CarouselSlide'"
  ).replace(
    'const components: ComponentMap = {\n  AssetMetricSnapshot,\n  AssetEMDExplainer,\n  AssetMarketingSimple\n}',
    'const components: ComponentMap = {\n  AssetMetricSnapshot,\n  AssetEMDExplainer,\n  AssetMarketingSimple,\n  CarouselSlide\n}'
  )
  fs.writeFileSync('src/Render.tsx', updatedRender)
}

try {
  await startViteServer()
  
  console.log('🌐 Launching browser...')
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-web-security', '--allow-file-access-from-files']
  })
  
  // Generate each slide
  for (let i = 0; i < carouselSlides.length; i++) {
    const slide = carouselSlides[i]
    console.log(`🎬 Generating slide ${i + 1}/${carouselSlides.length}: ${slide.title}`)
    
    // Create slide data file
    const slideDataPath = `src/data/copy/awareness/carousel-${slide.id}.json`
    const slideData = {
      title: slide.title,
      subtitle: slide.subtitle,
      content: slide.content,
      highlight: slide.highlight,
      color: slide.color
    }
    
    fs.mkdirSync(path.dirname(slideDataPath), { recursive: true })
    fs.writeFileSync(slideDataPath, JSON.stringify(slideData, null, 2))
    
    // Create preset file
    const presetPath = `src/brand/presets/awareness/carousel-${slide.id}.json`
    fs.mkdirSync(path.dirname(presetPath), { recursive: true })
    fs.writeFileSync(presetPath, JSON.stringify(slideData, null, 2))
    
    const context = await browser.newContext({
      recordVideo: {
        dir: outDir,
        size: { width: 1080, height: 1350 }
      }
    })
    
    const page = await context.newPage()
    await page.setViewportSize({ width: 1080, height: 1350 })
    
    // Build URL for this slide
    const url = `http://localhost:5173/?component=CarouselSlide&preset=awareness/carousel-${slide.id}&export=true&loop=1`
    
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForSelector('[data-ready]', { timeout: 20000 })
    
    console.log(`🎥 Recording slide ${i + 1}...`)
    await delay(duration)
    
    await context.close()
    
    // Get the recorded video file
    const videoFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'))
    if (videoFiles.length > 0) {
      const videoPath = path.join(outDir, videoFiles[videoFiles.length - 1])
      const outputPath = path.join(outDir, `linkedin-carousel-slide-${i + 1}.mp4`)
      
      console.log(`🔄 Converting slide ${i + 1} to MP4...`)
      
      // Convert to MP4
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
          '-i', videoPath,
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          '-y',
          outputPath
        ], { shell: true })
        
        ffmpeg.on('close', (code) => {
          fs.unlinkSync(videoPath) // Clean up original
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`FFmpeg conversion failed with code ${code}`))
          }
        })
      })
      
      console.log(`✅ Slide ${i + 1} exported: ${outputPath}`)
    }
  }
  
  await browser.close()
  
  console.log('')
  console.log('🎉 LinkedIn Carousel Export Complete!')
  console.log('=====================================')
  console.log(`📁 Files saved in: ${path.resolve(outDir)}`)
  console.log(`📊 Total slides: ${carouselSlides.length}`)
  console.log(`📐 Resolution: 1080 x 1350 pixels`)
  console.log(`⏱️  Duration per slide: ${duration}ms`)
  console.log('')
  console.log('📱 LinkedIn Upload Instructions:')
  console.log('1. Go to LinkedIn → Create a post')
  console.log('2. Click "Add a document"')
  console.log('3. Select all the MP4 files from the carousel folder')
  console.log('4. LinkedIn will automatically arrange them as slides')
  console.log('5. Add your caption and publish!')
  console.log('')
  console.log('💡 Pro Tips:')
  console.log('- Each slide will auto-advance after 4 seconds')
  console.log('- Perfect for showcasing project features')
  console.log('- Great for B2B marketing and developer outreach')
  
  // Create upload guide
  const uploadGuide = `# 🎠 LinkedIn Carousel Upload Guide

## Generated Files
${carouselSlides.map((slide, i) => `- Slide ${i + 1}: linkedin-carousel-slide-${i + 1}.mp4`).join('\n')}

## Upload Steps
1. **Open LinkedIn** → Create a new post
2. **Click "Add a document"** (paperclip icon)
3. **Select all carousel MP4 files** in order
4. **LinkedIn auto-arranges** as carousel slides
5. **Add engaging caption** with hashtags
6. **Publish and track engagement**

## Caption Suggestions
\`\`\`
🚀 Excited to share Agile Tunnel - a dynamic asset generation system I built!

This React-based platform creates cinematic animated visuals for:
• Marketing campaigns
• Social media content  
• Business presentations
• Brand awareness materials

Built with Framer Motion, TypeScript, and automated export pipelines.
Perfect for teams who need professional visuals at scale.

#ReactJS #Animation #Marketing #WebDev #CreativeTech
\`\`\`

## Technical Specs
- Resolution: 1080x1350 (perfect for mobile)
- Duration: 4 seconds per slide
- Format: MP4 (LinkedIn optimized)
- Total slides: ${carouselSlides.length}
- Auto-advance: Yes

*Generated: ${new Date().toLocaleString()}*
`
  
  fs.writeFileSync(path.join(outDir, 'upload-guide.md'), uploadGuide)
  console.log(`📋 Upload guide created: ${path.join(outDir, 'upload-guide.md')}`)
  
} catch (error) {
  console.log('')
  console.log('❌ Carousel export failed:', error.message)
  
  if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
    console.log('💡 Make sure the dev server can start properly')
  }
  
  if (error.message.includes('ffmpeg')) {
    console.log('💡 Make sure FFmpeg is installed: https://ffmpeg.org/download.html')
  }
  
  process.exit(1)
} finally {
  stopViteServer()
}

