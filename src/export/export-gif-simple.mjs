#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const [,, component, preset] = process.argv

if (!component || !preset) {
    console.log('❌ Usage: npm run gif-simple <component> <preset>')
    console.log('   Example: npm run gif-simple AssetMetricSnapshot awareness/cinematic-1')
    process.exit(1)
}

console.log('🎬 Simple GIF Export')
console.log('==================')
console.log(`Component: ${component}`)
console.log(`Preset: ${preset}`)
console.log('')

// Step 1: Create WebM
console.log('📹 Step 1: Creating WebM video...')
const webmResult = await new Promise((resolve) => {
    const child = spawn('npm', ['run', 'webm', component, preset], {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true
    })
    
    let output = ''
    child.stdout.on('data', (data) => output += data.toString())
    child.stderr.on('data', (data) => output += data.toString())
    
    child.on('close', (code) => {
        if (code === 0) {
            console.log('✅ WebM created successfully')
            resolve({ success: true, output })
        } else {
            console.log('❌ WebM creation failed')
            console.log(output)
            resolve({ success: false, output })
        }
    })
})

if (!webmResult.success) {
    console.log('💥 Cannot proceed without WebM file')
    process.exit(1)
}

// Step 2: Find the created WebM file
const exportsDir = 'out/exports'
const files = fs.readdirSync(exportsDir)
const webmFiles = files.filter(f => f.endsWith('.webm')).sort((a, b) => {
    const aStat = fs.statSync(path.join(exportsDir, a))
    const bStat = fs.statSync(path.join(exportsDir, b))
    return bStat.mtime - aStat.mtime // Most recent first
})

if (webmFiles.length === 0) {
    console.log('❌ No WebM files found in exports directory')
    process.exit(1)
}

const latestWebM = webmFiles[0]
const webmPath = path.join(exportsDir, latestWebM)
console.log(`📁 Using WebM: ${latestWebM}`)

// Step 3: Create descriptive GIF name
const timestamp = Date.now()
const gifName = `${preset.replace('/', '-')}-${timestamp}.gif`
const gifPath = path.join(exportsDir, gifName)

console.log('')
console.log('🔄 Step 2: Converting to GIF...')
console.log(`Input: ${webmPath}`)
console.log(`Output: ${gifPath}`)

// Try different FFmpeg paths
const possiblePaths = [
    'ffmpeg',
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages', 'Gyan.FFmpeg_Microsoft.Winget', 'bin', 'ffmpeg.exe')
]

let ffmpegPath = null
for (const testPath of possiblePaths) {
    try {
        await new Promise((resolve, reject) => {
            const test = spawn(testPath, ['-version'], { stdio: 'ignore' })
            test.on('close', (code) => code === 0 ? resolve() : reject())
            test.on('error', reject)
        })
        ffmpegPath = testPath
        break
    } catch {
        continue
    }
}

if (!ffmpegPath) {
    console.log('❌ FFmpeg not found. Please install FFmpeg and add it to your PATH.')
    console.log('💡 You can download it from: https://ffmpeg.org/download.html')
    console.log(`📁 Your WebM file is ready at: ${webmPath}`)
    process.exit(1)
}

console.log(`✅ Found FFmpeg at: ${ffmpegPath}`)

// Convert WebM to GIF
const conversionResult = await new Promise((resolve) => {
    const args = [
        '-i', webmPath,
        '-vf', 'fps=10,scale=1080:-1:flags=lanczos,palettegen=stats_mode=diff',
        '-y', gifPath + '.palette.png'
    ]
    
    console.log('🎨 Generating color palette...')
    const paletteProcess = spawn(ffmpegPath, args, { stdio: 'pipe' })
    
    paletteProcess.on('close', (code) => {
        if (code !== 0) {
            resolve({ success: false, error: 'Palette generation failed' })
            return
        }
        
        const gifArgs = [
            '-i', webmPath,
            '-i', gifPath + '.palette.png',
            '-lavfi', 'fps=10,scale=1080:-1:flags=lanczos[x];[x][1:v]paletteuse',
            '-y', gifPath
        ]
        
        console.log('🎬 Creating GIF...')
        const gifProcess = spawn(ffmpegPath, gifArgs, { stdio: 'pipe' })
        
        gifProcess.on('close', (code) => {
            // Clean up palette file
            try {
                fs.unlinkSync(gifPath + '.palette.png')
            } catch {}
            
            resolve({ success: code === 0, error: code !== 0 ? 'GIF creation failed' : null })
        })
    })
})

if (conversionResult.success) {
    const stats = fs.statSync(gifPath)
    const sizeKB = Math.round(stats.size / 1024)
    
    console.log('')
    console.log('🎉 GIF Export Successful!')
    console.log(`📁 File: ${gifPath}`)
    console.log(`📐 Size: ${sizeKB}KB`)
    console.log('')
    console.log('✅ Ready for social media!')
} else {
    console.log(`❌ Conversion failed: ${conversionResult.error}`)
    console.log(`📁 Your WebM file is still available at: ${webmPath}`)
    process.exit(1)
}
