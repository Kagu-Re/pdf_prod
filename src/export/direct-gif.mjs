#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const [,, component = 'AssetMetricSnapshot', preset = 'awareness/cinematic-1'] = process.argv

const timestamp = Date.now()
const webmFile = `out/exports/${preset.replace('/', '-')}-${timestamp}.webm`
const gifFile = `out/exports/${preset.replace('/', '-')}-${timestamp}.gif`

console.log('🎬 Direct GIF Export')
console.log('==================')
console.log(`Component: ${component}`)
console.log(`Preset: ${preset}`)
console.log(`WebM: ${webmFile}`)
console.log(`GIF: ${gifFile}`)
console.log('')

// Step 1: Create WebM
console.log('🎥 Step 1: Creating WebM video...')
const webmProcess = spawn('npm', ['run', 'webm', component, preset], {
  stdio: 'inherit',
  shell: true
})

webmProcess.on('close', (code) => {
  if (code !== 0) {
    console.log('❌ WebM creation failed')
    process.exit(1)
  }
  
  // Find the actual webm file created
  const exportDir = 'out/exports'
  const files = fs.readdirSync(exportDir)
  const webmFiles = files.filter(f => f.endsWith('.webm')).sort((a, b) => {
    const statA = fs.statSync(path.join(exportDir, a))
    const statB = fs.statSync(path.join(exportDir, b))
    return statB.mtime - statA.mtime
  })
  
  if (webmFiles.length === 0) {
    console.log('❌ No WebM file found')
    process.exit(1)
  }
  
  const latestWebm = path.join(exportDir, webmFiles[0])
  console.log(`✅ WebM created: ${latestWebm}`)
  
  // Step 2: Convert to GIF using simple ffmpeg
  console.log('🔄 Step 2: Converting to GIF...')
  
  // Try to find ffmpeg
  const ffmpegPaths = [
    'ffmpeg',
    'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft\\WinGet\\Packages\\Gyan.FFmpeg*\\ffmpeg*\\bin\\ffmpeg.exe')
  ]
  
  let ffmpegPath = 'ffmpeg' // Default to system PATH
  
  const convertProcess = spawn(ffmpegPath, [
    '-i', latestWebm,
    '-vf', 'fps=10,scale=640:-1:flags=lanczos',
    '-c:v', 'gif',
    '-y', // Overwrite output
    gifFile
  ], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  })
  
  let stderr = ''
  convertProcess.stderr.on('data', (data) => {
    stderr += data.toString()
  })
  
  convertProcess.on('close', (code) => {
    if (code === 0 && fs.existsSync(gifFile)) {
      const stats = fs.statSync(gifFile)
      console.log(`✅ GIF created successfully!`)
      console.log(`📁 File: ${gifFile}`)
      console.log(`📏 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
    } else {
      console.log('❌ GIF conversion failed')
      console.log('FFmpeg error:', stderr.split('\n').slice(-5).join('\n'))
      
      // Try alternative: copy WebM with .gif extension for testing
      console.log('🔄 Creating fallback copy...')
      fs.copyFileSync(latestWebm, gifFile.replace('.gif', '.webm.backup'))
      console.log(`📁 Backup created: ${gifFile.replace('.gif', '.webm.backup')}`)
    }
  })
})
