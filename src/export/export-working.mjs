#!/usr/bin/env node
import { chromium } from 'playwright'
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

console.log('🚀 Working Asset Export')
console.log('=======================')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Format: ${finalFormat}`)
console.log(`Output: ${outPath}`)
console.log('')

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

try {
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
        console.log('💡 Make sure the dev server is running: npm run dev')
    }
    
    if (error.message.includes('data-ready')) {
        console.log('💡 The component may not be loading properly. Check the URL manually.')
    }
    
    process.exit(1)
}
