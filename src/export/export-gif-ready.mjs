#!/usr/bin/env node
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i+1] : fallback
}

// Get positional arguments
const [,, component = 'AssetMetricSnapshot', preset = 'awareness/cinematic-1'] = process.argv

// Allow override with flags
const finalComponent = arg('component', component)
const finalPreset = arg('preset', preset)  
const duration = parseInt(arg('duration', '4000'))
const outPath = arg('out', `out/exports/${finalPreset.replace('/','-')}-anim-${Date.now()}.webm`)

console.log('🎬 Animated Export (WebM → GIF Ready)')
console.log('====================================')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Duration: ${duration}ms`)
console.log(`Output: ${outPath}`)
console.log('')

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

try {
    // Check if server is running
    console.log('🌐 Checking dev server...')
    let serverUrl = null
    
    for (const port of [5173, 5174, 5175]) {
        try {
            const response = await fetch(`http://localhost:${port}`)
            serverUrl = `http://localhost:${port}`
            console.log(`✅ Dev server found on port ${port}`)
            break
        } catch {
            // Try next port
        }
    }
    
    if (!serverUrl) {
        console.log('❌ Dev server not running. Start it with: npm run dev')
        process.exit(1)
    }
    
    console.log('🌐 Launching browser...')
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-web-security', '--allow-file-access-from-files']
    })
    
    const context = await browser.newContext({
        recordVideo: {
            dir: outDir,
            size: { width: 1080, height: 1350 }
        }
    })
    
    const page = await context.newPage()
    await page.setViewportSize({ width: 1080, height: 1350 })
    
    const url = `${serverUrl}/?component=${finalComponent}&preset=${finalPreset}&export=true&loop=3`
    console.log('📄 Loading asset:', url)
    
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForSelector('[data-ready]', { timeout: 20000 })
    
    console.log(`🎥 Recording animation for ${duration}ms...`)
    await delay(duration)
    
    console.log('🎬 Finalizing recording...')
    await context.close()
    await browser.close()
    
    // Find the created video
    const videoFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'))
    if (videoFiles.length === 0) {
        throw new Error('No video recorded')
    }
    
    // Rename to our desired filename
    const tempVideoPath = path.join(outDir, videoFiles[0])
    fs.renameSync(tempVideoPath, outPath)
    
    const fileSize = fs.statSync(outPath).size
    
    console.log('')
    console.log('✅ Animation Export Complete!')
    console.log(`📹 WebM file: ${path.resolve(outPath)}`)
    console.log(`📊 File size: ${(fileSize / 1024).toFixed(1)}KB`)
    console.log(`📐 Resolution: 1080 x 1350 pixels`)
    console.log('')
    console.log('🔄 Convert to GIF:')
    console.log(`1. Online: Upload to https://cloudconvert.com/webm-to-gif`)
    console.log(`2. GIMP: File → Import Video Frames → Export as GIF`)
    console.log(`3. Command: ffmpeg -i "${path.basename(outPath)}" -vf "fps=15" output.gif`)
    console.log('')
    console.log('💡 WebM is perfect for web use and some social platforms!')
    
    // Update manifest
    const manifestPath = 'out/manifest.json'
    let manifest = []
    try { 
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) 
    } catch {}
    
    manifest.push({ 
        ts: Date.now(), 
        component: finalComponent, 
        preset: finalPreset, 
        format: 'webm',
        type: 'animation',
        duration: duration,
        file: outPath,
        size: fileSize,
        note: 'Ready for GIF conversion'
    })
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    
} catch (error) {
    console.log('')
    console.log('❌ Export failed:', error.message)
    
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        console.log('💡 Make sure the dev server is running: npm run dev')
    }
    
    process.exit(1)
}
