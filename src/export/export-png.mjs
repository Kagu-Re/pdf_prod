import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i+1] : fallback
}

const component = arg('component', 'AssetMetricSnapshot')
const preset = arg('preset', 'awareness/metric-1')
const outPath = arg('out', `out/img/${preset.replace('/','-')}.png`)
const url = arg('url', `http://localhost:5173/render?component=${component}&preset=${preset}`)

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

console.log(`Exporting: ${component} with preset ${preset}`)
console.log(`URL: ${url}`)
console.log(`Output: ${outPath}`)

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 })

// Add a longer wait for the page to load completely
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

// Wait an additional 2 seconds for animations to complete
await page.waitForTimeout(2000)

await page.screenshot({ path: outPath })
await browser.close()

// manifest + tracker append (minimal)
const manifestPath = 'out/manifest.json'
fs.mkdirSync('out', { recursive: true })
let manifest = []
try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) } catch {}
manifest.push({ ts: Date.now(), component, preset, file: outPath })
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
console.log('Saved', outPath)
