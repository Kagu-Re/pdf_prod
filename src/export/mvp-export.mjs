#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

// Simple MVP export script using browser screenshot
// This is a backup approach when Puppeteer has issues

const component = process.argv[2] || 'AssetMetricSnapshot'
const preset = process.argv[3] || 'awareness/cinematic-1'
const outputFile = process.argv[4] || `out/mvp/${preset.replace('/', '-')}.png`

const url = `http://localhost:5173/render?component=${component}&preset=${preset}`

console.log('🚀 MVP Export Helper')
console.log('===================')
console.log('')
console.log(`Component: ${component}`)
console.log(`Preset: ${preset}`)
console.log(`Output: ${outputFile}`)
console.log('')
console.log(`✅ URL to capture: ${url}`)
console.log('')
console.log('📋 Manual Export Steps:')
console.log('1. Open the URL above in your browser')
console.log('2. Wait for animations to complete (3-4 seconds)')
console.log('3. Take a screenshot (Ctrl+Shift+S in most browsers)')
console.log('4. Save as PNG with dimensions 1080x1350px')
console.log('')
console.log('💡 Alternative: Use browser dev tools Device Toolbar')
console.log('   - Set custom size: 1080x1350')
console.log('   - Right-click page → "Capture screenshot"')
console.log('')
console.log('📁 Save location:')
const outDir = path.dirname(outputFile)
const fullPath = path.resolve(outDir)
fs.mkdirSync(outDir, { recursive: true })
console.log(`   ${fullPath}\\`)
console.log('')
console.log('✨ MVP Asset Ready for Manual Export!')

// Create a simple index file for easy access
const indexPath = 'out/mvp/index.html'
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Agile Tunnel MVP - Asset Export</title>
    <style>
        body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px; }
        .asset { border: 1px solid #ddd; margin: 20px 0; padding: 20px; border-radius: 8px; }
        .url { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; word-break: break-all; }
        .specs { background: #f0f8ff; padding: 10px; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🎬 Agile Tunnel MVP - Cinematic Asset Export</h1>
    
    <div class="asset">
        <h2>Asset: ${component}</h2>
        <p><strong>Preset:</strong> ${preset}</p>
        <div class="specs">
            <strong>Export Specs:</strong><br>
            📐 Dimensions: 1080 x 1350 pixels<br>
            📄 Format: PNG<br>
            🎨 Style: Cinematic (dark background, orange accents)
        </div>
        <p><strong>Live Preview URL:</strong></p>
        <div class="url">
            <a href="${url}" target="_blank">${url}</a>
        </div>
        <p><strong>Export Instructions:</strong></p>
        <ol>
            <li>Click the URL above to open the asset</li>
            <li>Wait 3-4 seconds for animations to complete</li>
            <li>Right-click → "Save page as..." → PNG</li>
            <li>Or use browser screenshot tools</li>
        </ol>
    </div>
    
    <hr>
    <p><em>Generated: ${new Date().toLocaleString()}</em></p>
</body>
</html>`

fs.writeFileSync(indexPath, htmlContent)
console.log(`📄 Export guide created: ${path.resolve(indexPath)}`)
