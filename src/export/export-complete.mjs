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
const [,, component = 'AssetMetricSnapshot', preset = 'awareness/cinematic-1', format = 'png'] = process.argv

// Allow override with flags
const finalComponent = arg('component', component)
const finalPreset = arg('preset', preset)  
const finalFormat = arg('format', format)
const outPath = arg('out', `out/exports/${finalPreset.replace('/','-')}-${Date.now()}.${finalFormat}`)

console.log('🚀 Complete Asset Export')
console.log('========================')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Format: ${finalFormat}`)
console.log(`Output: ${outPath}`)
console.log('')

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

let viteProcess = null

async function startViteServer() {
    return new Promise((resolve, reject) => {
        console.log('🚀 Starting Vite dev server...')
        
        viteProcess = spawn('npm', ['run', 'dev'], {
            cwd: process.cwd(),
            shell: true,
            stdio: ['pipe', 'pipe', 'pipe']
        })
        
        let output = ''
        viteProcess.stdout.on('data', (data) => {
            output += data.toString()
            if (output.includes('ready in')) {
                console.log('✅ Vite server started')
                resolve()
            }
        })
        
        viteProcess.stderr.on('data', (data) => {
            console.error('Vite error:', data.toString())
        })
        
        viteProcess.on('error', (error) => {
            reject(new Error(`Failed to start Vite: ${error.message}`))
        })
        
        // Timeout after 30 seconds
        setTimeout(() => {
            reject(new Error('Vite server startup timeout'))
        }, 30000)
    })
}

async function stopViteServer() {
    if (viteProcess) {
        console.log('🛑 Stopping Vite server...')
        viteProcess.kill('SIGTERM')
        
        // Wait a bit for graceful shutdown
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        if (!viteProcess.killed) {
            viteProcess.kill('SIGKILL')
        }
    }
}

async function checkServerAlive() {
    try {
        const browser = await chromium.launch({ headless: true })
        const page = await browser.newPage()
        await page.goto('http://localhost:5173', { timeout: 5000 })
        await browser.close()
        return true
    } catch {
        return false
    }
}

try {
    // Check if server is already running
    const serverAlive = await checkServerAlive()
    const shouldStartServer = !serverAlive
    
    if (shouldStartServer) {
        await startViteServer()
        // Give it a moment to fully start
        await new Promise(resolve => setTimeout(resolve, 2000))
    } else {
        console.log('✅ Using existing Vite server')
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
    const url = `http://localhost:5173/?component=${finalComponent}&preset=${finalPreset}&export=true`
    console.log('📄 Loading asset from:', url)
    
    // Navigate to the dev server
    await page.goto(url, { waitUntil: 'networkidle' })
    
    // Wait for the component to be ready
    console.log('⏱️  Waiting for animations...')
    await page.waitForSelector('[data-ready]', { timeout: 20000 })
    
    // Additional wait for animations to settle
    await page.waitForTimeout(1000)
    
    console.log(`📸 Capturing ${finalFormat.toUpperCase()}...`)
    
    // Find the asset container
    const assetElement = await page.locator('#root > div').first()
    
    // Take screenshot based on format
    const screenshotOptions = {
        path: outPath,
        type: finalFormat === 'jpg' ? 'jpeg' : finalFormat,
        quality: finalFormat === 'jpg' ? 95 : undefined
    }
    
    if (finalFormat === 'pdf') {
        await page.pdf({
            path: outPath,
            width: '1080px',
            height: '1350px',
            printBackground: true
        })
    } else {
        await assetElement.screenshot(screenshotOptions)
    }
    
    await browser.close()
    
    console.log('')
    console.log('✅ Export successful!')
    console.log(`📁 File saved: ${path.resolve(outPath)}`)
    console.log(`📐 Resolution: 1080 x 1350 pixels`)
    console.log(`📄 Format: ${finalFormat.toUpperCase()}`)
    
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
        file: outPath,
        size: fs.statSync(outPath).size
    })
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    
} catch (error) {
    console.log('')
    console.log('❌ Export failed:', error.message)
    
    // Common troubleshooting
    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        console.log('💡 Could not connect to Vite server')
    }
    
    if (error.message.includes('data-ready')) {
        console.log('💡 The component may not be loading properly. Check the URL manually.')
    }
    
    process.exit(1)
} finally {
    // Clean up Vite server if we started it
    if (viteProcess) {
        await stopViteServer()
    }
}
