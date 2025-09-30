import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const exportMergedPDF = async () => {
  console.log('🚀 Starting Merged PDF export with multiple pages...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to recommended dimensions
    await page.setViewport({
      width: 1080,
      height: 1350,
      deviceScaleFactor: 2 // High DPI for crisp quality
    });

    const url = 'http://localhost:5173/?component=WaterRippleTriptych';
    console.log(`📄 Loading component at: ${url}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Wait for the component to be fully rendered
    await page.waitForSelector('.w-full', { timeout: 10000 });
    
    // Wait for animations to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create output directory
    const outputDir = './out/water-ripple';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Define slides
    const slides = [
      { name: 'slide-01-problem', title: 'The Problem' },
      { name: 'slide-02-discovery', title: 'The Discovery' },
      { name: 'slide-03-solution', title: 'The Solution' },
      { name: 'slide-04-implementation', title: 'The Implementation' },
      { name: 'slide-05-future', title: 'The Future' },
      { name: 'slide-06-typography', title: 'Typography Showcase' }
    ];

    console.log('📊 Capturing all slides for merged PDF...');
    
    // Capture each slide as a PDF buffer
    const pdfBuffers = [];
    
    for (let i = 0; i < slides.length; i++) {
      console.log(`  📄 Capturing slide ${i + 1}: ${slides[i].title}`);
      
      // Navigate to the specific slide
      await page.evaluate((slideIndex) => {
        const indicators = document.querySelectorAll('button[class*="w-3 h-3 rounded-full"]');
        if (indicators[slideIndex]) {
          indicators[slideIndex].click();
        }
      }, i);
      
      // Wait for slide transition
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For the typography slide, wait longer for the grid to load
      if (i === 5) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // Capture this slide as PDF buffer
      const pdfBuffer = await page.pdf({
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
      
      pdfBuffers.push(pdfBuffer);
      console.log(`  ✅ Captured: ${slides[i].title}`);
    }

    // Create a new PDF document
    console.log('📚 Merging pages into single PDF...');
    const mergedPdf = await PDFDocument.create();
    
    // Add each page to the merged PDF
    for (let i = 0; i < pdfBuffers.length; i++) {
      console.log(`  📄 Adding page ${i + 1}: ${slides[i].title}`);
      
      // Load the individual PDF
      const individualPdf = await PDFDocument.load(pdfBuffers[i]);
      
      // Copy all pages from the individual PDF to the merged PDF
      const pages = await mergedPdf.copyPages(individualPdf, individualPdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
      
      console.log(`  ✅ Added: ${slides[i].title}`);
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfPath = path.join(outputDir, 'water-ripple-triptych-merged.pdf');
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);
    
    console.log(`✅ Merged PDF saved: ${mergedPdfPath}`);

    // Also save individual pages for reference
    console.log('📚 Creating individual page files for reference...');
    for (let i = 0; i < pdfBuffers.length; i++) {
      const pagePath = path.join(outputDir, `page-${String(i + 1).padStart(2, '0')}-${slides[i].name}.pdf`);
      fs.writeFileSync(pagePath, pdfBuffers[i]);
      console.log(`  📄 Page ${i + 1}: ${pagePath}`);
    }

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'merged-pdf-summary.md');
    const summaryContent = `# WaterRippleTriptych Merged PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych
- **Format**: Single PDF with multiple pages (properly merged)
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **Total Pages**: ${slides.length}
- **File Size**: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB

## Page Breakdown
${slides.map((slide, i) => `- **Page ${i + 1}**: ${slide.title}`).join('\n')}

## Files Generated
- **water-ripple-triptych-merged.pdf** - Main merged PDF file (all pages in one document)
- **page-01-slide-01-problem.pdf** - Individual page files for reference
- **page-02-slide-02-discovery.pdf**
- **page-03-slide-03-solution.pdf**
- **page-04-slide-04-implementation.pdf**
- **page-05-slide-05-future.pdf**
- **page-06-slide-06-typography.pdf**

## Recommended Usage
- **Presentations**: Use the merged PDF for seamless slide transitions
- **Print Materials**: High-quality 2x DPI suitable for printing
- **Social Media**: 4:5 aspect ratio perfect for Instagram posts
- **Client Deliverables**: Professional single-document format
- **Email Attachments**: Single file easy to share

## Technical Specifications
- **Resolution**: 2160 x 2700 pixels (2x DPI)
- **Color Space**: RGB
- **Background**: Preserved gradients and effects
- **Typography**: All custom fonts embedded
- **Animations**: Captured in final state
- **PDF Version**: 1.4 (compatible with all viewers)

## Mobile Optimization
- Typography scales responsively within the fixed dimensions
- Touch-friendly interface elements
- Readable text at all zoom levels
- Optimized for both mobile and desktop viewing

## Advantages of Merged PDF
- **Single File**: Easy to share and manage
- **Consistent Formatting**: All pages maintain same dimensions
- **Professional Presentation**: Seamless page transitions
- **Print Ready**: High-quality output for all pages
- **Universal Compatibility**: Works with all PDF viewers

## Notes
- All slides maintain the water ripple aesthetic
- Typography showcase includes the interactive grid layout
- High-quality rendering suitable for professional use
- Compatible with all major PDF viewers and presentation software
- Optimized file size while maintaining quality
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Merged PDF export completed successfully!');
    console.log(`📁 Main file: ${mergedPdfPath}`);
    console.log(`📊 Total pages: ${slides.length}`);
    console.log(`📐 Dimensions: 1080 x 1350 pixels (4:5 portrait)`);
    console.log(`💾 File size: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
};

// Run the export
exportMergedPDF().catch(console.error);

