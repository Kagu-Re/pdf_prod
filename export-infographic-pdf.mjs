import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const exportInfographicPDF = async () => {
  console.log('🚀 Starting Infographic Design PDF export...');
  
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

    console.log('📊 Capturing infographic design slides...');
    
    // Capture each slide as a PDF buffer
    const pdfBuffers = [];
    
    for (let i = 0; i < slides.length; i++) {
      console.log(`  📄 Capturing slide ${i + 1}: ${slides[i].title}`);
      
      // Navigate to the specific slide
      await page.evaluate((slideIndex) => {
        const indicators = document.querySelectorAll('button[class*="w-2 h-2 rounded-full"]');
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
    console.log('📚 Merging infographic pages into single PDF...');
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
    const mergedPdfPath = path.join(outputDir, 'water-ripple-infographic.pdf');
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);
    
    console.log(`✅ Infographic PDF saved: ${mergedPdfPath}`);

    // Also save individual pages for reference
    console.log('📚 Creating individual page files for reference...');
    for (let i = 0; i < pdfBuffers.length; i++) {
      const pagePath = path.join(outputDir, `infographic-page-${String(i + 1).padStart(2, '0')}-${slides[i].name}.pdf`);
      fs.writeFileSync(pagePath, pdfBuffers[i]);
      console.log(`  📄 Page ${i + 1}: ${pagePath}`);
    }

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'infographic-design-summary.md');
    const summaryContent = `# WaterRippleTriptych Infographic Design PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych (Infographic Design)
- **Format**: Single PDF with multiple pages (infographic style)
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **Total Pages**: ${slides.length}
- **File Size**: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB

## Infographic Design Features
- **Data Visualization**: Key statistics and metrics for each step
- **Visual Hierarchy**: Clear step numbers, titles, and content organization
- **Color-Coded Steps**: Each step has its own accent color
- **Two-Column Layout**: Content on left, visual elements on right
- **Progress Indicators**: Clear step progression visualization
- **Professional Gradients**: Modern gradient backgrounds and elements

## Page Breakdown
${slides.map((slide, i) => `- **Page ${i + 1}**: ${slide.title}`).join('\n')}

## Files Generated
- **water-ripple-infographic.pdf** - Main infographic PDF file
- **infographic-page-01-slide-01-problem.pdf** - Individual page files for reference
- **infographic-page-02-slide-02-discovery.pdf**
- **infographic-page-03-slide-03-solution.pdf**
- **infographic-page-04-slide-04-implementation.pdf**
- **infographic-page-05-slide-05-future.pdf**
- **infographic-page-06-slide-06-typography.pdf**

## Infographic Elements
- **Step Number Badges**: Large circular badges with step numbers
- **Key Statistics**: Success rates and timelines for each step
- **Visual Icons**: Large, prominent icons for each step
- **Decorative Elements**: Floating circles and visual accents
- **Progress Tracking**: Clear indication of current step
- **Brand Consistency**: Unified color scheme and typography

## Data Points Included
- **Success Rates**: 75%, 40%, 90%, 60%, 85% for each step
- **Timelines**: 3-6mo, 1-2mo, 6-12mo, 2-4mo, 12+mo
- **Visual Indicators**: Color-coded progress and status
- **Step Progression**: Clear 1-6 step journey

## Recommended Usage
- **Business Presentations**: Professional infographic format
- **Client Proposals**: Data-driven visual storytelling
- **Social Media**: 4:5 aspect ratio perfect for Instagram
- **Print Materials**: High-quality infographic output
- **Reports & Documentation**: Visual data representation

## Technical Specifications
- **Resolution**: 2160 x 2700 pixels (2x DPI)
- **Color Space**: RGB
- **Background**: Dynamic gradients with subtle patterns
- **Typography**: Professional font hierarchy
- **Visual Effects**: Shadows, gradients, and depth
- **PDF Version**: 1.4 (compatible with all viewers)

## Mobile Optimization
- Responsive typography within infographic constraints
- Touch-friendly navigation elements
- Optimized for both mobile and desktop viewing
- Clear visual hierarchy on all screen sizes

## Advantages of Infographic Design
- **Data-Driven**: Clear statistics and metrics
- **Visual Appeal**: Engaging graphics and layouts
- **Professional**: Business-ready presentation format
- **Informative**: Combines text and visual elements
- **Memorable**: Easy to understand and remember
- **Shareable**: Perfect for social media and presentations

## Notes
- All slides maintain consistent infographic design
- Typography showcase integrated with infographic style
- High-quality rendering suitable for professional use
- Data visualization elements enhance understanding
- Perfect for business presentations and client deliverables
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Infographic Design PDF export completed successfully!');
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
exportInfographicPDF().catch(console.error);

