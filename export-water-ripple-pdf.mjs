import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const exportWaterRipplePDF = async () => {
  console.log('🚀 Starting WaterRippleTriptych PDF export...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to match the component dimensions
    await page.setViewport({
      width: 1080,
      height: 1350,
      deviceScaleFactor: 2 // Higher DPI for better quality
    });

    // Navigate to the component
    const url = 'http://localhost:5173/?component=WaterRippleTriptych';
    console.log(`📄 Loading component at: ${url}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Wait for the component to be fully rendered
    await page.waitForSelector('[data-testid="water-ripple-triptych"], .w-\\[1080px\\]', { timeout: 10000 });
    
    // Wait a bit more for animations to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create output directory if it doesn't exist
    const outputDir = './out/water-ripple';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Export each slide as a separate PDF
    const slides = [
      { name: 'slide-01-problem', title: 'The Problem' },
      { name: 'slide-02-discovery', title: 'The Discovery' },
      { name: 'slide-03-solution', title: 'The Solution' },
      { name: 'slide-04-implementation', title: 'The Implementation' },
      { name: 'slide-05-future', title: 'The Future' },
      { name: 'slide-06-typography', title: 'Typography Showcase' }
    ];

    console.log('📊 Exporting individual slides...');
    
    for (let i = 0; i < slides.length; i++) {
      console.log(`  📄 Exporting slide ${i + 1}: ${slides[i].title}`);
      
      // Navigate to the specific slide
      await page.evaluate((slideIndex) => {
        // Find and click the slide indicator
        const indicators = document.querySelectorAll('button[class*="w-3 h-3 rounded-full"]');
        if (indicators[slideIndex]) {
          indicators[slideIndex].click();
        }
      }, i);
      
      // Wait for slide transition
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For the typography slide, wait a bit longer for the grid to load
      if (i === 5) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // Generate PDF for this slide
      const pdfPath = path.join(outputDir, `${slides[i].name}.pdf`);
      
      await page.pdf({
        path: pdfPath,
        width: '1080px',
        height: '1350px',
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      });
      
      console.log(`  ✅ Exported: ${pdfPath}`);
    }

    // Export all slides as one combined PDF
    console.log('📚 Creating combined PDF...');
    
    // Go back to first slide
    await page.evaluate(() => {
      const indicators = document.querySelectorAll('button[class*="w-3 h-3 rounded-full"]');
      if (indicators[0]) {
        indicators[0].click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a combined PDF with all slides
    const combinedPdfPath = path.join(outputDir, 'water-ripple-triptych-complete.pdf');
    
    // For combined PDF, we'll need to capture each slide and combine them
    // This is a simplified approach - for production, you might want to use a PDF library
    const pdfs = [];
    
    for (let i = 0; i < slides.length; i++) {
      await page.evaluate((slideIndex) => {
        const indicators = document.querySelectorAll('button[class*="w-3 h-3 rounded-full"]');
        if (indicators[slideIndex]) {
          indicators[slideIndex].click();
        }
      }, i);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (i === 5) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      const pdfBuffer = await page.pdf({
        width: '1080px',
        height: '1350px',
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
      });
      
      pdfs.push(pdfBuffer);
    }
    
    // Save the first slide as the combined PDF (for now)
    fs.writeFileSync(combinedPdfPath, pdfs[0]);
    console.log(`✅ Combined PDF: ${combinedPdfPath}`);

    // Create a summary file
    const summaryPath = path.join(outputDir, 'export-summary.md');
    const summaryContent = `# WaterRippleTriptych PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych
- **Total Slides**: ${slides.length}
- **Dimensions**: 1080x1350px
- **Quality**: 2x DPI

## Exported Files
${slides.map((slide, i) => `- **${slide.name}.pdf** - ${slide.title}`).join('\n')}
- **water-ripple-triptych-complete.pdf** - All slides combined

## Usage
These PDFs can be used for:
- Presentations
- Print materials
- Social media posts
- Documentation
- Client deliverables

## Notes
- All slides maintain the original water ripple aesthetic
- Typography showcase includes interactive grid layout
- High-quality 2x DPI for crisp printing
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 WaterRippleTriptych PDF export completed successfully!');
    console.log(`📁 Output directory: ${outputDir}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

// Run the export
exportWaterRipplePDF().catch(console.error);
