import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function exportLinkedInCarousel() {
  console.log('🚀 Starting LinkedIn carousel export...');
  console.log('📐 Format: PDF-based carousel (1080x1350px)');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport to LinkedIn carousel dimensions
    await page.setViewport({
      width: 1080,
      height: 1350,
      deviceScaleFactor: 2
    });
    
    // Navigate to the advanced carousel
    console.log('📄 Loading advanced carousel...');
    await page.goto('http://localhost:5173/?component=AdvancedCarousel', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for the page to load completely
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Switch to PDF view if needed
    console.log('🔄 Switching to PDF view...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pdfButton = buttons.find(btn => btn.textContent.includes('PDF VIEW'));
      if (pdfButton) {
        pdfButton.click();
      }
    });
    
    // Wait for PDF view to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate PDF optimized for LinkedIn
    console.log('📊 Generating LinkedIn-optimized PDF...');
    const pdf = await page.pdf({
      path: join(__dirname, 'carousel', 'linkedin-tech-carousel.pdf'),
      width: '1080px',
      height: '1350px',
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
    
    // Get file size
    const fs = await import('fs');
    const stats = fs.statSync(join(__dirname, 'carousel', 'linkedin-tech-carousel.pdf'));
    const fileSizeKB = Math.round(stats.size / 1024);
    
    console.log('✅ LinkedIn carousel exported successfully!');
    console.log('📁 Location: carousel/linkedin-tech-carousel.pdf');
    console.log(`📊 File Size: ${fileSizeKB} KB`);
    console.log('📐 Dimensions: 1080x1350px (LinkedIn optimized)');
    console.log('🎨 Style: Advanced texture & typography');
    console.log('📱 Format: PDF-based carousel (organic posts)');
    
    if (fileSizeKB > 102400) {
      console.log('⚠️  Warning: File size exceeds 100MB LinkedIn limit');
    } else {
      console.log('✅ File size is within LinkedIn limits');
    }
    
  } catch (error) {
    console.error('❌ Error exporting LinkedIn carousel:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the export
exportLinkedInCarousel();




