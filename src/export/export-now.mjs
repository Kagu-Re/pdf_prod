#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

// Simple one-command export
const component = process.argv[2] || 'AssetMetricSnapshot'
const preset = process.argv[3] || 'awareness/cinematic-1'
const format = process.argv[4] || 'png'

console.log('🚀 One-Command Asset Export')
console.log('===========================')
console.log(`Component: ${component}`)
console.log(`Preset: ${preset}`)
console.log(`Format: ${format}`)
console.log('')

try {
    // Generate the direct export file
    console.log('📦 Creating export file...')
    execSync(`node src/export/export-direct.mjs --component ${component} --preset ${preset} --format ${format}`, { 
        stdio: 'inherit',
        cwd: process.cwd()
    })
    
    const exportFile = `out/direct/${component}-${preset.replace('/', '-')}-export.html`
    const fullPath = path.resolve(exportFile)
    
    console.log('')
    console.log('✅ Ready to export!')
    console.log('')
    console.log('🎯 NEXT STEPS:')
    console.log(`1. Open in browser: ${fullPath}`)
    console.log(`2. Click "${format.toUpperCase()} Export" button`)
    console.log('3. Asset downloads automatically!')
    console.log('')
    console.log('💡 OR use auto-export URL:')
    console.log(`   ${fullPath}?format=${format}`)
    console.log('   (Waits 3 seconds then downloads automatically)')
    console.log('')
    console.log('📱 Formats available: PNG, JPEG, WebP, SVG')
    console.log('📐 Resolution: 1080 x 1350 pixels')
    console.log('🎨 Style: Cinematic with animations')
    
} catch (error) {
    console.error('❌ Export failed:', error.message)
    process.exit(1)
}
