import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const exportStreamlinedDesign = async () => {
  console.log('🚀 Starting Streamlined Design PDF export...');
  
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

    // Define the 6 cards (1 hero + 5 content cards)
    const cards = [
      { name: 'streamlined-hero', title: 'Digital Transformation Journey' },
      { name: 'streamlined-card-01-problem', title: 'The Problem' },
      { name: 'streamlined-card-02-discovery', title: 'The Discovery' },
      { name: 'streamlined-card-03-solution', title: 'The Solution' },
      { name: 'streamlined-card-04-implementation', title: 'The Implementation' },
      { name: 'streamlined-card-05-future', title: 'The Future' }
    ];

    console.log('📊 Capturing streamlined design cards...');
    
    // Capture each card as a separate PDF buffer
    const pdfBuffers = [];
    
    for (let i = 0; i < cards.length; i++) {
      console.log(`  📄 Capturing card ${i + 1}: ${cards[i].title}`);
      
      // Hide all other cards and show only the current one
      await page.evaluate((cardIndex) => {
        // Get all motion.div elements that contain cards
        const allCards = document.querySelectorAll('div[class*="bg-gradient-to-br from-white/95 to-stone-50/95"]');
        
        if (allCards.length === 0) {
          console.error('No streamlined cards found');
          return;
        }
        
        // For hero card (index 0), show only the hero section
        if (cardIndex === 0) {
          // Hide all content cards
          allCards.forEach(card => {
            card.style.display = 'none';
          });
          
          // Show hero section by making it visible
          const heroSection = document.querySelector('div[class*="text-center mb-12"]');
          if (heroSection) {
            heroSection.style.display = 'block';
            heroSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'center'
            });
          }
        } else {
          // Hide hero section
          const heroSection = document.querySelector('div[class*="text-center mb-12"]');
          if (heroSection) {
            heroSection.style.display = 'none';
          }
          
          // Show only the target content card (index - 1 because hero is index 0)
          allCards.forEach((card, index) => {
            if (index === cardIndex - 1) {
              card.style.display = 'block';
              card.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
              });
            } else {
              card.style.display = 'none';
            }
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
        const allCards = document.querySelectorAll('div[class*="bg-gradient-to-br from-white/95 to-stone-50/95"]');
        const heroSection = document.querySelector('div[class*="text-center mb-12"]');
        
        allCards.forEach(card => {
          card.style.display = 'block';
        });
        if (heroSection) {
          heroSection.style.display = 'block';
        }
      });
    }

    // Create a new PDF document
    console.log('📚 Merging streamlined design cards into single PDF...');
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

    // Save the merged PDF with timestamp to avoid conflicts
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfPath = path.join(outputDir, `streamlined-design-${timestamp}.pdf`);
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);
    
    console.log(`✅ Streamlined Design PDF saved: ${mergedPdfPath}`);

    // Also save individual card files for reference
    console.log('📚 Creating individual streamlined design card files for reference...');
    for (let i = 0; i < pdfBuffers.length; i++) {
      const cardPath = path.join(outputDir, `${cards[i].name}.pdf`);
      fs.writeFileSync(cardPath, pdfBuffers[i]);
      console.log(`  📄 Card ${i + 1}: ${cardPath}`);
    }

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'streamlined-design-summary.md');
    const summaryContent = `# Streamlined Design PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: StonePatternInfographic (Streamlined Design)
- **Format**: Single PDF with hero section + individual content cards
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **Total Pages**: ${cards.length}
- **File Size**: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB

## Design Improvements
- **Removed Redundant Containers**: Eliminated unnecessary wrapper divs
- **Better Proportions**: Optimized spacing and sizing for readability
- **Simplified Background**: Reduced stone pattern complexity
- **Streamlined Cards**: Cleaner card design with better typography
- **Improved Readability**: Larger text, better spacing, cleaner layout
- **Enhanced Visual Hierarchy**: Clear distinction between elements

## Card Pages Included
${cards.map((card, i) => `- **Page ${i + 1}**: ${card.title}${i === 0 ? ' (Hero Section)' : ' (Content Card)'}`).join('\n')}

## Files Generated
- **streamlined-design-${timestamp}.pdf** - Main merged PDF file
- **streamlined-hero.pdf** - Hero section with title and subtitle
- **streamlined-card-01-problem.pdf** - Individual streamlined content cards
- **streamlined-card-02-discovery.pdf**
- **streamlined-card-03-solution.pdf**
- **streamlined-card-04-implementation.pdf**
- **streamlined-card-05-future.pdf**

## Design Optimizations

### Background Improvements
- **Simplified Stone Pattern**: Reduced from 25 to 15 stones
- **Lower Opacity**: Background opacity reduced to 30%
- **Better Contrast**: Improved text readability against background
- **Removed Masonry**: Eliminated complex masonry pattern

### Card Design Improvements
- **Removed Redundant Containers**: Eliminated unnecessary wrapper divs
- **Better Proportions**: 
  - Hero title: 5xl to 8xl (larger, more impactful)
  - Card padding: 8-12 (increased for better breathing room)
  - Icon size: 24x24 (larger, more prominent)
  - Text sizes: Increased across all elements
- **Improved Typography**:
  - Better line height (1.7 for content)
  - Larger font sizes for better readability
  - Improved text shadows for better contrast
- **Enhanced Visual Hierarchy**:
  - Clear separation between hero and content
  - Better spacing between elements
  - Improved color contrast

### Layout Improvements
- **Streamlined Structure**: Removed unnecessary nested containers
- **Better Spacing**: Consistent spacing system (8, 10, 12 units)
- **Improved Alignment**: Better alignment of elements
- **Enhanced Shadows**: More subtle, professional shadows
- **Better Borders**: Cleaner border treatment

### Readability Improvements
- **Larger Text**: Increased font sizes across all elements
- **Better Contrast**: Improved text contrast against backgrounds
- **Improved Spacing**: Better spacing between text elements
- **Cleaner Design**: Removed visual clutter
- **Enhanced Focus**: Better focus on key content

## Technical Improvements
- **Reduced DOM Complexity**: Fewer nested elements
- **Better Performance**: Simplified rendering
- **Improved Accessibility**: Better contrast and text sizes
- **Enhanced Responsiveness**: Better responsive behavior
- **Cleaner Code**: More maintainable structure

## Visual Benefits
- **Better Readability**: Larger text and better spacing
- **Cleaner Design**: Removed visual clutter
- **Professional Appearance**: More polished look
- **Enhanced Focus**: Better focus on key content
- **Improved Hierarchy**: Clear visual hierarchy
- **Better Proportions**: More balanced layout

## Recommended Usage
- **Presentations**: Clean, readable design perfect for presentations
- **Client Proposals**: Professional appearance for client deliverables
- **Social Media**: Clean design works well for social media
- **Print Materials**: High-quality design suitable for print
- **Reports**: Clear, readable design for reports
- **Email Attachments**: Easy to read and share

## Notes
- Design has been significantly streamlined for better readability
- Redundant containers have been removed
- Proportions have been optimized for better visual hierarchy
- Typography has been improved for better readability
- Background has been simplified for better contrast
- Cards have been redesigned for cleaner appearance
- High-quality rendering suitable for professional use
- Perfect for presentations and client deliverables
- Optimized for both digital and print use
- Timestamped filename to avoid file conflicts

## Design Philosophy
- **Less is More**: Removed unnecessary elements
- **Focus on Content**: Better emphasis on key information
- **Improved Readability**: Larger text and better spacing
- **Professional Quality**: Clean, polished appearance
- **Better Proportions**: Balanced layout and spacing
- **Enhanced Hierarchy**: Clear visual organization
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Streamlined Design PDF export completed successfully!');
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
exportStreamlinedDesign().catch(console.error);

