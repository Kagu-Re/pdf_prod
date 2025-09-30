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
const [,, component = 'AssetMetricSnapshot', preset = 'awareness/cinematic-1'] = process.argv

// Allow override with flags
const finalComponent = arg('component', component)
const finalPreset = arg('preset', preset)  
const duration = parseInt(arg('duration', '4000'))
const baseFilename = `${finalPreset.replace('/','-')}-${Date.now()}`

console.log('🎨 Complete GIF Export Pipeline')
console.log('===============================')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Duration: ${duration}ms`)
console.log('')

const outDir = 'out/exports'
fs.mkdirSync(outDir, { recursive: true })

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function convertWebMToGIF(webmPath, gifPath) {
    console.log('🔄 Converting WebM to GIF...')
    
    // Refresh PATH to ensure FFmpeg is available
    process.env.PATH = process.env.PATH + ';' + 
        (process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Packages') : '') + ';' +
        'C:\\ffmpeg\\bin'
    
    const ffmpegArgs = [
        '-i', webmPath,
        '-vf', 'fps=15,scale=1080:1350:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=2',
        '-loop', '0',
        '-y', gifPath
    ]
    
    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ffmpegArgs, { shell: true })
        
        let stderr = ''
        
        ffmpeg.stderr.on('data', (data) => {
            stderr += data.toString()
            // Show progress dots
            if (data.toString().includes('frame=')) {
                process.stdout.write('.')
            }
        })
        
        ffmpeg.on('close', (code) => {
            console.log('') // New line after dots
            if (code === 0) {
                resolve()
            } else {
                console.log('FFmpeg stderr:', stderr)
                reject(new Error(`FFmpeg conversion failed with code ${code}`))
            }
        })
    })
}

try {
    // Assume server is running and proceed
    console.log('🌐 Proceeding with export...')
    const serverUrl = 'http://localhost:5173'
    
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
    
    // Find the created video (it will have a random hash name)
    const videoFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.webm') && !f.includes('-anim-'))
    if (videoFiles.length === 0) {
        throw new Error('No video recorded')
    }
    
    // Sort by creation time and get the newest
    const newestVideo = videoFiles
        .map(f => ({ name: f, time: fs.statSync(path.join(outDir, f)).mtime }))
        .sort((a, b) => b.time - a.time)[0].name
    
    const tempVideoPath = path.join(outDir, newestVideo)
    const webmPath = path.join(outDir, `${baseFilename}.webm`)
    const gifPath = path.join(outDir, `${baseFilename}.gif`)
    
    // Rename the temp video to our desired filename
    fs.renameSync(tempVideoPath, webmPath)
    
    const webmSize = fs.statSync(webmPath).size
    console.log('✅ WebM recording complete!')
    console.log(`📹 WebM file: ${webmPath}`)
    console.log(`📊 WebM size: ${(webmSize / 1024).toFixed(1)}KB`)
    
    // Convert to GIF
    await convertWebMToGIF(webmPath, gifPath)
    
    const gifSize = fs.statSync(gifPath).size
    
    console.log('')
    console.log('🎉 GIF Export Complete!')
    console.log(`📱 GIF file: ${gifPath}`)
    console.log(`📊 GIF size: ${(gifSize / 1024).toFixed(1)}KB`)
    console.log(`📐 Resolution: 1080 x 1350 pixels`)
    console.log(`🎬 Duration: ${duration}ms`)
    console.log('')
    console.log('✅ Both WebM and GIF formats ready!')
    
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
        formats: ['webm', 'gif'],
        webm: {
            file: webmPath,
            size: webmSize
        },
        gif: {
            file: gifPath,
            size: gifSize
        },
        duration: duration,
        type: 'animation'
    })
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    
} catch (error) {
    console.log('')
    console.log('❌ Export failed:', error.message)
    
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        console.log('💡 Make sure the dev server is running: npm run dev')
    } else if (error.message.includes('FFmpeg')) {
        console.log('💡 Make sure FFmpeg is installed: winget install ffmpeg')
    }
    
    process.exit(1)
}
