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
const debug = process.argv.includes('--debug')
const outPath = arg('out', `out/exports/${finalPreset.replace('/','-')}-${Date.now()}.${finalFormat}`)

console.log('🚀 Reliable Asset Export')
console.log('========================')
console.log(`Component: ${finalComponent}`)
console.log(`Preset: ${finalPreset}`)
console.log(`Format: ${finalFormat}`)
console.log(`Output: ${outPath}`)
console.log('')

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

// Load preset data
const presetPath = `src/brand/presets/${finalPreset}.json`
const copyPath = `src/data/copy/${finalPreset}.json`

let presetData = {}
let copyData = {}

try {
    presetData = JSON.parse(fs.readFileSync(presetPath, 'utf-8'))
    console.log(`✅ Loaded preset: ${presetPath}`)
} catch (e) {
    console.log(`⚠️  Could not load preset: ${presetPath}`)
    // Fallback data
    presetData = {
        metricName: "Brand Impact",
        value: "89%", 
        delta: "+23pp",
        timeframe: "Q3 2025",
        note: "Dramatic surge in brand recognition"
    }
}

try {
    copyData = JSON.parse(fs.readFileSync(copyPath, 'utf-8'))
    console.log(`✅ Loaded copy: ${copyPath}`)
} catch (e) {
    console.log(`⚠️  Could not load copy: ${copyPath}`)
    copyData = {}
}

// Create temporary HTML file
const tempHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asset Export</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/framer-motion@11.3.24/dist/framer-motion.umd.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            primary: "#FF6B35",
                            secondary: "#1A1A1A", 
                            accent: "#FFB020",
                            ink: "#0A0A0A",
                            paper: "#F8F8F8"
                        },
                        gray: {
                            950: "#0A0A0A",
                            900: "#1A1A1A",
                            800: "#2A2A2A",
                            700: "#3A3A3A",
                            100: "#F0F0F0",
                            50: "#F8F8F8"
                        }
                    },
                    fontSize: {
                        "hero": ["8rem", { lineHeight: "0.9", letterSpacing: "-0.02em" }]
                    },
                    fontFamily: {
                        display: ["Inter", "system-ui", "sans-serif"]
                    }
                }
            }
        }
    </script>
    
    <style>
        body { margin: 0; padding: 0; background: #f0f0f0; }
        #root { margin: 0; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { motion } = FramerMotion;
        const { useState, useEffect } = React;

        const presetData = ${JSON.stringify(presetData)};
        const copyData = ${JSON.stringify(copyData)};

        const dramaticReveal = {
            hidden: { opacity: 0, scale: 0.8, y: 40, filter: "blur(8px)" },
            visible: { 
                opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
                transition: { duration: 1.2, ease: [0.68, -0.55, 0.265, 1.55] }
            }
        };

        const impactNumber = {
            hidden: { opacity: 0, scale: 0.5, rotateX: -15 },
            visible: { 
                opacity: 1, scale: 1, rotateX: 0,
                transition: { duration: 0.8, ease: [0.68, -0.6, 0.32, 1.6], delay: 0.3 }
            }
        };

        function AssetMetricSnapshot({ metricName, value, delta, timeframe, note }) {
            return React.createElement(
                'div',
                {
                    className: "w-[1080px] h-[1350px] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-hidden",
                    style: { width: '1080px', height: '1350px' }
                },
                React.createElement('div', {
                    className: "absolute inset-0 opacity-5",
                    style: { background: 'radial-gradient(circle at 50% 50%, rgba(255,107,53,0.1), transparent 70%)' }
                }),
                React.createElement(motion.div, {
                    initial: "hidden",
                    animate: "visible", 
                    variants: dramaticReveal,
                    className: "relative z-10 h-full flex flex-col justify-center items-start p-20"
                },
                    React.createElement(motion.div, {
                        variants: dramaticReveal,
                        className: "text-2xl font-display text-gray-100 mb-8 tracking-wide uppercase opacity-80"
                    }, metricName),
                    React.createElement(motion.div, {
                        variants: impactNumber,
                        className: "relative mb-12"
                    },
                        React.createElement('div', {
                            className: "font-black leading-none tracking-tighter",
                            style: { 
                                color: '#FF6B35',
                                textShadow: '0 4px 20px rgba(255,107,53,0.3)',
                                fontSize: '8rem',
                                lineHeight: '0.9',
                                letterSpacing: '-0.02em'
                            }
                        }, value)
                    ),
                    React.createElement(motion.div, {
                        variants: dramaticReveal,
                        className: "text-xl text-gray-300 mb-auto"
                    },
                        React.createElement('span', { 
                            style: { color: '#FFB020' }, 
                            className: "font-medium" 
                        }, delta),
                        React.createElement('span', { 
                            className: "text-gray-400 ml-2" 
                        }, \`in \${timeframe}\`)
                    ),
                    note && React.createElement(motion.div, {
                        variants: dramaticReveal,
                        className: "text-sm text-gray-400 font-mono tracking-wide mt-auto border-l-2 pl-4 opacity-60",
                        style: { borderLeftColor: '#FF6B35' }
                    }, note)
                )
            );
        }

        function App() {
            const [ready, setReady] = useState(false);
            
            useEffect(() => {
                // Mark as ready after animations complete
                setTimeout(() => {
                    setReady(true);
                    document.body.setAttribute('data-ready', 'true');
                }, 3000);
            }, []);

            return React.createElement(AssetMetricSnapshot, presetData);
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
    </script>
</body>
</html>`;

const tempHtmlPath = path.join(outDir, 'temp-export.html')
fs.writeFileSync(tempHtmlPath, tempHtmlContent)

try {
    console.log('🌐 Launching browser...')
    const browser = await chromium.launch()
    const page = await browser.newPage()
    
    // Set viewport to exact dimensions
    await page.setViewportSize({ width: 1080, height: 1350 })
    
    console.log('📄 Loading asset...')
    await page.goto(`file://${path.resolve(tempHtmlPath)}`)
    
    // Wait for animations to complete
    console.log('⏱️  Waiting for animations...')
    await page.waitForSelector('[data-ready]', { timeout: 15000 })
    
    // Additional wait for good measure
    await page.waitForTimeout(1000)
    
    console.log(`📸 Capturing ${format.toUpperCase()}...`)
    
    // Find the asset container
    const assetElement = await page.locator('#root > div').first()
    
    // Take screenshot based on format
    const screenshotOptions = {
        path: outPath,
        type: format === 'jpg' ? 'jpeg' : format,
        quality: format === 'jpg' ? 95 : undefined
    }
    
    if (format === 'pdf') {
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
    
    // Clean up temp file unless debugging
    if (!debug) {
        fs.unlinkSync(tempHtmlPath)
    } else {
        console.log(`🐛 Debug mode: temp file kept at ${tempHtmlPath}`)
    }
    
    console.log('')
    console.log('✅ Export successful!')
    console.log(`📁 File saved: ${path.resolve(outPath)}`)
    console.log(`📐 Resolution: 1080 x 1350 pixels`)
    console.log(`📄 Format: ${format.toUpperCase()}`)
    
    // Update manifest
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
    console.error('❌ Export failed:', error.message)
    
    // Clean up temp file
    if (fs.existsSync(tempHtmlPath)) {
        fs.unlinkSync(tempHtmlPath)
    }
    
    process.exit(1)
}
