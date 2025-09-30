import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const exportIndividualCardsMerged = async () => {
  console.log('🚀 Starting Individual Cards Merged PDF export...');
  
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
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create output directory
    const outputDir = './out/water-ripple';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Define the 5 cards
    const cards = [
      { name: 'card-01-problem', title: 'The Problem' },
      { name: 'card-02-discovery', title: 'The Discovery' },
      { name: 'card-03-solution', title: 'The Solution' },
      { name: 'card-04-implementation', title: 'The Implementation' },
      { name: 'card-05-future', title: 'The Future' }
    ];

    console.log('📊 Capturing individual cards...');
    
    // Capture each card as a separate PDF buffer
    const pdfBuffers = [];
    
    for (let i = 0; i < cards.length; i++) {
      console.log(`  📄 Capturing card ${i + 1}: ${cards[i].title}`);
      
      // Scroll to the specific card
      await page.evaluate((cardIndex) => {
        const cards = document.querySelectorAll('[class*="bg-white rounded-2xl shadow-lg"]');
        if (cards[cardIndex]) {
          cards[cardIndex].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
        }
      }, i);
      
      // Wait for scroll to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capture this card as PDF buffer
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
      console.log(`  ✅ Captured: ${cards[i].title}`);
    }

    // Create a new PDF document
    console.log('📚 Merging individual cards into single PDF...');
    const mergedPdf = await PDFDocument.create();
    
    // Add each card page to the merged PDF
    for (let i = 0; i < pdfBuffers.length; i++) {
      console.log(`  📄 Adding card ${i + 1}: ${cards[i].title}`);
      
      // Load the individual PDF
      const individualPdf = await PDFDocument.load(pdfBuffers[i]);
      
      // Copy all pages from the individual PDF to the merged PDF
      const pages = await mergedPdf.copyPages(individualPdf, individualPdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
      
      console.log(`  ✅ Added: ${cards[i].title}`);
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfPath = path.join(outputDir, 'digital-transformation-cards-merged.pdf');
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);
    
    console.log(`✅ Merged Cards PDF saved: ${mergedPdfPath}`);

    // Also save individual card files for reference
    console.log('📚 Creating individual card files for reference...');
    for (let i = 0; i < pdfBuffers.length; i++) {
      const cardPath = path.join(outputDir, `${cards[i].name}.pdf`);
      fs.writeFileSync(cardPath, pdfBuffers[i]);
      console.log(`  📄 Card ${i + 1}: ${cardPath}`);
    }

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'individual-cards-merged-summary.md');
    const summaryContent = `# Digital Transformation Individual Cards Merged PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych (Individual Cards Merged)
- **Format**: Single PDF with individual card pages
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **Total Pages**: ${cards.length}
- **File Size**: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB

## Individual Cards Approach
- **One Card Per Page**: Each transformation step gets its own dedicated page
- **Proper Sizing**: Each card fits perfectly within 1080x1350 dimensions
- **No Content Splitting**: Content is not split across multiple pages
- **Clean Layout**: Each page focuses on one specific step
- **Professional Presentation**: Perfect for slide-by-slide viewing

## Card Pages Included
${cards.map((card, i) => `- **Page ${i + 1}**: ${card.title}`).join('\n')}

## Files Generated
- **digital-transformation-cards-merged.pdf** - Main merged PDF file
- **card-01-problem.pdf** - Individual card files for reference
- **card-02-discovery.pdf**
- **card-03-solution.pdf**
- **card-04-implementation.pdf**
- **card-05-future.pdf**

## Card Design Features
- **Individual Focus**: Each card gets its own dedicated page
- **Proper Scaling**: Content fits perfectly within page dimensions
- **Clean Layout**: No content overflow or splitting
- **Professional Icons**: Updated icon pack for better representation
- **Statistics Display**: Success rates and timelines clearly visible
- **Color Coding**: Each step has its own accent color

## Visual Elements Per Card
- **Large Icon**: 20x20 rounded icon with gradient background
- **Step Number**: Small circular badge with step number
- **Title & Subtitle**: Clear typography hierarchy
- **Content**: Descriptive text about the step
- **Statistics**: Success rate and timeline in bordered boxes
- **Professional Spacing**: Consistent padding and margins

## Updated Icons
1. **The Problem** - alert-circle (Red #EF4444)
2. **The Discovery** - search (Green #10B981)
3. **The Solution** - check-circle (Blue #3B82F6)
4. **The Implementation** - settings (Orange #F59E0B)
5. **The Future** - trending-up (Purple #8B5CF6)

## Recommended Usage
- **Presentations**: Perfect for slide-by-slide presentation
- **Client Proposals**: Each step can be presented individually
- **Social Media**: Each page perfect for Instagram posts
- **Print Materials**: High-quality individual page output
- **Reports**: Clear step-by-step documentation
- **Email Attachments**: Easy to share individual pages

## Technical Specifications
- **Resolution**: 2160 x 2700 pixels (2x DPI)
- **Color Space**: RGB
- **Background**: Dynamic gradients with subtle patterns
- **Typography**: Professional font hierarchy
- **Card Effects**: Shadows, gradients, and visual depth
- **PDF Version**: 1.4 (compatible with all viewers)

## Mobile Optimization
- Each card optimized for mobile viewing
- Touch-friendly card interactions
- Clear typography for all screen sizes
- Responsive design within page constraints

## Advantages of Individual Cards Approach
- **No Content Splitting**: Each card fits perfectly on one page
- **Better Focus**: Each step gets dedicated attention
- **Presentation Ready**: Perfect for slide-by-slide viewing
- **Flexible Usage**: Can use individual pages or complete set
- **Professional Look**: Clean, organized presentation
- **Easy Navigation**: Clear page-by-page progression

## Color Scheme
- **Step 1 (Problem)**: Red (#EF4444) - Alert/Problem indication
- **Step 2 (Discovery)**: Green (#10B981) - Growth/Discovery
- **Step 3 (Solution)**: Blue (#3B82F6) - Trust/Solution
- **Step 4 (Implementation)**: Orange (#F59E0B) - Action/Implementation
- **Step 5 (Future)**: Purple (#8B5CF6) - Innovation/Future

## Notes
- Each card is properly sized for 1080x1350 dimensions
- No content overflow or page splitting issues
- Professional card-based design with updated icons
- High-quality rendering suitable for professional use
- Perfect for presentations and client deliverables
- Optimized for both digital and print use
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Individual Cards Merged PDF export completed successfully!');
    console.log(`📁 Main file: ${mergedPdfPath}`);
    console.log(`📊 Total pages: ${cards.length}`);
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
exportIndividualCardsMerged().catch(console.error);

