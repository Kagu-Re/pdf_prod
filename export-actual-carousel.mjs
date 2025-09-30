import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function exportActualCarousel() {
  console.log('🚀 Starting actual carousel PDF export...');
  
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
    
    // Navigate directly to the simple carousel (HTML version)
    console.log('📄 Loading carousel slides...');
    await page.goto('http://localhost:5173/?component=SimpleSurpriseCarousel', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for the page to load completely
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshots of each slide
    console.log('📸 Capturing carousel slides...');
    
    // First, let's see how many slides there are
    const slideCount = await page.evaluate(() => {
      const slides = document.querySelectorAll('[data-slide]');
      return slides.length;
    });
    
    console.log(`Found ${slideCount} slides`);
    
    // If no slides with data-slide, try to find the carousel container
    if (slideCount === 0) {
      console.log('🔍 Looking for carousel content...');
      
      // Try to find the main carousel content
      const hasCarousel = await page.evaluate(() => {
        const carousel = document.querySelector('.min-h-screen.bg-black');
        return carousel !== null;
      });
      
      if (hasCarousel) {
        console.log('✅ Found carousel content, taking full page screenshot...');
        
        // Take a screenshot of the entire carousel
        await page.screenshot({
          path: join(__dirname, 'carousel', 'cyberpunk-carousel-slide-1.png'),
          fullPage: true,
          type: 'png'
        });
        
        console.log('📸 Screenshot saved as PNG');
      } else {
        console.log('❌ No carousel content found');
        return;
      }
    } else {
      // Take screenshots of individual slides
      for (let i = 0; i < slideCount; i++) {
        console.log(`📸 Capturing slide ${i + 1}/${slideCount}...`);
        
        // Show the slide
        await page.evaluate((slideIndex) => {
          const slides = document.querySelectorAll('[data-slide]');
          slides.forEach((slide, index) => {
            slide.style.display = index === slideIndex ? 'flex' : 'none';
          });
        }, i);
        
        // Wait for slide to render
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Take screenshot
        await page.screenshot({
          path: join(__dirname, 'carousel', `cyberpunk-carousel-slide-${i + 1}.png`),
          fullPage: true,
          type: 'png'
        });
      }
    }
    
    // Also try to generate a PDF of the carousel content
    console.log('📊 Generating PDF of carousel...');
    
    // Try to find the carousel content area
    const carouselElement = await page.$('.min-h-screen.bg-black');
    
    if (carouselElement) {
      const pdf = await page.pdf({
        path: join(__dirname, 'carousel', 'cyberpunk-carousel.pdf'),
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
      
      console.log('✅ PDF generated successfully!');
    }
    
    console.log('✅ Carousel export completed!');
    console.log('📁 Location: carousel/');
    console.log('📐 Dimensions: 1200x1500px');
    console.log('🎨 Style: Cyberpunk theme');
    
  } catch (error) {
    console.error('❌ Error exporting carousel:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the export
exportActualCarousel();
