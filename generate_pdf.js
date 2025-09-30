import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log('🚀 Starting PDF generation...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport for LinkedIn carousel dimensions (1200x1500px)
        await page.setViewport({
            width: 1200,
            height: 1500,
            deviceScaleFactor: 2
        });
        
        // Load the HTML file
        const htmlPath = path.join(__dirname, 'linkedin_carousel.html');
        await page.goto(`file://${htmlPath}`, {
            waitUntil: 'networkidle0'
        });
        
        // Generate PDF with proper settings for LinkedIn carousel (1200x1500px)
        const pdf = await page.pdf({
            path: 'linkedin_carousel.pdf',
            width: '1200px',
            height: '1500px',
            printBackground: true,
            margin: {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            },
            preferCSSPageSize: true,
            displayHeaderFooter: false
        });
        
        console.log('✅ PDF generated successfully: linkedin_carousel.pdf');
        console.log('📄 File size:', Math.round(pdf.length / 1024), 'KB');
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
    } finally {
        await browser.close();
    }
}

// Check if puppeteer is available
try {
    await generatePDF();
} catch (error) {
    console.log('📦 Puppeteer not found. Installing...');
    const { execSync } = await import('child_process');
    
    try {
        execSync('npm install puppeteer', { stdio: 'inherit' });
        console.log('✅ Puppeteer installed. Running PDF generation...');
        await generatePDF();
    } catch (installError) {
        console.error('❌ Failed to install puppeteer:', installError.message);
        console.log('\n📋 Manual steps:');
        console.log('1. Run: npm install puppeteer');
        console.log('2. Run: node generate_pdf.js');
        console.log('3. Or open linkedin_carousel.html in browser and print to PDF');
    }
}
