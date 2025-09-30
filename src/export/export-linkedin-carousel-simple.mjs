#!/usr/bin/env node
import fs from 'node:fs'
import path from 'path'

console.log('🎠 LinkedIn Carousel Export Guide')
console.log('================================')
console.log('')

// Create output directory
const outDir = 'out/social/linkedin/carousel'
fs.mkdirSync(outDir, { recursive: true })

// Carousel slides configuration
const carouselSlides = [
  {
    id: 'slide-1',
    title: 'Agile Tunnel',
    subtitle: 'Dynamic Asset Generation System',
    content: 'React-based platform for creating animated, professional visual assets',
    highlight: '🎬 Cinematic Animations',
    color: 'from-purple-900 to-blue-900',
    url: 'http://localhost:5174/?component=CarouselSlide&preset=awareness/carousel-slide-1'
  },
  {
    id: 'slide-2', 
    title: 'Template System',
    subtitle: 'JSON-Driven Design',
    content: 'Preset-based configurations with schema validation using Zod',
    highlight: '⚡ Lightning Fast',
    color: 'from-blue-900 to-indigo-900',
    url: 'http://localhost:5174/?component=CarouselSlide&preset=awareness/carousel-slide-2'
  },
  {
    id: 'slide-3',
    title: 'Multi-Format Export',
    subtitle: 'PNG • PDF • Video • GIF',
    content: 'Automated export pipeline with Puppeteer and FFmpeg integration',
    highlight: '🚀 Production Ready',
    color: 'from-indigo-900 to-purple-900',
    url: 'http://localhost:5174/?component=CarouselSlide&preset=awareness/carousel-slide-3'
  },
  {
    id: 'slide-4',
    title: 'Social Media Ready',
    subtitle: 'Perfect Dimensions',
    content: '1080x1350 optimized for Instagram Stories, LinkedIn, and Facebook',
    highlight: '📱 Mobile First',
    color: 'from-purple-900 to-pink-900',
    url: 'http://localhost:5174/?component=CarouselSlide&preset=awareness/carousel-slide-4'
  },
  {
    id: 'slide-5',
    title: 'MVP Complete',
    subtitle: 'AssetMetricSnapshot Template',
    content: 'Dark gradient backgrounds with orange accents and dramatic animations',
    highlight: '✅ Ready to Ship',
    color: 'from-pink-900 to-red-900',
    url: 'http://localhost:5174/?component=CarouselSlide&preset=awareness/carousel-slide-5'
  }
]

console.log('📋 Manual Export Instructions')
console.log('============================')
console.log('')
console.log('🎯 Step 1: Start the dev server')
console.log('   npm run dev')
console.log('')
console.log('🎬 Step 2: Record each slide manually')
console.log('')

carouselSlides.forEach((slide, index) => {
  console.log(`📱 Slide ${index + 1}: ${slide.title}`)
  console.log(`   URL: ${slide.url}`)
  console.log(`   Highlight: ${slide.highlight}`)
  console.log('')
})

console.log('🎥 Step 3: Recording Methods')
console.log('===========================')
console.log('')
console.log('METHOD 1: Browser Screen Recording (Recommended)')
console.log('1. Open each URL above in Chrome/Edge')
console.log('2. Press F12 → Device Toolbar → Set to 1080x1350')
console.log('3. Use browser extension like "Screen Recorder" or "Loom"')
console.log('4. Record 4-5 seconds to capture full animation')
console.log('5. Save as MP4 files')
console.log('')
console.log('METHOD 2: OBS Studio (Professional)')
console.log('1. Download OBS Studio (free)')
console.log('2. Create "Window Capture" source')
console.log('3. Set output to 1080x1350')
console.log('4. Record 4-5 seconds per slide')
console.log('5. Export as MP4 files')
console.log('')
console.log('METHOD 3: Mobile Device Recording')
console.log('1. Open each URL on mobile device')
console.log('2. Use built-in screen recording')
console.log('3. Crop to remove browser UI')
console.log('4. Perfect for mobile-first content!')
console.log('')

console.log('📁 Step 4: File Organization')
console.log('===========================')
console.log(`Save all MP4 files in: ${path.resolve(outDir)}`)
console.log('Name them as:')
carouselSlides.forEach((slide, index) => {
  console.log(`   slide-${index + 1}-${slide.title.toLowerCase().replace(/\s+/g, '-')}.mp4`)
})
console.log('')

console.log('📱 Step 5: LinkedIn Upload')
console.log('========================')
console.log('1. Go to LinkedIn → Create a post')
console.log('2. Click "Add a document" (paperclip icon)')
console.log('3. Select all the MP4 files in order')
console.log('4. LinkedIn will automatically arrange them as carousel slides')
console.log('5. Add your caption and publish!')
console.log('')

console.log('💡 Pro Tips for LinkedIn Carousel:')
console.log('• Each slide will auto-advance after 4 seconds')
console.log('• Perfect for showcasing project features step-by-step')
console.log('• Great for B2B marketing and developer outreach')
console.log('• Include relevant hashtags: #ReactJS #Animation #Marketing #WebDev')
console.log('')

// Create detailed upload guide
const uploadGuide = `# 🎠 LinkedIn Carousel Upload Guide

## Generated Slides
${carouselSlides.map((slide, i) => `- **Slide ${i + 1}**: ${slide.title}\n  - URL: ${slide.url}\n  - Highlight: ${slide.highlight}`).join('\n')}

## Recording Instructions

### Method 1: Browser Screen Recording (Recommended)
1. **Open each URL** above in Chrome/Edge
2. **Press F12** → Device Toolbar → Set to 1080x1350
3. **Use browser extension** like "Screen Recorder" or "Loom"
4. **Record 4-5 seconds** to capture full animation
5. **Save as MP4 files**

### Method 2: OBS Studio (Professional)
1. **Download OBS Studio** (free)
2. **Create "Window Capture"** source
3. **Set output to 1080x1350**
4. **Record 4-5 seconds** per slide
5. **Export as MP4 files**

### Method 3: Mobile Device Recording
1. **Open each URL** on mobile device
2. **Use built-in screen recording**
3. **Crop to remove browser UI**
4. **Perfect for mobile-first content!**

## File Organization
Save all MP4 files in: \`${path.resolve(outDir)}\`

Name them as:
${carouselSlides.map((slide, i) => `- slide-${i + 1}-${slide.title.toLowerCase().replace(/\s+/g, '-')}.mp4`).join('\n')}

## LinkedIn Upload Steps
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

#ReactJS #Animation #Marketing #WebDev #CreativeTech #OpenSource
\`\`\`

## Technical Specs
- Resolution: 1080x1350 (perfect for mobile)
- Duration: 4 seconds per slide
- Format: MP4 (LinkedIn optimized)
- Total slides: ${carouselSlides.length}
- Auto-advance: Yes

## Pro Tips
- Each slide will auto-advance after 4 seconds
- Perfect for showcasing project features step-by-step
- Great for B2B marketing and developer outreach
- Include relevant hashtags for maximum reach
- Test on mobile before publishing

*Generated: ${new Date().toLocaleString()}*
`

fs.writeFileSync(path.join(outDir, 'upload-guide.md'), uploadGuide)

// Create individual slide URLs file
const urlsContent = `# 🎠 Carousel Slide URLs

Copy and paste these URLs into your browser to record each slide:

${carouselSlides.map((slide, i) => `## Slide ${i + 1}: ${slide.title}
${slide.url}
- Highlight: ${slide.highlight}
- Color: ${slide.color}
`).join('\n')}

## Quick Start
1. Start dev server: \`npm run dev\`
2. Open each URL above
3. Record 4-5 seconds per slide
4. Upload to LinkedIn as carousel

*Generated: ${new Date().toLocaleString()}*
`

fs.writeFileSync(path.join(outDir, 'slide-urls.md'), urlsContent)

console.log('📁 Files created:')
console.log(`   ${path.resolve(outDir)}/`)
console.log('   ├── upload-guide.md')
console.log('   ├── slide-urls.md')
console.log('   └── [save your MP4 files here]')
console.log('')
console.log('🎉 Ready to create your LinkedIn carousel!')
console.log('')
console.log('💡 Next steps:')
console.log('1. Run: npm run dev')
console.log('2. Open the URLs from slide-urls.md')
console.log('3. Record each slide as MP4')
console.log('4. Upload to LinkedIn as carousel')
console.log('5. Watch the engagement roll in! 🚀')
