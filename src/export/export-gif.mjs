#!/usr/bin/env node
import { spawn } from 'node:child_process'
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
const duration = parseInt(arg('duration', '4000')) // 4 seconds default
const fps = parseInt(arg('fps', '15')) // 15 FPS for reasonable file size
const outPath = arg('out', `out/exports/${finalPreset.replace('/','-')}-${Date.now()}.gif`)

console.log('🎬 GIF Export')
console.log('=============')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Duration: ${duration}ms`)
console.log(`FPS: ${fps}`)
console.log(`Output: ${outPath}`)
console.log('')

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

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
    
    const context = await browser.newContext({
        recordVideo: {
            dir: outDir,
            size: { width: 1080, height: 1350 }
        }
    })
    
    const page = await context.newPage()
    
    // Set viewport for consistent sizing
    await page.setViewportSize({ width: 1080, height: 1350 })
    
    // Build the URL with export parameters
    const url = `${serverUrl}/?component=${finalComponent}&preset=${finalPreset}&export=true&loop=3`
    console.log('📄 Loading asset from:', url)
    
    // Navigate to the dev server
    await page.goto(url, { waitUntil: 'networkidle' })
    
    // Wait for the component to be ready
    console.log('⏱️  Waiting for component to load...')
    await page.waitForSelector('[data-ready]', { timeout: 20000 })
    
    console.log(`🎥 Recording for ${duration}ms...`)
    
    // Record the animation
    await delay(duration)
    
    console.log('🎬 Stopping recording...')
    await context.close()
    await browser.close()
    
    // Get the recorded video file
    const videoFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'))
    if (videoFiles.length === 0) {
        throw new Error('No video file was recorded')
    }
    
    const videoPath = path.join(outDir, videoFiles[0])
    console.log(`📹 Video recorded: ${videoPath}`)
    
    console.log('🔄 Converting to GIF...')
    
    // Convert WebM to GIF using a simple FFmpeg command
    await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', videoPath,
            '-vf', `fps=${fps},scale=1080:1350`,
            '-y',
            outPath
        ], { 
            shell: true,
            stdio: ['ignore', 'pipe', 'pipe']
        })
        
        let errorOutput = ''
        
        ffmpeg.stderr.on('data', (data) => {
            errorOutput += data.toString()
        })
        
        ffmpeg.on('close', (code) => {
            // Clean up video file
            fs.unlinkSync(videoPath)
            
            if (code === 0) {
                resolve()
            } else {
                console.log('FFmpeg error output:', errorOutput)
                reject(new Error(`FFmpeg conversion failed with code ${code}`))
            }
        })
    }).catch((conversionError) => {
        console.log('🔄 FFmpeg not available, but WebM file created successfully!')
        console.log('')
        console.log('✅ Video export completed!')
        console.log(`📹 WebM file: ${videoPath}`)
        console.log(`📐 Resolution: 1080 x 1350 pixels`)
        console.log(`⏱️  Duration: ${duration}ms`)
        console.log(`📊 File size: ${(fs.statSync(videoPath).size / 1024).toFixed(1)}KB`)
        console.log('')
        console.log('🔄 To convert to GIF:')
        console.log('1. Online: Upload to cloudconvert.com/webm-to-gif')
        console.log('2. Command: ffmpeg -i video.webm -vf "fps=15,scale=1080:1350" output.gif')
        console.log('3. Software: Import into GIMP or other video editor')
        
        // Update manifest with WebM info instead
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
            type: 'video-for-gif',
            duration: duration,
            fps: fps,
            file: videoPath,
            size: fs.statSync(videoPath).size,
            note: 'Ready for GIF conversion'
        })
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
        
        return // Exit successfully
    })
    
    console.log('')
    console.log('✅ GIF export successful!')
    console.log(`📁 File saved: ${path.resolve(outPath)}`)
    console.log(`📐 Resolution: 1080 x 1350 pixels`)
    console.log(`⏱️  Duration: ${duration}ms`)
    console.log(`🔄 FPS: ${fps}`)
    console.log(`📊 File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)}KB`)
    
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
        format: 'gif',
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
        console.log('💡 Trying alternative approach...')
        console.log('💡 You can manually convert the WebM file:')
        console.log('   ffmpeg -i video.webm -vf "fps=15,scale=1080:1350" output.gif')
    }
    
    if (error.message.includes('data-ready')) {
        console.log('💡 The component may not be loading properly. Check the URL manually.')
    }
    
    process.exit(1)
}
