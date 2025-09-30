#!/usr/bin/env node
import fs from 'node:fs'
import path from 'path'

console.log('🎠 LinkedIn Unified Carousel Export')
console.log('===================================')
console.log('')

// Create output directory
const outDir = 'out/social/linkedin/unified-carousel'
fs.mkdirSync(outDir, { recursive: true })

console.log('🎬 Single URL Carousel System')
console.log('=============================')
console.log('')
console.log('✅ All slides in one component!')
console.log('✅ Automatic slide transitions')
console.log('✅ Intro/outro animations')
console.log('✅ Progress indicators')
console.log('✅ Export mode timing')
console.log('')

const baseUrl = 'http://localhost:5174'
const previewUrl = `${baseUrl}/?component=LinkedInCarousel`
const exportUrl = `${baseUrl}/?component=LinkedInCarousel&export=true`

console.log('🌐 URLs to Use:')
console.log('==============')
console.log('')
console.log('📱 Preview Mode (4 seconds per slide):')
console.log(`   ${previewUrl}`)
console.log('')
console.log('🎬 Export Mode (6 seconds per slide):')
console.log(`   ${exportUrl}`)
console.log('')

console.log('🎥 Recording Instructions')
console.log('========================')
console.log('')
console.log('METHOD 1: Single Recording (Recommended)')
console.log('1. Open the export URL above')
console.log('2. Press F12 → Device Toolbar → Set to 1080x1350')
console.log('3. Record the entire carousel (30 seconds total)')
console.log('4. Save as MP4 file')
console.log('5. Upload to LinkedIn as a single video')
console.log('')
console.log('METHOD 2: Split into Individual Slides')
console.log('1. Record each slide separately (6 seconds each)')
console.log('2. Upload as LinkedIn carousel (multiple files)')
console.log('3. LinkedIn will auto-advance between slides')
console.log('')

console.log('🎯 Carousel Features:')
console.log('====================')
console.log('• 5 slides with smooth transitions')
console.log('• 3D rotation effects between slides')
console.log('• Dynamic gradient backgrounds')
console.log('• Progress indicators and counters')
console.log('• Export mode with extended timing')
console.log('• Professional animations and effects')
console.log('')

console.log('📁 File Organization')
console.log('===================')
console.log(`Save files in: ${path.resolve(outDir)}`)
console.log('')
console.log('For single video:')
console.log('   linkedin-carousel-complete.mp4')
console.log('')
console.log('For individual slides:')
console.log('   slide-1-agile-tunnel.mp4')
console.log('   slide-2-template-system.mp4')
console.log('   slide-3-multi-format-export.mp4')
console.log('   slide-4-social-media-ready.mp4')
console.log('   slide-5-mvp-complete.mp4')
console.log('')

console.log('📱 LinkedIn Upload Options')
console.log('=========================')
console.log('')
console.log('OPTION 1: Single Video Post')
console.log('1. Upload the complete 30-second video')
console.log('2. Add engaging caption')
console.log('3. Perfect for feed posts and stories')
console.log('')
console.log('OPTION 2: Carousel Post')
console.log('1. Upload individual 6-second clips')
console.log('2. LinkedIn arranges as carousel')
console.log('3. Users can swipe through slides')
console.log('4. Better for detailed feature showcase')
console.log('')

// Create detailed guide
const guideContent = `# 🎠 LinkedIn Unified Carousel Guide

## 🎬 Single Component System

The unified carousel shows all 5 slides in one component with:
- Automatic slide transitions (6 seconds each in export mode)
- Smooth 3D rotation effects between slides
- Dynamic gradient backgrounds per slide
- Progress indicators and slide counters
- Professional intro/outro animations

## 🌐 URLs

### Preview Mode (4 seconds per slide)
\`${previewUrl}\`

### Export Mode (6 seconds per slide)
\`${exportUrl}\`

## 🎥 Recording Methods

### Method 1: Single Complete Video (Recommended)
1. **Open export URL** in Chrome/Edge
2. **Set viewport** to 1080x1350 (F12 → Device Toolbar)
3. **Record entire carousel** (30 seconds total)
4. **Save as MP4** file
5. **Upload to LinkedIn** as single video post

**Pros:** 
- Simple upload process
- Consistent timing
- Professional presentation
- Works great for stories and feed

### Method 2: Individual Slide Recording
1. **Record each slide** separately (6 seconds each)
2. **Save as separate MP4** files
3. **Upload to LinkedIn** as carousel
4. **LinkedIn auto-advances** between slides

**Pros:**
- Users can control pace
- Better for detailed viewing
- Higher engagement potential
- Perfect for B2B content

## 📊 Slide Breakdown

1. **Slide 1**: Agile Tunnel - Dynamic Asset Generation System
   - Duration: 6 seconds
   - Animation: Purple to blue gradient with cinematic effects

2. **Slide 2**: Template System - JSON-Driven Design  
   - Duration: 6 seconds
   - Animation: Blue to indigo gradient with lightning effects

3. **Slide 3**: Multi-Format Export - PNG • PDF • Video • GIF
   - Duration: 6 seconds
   - Animation: Indigo to purple gradient with production effects

4. **Slide 4**: Social Media Ready - Perfect Dimensions
   - Duration: 6 seconds
   - Animation: Purple to pink gradient with mobile effects

5. **Slide 5**: MVP Complete - AssetMetricSnapshot Template
   - Duration: 6 seconds
   - Animation: Pink to red gradient with completion effects

## 🎨 Technical Features

- **Resolution**: 1080x1350 (perfect for LinkedIn mobile)
- **Transitions**: 3D rotation with scale and opacity effects
- **Backgrounds**: Dynamic gradient animations per slide
- **Typography**: Gradient text effects with shadows
- **Progress**: Visual progress bar and slide indicators
- **Export Mode**: Extended timing for better recording quality

## 📱 LinkedIn Upload Strategy

### Single Video Approach
\`\`\`
🚀 Excited to share Agile Tunnel - a complete asset generation system!

This 30-second carousel showcases:
• Dynamic React-based platform
• Template system with JSON configuration
• Multi-format export capabilities
• Social media optimized dimensions
• Production-ready MVP

Built with Framer Motion, TypeScript, and automated pipelines.
Perfect for teams who need professional visuals at scale.

#ReactJS #Animation #Marketing #WebDev #CreativeTech #MVP
\`\`\`

### Carousel Approach
\`\`\`
🎠 Introducing Agile Tunnel - swipe through to see all features!

This React-based platform creates cinematic animated visuals for:
• Marketing campaigns
• Social media content  
• Business presentations
• Brand awareness materials

Built with modern web technologies and production-ready export pipelines.

#ReactJS #Animation #Marketing #WebDev #CreativeTech
\`\`\`

## 🎯 Best Practices

- **Test on mobile** before publishing
- **Use relevant hashtags** for maximum reach
- **Post during business hours** for B2B audience
- **Engage with comments** to boost visibility
- **Share in relevant groups** and communities

*Generated: ${new Date().toLocaleString()}*
`

fs.writeFileSync(path.join(outDir, 'unified-carousel-guide.md'), guideContent)

// Create quick reference
const quickRef = `# 🎠 Quick Reference

## URLs
- **Preview**: ${previewUrl}
- **Export**: ${exportUrl}

## Recording
1. Open export URL
2. Set viewport to 1080x1350
3. Record 30 seconds
4. Upload to LinkedIn

## Files
Save in: \`${path.resolve(outDir)}\`
- \`linkedin-carousel-complete.mp4\`

*Generated: ${new Date().toLocaleString()}*
`

fs.writeFileSync(path.join(outDir, 'quick-reference.md'), quickRef)

console.log('📁 Files created:')
console.log(`   ${path.resolve(outDir)}/`)
console.log('   ├── unified-carousel-guide.md')
console.log('   └── quick-reference.md')
console.log('')
console.log('🎉 Ready to record your unified LinkedIn carousel!')
console.log('')
console.log('💡 Pro Tips:')
console.log('• Use export mode for better recording quality')
console.log('• Record the complete 30-second sequence')
console.log('• Test on mobile before publishing')
console.log('• Add engaging captions with relevant hashtags')
console.log('')
console.log('🚀 Your carousel is ready to go viral!')

