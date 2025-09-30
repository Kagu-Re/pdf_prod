import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const exportStonePatternDesign = async () => {
  console.log('🚀 Starting Stone Pattern Design PDF export...');
  
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
      { name: 'stone-hero-card', title: 'Digital Transformation Journey' },
      { name: 'stone-card-01-problem', title: 'The Problem' },
      { name: 'stone-card-02-discovery', title: 'The Discovery' },
      { name: 'stone-card-03-solution', title: 'The Solution' },
      { name: 'stone-card-04-implementation', title: 'The Implementation' },
      { name: 'stone-card-05-future', title: 'The Future' }
    ];

    console.log('📊 Capturing stone pattern hero card and individual cards...');
    
    // Capture each card as a separate PDF buffer
    const pdfBuffers = [];
    
    for (let i = 0; i < cards.length; i++) {
      console.log(`  📄 Capturing card ${i + 1}: ${cards[i].title}`);
      
      // Hide all other cards and show only the current one
      await page.evaluate((cardIndex) => {
        // For hero card (index 0), show only the hero card
        if (cardIndex === 0) {
          const heroCard = document.querySelector('[class*="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl shadow-lg border-2 border-stone-200 overflow-hidden mb-6"]');
          const contentCards = document.querySelectorAll('[class*="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl shadow-lg border-2 border-stone-200"]:not([class*="mb-6"])');
          
          if (heroCard) heroCard.style.display = 'block';
          contentCards.forEach(card => card.style.display = 'none');
        } else {
          // For content cards, hide hero and show only the target card
          const heroCard = document.querySelector('[class*="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl shadow-lg border-2 border-stone-200 overflow-hidden mb-6"]');
          const allContentCards = document.querySelectorAll('[class*="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl shadow-lg border-2 border-stone-200"]:not([class*="mb-6"])');
          
          if (heroCard) heroCard.style.display = 'none';
          
          allContentCards.forEach((card, index) => {
            if (index === cardIndex - 1) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }
        
        // Scroll to the visible card
        const visibleCard = document.querySelector('[style*="display: block"]');
        if (visibleCard) {
          visibleCard.scrollIntoView({ 
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
        const allCards = document.querySelectorAll('[class*="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl shadow-lg border-2 border-stone-200"]');
        allCards.forEach(card => {
          card.style.display = 'block';
        });
      });
    }

    // Create a new PDF document
    console.log('📚 Merging stone pattern cards into single PDF...');
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
    const mergedPdfPath = path.join(outputDir, `stone-pattern-design-${timestamp}.pdf`);
    fs.writeFileSync(mergedPdfPath, mergedPdfBytes);
    
    console.log(`✅ Stone Pattern Design PDF saved: ${mergedPdfPath}`);

    // Also save individual card files for reference
    console.log('📚 Creating individual stone pattern card files for reference...');
    for (let i = 0; i < pdfBuffers.length; i++) {
      const cardPath = path.join(outputDir, `${cards[i].name}.pdf`);
      fs.writeFileSync(cardPath, pdfBuffers[i]);
      console.log(`  📄 Card ${i + 1}: ${cardPath}`);
    }

    // Create a comprehensive summary
    const summaryPath = path.join(outputDir, 'stone-pattern-design-summary.md');
    const summaryContent = `# Stone Pattern Design PDF Export

## Export Details
- **Export Date**: ${new Date().toISOString()}
- **Component**: WaterRippleTriptych (Stone Pattern Design)
- **Format**: Single PDF with hero card + individual content cards
- **Dimensions**: 1080 x 1350 pixels (Portrait)
- **Aspect Ratio**: 4:5 (Portrait)
- **Quality**: 2x DPI for crisp rendering
- **Total Pages**: ${cards.length}
- **File Size**: ${(mergedPdfBytes.length / 1024 / 1024).toFixed(2)} MB

## Stone Pattern Design Features
- **Stone Texture Background**: Granite and marble-like patterns
- **Stone Masonry**: Brick-like masonry pattern overlay
- **Stone Color Palette**: Warm stone tones (stone-50 to stone-900)
- **Stone Card Design**: Stone-like card backgrounds with texture overlays
- **Stone Icon Effects**: Stone texture overlays on icon containers
- **Stone Stats Boxes**: Stone-patterned statistics containers
- **Stone Footer Design**: Stone-colored borders and text

## Card Pages Included
${cards.map((card, i) => `- **Page ${i + 1}**: ${card.title}${i === 0 ? ' (Stone Hero Card)' : ' (Stone Content Card)'}`).join('\n')}

## Files Generated
- **stone-pattern-design-${timestamp}.pdf** - Main merged PDF file
- **stone-hero-card.pdf** - Stone hero card with title and subtitle
- **stone-card-01-problem.pdf** - Individual stone content cards
- **stone-card-02-discovery.pdf**
- **stone-card-03-solution.pdf**
- **stone-card-04-implementation.pdf**
- **stone-card-05-future.pdf**

## Stone Pattern Elements
- **Background**: Stone gradient (stone-800 to stone-900)
- **Stone Textures**: Random granite and marble patterns
- **Masonry Pattern**: Brick-like stone masonry overlay
- **Card Backgrounds**: Stone-50 to stone-100 gradients
- **Texture Overlays**: Subtle stone texture patterns on cards
- **Border Colors**: Stone-200 to stone-300 borders
- **Text Colors**: Stone-700 for better contrast

## Stone Texture Techniques
- **Granite Pattern**: Darker stone colors with varied opacity
- **Marble Pattern**: Lighter stone colors with smooth gradients
- **Masonry Pattern**: Brick-like rectangular stone elements
- **Texture Overlays**: Subtle stone patterns on card surfaces
- **Shadow Effects**: Stone-like shadow and depth effects
- **Border Styling**: Stone-colored borders with texture

## Visual Design Elements
- **Hero Card**: Stone-patterned title and subtitle presentation
- **Content Cards**: Stone-textured individual transformation steps
- **Icon Containers**: Stone texture overlays on colored icon backgrounds
- **Stats Boxes**: Stone-patterned statistics containers
- **Footer Elements**: Stone-colored borders and text styling
- **Background Patterns**: Multi-layer stone texture system

## Stone Color Palette
- **Primary Stone**: stone-800, stone-700, stone-900 (background)
- **Card Stone**: stone-50, stone-100, stone-200 (cards)
- **Border Stone**: stone-200, stone-300 (borders)
- **Text Stone**: stone-700 (text)
- **Accent Colors**: Maintained original step colors for contrast

## Stone Pattern Layers
1. **Background Stone Gradient**: Base stone color gradient
2. **Stone Pattern Layer**: Random granite and marble stones
3. **Masonry Pattern Layer**: Brick-like stone masonry
4. **Card Stone Textures**: Individual card stone patterns
5. **Icon Stone Overlays**: Stone texture on icon containers
6. **Stats Stone Patterns**: Stone-patterned statistics boxes

## Design Benefits
- **Natural Aesthetic**: Stone patterns create a natural, organic feel
- **Professional Look**: Stone textures add sophistication
- **Visual Depth**: Multiple stone layers create depth and dimension
- **Unique Design**: Distinctive stone pattern approach
- **Texture Rich**: Rich visual texture throughout the design
- **Cohesive Theme**: Consistent stone pattern throughout

## Technical Implementation
- **CSS Gradients**: Stone color gradients for backgrounds
- **Random Patterns**: JavaScript-generated stone patterns
- **Masonry Layout**: Brick-like stone masonry pattern
- **Texture Overlays**: CSS-based stone texture effects
- **Shadow Effects**: Stone-like shadow and depth
- **Border Styling**: Stone-colored border treatments

## Stone Pattern Libraries Used
- **CSS Gradients**: Stone color gradients
- **CSS Border Radius**: Stone-like rounded corners
- **CSS Box Shadow**: Stone-like shadow effects
- **CSS Background Images**: Stone texture overlays
- **JavaScript Generation**: Random stone pattern creation
- **CSS Transform**: Stone rotation and positioning

## Recommended Usage
- **Architecture Presentations**: Stone patterns perfect for architectural themes
- **Construction Industry**: Ideal for construction and building materials
- **Luxury Brands**: Stone textures convey premium quality
- **Natural Products**: Perfect for natural and organic products
- **Heritage Brands**: Stone patterns suggest tradition and durability
- **Real Estate**: Stone textures work well for property presentations

## Notes
- Stone patterns create a natural, organic aesthetic
- Multiple stone texture layers add visual depth
- Stone color palette provides warm, professional appearance
- Stone masonry pattern adds architectural element
- Stone texture overlays enhance visual richness
- Stone borders and text create cohesive design theme
- High-quality rendering suitable for professional use
- Perfect for architectural and construction industry presentations
- Optimized for both digital and print use
- Timestamped filename to avoid file conflicts

## Stone Pattern Advantages
- **Natural Appeal**: Stone patterns feel natural and organic
- **Professional Quality**: Stone textures suggest premium quality
- **Visual Interest**: Rich stone patterns maintain visual interest
- **Unique Design**: Distinctive stone pattern approach
- **Architectural Feel**: Stone patterns suggest solidity and permanence
- **Luxury Aesthetic**: Stone textures convey luxury and quality
`;

    fs.writeFileSync(summaryPath, summaryContent);
    console.log(`📝 Summary: ${summaryPath}`);

    console.log('🎉 Stone Pattern Design PDF export completed successfully!');
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
exportStonePatternDesign().catch(console.error);

