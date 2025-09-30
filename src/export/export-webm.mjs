#!/usr/bin/env node
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i+1] : fallback
}

// Get positional arguments
const [,, component = 'AssetMetricSnapshot', preset = 'awareness/cinematic-1', format = 'webm'] = process.argv

// Allow override with flags
const finalComponent = arg('component', component)
const finalPreset = arg('preset', preset)  
const finalFormat = arg('format', format)
const duration = parseInt(arg('duration', '4000')) // 4 seconds default
const outPath = arg('out', `out/exports/${finalPreset.replace('/','-')}-${Date.now()}.${finalFormat}`)

console.log('🎬 Video Export (Self-Contained)')
console.log('================================')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Format: ${finalFormat.toUpperCase()}`)
console.log(`Duration: ${duration}ms`)
console.log(`Output: ${outPath}`)
console.log('')

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

let viteProcess = null
let serverUrl = 'http://localhost:5174' // Use different port to avoid conflicts

try {
    // Start our own Vite server on different port
    console.log('🚀 Starting Vite dev server on port 5174...')
    viteProcess = spawn('npm', ['run', 'dev', '--', '--port', '5174'], {
        stdio: 'pipe', // Capture output but don't show it
        shell: true
    })
    
    // Wait for server to be ready
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Server start timeout')), 10000)
        
        viteProcess.stdout.on('data', (data) => {
            if (data.toString().includes('Local:')) {
                clearTimeout(timeout)
                resolve()
            }
        })
        
        viteProcess.on('error', reject)
    })
    
    console.log('✅ Vite server started')
    
    // Wait a bit more for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('🌐 Launching browser...')
    const browser = await chromium.launch({ 
        headless: true
    })
    
    // Create context with video recording
    const context = await browser.newContext({
        recordVideo: {
            dir: outDir,
            size: { width: 1080, height: 1350 }
        }
    })
    
    const page = await context.newPage()
    await page.setViewportSize({ width: 1080, height: 1350 })
    
    // Build the URL with export parameters and multiple loops for animation
    const url = `${serverUrl}/?component=${finalComponent}&preset=${finalPreset}&export=true&loop=3`
    console.log('📄 Loading asset from:', url)
    
    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle' })
    
    // Wait for component to be ready
    console.log('⏱️  Waiting for component to load...')
    await page.waitForSelector('[data-ready]', { timeout: 20000 })
    
    console.log(`🎥 Recording for ${duration}ms...`)
    
    // Record for the specified duration
    await page.waitForTimeout(duration)
    
    console.log('🎬 Stopping recording...')
    await context.close()
    
    // Find the recorded video file
    const videoFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'))
    if (videoFiles.length === 0) {
        throw new Error('No video file was created')
    }
    
    const videoFile = path.join(outDir, videoFiles[0])
    console.log(`📹 Video recorded: ${videoFile}`)
    
    if (finalFormat === 'webm') {
        // Just rename the file
        fs.renameSync(videoFile, outPath)
    } else {
        // Keep the original webm file as is for now
        console.log(`💡 WebM file available at: ${videoFile}`)
        console.log(`💡 To convert to ${finalFormat.toUpperCase()}, you can use FFmpeg manually:`)
        console.log(`   ffmpeg -i "${videoFile}" "${outPath}"`)
    }
    
    await browser.close()
    
    console.log('')
    console.log('✅ Video export completed!')
    console.log(`📁 File: ${finalFormat === 'webm' ? outPath : videoFile}`)
    console.log(`📐 Resolution: 1080 x 1350 pixels`)
    console.log(`⏱️  Duration: ${duration}ms`)
    
    // Update manifest
    console.log('📋 Updating manifest...')
    const manifestPath = 'out/manifest.json'
    let manifest = []
    try { 
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) 
    } catch {}
    
    const finalFile = finalFormat === 'webm' ? outPath : videoFile
    manifest.push({ 
        ts: Date.now(), 
        component: finalComponent, 
        preset: finalPreset, 
        format: finalFormat === 'webm' ? 'webm' : 'webm',
        type: 'video',
        duration: duration,
        file: finalFile,
        size: fs.statSync(finalFile).size
    })
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    
    // Stop the Vite server
    if (viteProcess) {
        console.log('🛑 Stopping Vite server...')
        viteProcess.kill()
    }
    
} catch (error) {
    console.log('')
    console.log('❌ Video export failed:', error.message)
    
    // Stop the Vite server on error too
    if (viteProcess) {
        console.log('🛑 Stopping Vite server...')
        viteProcess.kill()
    }
    
    // Common troubleshooting
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        console.log('💡 Make sure the dev server is running: npm run dev')
    }
    
    if (error.message.includes('data-ready')) {
        console.log('💡 The component may not be loading properly. Check the URL manually.')
    }
    
    process.exit(1)
}
