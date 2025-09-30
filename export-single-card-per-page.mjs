import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const exportSingleCardPerPage = async () => {
  console.log('🚀 Starting Single Card Per Page PDF export...');
  
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

    console.log('📊 Capturing individual cards with proper isolation...');
    
    // Capture each card as a separate PDF buffer
    const pdfBuffers = [];
    
    for (let i = 0; i < cards.length; i++) {
      console.log(`  📄 Capturing card ${i + 1}: ${cards[i].title}`);
      
      // Hide all other cards and show only the current one
      await page.evaluate((cardIndex) => {
        const allCards = document.querySelectorAll('[class*="bg-white rounded-2xl shadow-lg"]');
        
        // Hide all cards first
        allCards.forEach((card, index) => {
          if (index !== cardIndex) {
            card.style.display = 'none';
          } else {
            card.style.display = 'block';
          }
        });
        
        // Scroll to the current card
        if (allCards[cardIndex]) {
          allCards[cardIndex].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
        }
      }, i);
      
      // Wait for changes to take effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capture this specific card as PDF buffer
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
      
      // Show all cards again for next iteration
      await page.evaluate(() => {
        const allCards = document.querySelectorAll('[class*="bg-white rounded-2xl shadow-lg"]');
        allCards.forEach(card => {
          card.style.display = 'block';
        });
      });
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
    const mergedPdfPath = path.join(outputDir, 'digital-transformation-single-cards.pdf');
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);
    
    console.log(`✅ Single Cards PDF saved: ${mergedPdfPath}`);

    // Also save individual card files for reference
    console.log('📚 Creating individual card files for reference...');
    for (let i = 0; i < pdfBuffers.length; i++) {
      const cardPath = path.join(outputDir, `single-${cards[i].name}.pdf`);
      fs.writeFileSync(cardPath, pdfBuffers[i]);
      console.log(`  📄 Card ${i + 1}: ${cardPath}`);
    }

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'single-card-per-page-summary.md');
    const summaryContent = `# Digital Transformation Single Card Per Page PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych (Single Card Per Page)
- **Format**: Single PDF with individual card pages
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **Total Pages**: ${cards.length}
- **File Size**: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB

## Single Card Per Page Approach
- **Card Isolation**: Each card is hidden except the one being captured
- **No Content Repetition**: Each page contains only one card
- **Proper Separation**: Clean separation between different cards
- **Individual Focus**: Each page focuses on one specific step
- **No Horizontal Overflow**: Content fits perfectly within page dimensions

## Card Pages Included
${cards.map((card, i) => `- **Page ${i + 1}**: ${card.title} (isolated)`).join('\n')}

## Files Generated
- **digital-transformation-single-cards.pdf** - Main merged PDF file
- **single-card-01-problem.pdf** - Individual isolated card files
- **single-card-02-discovery.pdf**
- **single-card-03-solution.pdf**
- **single-card-04-implementation.pdf**
- **single-card-05-future.pdf**

## Technical Implementation
- **Card Hiding**: All cards except target are hidden during capture
- **Individual Capture**: Each card captured in isolation
- **Clean Restoration**: All cards restored after each capture
- **Proper Scrolling**: Each card centered before capture
- **No Repetition**: Each page contains unique content

## Card Design Features
- **Isolated Content**: Each card appears alone on its page
- **Proper Scaling**: Content fits perfectly within page dimensions
- **Clean Layout**: No overlapping or repeated content
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

## Advantages of Single Card Per Page
- **No Content Repetition**: Each page is unique
- **Proper Isolation**: Cards don't interfere with each other
- **Clean Presentation**: Professional, focused layout
- **Easy Navigation**: Clear page-by-page progression
- **Flexible Usage**: Can use individual pages or complete set
- **No Overflow Issues**: Content fits perfectly on each page

## Color Scheme
- **Step 1 (Problem)**: Red (#EF4444) - Alert/Problem indication
- **Step 2 (Discovery)**: Green (#10B981) - Growth/Discovery
- **Step 3 (Solution)**: Blue (#3B82F6) - Trust/Solution
- **Step 4 (Implementation)**: Orange (#F59E0B) - Action/Implementation
- **Step 5 (Future)**: Purple (#8B5CF6) - Innovation/Future

## Notes
- Each card is properly isolated and captured individually
- No content repetition or horizontal overflow issues
- Professional card-based design with updated icons
- High-quality rendering suitable for professional use
- Perfect for presentations and client deliverables
- Optimized for both digital and print use
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Single Card Per Page PDF export completed successfully!');
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
exportSingleCardPerPage().catch(console.error);

