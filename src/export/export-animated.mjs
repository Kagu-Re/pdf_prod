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
const fps = parseInt(arg('fps', '30'))
const loops = parseInt(arg('loops', '2'))
const outPath = arg('out', `out/exports/${finalPreset.replace('/','-')}-${Date.now()}.${finalFormat}`)

console.log('🎬 Video Asset Export')
console.log('====================')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Format: ${finalFormat.toUpperCase()}`)
console.log(`Duration: ${duration}ms`)
console.log(`FPS: ${fps}`)
console.log(`Loops: ${loops}`)
console.log(`Output: ${outPath}`)
console.log('')

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

// Start Vite dev server
let viteProcess = null

function startViteServer() {
    return new Promise((resolve, reject) => {
        // First check if server is already running
        fetch('http://localhost:5173')
            .then(() => {
                console.log('✅ Vite server already running')
                resolve()
            })
            .catch(() => {
                // Server not running, start it
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
                        setTimeout(resolve, 2000) // Wait longer for full startup
                    }
                })
                
                viteProcess.stderr.on('data', (data) => {
                    console.error('Vite error:', data.toString())
                })
                
                viteProcess.on('error', (error) => {
                    reject(error)
                })
                
                // Longer timeout
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

try {
    await startViteServer()
    
    console.log('🌐 Launching browser...')
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--disable-web-security', '--allow-file-access-from-files']
    })
    
    const context = await browser.newContext({
        recordVideo: {
            dir: path.dirname(outPath),
            size: { width: 1080, height: 1350 }
        }
    })
    
    const page = await context.newPage()
    
    // Set viewport for consistent sizing
    await page.setViewportSize({ width: 1080, height: 1350 })
    
    // Build the URL with export parameters
    const url = `http://localhost:5173/?component=${finalComponent}&preset=${finalPreset}&export=true&loop=${loops}`
    console.log('📄 Loading asset from:', url)
    
    // Navigate to the dev server
    await page.goto(url, { waitUntil: 'networkidle' })
    
    // Wait for the component to be ready
    console.log('⏱️  Waiting for animations...')
    await page.waitForSelector('[data-ready]', { timeout: 20000 })
    
    console.log(`🎥 Recording ${finalFormat.toUpperCase()} for ${duration}ms...`)
    
    // Record the animation
    await delay(duration)
    
    console.log('🎬 Stopping recording...')
    await context.close()
    await browser.close()
    
    // Get the recorded video file
    const videoFiles = fs.readdirSync(path.dirname(outPath)).filter(f => f.endsWith('.webm'))
    if (videoFiles.length === 0) {
        throw new Error('No video file was recorded')
    }
    
    const videoPath = path.join(path.dirname(outPath), videoFiles[0])
    console.log(`📹 Video recorded: ${videoPath}`)
    
    if (finalFormat === 'gif') {
        console.log('🔄 Converting to GIF...')
        
        // Convert WebM to GIF using FFmpeg
        await new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', [
                '-i', videoPath,
                '-vf', `fps=${fps},scale=1080:1350:flags=lanczos,palettegen`,
                '-y',
                path.join(path.dirname(outPath), 'palette.png')
            ], { shell: true })
            
            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    // Generate GIF with palette
                    const ffmpeg2 = spawn('ffmpeg', [
                        '-i', videoPath,
                        '-i', path.join(path.dirname(outPath), 'palette.png'),
                        '-filter_complex', `fps=${fps},scale=1080:1350:flags=lanczos[v];[v][1:v]paletteuse`,
                        '-y',
                        outPath
                    ], { shell: true })
                    
                    ffmpeg2.on('close', (code2) => {
                        // Clean up
                        fs.unlinkSync(path.join(path.dirname(outPath), 'palette.png'))
                        fs.unlinkSync(videoPath)
                        
                        if (code2 === 0) {
                            resolve()
                        } else {
                            reject(new Error(`FFmpeg GIF conversion failed with code ${code2}`))
                        }
                    })
                } else {
                    reject(new Error(`FFmpeg palette generation failed with code ${code}`))
                }
            })
        })
        
    } else if (finalFormat === 'mp4') {
        console.log('🔄 Converting to MP4...')
        
        // Convert WebM to MP4 using FFmpeg
        await new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', [
                '-i', videoPath,
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '23',
                '-pix_fmt', 'yuv420p',
                '-y',
                outPath
            ], { shell: true })
            
            ffmpeg.on('close', (code) => {
                fs.unlinkSync(videoPath) // Clean up original
                
                if (code === 0) {
                    resolve()
                } else {
                    reject(new Error(`FFmpeg MP4 conversion failed with code ${code}`))
                }
            })
        })
        
    } else if (finalFormat === 'webm') {
        // Just move the WebM file
        fs.renameSync(videoPath, outPath)
    } else {
        throw new Error(`Unsupported video format: ${finalFormat}`)
    }
    
    console.log('')
    console.log('✅ Video export successful!')
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
        type: 'video',
        duration: duration,
        fps: fps,
        loops: loops,
        file: outPath,
        size: fs.statSync(outPath).size
    })
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    
} catch (error) {
    console.log('')
    console.log('❌ Video export failed:', error.message)
    
    // Common troubleshooting
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        console.log('💡 Make sure the dev server can start properly')
    }
    
    if (error.message.includes('ffmpeg')) {
        console.log('💡 Make sure FFmpeg is installed: https://ffmpeg.org/download.html')
        console.log('💡 Or install via: winget install ffmpeg')
    }
    
    if (error.message.includes('data-ready')) {
        console.log('💡 The component may not be loading properly. Check the URL manually.')
    }
    
    process.exit(1)
} finally {
    stopViteServer()
}
