import fs from 'node:fs'
import path from 'node:path'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i+1] : fallback
}

const component = arg('component', 'AssetMetricSnapshot')
const preset = arg('preset', 'awareness/cinematic-1')
const outPath = arg('out', `out/direct/${preset.replace('/','-')}.png`)
const format = arg('format', 'png') // png, jpeg, webp

const outDir = path.dirname(outPath)
fs.mkdirSync(outDir, { recursive: true })

console.log('🎯 Direct Asset Export (No Server Required)')
console.log('==========================================')
console.log(`Component: ${component}`)
console.log(`Preset: ${preset}`)
console.log(`Output: ${outPath}`)
console.log(`Format: ${format}`)
console.log('')

// Create a self-contained HTML file that can be opened directly
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asset Export: ${component}</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/framer-motion@11.3.24/dist/framer-motion.umd.js"></script>
    <script src="https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    
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
                            paper: "#F8F8F8",
                            shadow: "#2A2A2A",
                            mist: "#E8E8E8"
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
                        "hero": ["8rem", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
                        "display": ["4rem", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
                        "headline": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }]
                    },
                    fontFamily: {
                        display: ["Inter", "system-ui", "sans-serif"],
                        body: ["Inter", "system-ui", "sans-serif"],
                        mono: ["JetBrains Mono", "Consolas", "monospace"]
                    }
                }
            }
        }
    </script>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: 'Inter', system-ui, sans-serif; 
            background: #f0f0f0;
        }
        #asset-container { 
            margin: 0 auto; 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        #export-controls {
            max-width: 1080px;
            margin: 0 auto 20px auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        .btn {
            background: #FF6B35;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .btn:hover { background: #E55A2B; }
        .btn:disabled { background: #ccc; cursor: not-allowed; }
        .status { 
            margin-top: 10px; 
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
        }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .info { background: #d1ecf1; color: #0c5460; }
    </style>
</head>
<body>
    <div id="export-controls">
        <h1>🎯 Direct Asset Export</h1>
        <p><strong>Component:</strong> ${component} | <strong>Preset:</strong> ${preset}</p>
        
        <button class="btn" onclick="exportAsset('png')">📷 Export PNG</button>
        <button class="btn" onclick="exportAsset('jpeg')">📸 Export JPEG</button>
        <button class="btn" onclick="exportAsset('webp')">🖼️ Export WebP</button>
        <button class="btn" onclick="exportAsset('svg')">📝 Export SVG</button>
        
        <div id="status" class="status info">Ready to export. Click a format button above.</div>
    </div>

    <div id="asset-container"></div>

    <script type="text/babel">
        const { motion } = FramerMotion;
        const { useState, useEffect } = React;

        // Asset data
        const presetData = ${JSON.stringify({
          metricName: "Brand Impact",
          value: "89%",
          delta: "+23pp",
          timeframe: "Q3 2025",
          note: "Dramatic surge in brand recognition"
        })};

        // Animation variants
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
                    style: {
                        background: 'radial-gradient(circle at 50% 50%, rgba(255,107,53,0.1), transparent 70%)'
                    }
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
                            className: "text-8xl font-black leading-none tracking-tighter",
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
            const [mounted, setMounted] = useState(false);
            
            useEffect(() => {
                setMounted(true);
            }, []);

            if (!mounted) return React.createElement('div', null, 'Loading...');

            return React.createElement(AssetMetricSnapshot, presetData);
        }

        // Render the app
        const root = ReactDOM.createRoot(document.getElementById('asset-container'));
        root.render(React.createElement(App));

        // Export functions
        window.exportAsset = async function(format) {
            const statusEl = document.getElementById('status');
            const container = document.getElementById('asset-container');
            
            statusEl.className = 'status info';
            statusEl.textContent = \`Exporting as \${format.toUpperCase()}...\`;
            
            try {
                let dataUrl;
                const options = {
                    width: 1080,
                    height: 1350,
                    style: {
                        transform: 'scale(1)',
                        transformOrigin: 'top left'
                    }
                };

                switch(format) {
                    case 'png':
                        dataUrl = await htmlToImage.toPng(container.firstChild, options);
                        break;
                    case 'jpeg':
                        dataUrl = await htmlToImage.toJpeg(container.firstChild, { ...options, quality: 0.95 });
                        break;
                    case 'webp':
                        dataUrl = await htmlToImage.toWebp(container.firstChild, options);
                        break;
                    case 'svg':
                        dataUrl = await htmlToImage.toSvg(container.firstChild, options);
                        break;
                }

                // Download the file
                const link = document.createElement('a');
                link.download = \`\${component}-\${preset.replace('/', '-')}.\${format}\`;
                link.href = dataUrl;
                link.click();

                statusEl.className = 'status success';
                statusEl.textContent = \`✅ \${format.toUpperCase()} exported successfully! Check your downloads folder.\`;
            } catch (error) {
                statusEl.className = 'status error';
                statusEl.textContent = \`❌ Export failed: \${error.message}\`;
                console.error('Export error:', error);
            }
        };

        // Auto-export after 3 seconds if format is specified
        const urlParams = new URLSearchParams(window.location.search);
        const autoFormat = urlParams.get('format');
        if (autoFormat) {
            setTimeout(() => {
                window.exportAsset(autoFormat);
            }, 3000);
        }
    </script>
</body>
</html>`;

const htmlPath = path.join(outDir, `${component}-${preset.replace('/', '-')}-export.html`);
fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ Self-contained export file created!')
console.log(`📁 File: ${path.resolve(htmlPath)}`)
console.log('')
console.log('🚀 Usage Options:')
console.log('')
console.log('📖 OPTION 1: Open in Browser')
console.log(`   1. Open: ${htmlPath}`)
console.log('   2. Click export button for desired format')
console.log('   3. File downloads automatically')
console.log('')
console.log('⚡ OPTION 2: Auto-Export')
console.log(`   1. Open: ${htmlPath}?format=${format}`)
console.log('   2. Waits 3 seconds then auto-exports')
console.log('   3. No clicking required!')
console.log('')
console.log('📐 Export Specs:')
console.log('   • Resolution: 1080 x 1350 pixels')
console.log('   • Formats: PNG, JPEG, WebP, SVG')
console.log('   • Quality: High (95% for JPEG)')
console.log('   • Animations: Captured at rest state')
console.log('')
console.log('🎯 Perfect for social media platforms!')

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
    type: 'direct-export',
    file: htmlPath,
    formats: ['png', 'jpeg', 'webp', 'svg']
})
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
