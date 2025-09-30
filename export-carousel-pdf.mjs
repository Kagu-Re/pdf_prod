import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function exportCarouselPDF() {
  console.log('🚀 Starting PDF export...');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match carousel dimensions
    await page.setViewport({
      width: 1200,
      height: 1500,
      deviceScaleFactor: 2
    });
    
    // Navigate to the enhanced carousel
    console.log('📄 Loading carousel page...');
    await page.goto('http://localhost:5173/?component=EnhancedCarousel', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for the page to load completely
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Switch to PDF view if needed
    console.log('🔄 Switching to PDF view...');
    await page.evaluate(() => {
      // Look for buttons containing "PDF VIEW" text
      const buttons = Array.from(document.querySelectorAll('button'));
      const pdfButton = buttons.find(btn => btn.textContent.includes('PDF VIEW'));
      if (pdfButton) {
        pdfButton.click();
      }
    });
    
    // Wait for PDF view to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate PDF
    console.log('📊 Generating PDF...');
    const pdf = await page.pdf({
      path: join(__dirname, 'carousel', 'enhanced-cyberpunk-carousel.pdf'),
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
    
    console.log('✅ PDF exported successfully!');
    console.log('📁 Location: carousel/enhanced-cyberpunk-carousel.pdf');
    console.log('📐 Dimensions: 1200x1500px');
    console.log('🎨 Style: Cyberpunk theme');
    
  } catch (error) {
    console.error('❌ Error exporting PDF:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the export
exportCarouselPDF();
