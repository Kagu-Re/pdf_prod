#!/usr/bin/env node
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i+1] : fallback
}

// Get positional arguments
const [,, component = 'AssetMetricSnapshot', preset = 'awareness/cinematic-1', format = 'gif'] = process.argv

// Allow override with flags
const finalComponent = arg('component', component)
const finalPreset = arg('preset', preset)  
const finalFormat = arg('format', format)
const duration = parseInt(arg('duration', '3000')) // 3 seconds default
const fps = parseInt(arg('fps', '15')) // Lower FPS for simpler processing
const outPath = arg('out', `out/exports/${finalPreset.replace('/','-')}-${Date.now()}.${finalFormat}`)

console.log('🎬 Simple GIF Export')
console.log('===================')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Duration: ${duration}ms`)
console.log(`FPS: ${fps}`)
console.log(`Output: ${outPath}`)
console.log('')

const outDir = path.dirname(outPath)
const tempDir = path.join(outDir, 'temp-frames')
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(tempDir, { recursive: true })

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

try {
    // Check if server is running on common ports
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
    
    const page = await browser.newPage()
    
    // Set viewport for consistent sizing
    await page.setViewportSize({ width: 1080, height: 1350 })
    
    // Build the URL with export parameters
    const url = `${serverUrl}/?component=${finalComponent}&preset=${finalPreset}&export=true&loop=1`
    console.log('📄 Loading asset from:', url)
    
    // Navigate to the dev server
    await page.goto(url, { waitUntil: 'networkidle' })
    
    // Wait for the component to be ready
    console.log('⏱️  Waiting for animations...')
    await page.waitForSelector('[data-ready]', { timeout: 20000 })
    
    console.log(`📸 Capturing ${Math.ceil(duration / (1000/fps))} frames...`)
    
    const frameInterval = 1000 / fps
    const totalFrames = Math.ceil(duration / frameInterval)
    
    // Capture frames
    for (let i = 0; i < totalFrames; i++) {
        const framePath = path.join(tempDir, `frame_${i.toString().padStart(4, '0')}.png`)
        
        // Take screenshot of the main container
        const assetElement = await page.locator('#root > div').first()
        await assetElement.screenshot({ path: framePath })
        
        // Wait for next frame
        await delay(frameInterval)
    }
    
    await browser.close()
    
    console.log('🔄 Creating GIF with FFmpeg...')
    
    // Create GIF from frames using FFmpeg
    await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-framerate', fps.toString(),
            '-i', path.join(tempDir, 'frame_%04d.png'),
            '-vf', 'palettegen=stats_mode=diff',
            '-y',
            path.join(tempDir, 'palette.png')
        ], { shell: true })
        
        ffmpeg.on('close', (code) => {
            if (code === 0) {
                // Generate GIF with palette
                const ffmpeg2 = spawn('ffmpeg', [
                    '-framerate', fps.toString(),
                    '-i', path.join(tempDir, 'frame_%04d.png'),
                    '-i', path.join(tempDir, 'palette.png'),
                    '-filter_complex', 'paletteuse=dither=bayer:bayer_scale=2',
                    '-loop', '0',
                    '-y',
                    outPath
                ], { shell: true })
                
                ffmpeg2.on('close', (code2) => {
                    if (code2 === 0) {
                        resolve()
                    } else {
                        reject(new Error(`FFmpeg GIF generation failed with code ${code2}`))
                    }
                })
            } else {
                reject(new Error(`FFmpeg palette generation failed with code ${code}`))
            }
        })
    })
    
    // Clean up temp files
    console.log('🧹 Cleaning up temporary files...')
    fs.rmSync(tempDir, { recursive: true, force: true })
    
    console.log('')
    console.log('✅ GIF export successful!')
    console.log(`📁 File saved: ${path.resolve(outPath)}`)
    console.log(`📐 Resolution: 1080 x 1350 pixels`)
    console.log(`📄 Format: ${finalFormat.toUpperCase()}`)
    console.log(`⏱️  Duration: ${duration}ms`)
    console.log(`🔄 FPS: ${fps}`)
    
    // Update manifest
    console.log('📋 Updating manifest...')
    const manifestPath = 'out/manifest.json'
    let manifest = []
    try { 
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) 
    } catch {}
    manifest.push({ 
        ts: Date.now(), 
        component: finalComponent, 
        preset: finalPreset, 
        format: finalFormat,
        type: 'animated-gif',
        duration: duration,
        fps: fps,
        file: outPath,
        size: fs.statSync(outPath).size
    })
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    
} catch (error) {
    console.log('')
    console.log('❌ GIF export failed:', error.message)
    
    // Common troubleshooting
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        console.log('💡 Make sure the dev server is running: npm run dev')
    }
    
    if (error.message.includes('ffmpeg')) {
        console.log('💡 Make sure FFmpeg is installed and in PATH')
    }
    
    if (error.message.includes('data-ready')) {
        console.log('💡 The component may not be loading properly. Check the URL manually.')
    }
    
    // Clean up on error
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true })
    }
    
    process.exit(1)
}
