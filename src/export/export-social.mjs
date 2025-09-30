#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

// Enhanced export guide for animated formats
const component = process.argv[2] || 'AssetMetricSnapshot'
const preset = process.argv[3] || 'awareness/cinematic-1'

const url = `http://localhost:5173/render?component=${component}&preset=${preset}`

console.log('🎬 Animated Export Guide - Social Media Ready')
console.log('============================================')
console.log('')
console.log(`🎯 Asset: ${component} (${preset})`)
console.log(`🔗 URL: ${url}`)
console.log('')

// Social media specs
const platforms = [
  {
    name: 'LinkedIn',
    formats: ['MP4 Video (preferred)', 'GIF (converts to video)'],
    specs: '1080x1080 (square) or 1200x627 (landscape)',
    limits: 'MP4: 4GB, 10min | GIF: 5MB',
    current: '✅ 1080x1350 works great for vertical posts'
  },
  {
    name: 'Instagram Stories',
    formats: ['MP4 Video', 'GIF'],
    specs: '1080x1920 (recommended) or 1080x1350',
    limits: 'MP4: 60s max | GIF: Auto-converts',
    current: '🎯 Perfect! 1080x1350 is ideal'
  },
  {
    name: 'Instagram Feed', 
    formats: ['MP4 Video', 'GIF'],
    specs: '1080x1080 (square) or 1080x1350 (portrait)',
    limits: 'MP4: 60s max | GIF: Auto-converts', 
    current: '✅ 1080x1350 works perfectly'
  },
  {
    name: 'Facebook',
    formats: ['MP4 Video', 'GIF'],
    specs: '1200x630 (landscape) or 1080x1350 (stories)',
    limits: 'MP4: 4GB | GIF: 8MB',
    current: '✅ Current size works for stories'
  }
]

platforms.forEach(platform => {
  console.log(`📱 ${platform.name}`)
  console.log(`   Formats: ${platform.formats.join(', ')}`)
  console.log(`   Specs: ${platform.specs}`)
  console.log(`   Limits: ${platform.limits}`)
  console.log(`   Status: ${platform.current}`)
  console.log('')
})

console.log('🎬 Export Methods Available:')
console.log('')

console.log('📹 METHOD 1: Browser Screen Recording (Recommended)')
console.log('   1. Open URL above in Chrome/Edge')
console.log('   2. Press F12 → Device Toolbar → Set to 1080x1350')
console.log('   3. Use browser extension like "Screen Recorder" or "Loom"')
console.log('   4. Record 4-5 seconds to capture full animation')
console.log('   5. Export as MP4 or convert to GIF')
console.log('')

console.log('🎮 METHOD 2: OBS Studio (Professional)')
console.log('   1. Download OBS Studio (free)')
console.log('   2. Create "Window Capture" source')
console.log('   3. Set output to 1080x1350')
console.log('   4. Record 4-5 seconds')
console.log('   5. Export as MP4')
console.log('')

console.log('📱 METHOD 3: Mobile Device Recording')
console.log('   1. Open URL on mobile device')
console.log('   2. Use built-in screen recording')
console.log('   3. Crop to remove browser UI')
console.log('   4. Perfect for Instagram Stories!')
console.log('')

console.log('🛠️ METHOD 4: FFmpeg Conversion (Advanced)')
console.log('   1. First capture frames with: npm run export:frames')
console.log('   2. Convert to video: ffmpeg -r 30 -i frame-%04d.png output.mp4')
console.log('   3. Convert to GIF: ffmpeg -i output.mp4 -vf "fps=15,scale=1080:1350" output.gif')
console.log('')

console.log('⚡ Quick Start Commands:')
console.log('   npm run export:frames  # Capture frame sequence')
console.log('   npm run export:social  # Generate this guide')
console.log('')

// Create enhanced export directory structure
const exportDir = 'out/social'
fs.mkdirSync(exportDir, { recursive: true })

// Create platform-specific directories
const platformDirs = ['linkedin', 'instagram-stories', 'instagram-feed', 'facebook']
platformDirs.forEach(dir => {
  fs.mkdirSync(path.join(exportDir, dir), { recursive: true })
})

// Create export checklist
const checklistPath = path.join(exportDir, 'export-checklist.md')
const checklist = `# 🎬 Social Media Export Checklist

## ✅ Pre-Export
- [ ] Asset renders correctly at ${url}
- [ ] Animations complete in 3-4 seconds
- [ ] Text is readable at 1080x1350 resolution
- [ ] Colors are vibrant and on-brand

## 🎯 Export Targets

### LinkedIn (${exportDir}/linkedin/)
- [ ] MP4 video (4-5 seconds, 30fps)
- [ ] Alternative: GIF under 5MB
- [ ] Test on mobile and desktop

### Instagram Stories (${exportDir}/instagram-stories/)  
- [ ] MP4 video (max 15 seconds)
- [ ] Vertical 1080x1350 ✅ Perfect fit!
- [ ] Test story preview

### Instagram Feed (${exportDir}/instagram-feed/)
- [ ] MP4 video (max 60 seconds) 
- [ ] 1080x1350 portrait ✅ Perfect fit!
- [ ] Test feed preview

### Facebook (${exportDir}/facebook/)
- [ ] MP4 video for stories
- [ ] Alternative: GIF under 8MB
- [ ] Test on mobile app

## 🎨 Quality Checks
- [ ] Animation timing feels natural
- [ ] Text remains readable throughout
- [ ] Orange accents (#FF6B35) are vibrant
- [ ] Dark background creates good contrast
- [ ] File size appropriate for platform

## 🚀 Upload Tips
- [ ] Add captions/alt text
- [ ] Schedule for optimal posting times
- [ ] Cross-post with platform-specific sizing
- [ ] Monitor engagement metrics

*Generated: ${new Date().toLocaleString()}*`

fs.writeFileSync(checklistPath, checklist)

console.log(`📁 Export structure created:`)
console.log(`   ${path.resolve(exportDir)}/`)
console.log(`   ├── linkedin/`)
console.log(`   ├── instagram-stories/`)
console.log(`   ├── instagram-feed/`)
console.log(`   ├── facebook/`)
console.log(`   └── export-checklist.md`)
console.log('')
console.log('🎉 Ready for animated social media exports!')
console.log('')
console.log('💡 Pro Tip: Your 1080x1350 size is perfect for:')
console.log('   • Instagram Stories (native size)')
console.log('   • Instagram Feed (portrait posts)')
console.log('   • LinkedIn vertical posts')
console.log('   • Facebook Stories')
