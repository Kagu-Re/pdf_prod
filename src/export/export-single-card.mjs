import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const cardType = args[0] || 'hero';
const format = args[1] || 'png';

console.log('🎨 Single Card Export');
console.log('===========================');
console.log(`Card Type: ${cardType}`);
console.log(`Format: ${format}`);

// Create output directory
const outDir = 'out/single-cards';
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Generate output filename
const timestamp = Date.now();
const outPath = path.join(outDir, `${cardType}-${timestamp}.${format}`);
console.log(`Output: ${outPath}`);

async function exportCard() {
    let browser;
    try {
        console.log('🌐 Launching browser...');
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        // Set viewport for consistent rendering
        await page.setViewportSize({ width: 1080, height: 1350 });
        
        // Import the specific card component
        const cardComponents = {
            hero: 'HeroCard',
            content: 'ContentCard', 
            metric: 'MetricCard',
            process: 'ProcessCard',
            comparison: 'ComparisonCard'
        };
        
        const componentName = cardComponents[cardType];
        if (!componentName) {
            throw new Error(`Unknown card type: ${cardType}`);
        }
        
        console.log(`📄 Loading ${componentName} component...`);
        const url = `http://localhost:5173/?component=${componentName}&export=true`;
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Wait for component to load
        console.log('⏱️  Waiting for component to load...');
        await page.waitForTimeout(3000);
        
        // Wait for animations to settle
        console.log('⏱️  Waiting for animations to settle...');
        await page.waitForTimeout(2000);
        
        console.log(`📸 Capturing ${format.toUpperCase()}...`);
        
        // Find the asset container
        const assetElement = await page.locator('#root > div').first();
        
        // Take screenshot based on format
        const screenshotOptions = {
            path: outPath,
            type: format === 'jpg' ? 'jpeg' : format,
            quality: format === 'jpg' ? 95 : undefined
        };
        
        if (format === 'pdf') {
            await page.pdf({
                path: outPath,
                width: '1080px',
                height: '1350px',
                printBackground: true,
                margin: { top: 0, right: 0, bottom: 0, left: 0 }
            });
        } else {
            await assetElement.screenshot(screenshotOptions);
        }
        
        console.log(`✅ Export completed: ${outPath}`);
        
    } catch (error) {
        console.error('❌ Export failed:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Check if dev server is running
async function checkDevServer() {
    try {
        const response = await fetch('http://localhost:5173');
        if (!response.ok) {
            throw new Error('Dev server not responding');
        }
    } catch (error) {
        console.error('❌ Dev server not running. Please start it with: npm run dev');
        process.exit(1);
    }
}

// Run the export
checkDevServer().then(() => exportCard());
