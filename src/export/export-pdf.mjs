import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i+1] : fallback
}

const component = arg('component', 'AssetMetricSnapshot')
const preset = arg('preset', 'awareness/metric-1')
const outPath = arg('out', `out/pdf/${preset.replace('/','-')}.pdf`)
const url = arg('url', `http://localhost:5173/render?component=${component}&preset=${preset}`)

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: 'networkidle0' })
await page.pdf({ path: outPath, width: '1080px', height: '1350px', printBackground: true })
await browser.close()

console.log('Saved', outPath)
