import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const exportLargerCards = async () => {
  console.log('🚀 Starting Larger Cards Design PDF export...');
  
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
      { name: 'large-hero', title: 'Digital Transformation Journey' },
      { name: 'large-card-01-problem', title: 'The Problem' },
      { name: 'large-card-02-discovery', title: 'The Discovery' },
      { name: 'large-card-03-solution', title: 'The Solution' },
      { name: 'large-card-04-implementation', title: 'The Implementation' },
      { name: 'large-card-05-future', title: 'The Future' }
    ];

    console.log('📊 Capturing larger cards design...');
    
    // Capture each card as a separate PDF buffer
    const pdfBuffers = [];
    
    for (let i = 0; i < cards.length; i++) {
      console.log(`  📄 Capturing card ${i + 1}: ${cards[i].title}`);
      
      // Hide all other cards and show only the current one
      await page.evaluate((cardIndex) => {
        // Get all motion.div elements that contain cards
        const allCards = document.querySelectorAll('div[class*="bg-gradient-to-br from-white/95 to-stone-50/95"]');
        
        if (allCards.length === 0) {
          console.error('No large cards found');
          return;
        }
        
        // For hero card (index 0), show only the hero section
        if (cardIndex === 0) {
          // Hide all content cards
          allCards.forEach(card => {
            card.style.display = 'none';
          });
          
          // Show hero section by making it visible
          const heroSection = document.querySelector('div[class*="text-center mb-16"]');
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
          const heroSection = document.querySelector('div[class*="text-center mb-16"]');
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
        const heroSection = document.querySelector('div[class*="text-center mb-16"]');
        
        allCards.forEach(card => {
          card.style.display = 'block';
        });
        if (heroSection) {
          heroSection.style.display = 'block';
        }
      });
    }

    // Create a new PDF document
    console.log('📚 Merging larger cards design into single PDF...');
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
    const mergedPdfPath = path.join(outputDir, `larger-cards-design-${timestamp}.pdf`);
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);
    
    console.log(`✅ Larger Cards Design PDF saved: ${mergedPdfPath}`);

    // Also save individual card files for reference
    console.log('📚 Creating individual larger cards design files for reference...');
    for (let i = 0; i < pdfBuffers.length; i++) {
      const cardPath = path.join(outputDir, `${cards[i].name}.pdf`);
      fs.writeFileSync(cardPath, pdfBuffers[i]);
      console.log(`  📄 Card ${i + 1}: ${cardPath}`);
    }

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'larger-cards-design-summary.md');
    const summaryContent = `# Larger Cards Design PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: StonePatternInfographic (Larger Cards Design)
- **Format**: Single PDF with hero section + individual content cards
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **Total Pages**: ${cards.length}
- **File Size**: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB

## Card Size Improvements
- **Increased Card Spacing**: 12-20 units between cards (was 8-12)
- **Larger Card Padding**: 12-20 units internal padding (was 8-12)
- **Minimum Card Height**: 400px minimum height for better presence
- **Larger Icons**: 32x32 (was 24x24) for better visibility
- **Bigger Typography**: All text sizes increased significantly
- **Enhanced Spacing**: Better spacing throughout all elements

## Card Pages Included
${cards.map((card, i) => `- **Page ${i + 1}**: ${card.title}${i === 0 ? ' (Larger Hero Section)' : ' (Larger Content Card)'}`).join('\n')}

## Files Generated
- **larger-cards-design-${timestamp}.pdf** - Main merged PDF file
- **large-hero.pdf** - Larger hero section with title and subtitle
- **large-card-01-problem.pdf** - Individual larger content cards
- **large-card-02-discovery.pdf**
- **large-card-03-solution.pdf**
- **large-card-04-implementation.pdf**
- **large-card-05-future.pdf**

## Size Improvements

### Hero Section
- **Title Size**: 6xl-9xl (was 5xl-8xl) - Much larger and more impactful
- **Subtitle Size**: 2xl-4xl (was xl-3xl) - Better proportion to title
- **Spacing**: Increased margins and padding throughout
- **Text Shadows**: Enhanced for better depth and readability

### Content Cards
- **Card Padding**: 12-20 units (was 8-12) - Much more breathing room
- **Card Spacing**: 12-20 units between cards (was 8-12) - Better separation
- **Minimum Height**: 400px - Ensures substantial presence
- **Icon Size**: 32x32 (was 24x24) - Much more prominent
- **Step Number**: 14x14 (was 10x10) - Better visibility

### Typography Improvements
- **Card Titles**: 4xl-6xl (was 3xl-5xl) - Much larger and more impactful
- **Subtitles**: 2xl-3xl (was xl-2xl) - Better proportion
- **Content Text**: xl-2xl (was lg-xl) - Much more readable
- **Stats Numbers**: 4xl (was 3xl) - More prominent statistics
- **Footer Text**: lg (was base) - Better readability

### Layout Improvements
- **Header Gap**: 10 units (was 6) - Better spacing between icon and text
- **Content Margins**: 12 units (was 8) - More breathing room
- **Stats Gap**: 8 units (was 6) - Better separation between stats
- **Stats Padding**: 8 units (was 6) - More substantial stat boxes
- **Footer Padding**: 8 units (was 6) - Better footer presence

### Visual Enhancements
- **Icon Shadows**: Enhanced shadow effects for better depth
- **Card Shadows**: Improved shadow system for better presence
- **Border Radius**: 3xl for stats (was 2xl) - More modern appearance
- **Footer Elements**: Larger dots and better spacing

## Design Benefits
- **Better Readability**: Much larger text throughout
- **Enhanced Presence**: Cards have more substantial visual weight
- **Improved Hierarchy**: Clear size differences between elements
- **Better Proportions**: More balanced layout with larger elements
- **Enhanced Focus**: Larger elements draw better attention
- **Professional Appearance**: More substantial, premium feel

## Technical Improvements
- **Better Spacing System**: Consistent larger spacing throughout
- **Enhanced Typography Scale**: Better progression of text sizes
- **Improved Visual Weight**: Better balance of element sizes
- **Enhanced Accessibility**: Larger text and elements for better accessibility
- **Better Mobile Experience**: Larger elements work better on mobile

## Recommended Usage
- **Presentations**: Large, impactful design perfect for presentations
- **Client Proposals**: Substantial design for professional deliverables
- **Social Media**: Large, eye-catching design for social media
- **Print Materials**: High-impact design suitable for print
- **Reports**: Clear, readable design for reports
- **Email Attachments**: Easy to read and share

## Notes
- Cards are now significantly larger for better impact
- All text sizes have been increased for better readability
- Spacing has been optimized for larger elements
- Icons and visual elements are much more prominent
- Design has more substantial visual weight
- Better proportions throughout all elements
- High-quality rendering suitable for professional use
- Perfect for presentations and client deliverables
- Optimized for both digital and print use
- Timestamped filename to avoid file conflicts

## Size Comparison
- **Card Padding**: 12-20 units (was 8-12) - 50% increase
- **Card Spacing**: 12-20 units (was 8-12) - 50% increase
- **Icon Size**: 32x32 (was 24x24) - 33% increase
- **Title Size**: 4xl-6xl (was 3xl-5xl) - 1 size level increase
- **Content Text**: xl-2xl (was lg-xl) - 1 size level increase
- **Stats Numbers**: 4xl (was 3xl) - 1 size level increase
- **Minimum Height**: 400px (was auto) - Ensures substantial presence
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Larger Cards Design PDF export completed successfully!');
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
exportLargerCards().catch(console.error);

