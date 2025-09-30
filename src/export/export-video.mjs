import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i+1] : fallback
}

const component = arg('component', 'AssetMetricSnapshot')
const preset = arg('preset', 'awareness/cinematic-1')
const duration = parseInt(arg('duration', '4')) // seconds
const fps = parseInt(arg('fps', '30'))
const outPath = arg('out', `out/video/${preset.replace('/','-')}.mp4`)
const url = arg('url', `http://localhost:5173/render?component=${component}&preset=${preset}`)

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

console.log(`🎬 Exporting Animated Video`)
console.log(`Component: ${component}`)
console.log(`Preset: ${preset}`)
console.log(`Duration: ${duration}s at ${fps}fps`)
console.log(`URL: ${url}`)
console.log(`Output: ${outPath}`)

const browser = await puppeteer.launch({ 
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})

const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 })

// Navigate and wait for page to load
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

// Start recording
await page.evaluate(() => {
  // Inject MediaRecorder setup
  window.mediaRecorder = null
  window.recordedChunks = []
})

// Add screen recording capability
const startRecording = async () => {
  await page.evaluate(async (duration, fps) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 1080
    canvas.height = 1350
    
    const stream = canvas.captureStream(fps)
    window.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    })
    
    window.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        window.recordedChunks.push(event.data)
      }
    }
    
    // Capture the page content to canvas
    const captureFrame = () => {
      html2canvas(document.body, {
        canvas: canvas,
        width: 1080,
        height: 1350,
        scale: 1
      })
    }
    
    window.mediaRecorder.start()
    
    // Capture frames
    const frameInterval = setInterval(captureFrame, 1000/fps)
    
    setTimeout(() => {
      clearInterval(frameInterval)
      window.mediaRecorder.stop()
    }, duration * 1000)
    
  }, duration, fps)
}

try {
  // Wait for initial animations to start
  await page.waitForTimeout(500)
  
  // Alternative approach: Record as image sequence then convert
  const frames = []
  const frameCount = duration * fps
  
  for (let i = 0; i < frameCount; i++) {
    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1350 }
    })
    frames.push(screenshot)
    
    // Wait for next frame
    await page.waitForTimeout(1000 / fps)
    
    if (i % 10 === 0) {
      console.log(`📸 Captured frame ${i + 1}/${frameCount}`)
    }
  }
  
  // Save frames for FFmpeg conversion
  const framesDir = path.join(outDir, 'frames')
  fs.mkdirSync(framesDir, { recursive: true })
  
  for (let i = 0; i < frames.length; i++) {
    const framePath = path.join(framesDir, `frame-${String(i).padStart(4, '0')}.png`)
    fs.writeFileSync(framePath, frames[i])
  }
  
  console.log(`💾 Saved ${frames.length} frames to ${framesDir}`)
  console.log(`🎬 Convert to video with FFmpeg:`)
  console.log(`ffmpeg -r ${fps} -i "${framesDir}/frame-%04d.png" -c:v libx264 -pix_fmt yuv420p -r ${fps} "${outPath}"`)
  
} catch (error) {
  console.error('❌ Export failed:', error)
} finally {
  await browser.close()
}

// Update manifest
const manifestPath = 'out/manifest.json'
fs.mkdirSync('out', { recursive: true })
let manifest = []
try { 
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) 
} catch {}
manifest.push({ 
  ts: Date.now(), 
  component, 
  preset, 
  type: 'video',
  duration,
  fps,
  file: outPath,
  frames: `${framesDir}` 
})
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

console.log(`✅ Video export prepared!`)
