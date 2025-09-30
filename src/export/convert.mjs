#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const [,, inputFile, outputFormat = 'gif'] = process.argv

if (!inputFile || !fs.existsSync(inputFile)) {
    console.log('❌ Usage: npm run convert <input-file> <format>')
    console.log('   Formats: gif, mp4, mov')
    console.log('   Example: npm run convert out/exports/video.webm gif')
    process.exit(1)
}

const inputPath = path.resolve(inputFile)
const outputPath = inputPath.replace(/\.[^.]+$/, `.${outputFormat}`)

console.log('🔄 Video Converter')
console.log('=================')
console.log(`Input: ${inputPath}`)
console.log(`Output: ${outputPath}`)
console.log(`Format: ${outputFormat.toUpperCase()}`)
console.log('')

try {
    console.log('🔄 Converting with FFmpeg...')
    
    // Refresh PATH to ensure FFmpeg is available
    process.env.PATH = process.env.PATH + ';' + 
        (process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Packages') : '') + ';' +
        'C:\\ffmpeg\\bin'
    
    let ffmpegArgs = []
    
    if (outputFormat === 'gif') {
        // High quality GIF conversion
        ffmpegArgs = [
            '-i', inputPath,
            '-vf', 'fps=15,scale=1080:1350:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=2',
            '-loop', '0',
            '-y', outputPath
        ]
    } else if (outputFormat === 'mp4') {
        // MP4 conversion
        ffmpegArgs = [
            '-i', inputPath,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            '-y', outputPath
        ]
    } else if (outputFormat === 'mov') {
        // MOV conversion (for social media)
        ffmpegArgs = [
            '-i', inputPath,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '20',
            '-pix_fmt', 'yuv420p',
            '-y', outputPath
        ]
    } else {
        throw new Error(`Unsupported format: ${outputFormat}`)
    }
    
    await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ffmpegArgs, { shell: true })
        
        ffmpeg.stderr.on('data', (data) => {
            // FFmpeg outputs progress to stderr
            const output = data.toString()
            if (output.includes('frame=')) {
                process.stdout.write('.')
            }
        })
        
        ffmpeg.on('close', (code) => {
            console.log('') // New line after dots
            if (code === 0) {
                resolve()
            } else {
                reject(new Error(`FFmpeg conversion failed with code ${code}`))
            }
        })
    })
    
    console.log('')
    console.log('✅ Conversion successful!')
    console.log(`📁 File saved: ${outputPath}`)
    console.log(`📊 Original size: ${(fs.statSync(inputPath).size / 1024).toFixed(1)}KB`)
    console.log(`📊 New size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)}KB`)
    
} catch (error) {
    console.log('')
    console.log('❌ Conversion failed:', error.message)
    
    if (error.message.includes('ffmpeg')) {
        console.log('💡 Make sure FFmpeg is installed and in PATH')
        console.log('💡 Install with: winget install ffmpeg')
    }
    
    process.exit(1)
}
